import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { LayoutDashboard, Package, ShoppingBag, TrendingUp, LogOut } from 'lucide-react';

const links = [
  { to: '/seller', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/seller/products', icon: <Package size={18} />, label: 'Products' },
  { to: '/seller/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
  { to: '/seller/earnings', icon: <TrendingUp size={18} />, label: 'Earnings' },
];

export default function SellerLayout({ children }) {
  const { currentUser, logout } = useApp();
  const loc = useLocation();
  const navigate = useNavigate();
  const vendor = useApp().vendors.find(v => v.id === currentUser?.vendorId);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>{vendor?.name || 'My Store'}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: '0.2rem' }}>Seller Account</div>
          {vendor?.status === 'approved' ? <span className="badge badge-success mt-1">✓ Approved</span> : <span className="badge badge-warning mt-1">Pending Approval</span>}
        </div>
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`sidebar-link ${loc.pathname === l.to ? 'active' : ''}`}>{l.icon}{l.label}</Link>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
