import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/ai';
import { platformStats } from '../../data/mockData';

export default function AdminReports() {
  const { vendors, orders, products } = useApp();
  const delivered = orders.filter(o => o.status === 'Delivered');
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0) || platformStats.totalRevenue;

  // Category sales breakdown from products
  const catSales = {};
  products.forEach(p => {
    catSales[p.category] = (catSales[p.category] || 0) + p.sold * p.price;
  });
  const catData = Object.entries(catSales).sort((a, b) => b[1] - a[1]).map(([name, rev]) => ({
    name, revenue: rev, percentage: Math.round((rev / Object.values(catSales).reduce((a, b) => a + b, 0)) * 100)
  }));

  // Vendor leaderboard
  const vendorSales = {};
  orders.forEach(o => {
    if (o.status === 'Delivered') vendorSales[o.vendorId] = (vendorSales[o.vendorId] || 0) + o.total;
  });
  const vendorLeaderboard = vendors.filter(v => v.status === 'approved').map(v => ({
    ...v, sessionRevenue: vendorSales[v.id] || 0, total: v.totalSales + (vendorSales[v.id] || 0),
  })).sort((a, b) => b.total - a.total);

  const ordersByStatus = ['Placed', 'Confirmed', 'Shipped', 'Delivered'].map(s => ({
    status: s, count: orders.filter(o => o.status === s).length,
  }));

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Platform Analytics</h1>
      <p className="text-muted mb-4">Overview of platform performance</p>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total GMV', value: formatCurrency(totalRevenue), color: 'var(--primary)' },
          { label: 'Avg Order Value', value: formatCurrency(orders.length ? Math.round(totalRevenue / (delivered.length || 1)) : 0), color: 'var(--accent)' },
          { label: 'Order Completion', value: `${orders.length ? Math.round((delivered.length / orders.length) * 100) : 0}%`, color: 'var(--success)' },
          { label: 'Active Products', value: products.filter(p => p.stock > 0).length, color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Monthly Revenue Chart */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>📈 Monthly Revenue Trend</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem', height: 140 }}>
              {platformStats.monthlyRevenue.map((m, i) => {
                const pct = (m.revenue / 3200000) * 100;
                return (
                  <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 700 }}>{formatCurrency(m.revenue).replace('₹', '₹').slice(0, 6)}</span>
                    <div style={{ width: '100%', height: `${pct}%`, background: `linear-gradient(180deg, var(--primary-light), var(--primary-dark))`, borderRadius: '4px 4px 0 0', minHeight: 8, transition: 'height 0.5s ease' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600 }}>{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>📦 Orders by Status</h3>
            <div className="chart-bar-wrap">
              {ordersByStatus.map(s => (
                <div key={s.status} className="chart-bar-row">
                  <span className="chart-bar-label">{s.status}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{
                      width: `${orders.length ? (s.count / orders.length) * 100 : 0}%`,
                      background: s.status === 'Delivered' ? 'linear-gradient(90deg, var(--success), #00a857)' :
                        s.status === 'Placed' ? 'linear-gradient(90deg, var(--info), #0090d4)' :
                          s.status === 'Confirmed' ? 'linear-gradient(90deg, var(--warning), #e0a000)' :
                            'linear-gradient(90deg, var(--primary), var(--primary-light))'
                    }} />
                  </div>
                  <span className="chart-bar-pct">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>🏷️ Revenue by Category</h3>
            <div className="chart-bar-wrap">
              {catData.slice(0, 6).map(c => (
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

        {/* Vendor Leaderboard */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🏆 Vendor Leaderboard</h3>
            {vendorLeaderboard.map((v, i) => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 900, fontSize: '1rem', color: i === 0 ? 'var(--warning)' : i === 1 ? 'var(--text2)' : i === 2 ? '#cd7f32' : 'var(--text3)', width: 24, textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <img src={v.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{v.location} · ⭐ {v.rating}</div>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '0.9rem', flexShrink: 0 }}>{formatCurrency(v.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
