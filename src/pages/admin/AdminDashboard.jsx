import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/ai';
import { Users, ShoppingBag, TrendingUp, Store } from 'lucide-react';
import { platformStats } from '../../data/mockData';

export default function AdminDashboard() {
  const { vendors, orders, products } = useApp();
  const approved = vendors.filter(v => v.status === 'approved');
  const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue || platformStats.totalRevenue), icon: <TrendingUp size={20} />, color: 'var(--primary)', change: '+18% vs last month' },
    { label: 'Total Orders', value: orders.length + 14000, icon: <ShoppingBag size={20} />, color: 'var(--accent)', change: `${orders.length} new this session` },
    { label: 'Active Vendors', value: approved.length, icon: <Store size={20} />, color: 'var(--success)', change: `${vendors.filter(v => v.status === 'pending').length} pending approval` },
    { label: 'Total Products', value: products.length, icon: <Users size={20} />, color: 'var(--warning)', change: `${products.filter(p => p.stock === 0).length} out of stock` },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Admin Dashboard</h1>
      <p className="text-muted mb-4">Platform-wide analytics and overview</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{s.value}</div>
            <div className="stat-change">{s.change}</div>
            <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Monthly Revenue */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>📈 Monthly Revenue</h3>
            <div className="chart-bar-wrap">
              {platformStats.monthlyRevenue.map(m => (
                <div key={m.month} className="chart-bar-row">
                  <span className="chart-bar-label">{m.month}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${(m.revenue / 3200000) * 100}%` }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 700, width: 70, textAlign: 'right' }}>{formatCurrency(m.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>🏷️ Top Categories</h3>
            <div className="chart-bar-wrap">
              {platformStats.topCategories.map(c => (
                <div key={c.name} className="chart-bar-row">
                  <span className="chart-bar-label">{c.name}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${c.percentage}%`, background: 'linear-gradient(90deg, var(--accent), var(--primary-light))' }} />
                  </div>
                  <span className="chart-bar-pct">{c.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Vendors */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🏪 Top Vendors</h3>
            {vendors.filter(v => v.status === 'approved').sort((a, b) => b.totalSales - a.totalSales).map((v, i) => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 800, color: 'var(--text3)', width: 20 }}>#{i + 1}</span>
                <img src={v.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{v.location} · ⭐ {v.rating}</div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.9rem' }}>{formatCurrency(v.totalSales)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📋 Recent Orders</h3>
            {orders.slice(0, 6).map(o => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>#{o.id}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{o.items.length} items · {o.paymentMethod}</div>
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
