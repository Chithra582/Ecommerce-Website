import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { getRecommendations } from '../utils/ai';
import { ArrowRight, Zap, Shield, Truck, Star, ChevronRight } from 'lucide-react';

export default function Home() {
  const { products, orders, currentUser, categories } = useApp();
  const navigate = useNavigate();
  const [heroIdx, setHeroIdx] = useState(0);

  const featured = products.filter(p => p.featured).slice(0, 4);
  const trending = products.filter(p => p.trending).slice(0, 4);
  const userOrders = currentUser ? orders.filter(o => o.buyerId === currentUser.id) : [];
  const history = currentUser?.browsingHistory || [];
  const recommended = getRecommendations(products, userOrders, history, null, 4);

  const heroes = [
    { title: 'Shop the Future', sub: 'AI-powered recommendations just for you', bg: 'rgba(108,62,255,0.25)', img: products[0]?.images[0] },
    { title: 'Local Vendors, Big Deals', sub: 'Support hyperlocal businesses near you', bg: 'rgba(0,212,170,0.15)', img: products[4]?.images[0] },
    { title: 'New Arrivals Every Day', sub: 'Discover trending products before everyone else', bg: 'rgba(255,107,53,0.15)', img: products[6]?.images[0] },
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroes.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ background: `radial-gradient(ellipse at 70% 50%, ${heroes[heroIdx].bg}, transparent 60%), var(--bg2)`, borderBottom: '1px solid var(--border)', minHeight: 380, display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative', transition: 'background 0.5s' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', padding: '3rem 1.5rem' }}>
          <div>
            <span className="badge badge-primary mb-2"><Zap size={11} /> Hyperlocal Marketplace</span>
            <h1 className="hero-title mt-2">
              <span className="hero-grad">{heroes[heroIdx].title}</span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '1.1rem', marginTop: '1rem', marginBottom: '2rem' }}>{heroes[heroIdx].sub}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/search')}>
                Shop Now <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/register-vendor')}>
                Sell With Us
              </button>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
              {[['10K+', 'Products'], ['500+', 'Vendors'], ['50K+', 'Happy Buyers']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-light)' }}>{n}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 300, height: 300, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--border2)', boxShadow: 'var(--glow)' }}>
              <img src={heroes[heroIdx].img} alt="hero" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s' }} onError={e => { e.target.style.display = 'none'; }} />
            </div>
          </div>
        </div>
        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.4rem' }}>
          {heroes.map((_, i) => <div key={i} onClick={() => setHeroIdx(i)} style={{ width: i === heroIdx ? 24 : 8, height: 8, borderRadius: 999, background: i === heroIdx ? 'var(--primary)' : 'var(--border2)', cursor: 'pointer', transition: 'all 0.3s' }} />)}
        </div>
      </div>

      <div className="container page">
        {/* Trust Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { icon: <Truck size={22} color="var(--primary-light)" />, title: 'Fast Delivery', sub: 'Same-day & next-day delivery' },
            { icon: <Shield size={22} color="var(--accent)" />, title: 'Secure Payments', sub: 'Razorpay & Stripe protected' },
            { icon: <Star size={22} color="var(--warning)" />, title: 'Verified Vendors', sub: 'All sellers are admin approved' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="card" style={{ padding: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Browse Categories</h2>
            <Link to="/search" style={{ color: 'var(--primary-light)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>View all <ChevronRight size={16} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            {categories.slice(0, 8).map(cat => (
              <button key={cat.id} onClick={() => navigate(`/search?category=${cat.name}`)}
                className="card card-hover"
                style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s', background: 'var(--surface)' }}>
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{cat.name}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{cat.sub.length} subcategories</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>⭐ Featured Products</h2>
            <Link to="/search" style={{ color: 'var(--primary-light)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>View all <ChevronRight size={16} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Trending */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}><Zap size={20} color="var(--warning)" /> Trending Now</h2>
            <Link to="/search" style={{ color: 'var(--primary-light)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>View all <ChevronRight size={16} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* AI Recommendations */}
        {recommended.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>🤖 Recommended for You</h2>
              <p className="text-muted text-sm">AI-powered picks based on your activity</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
              {recommended.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: 'var(--radius-lg)', padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Start Selling Today</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 400 }}>Join hundreds of vendors growing their business on VendorHub. Admin approval in 24 hours.</p>
          </div>
          <button className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary-dark)', fontWeight: 700 }} onClick={() => navigate('/register-vendor')}>
            Register as Vendor <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
