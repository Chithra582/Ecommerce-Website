import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/ai';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { getCartItems, getCartTotal, dispatch, notify } = useApp();
  const navigate = useNavigate();
  const items = getCartItems();
  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;
  const tax = Math.round(total * 0.05);
  const grand = total + shipping + tax;

  const updateQty = (productId, qty) => {
    if (qty < 1) return;
    dispatch({ type: 'UPDATE_CART_QTY', payload: { productId, qty } });
  };
  const remove = (productId, name) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    notify(`${name} removed from cart`, 'info');
  };

  if (items.length === 0) return (
    <div className="container page">
      <div className="empty-state" style={{ minHeight: 400 }}>
        <div className="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some awesome products to get started!</p>
        <Link to="/search" className="btn btn-primary btn-lg"><ShoppingBag size={18} /> Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="container page">
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: '1.1rem' }}>({items.length} items)</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(({ product, qty }) => (
            <div key={product.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <Link to={`/product/${product.id}`}>
                <img src={product.images[0]} alt={product.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0 }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&q=60'; }} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/product/${product.id}`} style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', marginBottom: '0.25rem' }}>{product.name}</Link>
                <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '0.5rem' }}>{product.category} · {product.subcategory}</p>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-light)' }}>{formatCurrency(product.price)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border2)', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <button onClick={() => updateQty(product.id, qty - 1)} style={{ padding: '0.4rem 0.6rem', background: 'var(--surface)', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><Minus size={14} /></button>
                <span style={{ padding: '0.4rem 0.8rem', background: 'var(--bg3)', fontWeight: 700 }}>{qty}</span>
                <button onClick={() => updateQty(product.id, qty + 1)} style={{ padding: '0.4rem 0.6rem', background: 'var(--surface)', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><Plus size={14} /></button>
              </div>
              <div style={{ textAlign: 'right', minWidth: 90, flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{formatCurrency(product.price * qty)}</div>
                <button onClick={() => remove(product.id, product.name)} style={{ background: 'none', color: 'var(--danger)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{ position: 'sticky', top: 90 }}>
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)', fontSize: '0.9rem' }}>
                <span>Subtotal ({items.length} items)</span><span>{formatCurrency(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)', fontSize: '0.9rem' }}>
                <span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)', fontSize: '0.9rem' }}>
                <span>GST (5%)</span><span>{formatCurrency(tax)}</span>
              </div>
            </div>
            {shipping > 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '0.75rem', background: 'var(--bg3)', padding: '0.5rem 0.75rem', borderRadius: 8 }}>Add {formatCurrency(999 - total)} more for FREE shipping!</p>}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              <span>Total</span><span style={{ color: 'var(--primary-light)' }}>{formatCurrency(grand)}</span>
            </div>
            <button className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/search" className="btn btn-secondary w-full mt-2" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
