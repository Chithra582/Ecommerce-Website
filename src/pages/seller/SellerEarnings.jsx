import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/ai';
import { TrendingUp, DollarSign, Calendar, Award } from 'lucide-react';

export default function SellerEarnings() {
  const { currentUser, getVendorOrders, getVendorProducts, commission } = useApp();
  const orders = getVendorOrders(currentUser?.vendorId);
  const products = getVendorProducts(currentUser?.vendorId);
  const delivered = orders.filter(o => o.status === 'Delivered');
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const platformFee = Math.round(totalRevenue * commission / 100);
  const netEarnings = totalRevenue - platformFee;

  const now = new Date();
  const weekAgo = new Date(now - 7 * 86400000);
  const monthAgo = new Date(now - 30 * 86400000);
  const weekRevenue = delivered.filter(o => new Date(o.placedAt) >= weekAgo).reduce((s, o) => s + o.total, 0);
  const monthRevenue = delivered.filter(o => new Date(o.placedAt) >= monthAgo).reduce((s, o) => s + o.total, 0);

  // Simulated payout history
  const payouts = [
    { id: 'pay1', date: '2026-05-01', amount: Math.round(netEarnings * 0.4), status: 'Paid', method: 'Bank Transfer' },
    { id: 'pay2', date: '2026-04-01', amount: Math.round(netEarnings * 0.35), status: 'Paid', method: 'Bank Transfer' },
    { id: 'pay3', date: '2026-03-01', amount: Math.round(netEarnings * 0.25), status: 'Paid', method: 'UPI' },
  ];

  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Earnings Dashboard</h1>
      <p className="text-muted mb-4">Platform commission: <strong style={{ color: 'var(--warning)' }}>{commission}%</strong></p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: <TrendingUp size={20} />, color: 'var(--primary)' },
          { label: 'Net Earnings', value: formatCurrency(netEarnings), icon: <DollarSign size={20} />, color: 'var(--success)', sub: `After ${commission}% commission` },
          { label: 'This Week', value: formatCurrency(weekRevenue), icon: <Calendar size={20} />, color: 'var(--accent)' },
          { label: 'This Month', value: formatCurrency(monthRevenue), icon: <Award size={20} />, color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            {s.sub && <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{s.sub}</div>}
            <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Commission breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>💰 Earnings Breakdown</h3>
            {[
              { label: 'Gross Revenue', value: totalRevenue, color: 'var(--text)' },
              { label: `Platform Fee (${commission}%)`, value: -platformFee, color: 'var(--danger)' },
              { label: 'Net Earnings', value: netEarnings, color: 'var(--success)' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{row.label}</span>
                <span style={{ fontWeight: 700, color: row.color }}>{row.value < 0 ? '-' : ''}{formatCurrency(Math.abs(row.value))}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🏆 Top Products by Revenue</h3>
            {topProducts.map((p, i) => {
              const rev = Math.round(p.sold * p.price * (1 - commission / 100));
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 800, color: 'var(--text3)', width: 20, flexShrink: 0 }}>#{i + 1}</span>
                  <img src={p.images[0]} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=80&q=60'; }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{p.sold} units sold</div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--success)', flexShrink: 0 }}>{formatCurrency(rev)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="card">
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📜 Payout History (Simulated)</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Payout ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr>
              </thead>
              <tbody>
                {payouts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>#{p.id}</td>
                    <td>{p.date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(p.amount)}</td>
                    <td>{p.method}</td>
                    <td><span className="badge badge-success">{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
