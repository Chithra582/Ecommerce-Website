
// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────
export const categories = [
  { id: 'c1', name: 'Electronics', icon: '💻', sub: ['Mobiles', 'Laptops', 'Accessories', 'Audio'] },
  { id: 'c2', name: 'Fashion', icon: '👗', sub: ['Men', 'Women', 'Kids', 'Footwear'] },
  { id: 'c3', name: 'Grocery', icon: '🛒', sub: ['Fruits', 'Vegetables', 'Dairy', 'Snacks'] },
  { id: 'c4', name: 'Home & Kitchen', icon: '🏠', sub: ['Furniture', 'Cookware', 'Decor', 'Appliances'] },
  { id: 'c5', name: 'Sports', icon: '⚽', sub: ['Fitness', 'Outdoor', 'Team Sports', 'Cycling'] },
  { id: 'c6', name: 'Books', icon: '📚', sub: ['Fiction', 'Non-Fiction', 'Academic', 'Children'] },
  { id: 'c7', name: 'Beauty', icon: '💄', sub: ['Skincare', 'Haircare', 'Makeup', 'Fragrances'] },
  { id: 'c8', name: 'Toys', icon: '🧸', sub: ['Educational', 'Action', 'Outdoor', 'Board Games'] },
];

// ─────────────────────────────────────────────
// VENDORS
// ─────────────────────────────────────────────
export const vendors = [
  {
    id: 'v1', name: 'TechZone Store', owner: 'Arjun Mehta',
    email: 'arjun@techzone.com', location: 'Mumbai, MH',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechZone',
    rating: 4.7, totalSales: 1240000, status: 'approved',
    joinDate: '2024-01-15', commission: 10,
    description: 'Premium electronics at competitive prices.',
    totalOrders: 3420, badge: 'Top Seller',
  },
  {
    id: 'v2', name: 'Fashion Forward', owner: 'Priya Sharma',
    email: 'priya@fashionforward.com', location: 'Delhi, DL',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Fashion',
    rating: 4.5, totalSales: 890000, status: 'approved',
    joinDate: '2024-03-08', commission: 12,
    description: 'Trendy fashion for every occasion.',
    totalOrders: 2100, badge: 'Verified',
  },
  {
    id: 'v3', name: 'Green Basket', owner: 'Ramesh Patel',
    email: 'ramesh@greenbasket.com', location: 'Ahmedabad, GJ',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GreenBasket',
    rating: 4.8, totalSales: 540000, status: 'approved',
    joinDate: '2024-02-20', commission: 8,
    description: 'Fresh organic grocery delivered daily.',
    totalOrders: 5600, badge: 'Top Rated',
  },
  {
    id: 'v4', name: 'HomeNest', owner: 'Sunita Rao',
    email: 'sunita@homenest.com', location: 'Bangalore, KA',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HomeNest',
    rating: 4.3, totalSales: 320000, status: 'approved',
    joinDate: '2024-04-10', commission: 10,
    description: 'Beautiful home decor and kitchen essentials.',
    totalOrders: 980, badge: null,
  },
  {
    id: 'v5', name: 'SportsPro', owner: 'Kiran Singh',
    email: 'kiran@sportspro.com', location: 'Pune, MH',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SportsPro',
    rating: 4.6, totalSales: 420000, status: 'pending',
    joinDate: '2026-05-10', commission: 10,
    description: 'Professional sports gear for every athlete.',
    totalOrders: 0, badge: null,
  },
  {
    id: 'v6', name: 'BookWorld', owner: 'Ananya Das',
    email: 'ananya@bookworld.com', location: 'Kolkata, WB',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BookWorld',
    rating: 4.9, totalSales: 220000, status: 'rejected',
    joinDate: '2026-05-12', commission: 10,
    description: 'A world of books at your fingertips.',
    totalOrders: 0, badge: null,
  },
];

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────
export const products = [
  {
    id: 'p1', name: 'iPhone 15 Pro Max 256GB', category: 'Electronics', subcategory: 'Mobiles',
    vendorId: 'v1', price: 134900, originalPrice: 149900, stock: 25,
    rating: 4.8, reviews: 312, sold: 890,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    ],
    description: 'The most powerful iPhone ever with titanium design, A17 Pro chip, and pro camera system. Features USB-C connectivity, 48MP main camera, and all-day battery life.',
    tags: ['iphone', 'apple', 'smartphone', 'mobile', '5g'],
    synonyms: ['apple phone', 'apple smartphone', 'ios phone'],
    featured: true, trending: true,
  },
  {
    id: 'p2', name: 'MacBook Air M2 Chip 13"', category: 'Electronics', subcategory: 'Laptops',
    vendorId: 'v1', price: 114900, originalPrice: 119900, stock: 12,
    rating: 4.9, reviews: 201, sold: 450,
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    ],
    description: 'Supercharged by M2 chip, the redesigned MacBook Air is the world\'s thinnest and lightest laptop. All-day battery life with up to 18 hours.',
    tags: ['macbook', 'apple', 'laptop', 'notebook', 'm2'],
    synonyms: ['apple laptop', 'mac laptop', 'apple notebook carry case'],
    featured: true, trending: false,
  },
  {
    id: 'p3', name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', subcategory: 'Audio',
    vendorId: 'v1', price: 24990, originalPrice: 34990, stock: 38,
    rating: 4.7, reviews: 589, sold: 1200,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e736d9c67c?w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    ],
    description: 'Industry-leading noise canceling with two processors and eight microphones. 30-hour battery life with quick charge.',
    tags: ['headphones', 'sony', 'wireless', 'noise canceling', 'audio'],
    synonyms: ['ear phones', 'headset', 'wireless headphones'],
    featured: false, trending: true,
  },
  {
    id: 'p4', name: 'Men\'s Slim Fit Formal Shirt', category: 'Fashion', subcategory: 'Men',
    vendorId: 'v2', price: 899, originalPrice: 1499, stock: 120,
    rating: 4.3, reviews: 234, sold: 2100,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    ],
    description: 'Premium cotton formal shirt with slim fit cut. Perfect for office wear and formal occasions. Available in multiple colors.',
    tags: ['shirt', 'formal', 'men', 'office', 'cotton'],
    synonyms: ['mens shirt', 'office shirt', 'formal wear'],
    featured: false, trending: false,
  },
  {
    id: 'p5', name: 'Women\'s Floral Kurta Set', category: 'Fashion', subcategory: 'Women',
    vendorId: 'v2', price: 1299, originalPrice: 2199, stock: 85,
    rating: 4.6, reviews: 178, sold: 1400,
    images: [
      'https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?w=600&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    ],
    description: 'Beautiful floral print kurta set with matching dupatta. Made from breathable fabric, perfect for festive occasions.',
    tags: ['kurta', 'women', 'ethnic', 'floral', 'festive'],
    synonyms: ['ladies kurta', 'indian wear', 'ethnic wear'],
    featured: true, trending: true,
  },
  {
    id: 'p6', name: 'Organic Mixed Fruits Basket', category: 'Grocery', subcategory: 'Fruits',
    vendorId: 'v3', price: 399, originalPrice: 499, stock: 50,
    rating: 4.8, reviews: 456, sold: 3200,
    images: [
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80',
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
    ],
    description: 'Farm-fresh organic mixed fruits basket. Includes apples, oranges, bananas, grapes, and seasonal fruits. Delivered same day.',
    tags: ['fruits', 'organic', 'fresh', 'healthy', 'basket'],
    synonyms: ['fresh fruits', 'fruit basket', 'organic produce'],
    featured: false, trending: false,
  },
  {
    id: 'p7', name: 'Premium Coffee Maker Machine', category: 'Home & Kitchen', subcategory: 'Appliances',
    vendorId: 'v4', price: 4999, originalPrice: 7999, stock: 30,
    rating: 4.5, reviews: 123, sold: 345,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    ],
    description: 'Professional-grade coffee maker with built-in grinder, milk frother, and programmable settings for the perfect brew every time.',
    tags: ['coffee', 'machine', 'kitchen', 'appliance', 'espresso'],
    synonyms: ['coffee machine', 'espresso maker', 'coffee brewer'],
    featured: true, trending: false,
  },
  {
    id: 'p8', name: 'Yoga Mat Non-Slip Premium', category: 'Sports', subcategory: 'Fitness',
    vendorId: 'v4', price: 1199, originalPrice: 1999, stock: 75,
    rating: 4.4, reviews: 312, sold: 890,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    ],
    description: '6mm thick premium non-slip yoga mat with alignment lines. Eco-friendly TPE material, sweat-resistant and easy to clean.',
    tags: ['yoga', 'mat', 'fitness', 'exercise', 'gym'],
    synonyms: ['exercise mat', 'gym mat', 'workout mat'],
    featured: false, trending: true,
  },
  {
    id: 'p9', name: 'Atomic Habits by James Clear', category: 'Books', subcategory: 'Non-Fiction',
    vendorId: 'v4', price: 349, originalPrice: 499, stock: 200,
    rating: 4.9, reviews: 1200, sold: 5400,
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
    ],
    description: 'The #1 New York Times bestseller. A revolutionary system to get 1% better every day. Tiny changes, remarkable results.',
    tags: ['book', 'habits', 'self-help', 'james clear', 'bestseller'],
    synonyms: ['atomic habits book', 'self improvement book', 'habit book'],
    featured: true, trending: true,
  },
  {
    id: 'p10', name: 'Vitamin C Face Serum 30ml', category: 'Beauty', subcategory: 'Skincare',
    vendorId: 'v2', price: 599, originalPrice: 999, stock: 150,
    rating: 4.5, reviews: 678, sold: 2300,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
    ],
    description: '20% Vitamin C serum with hyaluronic acid and niacinamide. Brightens skin, reduces dark spots, and boosts collagen production.',
    tags: ['serum', 'vitamin c', 'skincare', 'face', 'brightening'],
    synonyms: ['face serum', 'vitamin c cream', 'skin brightener'],
    featured: false, trending: true,
  },
  {
    id: 'p11', name: 'Wireless Charging Pad 15W', category: 'Electronics', subcategory: 'Accessories',
    vendorId: 'v1', price: 1299, originalPrice: 2499, stock: 60,
    rating: 4.3, reviews: 145, sold: 670,
    images: [
      'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=600&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    ],
    description: 'Fast 15W Qi wireless charger compatible with all Qi-enabled devices. LED indicator, anti-slip base, and smart temperature control.',
    tags: ['charger', 'wireless', 'charging', 'pad', '15w'],
    synonyms: ['wireless charger', 'qi charger', 'phone charger'],
    featured: false, trending: false,
  },
  {
    id: 'p12', name: 'Kids Educational Building Blocks', category: 'Toys', subcategory: 'Educational',
    vendorId: 'v3', price: 799, originalPrice: 1199, stock: 90,
    rating: 4.7, reviews: 267, sold: 1100,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=600&q=80',
    ],
    description: '200-piece colorful building blocks set for kids 3+. Non-toxic BPA-free material, enhances creativity and motor skills.',
    tags: ['toys', 'blocks', 'kids', 'educational', 'building'],
    synonyms: ['lego blocks', 'building toys', 'kids blocks'],
    featured: false, trending: false,
  },
];

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────
export const users = [
  {
    id: 'u1', name: 'Admin User', email: 'admin@vendorhub.com',
    password: 'admin123', role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
    phone: '+91 9876543210', joinDate: '2023-01-01',
  },
  {
    id: 'u2', name: 'Arjun Mehta', email: 'arjun@techzone.com',
    password: 'seller123', role: 'seller', vendorId: 'v1',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Arjun',
    phone: '+91 9876543211', joinDate: '2024-01-15',
  },
  {
    id: 'u3', name: 'Raj Kumar', email: 'raj@buyer.com',
    password: 'buyer123', role: 'buyer',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Raj',
    phone: '+91 9876543212', joinDate: '2024-06-10',
    addresses: [
      { id: 'a1', label: 'Home', line1: '123, MG Road', line2: 'Near Central Park', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', default: true },
      { id: 'a2', label: 'Office', line1: '456, BKC Complex', line2: 'Tower B', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', default: false },
    ],
    browsingHistory: ['p1', 'p3', 'p9', 'p2'],
  },
];

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────
export const initialOrders = [
  {
    id: 'o1', buyerId: 'u3', vendorId: 'v1',
    items: [{ productId: 'p1', qty: 1, price: 134900 }],
    total: 134900, status: 'Delivered',
    address: { label: 'Home', line1: '123, MG Road', city: 'Mumbai', pincode: '400001' },
    paymentMethod: 'Razorpay', paymentId: 'pay_mock_001',
    placedAt: '2026-04-10T10:30:00Z', updatedAt: '2026-04-15T14:00:00Z',
    reviewed: true,
  },
  {
    id: 'o2', buyerId: 'u3', vendorId: 'v1',
    items: [{ productId: 'p3', qty: 1, price: 24990 }, { productId: 'p11', qty: 2, price: 1299 }],
    total: 27588, status: 'Shipped',
    address: { label: 'Home', line1: '123, MG Road', city: 'Mumbai', pincode: '400001' },
    paymentMethod: 'Stripe', paymentId: 'pay_mock_002',
    placedAt: '2026-05-12T09:15:00Z', updatedAt: '2026-05-14T11:00:00Z',
    reviewed: false,
  },
  {
    id: 'o3', buyerId: 'u3', vendorId: 'v2',
    items: [{ productId: 'p5', qty: 2, price: 1299 }],
    total: 2598, status: 'Confirmed',
    address: { label: 'Office', line1: '456, BKC Complex', city: 'Mumbai', pincode: '400051' },
    paymentMethod: 'Razorpay', paymentId: 'pay_mock_003',
    placedAt: '2026-05-17T16:45:00Z', updatedAt: '2026-05-18T09:00:00Z',
    reviewed: false,
  },
  {
    id: 'o4', buyerId: 'u3', vendorId: 'v3',
    items: [{ productId: 'p6', qty: 3, price: 399 }],
    total: 1197, status: 'Placed',
    address: { label: 'Home', line1: '123, MG Road', city: 'Mumbai', pincode: '400001' },
    paymentMethod: 'Razorpay', paymentId: 'pay_mock_004',
    placedAt: '2026-05-19T08:00:00Z', updatedAt: '2026-05-19T08:00:00Z',
    reviewed: false,
  },
];

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────
export const initialReviews = [
  { id: 'r1', productId: 'p1', userId: 'u3', userName: 'Raj Kumar', rating: 5, comment: 'Absolutely love this phone! Camera quality is outstanding.', date: '2026-04-18' },
  { id: 'r2', productId: 'p1', userId: 'u4', userName: 'Meena Shah', rating: 4, comment: 'Great phone but slightly expensive. Worth it though!', date: '2026-04-20' },
  { id: 'r3', productId: 'p3', userId: 'u5', userName: 'Vikram Nair', rating: 5, comment: 'Best noise-canceling headphones I\'ve ever used.', date: '2026-05-01' },
  { id: 'r4', productId: 'p9', userId: 'u6', userName: 'Deepa Rao', rating: 5, comment: 'Life-changing book. Every page is packed with value.', date: '2026-03-15' },
];

// ─────────────────────────────────────────────
// REFUND REQUESTS
// ─────────────────────────────────────────────
export const initialRefunds = [
  { id: 'ref1', orderId: 'o1', userId: 'u3', reason: 'Product not as described', amount: 134900, status: 'pending', date: '2026-04-20' },
];

// ─────────────────────────────────────────────
// PLATFORM STATS (Admin)
// ─────────────────────────────────────────────
export const platformStats = {
  totalRevenue: 28650000,
  totalOrders: 14820,
  totalUsers: 8430,
  totalVendors: 4,
  monthlyRevenue: [
    { month: 'Jan', revenue: 1800000 },
    { month: 'Feb', revenue: 2100000 },
    { month: 'Mar', revenue: 2400000 },
    { month: 'Apr', revenue: 2900000 },
    { month: 'May', revenue: 3200000 },
  ],
  topCategories: [
    { name: 'Electronics', percentage: 35 },
    { name: 'Fashion', percentage: 25 },
    { name: 'Grocery', percentage: 18 },
    { name: 'Home & Kitchen', percentage: 12 },
    { name: 'Others', percentage: 10 },
  ],
};
