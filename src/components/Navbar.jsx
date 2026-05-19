import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, LogOut, Package, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

export default function Navbar() {
  const { currentUser, cart, wishlist, logout } = useApp();
  const [dropOpen, setDropOpen] = useState(false);
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  const getDashLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'seller') return '/seller';
    return '/dashboard';
  };

  return (
    <nav style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 500 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 70, gap: '1.5rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>V</div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary-light), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VendorHub</span>
        </Link>

        {/* Search — desktop */}
        <form onSubmit={handleSearchSubmit} className="search-bar" style={{ flex: 1, maxWidth: 500, display: 'flex' }}>
          <Search size={18} color="var(--text3)" />
          <input value={navSearch} onChange={e => setNavSearch(e.target.value)} placeholder='Search products, categories, brands...' />
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <Link to="/search" className="btn-icon" title="Search"><Search size={18} /></Link>

          {currentUser?.role === 'buyer' && (
            <>
              <Link to="/wishlist" className="btn-icon" title="Wishlist" style={{ position: 'relative' }}>
                <Heart size={18} />
                {wishlist.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--danger)', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{wishlist.length}</span>}
              </Link>
              <Link to="/cart" className="btn-icon" title="Cart" style={{ position: 'relative' }}>
                <ShoppingCart size={18} />
                {cart.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cart.length}</span>}
              </Link>
            </>
          )}

          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '0.4rem 0.8rem', cursor: 'pointer', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600 }}>
                <img src={currentUser.avatar} alt="" style={{ width: 26, height: 26, borderRadius: '50%' }} />
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>
              {dropOpen && (
                <div style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', minWidth: 180, boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 100 }}>
                  <Link to={getDashLink()} onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', color: 'var(--text)', fontSize: '0.9rem' }}>
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  {currentUser.role === 'buyer' && (
                    <Link to="/orders" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', color: 'var(--text)', fontSize: '0.9rem' }}>
                      <Package size={15} /> My Orders
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid var(--border)' }} />
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', color: 'var(--danger)', fontSize: '0.9rem', width: '100%', background: 'none' }}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
