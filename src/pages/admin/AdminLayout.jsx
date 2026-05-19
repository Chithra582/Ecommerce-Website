import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { LayoutDashboard, Users, Tag, BarChart2, RotateCcw, Settings, LogOut } from 'lucide-react';

const links = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/vendors', icon: <Users size={18} />, label: 'Vendors' },
  { to: '/admin/categories', icon: <Tag size={18} />, label: 'Categories' },
  { to: '/admin/reports', icon: <BarChart2 size={18} />, label: 'Analytics' },
  { to: '/admin/refunds', icon: <RotateCcw size={18} />, label: 'Refunds' },
  { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const { logout } = useApp();
  const loc = useLocation();
  const navigate = useNavigate();
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg, var(--primary-light), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VendorHub Admin</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: '0.2rem' }}>Platform Management</div>
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
