
// ─── AI-POWERED SEARCH ────────────────────────────────────────────────────────
// Synonym map for fuzzy understanding
const synonymMap = {
  'laptop': ['notebook', 'macbook', 'computer', 'pc'],
  'notebook': ['laptop', 'macbook', 'computer'],
  'laptop bag': ['notebook carry case', 'laptop backpack', 'laptop case', 'computer bag'],
  'notebook carry case': ['laptop bag', 'laptop backpack', 'laptop case'],
  'mobile': ['phone', 'smartphone', 'cellphone', 'iphone', 'android'],
  'phone': ['mobile', 'smartphone', 'cellphone'],
  'smartphone': ['phone', 'mobile', 'iphone', 'android'],
  'earphones': ['headphones', 'earbuds', 'headset'],
  'headphones': ['earphones', 'earbuds', 'headset', 'ear phones'],
  'shirt': ['top', 'blouse', 'tee'],
  'kurta': ['ethnic wear', 'indian wear', 'salwar'],
  'serum': ['face serum', 'skin serum', 'vitamin c'],
  'coffee': ['espresso', 'cappuccino', 'brew'],
  'yoga mat': ['exercise mat', 'gym mat', 'workout mat'],
  'book': ['novel', 'publication', 'reading'],
  'toys': ['kids toys', 'children toys', 'play'],
  'charger': ['charging pad', 'power', 'adapter'],
  'fruits': ['fresh produce', 'organic', 'vegetables'],
};

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function isFuzzyMatch(query, text, threshold = 2) {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  const words = t.split(/\s+/);
  return words.some(w => levenshtein(q, w) <= threshold);
}

function expandQuery(query) {
  const q = query.toLowerCase().trim();
  const expanded = [q];
  Object.entries(synonymMap).forEach(([key, syns]) => {
    if (q.includes(key) || key.includes(q)) expanded.push(...syns);
    syns.forEach(s => { if (q.includes(s) || s.includes(q)) { expanded.push(key); expanded.push(...syns.filter(x => x !== s)); } });
  });
  return [...new Set(expanded)];
}

export function aiSearch(query, products, filters = {}) {
  if (!query && !filters.category && !filters.minPrice && !filters.maxPrice && !filters.rating && !filters.vendorId) {
    return products;
  }
  const terms = query ? expandQuery(query) : [];
  return products.filter(p => {
    // Category filter
    if (filters.category && filters.category !== 'all' && p.category !== filters.category) return false;
    // Price filter
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    // Rating filter
    if (filters.rating && p.rating < filters.rating) return false;
    // Vendor filter
    if (filters.vendorId && p.vendorId !== filters.vendorId) return false;
    // Text search
    if (!query) return true;
    const searchable = [p.name, p.description, p.category, p.subcategory, ...(p.tags || []), ...(p.synonyms || [])].join(' ').toLowerCase();
    return terms.some(term => isFuzzyMatch(term, searchable));
  }).map(p => {
    // Score for relevance
    const searchable = [p.name, ...(p.tags || [])].join(' ').toLowerCase();
    let score = 0;
    if (query) {
      const q = query.toLowerCase();
      if (p.name.toLowerCase().includes(q)) score += 10;
      if (searchable.includes(q)) score += 5;
      if (p.featured) score += 2;
      if (p.trending) score += 1;
    }
    return { ...p, _score: score };
  }).sort((a, b) => b._score - a._score);
}

// ─── PRODUCT RECOMMENDATIONS ──────────────────────────────────────────────────
export function getRecommendations(products, orders, browsingHistory = [], currentProductId = null, limit = 6) {
  const viewedCategories = {};
  const orderedCategories = {};

  // From browsing history
  browsingHistory.forEach(pid => {
    const p = products.find(x => x.id === pid);
    if (p) viewedCategories[p.category] = (viewedCategories[p.category] || 0) + 1;
  });

  // From past orders
  orders.forEach(o => {
    o.items.forEach(item => {
      const p = products.find(x => x.id === item.productId);
      if (p) orderedCategories[p.category] = (orderedCategories[p.category] || 0) + 2;
    });
  });

  const allInterests = { ...viewedCategories };
  Object.entries(orderedCategories).forEach(([cat, score]) => {
    allInterests[cat] = (allInterests[cat] || 0) + score;
  });

  return products
    .filter(p => p.id !== currentProductId && p.stock > 0)
    .map(p => {
      let score = 0;
      score += (allInterests[p.category] || 0) * 3;
      if (p.featured) score += 5;
      if (p.trending) score += 4;
      score += p.rating * 2;
      score += Math.min(p.sold / 100, 10);
      return { ...p, _recScore: score };
    })
    .sort((a, b) => b._recScore - a._recScore)
    .slice(0, limit);
}

// ─── SMART PRICE SUGGESTION ───────────────────────────────────────────────────
export function suggestPrice(products, category, subcategory, currentProductId = null) {
  const similar = products.filter(p =>
    p.category === category &&
    p.id !== currentProductId &&
    p.stock > 0
  );
  if (similar.length === 0) return null;

  const prices = similar.map(p => p.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const median = [...prices].sort((a, b) => a - b)[Math.floor(prices.length / 2)];

  const competitive = Math.round(avg * 0.95);
  const premium = Math.round(avg * 1.10);

  return {
    min: Math.round(min),
    max: Math.round(max),
    avg: Math.round(avg),
    median: Math.round(median),
    suggested: Math.round(competitive),
    competitive,
    premium,
    sampleCount: similar.length,
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function getDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN');
}
