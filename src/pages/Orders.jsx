import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, timeAgo } from '../utils/ai';
import { Package, RotateCcw } from 'lucide-react';

const STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

function OrderStepper({ status }) {
  const cur = STEPS.indexOf(status);
  return (
    <div className="stepper">
      {STEPS.map((s, i) => (
        <>
          {i > 0 && <div key={`line-${i}`} className={`step-line ${i <= cur ? 'done' : ''}`} />}
          <div key={s} className={`step ${i < cur ? 'done' : i === cur ? 'active' : ''}`}>
            <div className="step-dot">{i < cur ? '✓' : i + 1}</div>
            <div className="step-label">{s}</div>
          </div>
        </>
      ))}
    </div>
  );
}

export default function Orders() {
  const { currentUser, getBuyerOrders, getProduct, getVendor, dispatch, notify, refunds } = useApp();
  const orders = getBuyerOrders(currentUser?.id || '').sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  const [filter, setFilter] = useState('all');
  const [refundModal, setRefundModal] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const submitRefund = (order) => {
    dispatch({ type: 'REQUEST_REFUND', payload: { orderId: order.id, userId: currentUser.id, reason: refundReason, amount: order.total } });
    notify('Refund request submitted!', 'info');
    setRefundModal(null); setRefundReason('');
  };

  if (orders.length === 0) return (
    <div className="container page">
      <div className="empty-state" style={{ minHeight: 400 }}>
        <div className="icon">📦</div>
        <h3>No orders yet</h3>
        <p>Start shopping to see your orders here!</p>
        <Link to="/search" className="btn btn-primary btn-lg"><Package size={18} /> Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="container page">
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Orders</h1>
      {/* Filters */}
      <div className="nav-tabs" style={{ marginBottom: '1.5rem' }}>
        {['all', ...STEPS].map(f => (
          <button key={f} className={`nav-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${orders.length})` : f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.map(order => {
          const vendor = getVendor(order.vendorId);
          const refundRecord = refunds.find(r => r.orderId === order.id);
          return (
            <div key={order.id} className="card">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Order #{order.id}</span>
                    <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--text3)' }}>{timeAgo(order.placedAt)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`badge badge-${order.status === 'Delivered' ? 'success' : order.status === 'Placed' ? 'info' : order.status === 'Confirmed' ? 'warning' : 'primary'}`}>
                      {order.status}
                    </span>
                    <span style={{ fontWeight: 800, color: 'var(--primary-light)' }}>{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {order.items.map(item => {
                    const p = getProduct(item.productId);
                    if (!p) return null;
                    return (
                      <Link to={`/product/${p.id}`} key={item.productId} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', background: 'var(--bg3)', padding: '0.5rem 0.75rem', borderRadius: 8 }}>
                        <img src={p.images[0]} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&q=60'; }} />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Qty: {item.qty} · {formatCurrency(item.price)}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Stepper */}
                <div style={{ margin: '1.25rem 0' }}>
                  <OrderStepper status={order.status} />
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                    <span>📍 {order.address?.city} · </span>
                    <span>💳 {order.paymentMethod}</span>
                    {vendor && <span> · 🏪 {vendor.name}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {order.status === 'Delivered' && !order.reviewed && (
                      <Link to={`/product/${order.items[0]?.productId}`} className="btn btn-outline btn-sm">Write Review</Link>
                    )}
                    {order.status === 'Delivered' && !refundRecord && (
                      <button className="btn btn-secondary btn-sm" onClick={() => setRefundModal(order)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <RotateCcw size={13} /> Refund
                      </button>
                    )}
                    {refundRecord && refundRecord.status === 'pending' && (
                      <span className="badge badge-warning">Refund Requested</span>
                    )}
                    {refundRecord && refundRecord.status === 'approved' && (
                      <span className="badge badge-success">Refund Approved</span>
                    )}
                    {refundRecord && refundRecord.status === 'rejected' && (
                      <span className="badge badge-danger">Refund Rejected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refund Modal */}
      {refundModal && (
        <div className="overlay" onClick={() => setRefundModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Request Refund</h3>
              <button onClick={() => setRefundModal(null)} style={{ background: 'none', color: 'var(--text3)' }}>✕</button>
            </div>
            <p style={{ color: 'var(--text2)', marginBottom: '1rem', fontSize: '0.9rem' }}>Order #{refundModal.id} · {formatCurrency(refundModal.total)}</p>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Reason for Refund</label>
              <textarea className="form-input" placeholder="Describe the issue..." value={refundReason} onChange={e => setRefundReason(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setRefundModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => submitRefund(refundModal)} disabled={!refundReason.trim()}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
