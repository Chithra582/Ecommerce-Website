import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/ai';
import { CreditCard, MapPin, Check, Shield } from 'lucide-react';

export default function Checkout() {
  const { currentUser, getCartItems, getCartTotal, dispatch, notify } = useApp();
  const navigate = useNavigate();
  const items = getCartItems();
  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const grand = subtotal + shipping + tax;
  const addresses = currentUser?.addresses || [];
  const [selAddr, setSelAddr] = useState(addresses.find(a => a.default)?.id || addresses[0]?.id || null);
  const [payment, setPayment] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [newAddr, setNewAddr] = useState({ line1: '', city: '', state: '', pincode: '' });
  const [addingAddr, setAddingAddr] = useState(addresses.length === 0);

  const selectedAddress = addresses.find(a => a.id === selAddr) || (addingAddr ? newAddr : null);

  const handlePlace = () => {
    if (!selectedAddress?.line1 && !selectedAddress?.city) { notify('Please select or add an address', 'danger'); return; }
    setLoading(true);
    setTimeout(() => {
      // Group by vendor
      const byVendor = {};
      items.forEach(({ product, qty }) => {
        if (!byVendor[product.vendorId]) byVendor[product.vendorId] = [];
        byVendor[product.vendorId].push({ productId: product.id, qty, price: product.price });
      });
      Object.entries(byVendor).forEach(([vendorId, orderItems]) => {
        const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
        dispatch({
          type: 'PLACE_ORDER', payload: {
            buyerId: currentUser.id, vendorId,
            items: orderItems, total,
            address: selectedAddress,
            paymentMethod: payment === 'razorpay' ? 'Razorpay' : 'Stripe',
            paymentId: 'pay_mock_' + Date.now(),
          }
        });
      });
      setLoading(false);
      setPlaced(true);
    }, 1500);
  };

  if (placed) return (
    <div className="container page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,201,107,0.15)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Check size={36} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed!</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '2rem' }}>Your order has been placed successfully. You'll receive a confirmation soon.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>Track Orders</button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="container page">
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Address */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} color="var(--primary-light)" /> Delivery Address</h3>
              {addresses.map(addr => (
                <div key={addr.id} onClick={() => { setSelAddr(addr.id); setAddingAddr(false); }}
                  style={{ padding: '1rem', border: `1.5px solid ${selAddr === addr.id && !addingAddr ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', marginBottom: '0.75rem', cursor: 'pointer', background: selAddr === addr.id && !addingAddr ? 'rgba(108,62,255,0.08)' : 'var(--bg3)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{addr.label}</span>
                    {addr.default && <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Default</span>}
                  </div>
                  <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
              ))}
              <button onClick={() => setAddingAddr(v => !v)} className="btn btn-outline btn-sm">+ Add New Address</button>
              {addingAddr && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input className="form-input" placeholder="Street address" value={newAddr.line1} onChange={e => setNewAddr(a => ({ ...a, line1: e.target.value }))} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <input className="form-input" placeholder="City" value={newAddr.city} onChange={e => setNewAddr(a => ({ ...a, city: e.target.value }))} />
                    <input className="form-input" placeholder="State" value={newAddr.state} onChange={e => setNewAddr(a => ({ ...a, state: e.target.value }))} />
                    <input className="form-input" placeholder="Pincode" value={newAddr.pincode} onChange={e => setNewAddr(a => ({ ...a, pincode: e.target.value }))} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard size={18} color="var(--primary-light)" /> Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'razorpay', label: 'Razorpay', sub: 'Cards, UPI, Net Banking, Wallets', badge: 'Recommended' },
                  { id: 'stripe', label: 'Stripe', sub: 'International cards accepted', badge: null },
                  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive', badge: null },
                ].map(p => (
                  <div key={p.id} onClick={() => setPayment(p.id)}
                    style={{ padding: '1rem', border: `1.5px solid ${payment === p.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', background: payment === p.id ? 'rgba(108,62,255,0.08)' : 'var(--bg3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payment === p.id ? 'var(--primary)' : 'var(--border2)'}`, background: payment === p.id ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {payment === p.id && <Check size={11} color="#fff" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {p.label} {p.badge && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{p.badge}</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,201,107,0.08)', borderRadius: 8, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Shield size={14} color="var(--success)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Sandbox mode — no real payments are processed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card" style={{ position: 'sticky', top: 90 }}>
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {items.map(({ product, qty }) => (
                <div key={product.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img src={product.images[0]} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&q=60'; }} />
                  <div style={{ flex: 1, fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
                    <div style={{ color: 'var(--text3)' }}>Qty: {qty}</div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(product.price * qty)}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            {[['Subtotal', formatCurrency(subtotal)], ['Shipping', shipping === 0 ? 'FREE' : formatCurrency(shipping)], ['GST (5%)', formatCurrency(tax)]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              <span>Total</span><span style={{ color: 'var(--primary-light)' }}>{formatCurrency(grand)}</span>
            </div>
            <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={handlePlace} disabled={loading}>
              {loading ? 'Placing Order...' : `Pay ${formatCurrency(grand)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
