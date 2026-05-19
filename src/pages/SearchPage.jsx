import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { aiSearch } from '../utils/ai';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const { products, categories } = useApp();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('category') || 'all';

  const [filters, setFilters] = useState({
    minPrice: '', maxPrice: '', rating: 0,
  });
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  // Calculate results on the fly
  let results = aiSearch(query, products, {
    category: category === 'all' ? '' : category,
    minPrice: filters.minPrice ? Number(filters.minPrice) : null,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
    rating: filters.rating || null,
  });

  if (sortBy === 'price-asc') results = [...results].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') results = [...results].sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') results = [...results].sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'newest') results = [...results].sort((a, b) => b.id.localeCompare(a.id));

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const clearAll = () => {
    setParams({});
    setFilters({ minPrice: '', maxPrice: '', rating: 0 });
  };

  const handleQueryChange = (val) => {
    setParams(p => {
      if (val) p.set('q', val);
      else p.delete('q');
      return p;
    });
  };

  const handleCategorySelect = (catName) => {
    setParams(p => {
      if (catName === 'all') p.delete('category');
      else p.set('category', catName);
      return p;
    });
  };

  const activeFilters = (category !== 'all' ? 1 : 0) + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + (filters.rating > 0 ? 1 : 0);

  return (
    <div className="container page">
      {/* Search header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="search-bar" style={{ maxWidth: 600, marginBottom: '0.75rem' }}>
          <Search size={18} color="var(--text3)" />
          <input
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder="Search products, brands, categories..."
            style={{ flex: 1 }}
          />
          {query && <button onClick={() => handleQueryChange('')} style={{ background: 'none', color: 'var(--text3)' }}><X size={16} /></button>}
        </div>
        {query && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text2)', fontSize: '0.85rem' }}>
            <Sparkles size={14} color="var(--primary-light)" />
            <span>AI Search: showing results for "<strong>{query}</strong>" including synonyms & fuzzy matches</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '230px 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Filters Panel */}
        {showFilters && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Filters {activeFilters > 0 && <span className="badge badge-primary">{activeFilters}</span>}</span>
                  {activeFilters > 0 && <button onClick={clearAll} style={{ background: 'none', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>Clear All</button>}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <p className="form-label" style={{ marginBottom: '0.5rem' }}>Category</p>
                  {[{ id: 'c0', name: 'All', icon: '🏪' }, ...categories].map(cat => (
                    <button key={cat.id} onClick={() => handleCategorySelect(cat.name === 'All' ? 'all' : cat.name)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.45rem 0.6rem', borderRadius: 8, background: category === (cat.name === 'All' ? 'all' : cat.name) ? 'rgba(108,62,255,0.15)' : 'transparent', color: category === (cat.name === 'All' ? 'all' : cat.name) ? 'var(--primary-light)' : 'var(--text2)', fontSize: '0.85rem', border: 'none', cursor: 'pointer', marginBottom: '0.1rem', transition: 'all 0.15s', textAlign: 'left' }}>
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <p className="form-label" style={{ marginBottom: '0.5rem' }}>Price Range (₹)</p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input className="form-input" placeholder="Min" type="number" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} style={{ padding: '0.5rem 0.6rem', fontSize: '0.85rem' }} />
                    <span style={{ color: 'var(--text3)' }}>—</span>
                    <input className="form-input" placeholder="Max" type="number" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} style={{ padding: '0.5rem 0.6rem', fontSize: '0.85rem' }} />
                  </div>
                </div>

                <div>
                  <p className="form-label" style={{ marginBottom: '0.5rem' }}>Minimum Rating</p>
                  {[4, 3, 2, 0].map(r => (
                    <button key={r} onClick={() => setFilter('rating', r)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.4rem 0.6rem', borderRadius: 8, background: filters.rating === r ? 'rgba(108,62,255,0.15)' : 'transparent', color: filters.rating === r ? 'var(--primary-light)' : 'var(--text2)', fontSize: '0.85rem', border: 'none', cursor: 'pointer', marginBottom: '0.1rem', transition: 'all 0.15s' }}>
                      <span style={{ color: 'var(--warning)' }}>{'★'.repeat(r)}{r > 0 && '+'}</span>
                      <span>{r > 0 ? `${r}+ Stars` : 'Any Rating'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <button className="btn btn-icon btn-sm" onClick={() => setShowFilters(v => !v)} title="Toggle filters">
              <SlidersHorizontal size={16} />
            </button>
            <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--text)' }}>{results.length}</strong> products found
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>Sort:</span>
              <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}>
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No products found</h3>
              <p>Try different keywords or adjust your filters</p>
              <button className="btn btn-primary" onClick={clearAll}>Clear All Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
