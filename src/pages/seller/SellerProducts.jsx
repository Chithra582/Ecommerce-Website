import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency, suggestPrice } from '../../utils/ai';
import { Plus, Edit2, Trash2, X, Sparkles, AlertTriangle } from 'lucide-react';

const empty = { name: '', category: '', subcategory: '', price: '', originalPrice: '', stock: '', description: '', images: ['', ''], tags: '' };

export default function SellerProducts() {
  const { currentUser, getVendorProducts, dispatch, notify, categories, products } = useApp();
  const myProducts = getVendorProducts(currentUser?.vendorId);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [priceSug, setPriceSug] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(empty); setEditId(null); setPriceSug(null); setModal('add'); };
  const openEdit = (p) => {
    setForm({ ...p, tags: p.tags?.join(', ') || '', images: p.images || ['', ''] });
    setEditId(p.id); setPriceSug(null); setModal('edit');
  };

  const handleSuggest = () => {
    const sug = suggestPrice(products, form.category, form.subcategory, editId);
    setPriceSug(sug);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock || !form.category) { notify('Fill all required fields', 'danger'); return; }
    const payload = {
      ...form,
      price: Number(form.price), originalPrice: Number(form.originalPrice) || Number(form.price),
      stock: Number(form.stock),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      images: form.images.filter(Boolean),
      vendorId: currentUser.vendorId,
      featured: false, trending: false,
    };
    if (modal === 'add') { dispatch({ type: 'ADD_PRODUCT', payload }); notify('Product added!'); }
    else { dispatch({ type: 'UPDATE_PRODUCT', payload: { ...payload, id: editId } }); notify('Product updated!'); }
    setModal(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) { dispatch({ type: 'DELETE_PRODUCT', payload: id }); notify(`${name} deleted`, 'info'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Products</h1>
          <p className="text-muted">{myProducts.length} products in your store</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      {myProducts.length === 0 ? (
        <div className="empty-state"><div className="icon">📦</div><h3>No products yet</h3><p>Add your first product to start selling!</p><button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sold</th><th>Rating</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {myProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={p.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&q=60'; }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        {p.stock <= 5 && p.stock > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--warning)', fontSize: '0.75rem' }}><AlertTriangle size={11} /> Low stock</div>}
                        {p.stock === 0 && <div style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>Out of stock</div>}
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{p.category}</span></td>
                  <td><span style={{ fontWeight: 700 }}>{formatCurrency(p.price)}</span></td>
                  <td><span style={{ color: p.stock <= 5 ? 'var(--danger)' : 'var(--text)', fontWeight: 600 }}>{p.stock}</span></td>
                  <td>{p.sold}</td>
                  <td>⭐ {p.rating?.toFixed(1) || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-icon btn-sm" onClick={() => openEdit(p)} title="Edit"><Edit2 size={14} /></button>
                      <button className="btn btn-icon btn-sm" onClick={() => handleDelete(p.id, p.name)} style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modal === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', color: 'var(--text3)' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. iPhone 15 Pro Max" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subcategory</label>
                  <select className="form-input" value={form.subcategory} onChange={e => set('subcategory', e.target.value)}>
                    <option value="">Select subcategory</option>
                    {(categories.find(c => c.name === form.category)?.sub || []).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input className="form-input" type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-input" type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
                </div>
              </div>

              {/* AI Price Suggestion */}
              {form.category && (
                <div>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleSuggest} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} /> AI Price Suggestion
                  </button>
                  {priceSug && (
                    <div style={{ marginTop: '0.75rem', background: 'rgba(108,62,255,0.08)', border: '1px solid rgba(108,62,255,0.2)', borderRadius: 'var(--radius)', padding: '0.85rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>🤖 AI suggests for {form.category}:</p>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text2)' }}>
                        <span>Market avg: <strong>{formatCurrency(priceSug.avg)}</strong></span>
                        <span>Competitive: <strong style={{ color: 'var(--success)' }}>{formatCurrency(priceSug.competitive)}</strong></span>
                        <span>Premium: <strong style={{ color: 'var(--warning)' }}>{formatCurrency(priceSug.premium)}</strong></span>
                      </div>
                      <button className="btn btn-sm btn-secondary mt-2" onClick={() => set('price', priceSug.competitive)}>Use Competitive Price</button>
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe your product..." />
              </div>
              <div className="form-group">
                <label className="form-label">Image URLs (one per line)</label>
                <input className="form-input" value={form.images[0]} onChange={e => set('images', [e.target.value, form.images[1]])} placeholder="https://..." style={{ marginBottom: '0.5rem' }} />
                <input className="form-input" value={form.images[1]} onChange={e => set('images', [form.images[0], e.target.value])} placeholder="https://... (optional)" />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. mobile, 5g, apple" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSave}>{modal === 'add' ? 'Add Product' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
