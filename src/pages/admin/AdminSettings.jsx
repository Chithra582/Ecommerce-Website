import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Save, Percent } from 'lucide-react';

export default function AdminSettings() {
  const { commission, dispatch, notify } = useApp();
  const [val, setVal] = useState(commission);

  const save = () => {
    dispatch({ type: 'SET_COMMISSION', payload: Number(val) });
    notify(`Commission updated to ${val}%`, 'success');
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Platform Settings</h1>
      <p className="text-muted mb-4">Configure platform-wide settings</p>

      <div style={{ maxWidth: 500 }}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Percent size={18} color="var(--primary-light)" /> Commission Settings
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>
              Platform commission deducted from vendor earnings on each sale.
            </p>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Commission Rate (%)</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type="number"
                  min="0" max="50" step="0.5"
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontWeight: 700 }}>%</span>
              </div>
            </div>

            <div style={{ background: 'rgba(108,62,255,0.08)', border: '1px solid rgba(108,62,255,0.2)', borderRadius: 'var(--radius)', padding: '0.85rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '0.3rem' }}>Example: For a ₹10,000 order</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text3)' }}>Platform earns:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>₹{Math.round(10000 * val / 100).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text3)' }}>Vendor earns:</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{Math.round(10000 * (1 - val / 100)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="btn btn-primary" onClick={save} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> Save Commission
            </button>
          </div>
        </div>

        {/* Sandbox Notice */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>🔐 Payment Gateway</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Razorpay', status: 'Sandbox Active', color: 'var(--success)' },
                { name: 'Stripe', status: 'Sandbox Active', color: 'var(--success)' },
                { name: 'Cash on Delivery', status: 'Enabled', color: 'var(--accent)' },
              ].map(pg => (
                <div key={pg.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg3)', borderRadius: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{pg.name}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: pg.color }}>● {pg.status}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: '0.75rem' }}>All payments are in sandbox/test mode. No real transactions occur.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
