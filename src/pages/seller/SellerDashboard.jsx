import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/ai';
import { Package, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';

export default function SellerDashboard() {
  const { currentUser, getVendorProducts, getVendorOrders, commission } = useApp();
  const products = getVendorProducts(currentUser?.vendorId);
  const orders = getVendorOrders(currentUser?.vendorId);
  const delivered = orders.filter(o => o.status === 'Delivered');
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const netEarnings = Math.round(totalRevenue * (1 - commission / 100));
  const now = new Date();
  const weekAgo = new Date(now - 7 * 86400000);
  const weekOrders = orders.filter(o => new Date(o.placedAt) >= weekAgo);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: <TrendingUp size={20} />, color: 'var(--primary)', change: '+12% this month' },
    { label: 'Net Earnings', value: formatCurrency(netEarnings), icon: '💰', color: 'var(--success)', change: `After ${commission}% commission` },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={20} />, color: 'var(--accent)', change: `${weekOrders.length} this week` },
    { label: 'Active Products', value: products.filter(p => p.stock > 0).length, icon: <Package size={20} />, color: 'var(--warning)', change: `${products.length} total` },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Seller Dashboard</h1>
      <p className="text-muted mb-4">Welcome back! Here's your store overview.</p>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div style={{ background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', borderRadius: 'var(--radius)', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={18} color="var(--warning)" />
          <span style={{ fontSize: '0.9rem' }}>
            <strong>Low stock alert:</strong> {lowStock.map(p => p.name).join(', ')} — restock soon!
          </span>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change">{s.change}</div>
            <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🏆 Top Selling Products</h3>
            {topProducts.length === 0 ? <p className="text-muted">No products yet.</p> : topProducts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 800, color: 'var(--text3)', width: 20 }}>#{i + 1}</span>
                <img src={p.images[0]} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&q=60'; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{p.sold} sold · Stock: {p.stock}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-light)', flexShrink: 0 }}>{formatCurrency(p.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📋 Recent Orders</h3>
            {orders.length === 0 ? <p className="text-muted">No orders yet.</p> : orders.slice(0, 5).map(o => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>#{o.id}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{o.items.length} items</div>
                </div>
                <span className={`badge badge-${o.status === 'Delivered' ? 'success' : o.status === 'Placed' ? 'info' : o.status === 'Confirmed' ? 'warning' : 'primary'}`}>{o.status}</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(o.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
