import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ShoppingCart, Heart, Package, MapPin, Plus, Trash2, User, Phone, Mail, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/ai';

export default function BuyerDashboard() {
  const { currentUser, wishlist, getCartItems, getBuyerOrders, getProduct, dispatch, notify } = useApp();
  const navigate = useNavigate();
  
  const orders = getBuyerOrders(currentUser?.id) || [];
  const cartItems = getCartItems() || [];
  const addresses = currentUser?.addresses || [];
  
  // States for Address Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', default: false });

  if (!currentUser) return null;

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrForm.line1 || !addrForm.city || !addrForm.state || !addrForm.pincode) {
      notify('Please fill out all address fields!', 'danger');
      return;
    }
    dispatch({ type: 'ADD_ADDRESS', payload: addrForm });
    notify('Address added successfully!', 'success');
    setShowAddForm(false);
    setAddrForm({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', default: false });
  };

  const handleDeleteAddress = (id) => {
    dispatch({ type: 'DELETE_ADDRESS', payload: id });
    notify('Address deleted successfully', 'info');
  };

  const handleSetDefault = (id) => {
    dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: id });
    notify('Default address updated', 'success');
  };

  // Recent order
  const recentOrder = orders[orders.length - 1];

  return (
    <div className="container page" style={{ maxWidth: 1200 }}>
      {/* Banner / Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(108,62,255,0.15) 0%, rgba(0,212,170,0.08) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img src={currentUser.avatar} alt={currentUser.name} style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid var(--primary-light)', boxShadow: 'var(--shadow-md)' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>{currentUser.name}</h1>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>Buyer Account</span>
            </div>
            <p className="text-muted" style={{ margin: '0.25rem 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
              <Calendar size={14} /> Member since {currentUser.joinDate || '2024'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/search" className="btn btn-primary">Start Shopping</Link>
          <Link to="/cart" className="btn btn-secondary">Go to Cart</Link>
        </div>
      </div>

      {/* Grid Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" onClick={() => navigate('/orders')} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(108,62,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
              <Package size={22} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text3)', margin: 0 }}>Orders Placed</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.1rem 0 0' }}>{orders.length}</h4>
            </div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/cart')} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,212,170,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <ShoppingCart size={22} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text3)', margin: 0 }}>Items in Cart</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.1rem 0 0' }}>{cartItems.length}</h4>
            </div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/wishlist')} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,75,75,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <Heart size={22} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text3)', margin: 0 }}>Wishlist Items</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.1rem 0 0' }}>{wishlist.length}</h4>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Left Side: Profile & Addresses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* User Details */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} color="var(--primary-light)" /> Personal Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Mail size={16} color="var(--text3)" />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text3)', margin: 0 }}>Email Address</p>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentUser.email}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Phone size={16} color="var(--text3)" />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text3)', margin: 0 }}>Phone Number</p>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentUser.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Manager */}
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--accent)" /> Saved Addresses
                </h3>
                {!showAddForm && (
                  <button onClick={() => setShowAddForm(true)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Plus size={14} /> Add
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {showAddForm && (
                <form onSubmit={handleAddAddress} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select className="form-input" style={{ width: '40%' }} value={addrForm.label} onChange={e => setAddrForm(a => ({ ...a, label: e.target.value }))}>
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                    <input className="form-input" placeholder="Line 1 (Flat, Block, St)" value={addrForm.line1} onChange={e => setAddrForm(a => ({ ...a, line1: e.target.value }))} required />
                  </div>
                  <input className="form-input" placeholder="Line 2 (Landmark, Area - Optional)" value={addrForm.line2} onChange={e => setAddrForm(a => ({ ...a, line2: e.target.value }))} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input className="form-input" placeholder="City" value={addrForm.city} onChange={e => setAddrForm(a => ({ ...a, city: e.target.value }))} required />
                    <input className="form-input" placeholder="State" value={addrForm.state} onChange={e => setAddrForm(a => ({ ...a, state: e.target.value }))} required />
                    <input className="form-input" placeholder="Pincode" type="number" value={addrForm.pincode} onChange={e => setAddrForm(a => ({ ...a, pincode: e.target.value }))} required />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input type="checkbox" checked={addrForm.default} onChange={e => setAddrForm(a => ({ ...a, default: e.target.checked }))} /> Set as default address
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.7rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.3rem 0.7rem' }}>Save</button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {addresses.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'center', margin: '1rem 0' }}>No saved addresses found. Add one to speed up checkout!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {addresses.map(addr => (
                    <div key={addr.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: addr.default ? 'rgba(0,212,170,0.03)' : 'var(--surface)', borderColor: addr.default ? 'var(--accent)' : 'var(--border2)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <span className="badge" style={{ background: addr.default ? 'var(--accent)' : 'var(--border)', color: addr.default ? '#fff' : 'var(--text2)', fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>{addr.label}</span>
                          {addr.default && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>Default</span>}
                        </div>
                        <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 500, color: 'var(--text)' }}>
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                        </p>
                        <p style={{ fontSize: '0.8rem', margin: '0.1rem 0 0', color: 'var(--text2)' }}>
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {!addr.default && (
                          <button onClick={() => handleSetDefault(addr.id)} style={{ background: 'none', color: 'var(--primary-light)', fontSize: '0.75rem', fontWeight: 600 }}>Set Default</button>
                        )}
                        <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'none', color: 'var(--danger)', padding: 4 }} title="Delete address">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Recent Order */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} color="var(--primary-light)" /> Recent Order
              </h3>

              {recentOrder ? (
                <div>
                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', background: 'var(--bg2)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Order ID:</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, marginLeft: '0.2rem' }}>#{recentOrder.id}</span>
                      </div>
                      <span className={`badge ${recentOrder.status === 'Delivered' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.75rem' }}>
                        {recentOrder.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {recentOrder.items.map(item => {
                        const prod = getProduct(item.productId);
                        return (
                          <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod?.name || 'Product'}</span>
                            <span style={{ color: 'var(--text2)' }}>Qty: {item.qty} × {formatCurrency(item.price)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border2)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text3)', margin: 0 }}>Total Paid:</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--primary-light)' }}>{formatCurrency(recentOrder.total)}</strong>
                    </div>
                  </div>
                  <Link to="/orders" className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center' }}>Track & View All Orders</Link>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>You haven't placed any orders yet!</p>
                  <Link to="/search" className="btn btn-secondary btn-sm">Start Browsing</Link>
                </div>
              )}
            </div>
          </div>

          {/* Wishlist Preview */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={18} color="var(--danger)" /> Wishlist Preview
              </h3>

              {wishlist.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No items in wishlist</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {wishlist.slice(-3).reverse().map(id => {
                    const prod = getProduct(id);
                    if (!prod) return null;
                    return (
                      <div key={prod.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem' }}>
                        <img src={prod.images[0]} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 700 }}>{formatCurrency(prod.price)}</span>
                        </div>
                        <button onClick={() => navigate(`/product/${prod.id}`)} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>View</button>
                      </div>
                    );
                  })}
                  <Link to="/wishlist" className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center' }}>Manage Wishlist</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
