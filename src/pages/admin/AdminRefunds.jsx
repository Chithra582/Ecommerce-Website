import { useApp } from '../../contexts/AppContext';
import { formatCurrency, timeAgo } from '../../utils/ai';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminRefunds() {
  const { refunds, dispatch, notify, orders, getProduct } = useApp();

  const update = (refundId, status) => {
    dispatch({ type: 'UPDATE_REFUND_STATUS', payload: { refundId, status } });
    notify(`Refund ${status}`, status === 'approved' ? 'success' : 'danger');
  };

  const pending = refunds.filter(r => r.status === 'pending');
  const resolved = refunds.filter(r => r.status !== 'pending');

  const getOrder = (orderId) => orders.find(o => o.id === orderId);

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Refund Requests</h1>
      <p className="text-muted mb-4">{pending.length} pending · {resolved.length} resolved</p>

      {refunds.length === 0 && (
        <div className="empty-state"><div className="icon">✅</div><h3>No refund requests</h3><p>All clear!</p></div>
      )}

      {pending.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--warning)' }}>⏳ Pending ({pending.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pending.map(r => {
              const order = getOrder(r.orderId);
              return (
                <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700 }}>Refund #{r.id}</span>
                        <span className="badge badge-warning">Pending</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary-light)' }}>{formatCurrency(r.amount)}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '0.4rem' }}>
                        Order: #{r.orderId} · User: {r.userId} · Date: {r.date}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text3)', fontStyle: 'italic' }}>
                        Reason: "{r.reason}"
                      </div>
                      {order && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {order.items.map(item => {
                            const p = getProduct(item.productId);
                            return p ? (
                              <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg3)', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.78rem' }}>
                                <img src={p.images[0]} alt="" style={{ width: 20, height: 20, borderRadius: 3, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60&q=60'; }} />
                                {p.name.slice(0, 25)}...
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button className="btn btn-success btn-sm" onClick={() => update(r.id, 'approved')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => update(r.id, 'rejected')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {resolved.length > 0 && (
        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text2)' }}>Resolved ({resolved.length})</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Refund ID</th><th>Order</th><th>Amount</th><th>Reason</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {resolved.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700 }}>#{r.id}</td>
                    <td>#{r.orderId}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(r.amount)}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text2)', fontSize: '0.85rem' }}>{r.reason}</td>
                    <td style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{r.date}</td>
                    <td><span className={`badge badge-${r.status === 'approved' ? 'success' : 'danger'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
