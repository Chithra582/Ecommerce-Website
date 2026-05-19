import { useApp } from '../../contexts/AppContext';
import { formatCurrency, timeAgo } from '../../utils/ai';

export default function SellerOrders() {
  const { currentUser, getVendorOrders, getProduct, dispatch, notify } = useApp();
  const orders = getVendorOrders(currentUser?.vendorId).sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));

  const nextStatus = { Placed: 'Confirmed', Confirmed: 'Shipped', Shipped: 'Delivered' };

  const advance = (orderId, current) => {
    const next = nextStatus[current];
    if (!next) return;
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: next } });
    notify(`Order marked as ${next}`, 'success');
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Incoming Orders</h1>
      <p className="text-muted mb-4">{orders.length} total orders</p>

      {orders.length === 0 ? (
        <div className="empty-state"><div className="icon">📬</div><h3>No orders yet</h3><p>Orders will appear here once buyers purchase your products</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Order ID</th><th>Items</th><th>Buyer</th><th>Address</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>#{o.id}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {o.items.map(item => {
                        const p = getProduct(item.productId);
                        return p ? (
                          <div key={item.productId} style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <img src={p.images[0]} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60&q=60'; }} />
                            <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                            <span style={{ color: 'var(--text3)' }}>x{item.qty}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{o.buyerId}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text2)', maxWidth: 130 }}>{o.address?.city}, {o.address?.pincode}</td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(o.total)}</td>
                  <td><span className={`badge badge-${o.status === 'Delivered' ? 'success' : o.status === 'Placed' ? 'info' : o.status === 'Confirmed' ? 'warning' : 'primary'}`}>{o.status}</span></td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{timeAgo(o.placedAt)}</td>
                  <td>
                    {nextStatus[o.status] ? (
                      <button className="btn btn-primary btn-sm" onClick={() => advance(o.id, o.status)}>
                        Mark {nextStatus[o.status]}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{o.status === 'Shipped' ? 'Awaiting delivery' : 'Completed'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
