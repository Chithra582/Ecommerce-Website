import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, getProduct, dispatch, notify } = useApp();
  const products = wishlist.map(id => getProduct(id)).filter(Boolean);

  const removeAll = () => {
    wishlist.forEach(id => dispatch({ type: 'TOGGLE_WISHLIST', payload: id }));
    notify('Wishlist cleared', 'info');
  };

  if (products.length === 0) return (
    <div className="container page">
      <div className="empty-state" style={{ minHeight: 400 }}>
        <div className="icon">💝</div>
        <h3>Your wishlist is empty</h3>
        <p>Save products you love to buy them later</p>
        <Link to="/search" className="btn btn-primary btn-lg"><Heart size={18} /> Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="container page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Wishlist <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: '1.1rem' }}>({products.length})</span></h1>
        <button onClick={removeAll} style={{ background: 'none', color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Heart size={16} /> Clear All
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
