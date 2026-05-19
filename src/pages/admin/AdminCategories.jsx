import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';

export default function AdminCategories() {
  const { categories, notify } = useApp();
  const [cats, setCats] = useState(categories.map(c => ({ ...c })));
  const [newCat, setNewCat] = useState('');
  const [newIcon, setNewIcon] = useState('🛍️');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [newSub, setNewSub] = useState({});

  const addCat = () => {
    if (!newCat.trim()) return;
    setCats(c => [...c, { id: 'c' + Date.now(), name: newCat, icon: newIcon, sub: [] }]);
    setNewCat(''); setNewIcon('🛍️');
    notify('Category added!');
  };

  const deleteCat = (id) => { setCats(c => c.filter(x => x.id !== id)); notify('Category deleted', 'info'); };

  const saveEdit = (id) => {
    setCats(c => c.map(x => x.id === id ? { ...x, name: editName } : x));
    setEditId(null); notify('Category updated!');
  };

  const addSub = (catId) => {
    const sub = newSub[catId]?.trim();
    if (!sub) return;
    setCats(c => c.map(x => x.id === catId ? { ...x, sub: [...x.sub, sub] } : x));
    setNewSub(s => ({ ...s, [catId]: '' }));
    notify('Subcategory added!');
  };

  const deleteSub = (catId, sub) => {
    setCats(c => c.map(x => x.id === catId ? { ...x, sub: x.sub.filter(s => s !== sub) } : x));
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Categories & Subcategories</h1>
      <p className="text-muted mb-4">Manage platform categories</p>

      {/* Add Category */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Add New Category</h3>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input className="form-input" placeholder="Icon (emoji)" value={newIcon} onChange={e => setNewIcon(e.target.value)} style={{ width: 70 }} />
            <input className="form-input" placeholder="Category name" value={newCat} onChange={e => setNewCat(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && addCat()} />
            <button className="btn btn-primary" onClick={addCat}><Plus size={16} /> Add</button>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {cats.map(cat => (
          <div key={cat.id} className="card">
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                {editId === cat.id ? (
                  <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                    <input className="form-input" value={editName} onChange={e => setEditName(e.target.value)} style={{ flex: 1 }} />
                    <button className="btn btn-success btn-sm" onClick={() => saveEdit(cat.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontWeight: 700, flex: 1 }}>{cat.name}</span>
                    <button className="btn btn-icon btn-sm" onClick={() => { setEditId(cat.id); setEditName(cat.name); }} title="Edit"><Edit2 size={13} /></button>
                    <button className="btn btn-icon btn-sm" onClick={() => deleteCat(cat.id)} style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={13} /></button>
                  </>
                )}
              </div>

              {/* Subcategories */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {cat.sub.map(s => (
                  <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 6, fontSize: '0.78rem', color: 'var(--text2)' }}>
                    {s}
                    <button onClick={() => deleteSub(cat.id, s)} style={{ background: 'none', color: 'var(--danger)', padding: 0, fontSize: '0.75rem', lineHeight: 1 }}>✕</button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="form-input" placeholder="Add subcategory..." value={newSub[cat.id] || ''} onChange={e => setNewSub(s => ({ ...s, [cat.id]: e.target.value }))} style={{ flex: 1, fontSize: '0.82rem', padding: '0.4rem 0.6rem' }} onKeyDown={e => e.key === 'Enter' && addSub(cat.id)} />
                <button className="btn btn-outline btn-sm" onClick={() => addSub(cat.id)}><Plus size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
