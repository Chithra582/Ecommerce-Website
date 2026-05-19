import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { User, Mail, Lock, Phone, MapPin, Store, FileText } from 'lucide-react';

export default function RegisterVendor() {
  const { dispatch, notify, registerUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    storeName: '', location: '', description: '', category: '',
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const vendorId = 'v' + Date.now();
      const registered = registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: 'seller',
        vendorId: vendorId,
      });

      if (!registered) {
        setLoading(false);
        notify('Email is already registered!', 'danger');
        return;
      }

      dispatch({
        type: 'ADD_VENDOR', payload: {
          id: vendorId, name: form.storeName, owner: form.name,
          email: form.email, location: form.location,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${form.storeName}`,
          rating: 0, totalSales: 0, status: 'pending',
          joinDate: new Date().toISOString().split('T')[0], commission: 10,
          description: form.description, totalOrders: 0, badge: null,
        }
      });
      setLoading(false);
      notify('Vendor registration submitted! Await admin approval.', 'info');
      navigate('/login');
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 40% 30%, rgba(0,212,170,0.1) 0%, transparent 50%), var(--bg)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--accent), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Store size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Become a Vendor</h1>
          <p className="text-muted mt-1">Register your store and start selling</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: step >= s ? 'var(--primary)' : 'var(--border2)', transition: 'background 0.3s' }} />
          ))}
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {step === 1 && (
                <>
                  <p style={{ fontWeight: 700, color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '-0.25rem' }}>Step 1: Your Details</p>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                      <input className="form-input" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} style={{ paddingLeft: '2.4rem' }} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                      <input className="form-input" type="email" placeholder="you@store.com" value={form.email} onChange={e => set('email', e.target.value)} style={{ paddingLeft: '2.4rem' }} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                      <input className="form-input" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingLeft: '2.4rem' }} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                      <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ paddingLeft: '2.4rem' }} required />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={() => setStep(2)}>Next Step →</button>
                </>
              )}
              {step === 2 && (
                <>
                  <p style={{ fontWeight: 700, color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '-0.25rem' }}>Step 2: Store Details</p>
                  <div className="form-group">
                    <label className="form-label">Store Name</label>
                    <div style={{ position: 'relative' }}>
                      <Store size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                      <input className="form-input" placeholder="Your store name" value={form.storeName} onChange={e => set('storeName', e.target.value)} style={{ paddingLeft: '2.4rem' }} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / City</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                      <input className="form-input" placeholder="e.g. Mumbai, MH" value={form.location} onChange={e => set('location', e.target.value)} style={{ paddingLeft: '2.4rem' }} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Store Description</label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={15} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text3)' }} />
                      <textarea className="form-input" placeholder="Describe what you sell..." value={form.description} onChange={e => set('description', e.target.value)} style={{ paddingLeft: '2.4rem', minHeight: 80 }} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" className="btn btn-secondary btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>← Back</button>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>{loading ? 'Submitting...' : 'Submit for Approval'}</button>
                  </div>
                </>
              )}
            </form>
            <p className="text-center mt-3" style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
