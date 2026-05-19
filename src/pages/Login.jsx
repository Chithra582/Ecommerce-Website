import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, notify } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const demos = [
    { label: 'Admin', email: 'admin@vendorhub.com', password: 'admin123', color: 'var(--danger)' },
    { label: 'Seller', email: 'arjun@techzone.com', password: 'seller123', color: 'var(--warning)' },
    { label: 'Buyer', email: 'raj@buyer.com', password: 'buyer123', color: 'var(--success)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = login(form.email, form.password);
      setLoading(false);
      if (user) {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'seller') navigate('/seller');
        else navigate('/');
      } else {
        notify('Invalid email or password', 'danger');
      }
    }, 600);
  };

  const quickLogin = (email, password) => {
    setForm({ email, password });
    setLoading(true);
    setTimeout(() => {
      const user = login(email, password);
      setLoading(false);
      if (user) {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'seller') navigate('/seller');
        else navigate('/');
      }
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 60% 20%, rgba(108,62,255,0.15) 0%, transparent 50%), var(--bg)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: '0 auto 1rem' }}>V</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back</h1>
          <p className="text-muted mt-1">Sign in to your VendorHub account</p>
        </div>

        {/* Demo Quick Login */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Quick Demo Login</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {demos.map(d => (
                <button key={d.label} onClick={() => quickLogin(d.email, d.password)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 8, background: 'var(--bg3)', border: `1px solid ${d.color}33`, color: d.color, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${d.color}22`}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}
                >{d.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                  <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ paddingLeft: '2.5rem' }} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                  <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} required />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text3)' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center mt-3" style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign up</Link>
            </p>
            <p className="text-center mt-1" style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
              Want to sell? <Link to="/register-vendor" style={{ color: 'var(--accent)', fontWeight: 600 }}>Register as Vendor</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
