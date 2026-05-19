import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { StarRating, InteractiveStars } from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { getRecommendations, formatCurrency, getDiscount } from '../utils/ai';
import { ShoppingCart, Heart, MapPin, Shield, Truck, RotateCcw, Plus, Minus, Send } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { getProduct, getVendor, getProductReviews, dispatch, isInWishlist, isInCart, currentUser, notify, products, orders } = useApp();
  const navigate = useNavigate();
  const product = getProduct(id);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [tab, setTab] = useState('desc');

  if (!product) return <div className="container page"><div className="empty-state"><div className="icon">😕</div><h3>Product not found</h3><Link to="/" className="btn btn-primary">Go Home</Link></div></div>;

  const vendor = getVendor(product.vendorId);
  const reviews = getProductReviews(product.id);
  const inWish = isInWishlist(product.id);
  const inCart = isInCart(product.id);
  const discount = getDiscount(product.price, product.originalPrice);
  const related = getRecommendations(products, [], [], product.id, 4).filter(p => p.category === product.category);
  const userOrders = currentUser ? orders.filter(o => o.buyerId === currentUser.id) : [];
  const hasBought = userOrders.some(o => o.items.some(i => i.productId === product.id) && o.status === 'Delivered');
  const alreadyReviewed = reviews.some(r => r.userId === currentUser?.id);

  const handleCart = () => {
    if (!currentUser) { navigate('/login'); return; }
    if (inCart) { navigate('/cart'); return; }
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, qty } });
    notify(`${product.name} added to cart!`);
  };
  const handleBuy = () => {
    if (!currentUser) { navigate('/login'); return; }
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, qty } });
    navigate('/cart');
  };
  const handleWish = () => {
    if (!currentUser) { navigate('/login'); return; }
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    notify(inWish ? 'Removed from wishlist' : 'Added to wishlist!', inWish ? 'info' : 'success');
  };
  const submitReview = () => {
    if (!currentUser) { navigate('/login'); return; }
    if (!reviewText.trim()) return;
    dispatch({ type: 'ADD_REVIEW', payload: { productId: product.id, userId: currentUser.id, userName: currentUser.name, rating: reviewRating, comment: reviewText } });
    setReviewText(''); setReviewRating(5);
    notify('Review submitted!');
  };

  return (
    <div className="container page">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text3)' }}>Home</Link> / <Link to="/search" style={{ color: 'var(--text3)' }}>{product.category}</Link> / <span style={{ color: 'var(--text2)' }}>{product.name.slice(0, 30)}...</span>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Images */}
        <div>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '0.75rem', background: 'var(--surface)', aspectRatio: '1' }}>
            <img src={product.images[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&q=60'; }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {product.images.map((img, i) => (
              <img key={i} src={img} alt="" className={`img-thumb ${i === imgIdx ? 'active' : ''}`} style={{ width: 70, height: 70 }} onClick={() => setImgIdx(i)} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&q=60'; }} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{product.category}</span>
            {product.trending && <span className="badge badge-warning">⚡ Trending</span>}
            {product.featured && <span className="badge badge-accent">⭐ Featured</span>}
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.75rem' }}>{product.name}</h1>
          <StarRating rating={product.rating} count={product.reviews} size={16} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '1rem 0' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-light)' }}>{formatCurrency(product.price)}</span>
            {discount > 0 && <>
              <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--text3)' }}>{formatCurrency(product.originalPrice)}</span>
              <span className="badge badge-success">{discount}% OFF</span>
            </>}
          </div>

          {product.stock <= 5 && product.stock > 0 && <p className="low-stock" style={{ marginBottom: '0.75rem' }}>⚠ Only {product.stock} left in stock!</p>}
          {product.stock === 0 && <p className="low-stock" style={{ marginBottom: '0.75rem' }}>Out of stock</p>}

          {/* Qty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text2)', fontWeight: 600 }}>Qty:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '0.5rem 0.8rem', background: 'var(--surface)', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><Minus size={14} /></button>
              <span style={{ padding: '0.5rem 1rem', background: 'var(--bg3)', fontWeight: 700 }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '0.5rem 0.8rem', background: 'var(--surface)', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><Plus size={14} /></button>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{product.sold}+ sold</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={handleCart} disabled={product.stock === 0} style={{ flex: 1, justifyContent: 'center' }}>
              <ShoppingCart size={18} /> {inCart ? 'Go to Cart' : 'Add to Cart'}
            </button>
            <button className="btn btn-secondary btn-lg" onClick={handleBuy} disabled={product.stock === 0} style={{ flex: 1, justifyContent: 'center' }}>Buy Now</button>
            <button className={`btn btn-icon btn-lg ${inWish ? 'active' : ''}`} onClick={handleWish} style={inWish ? { color: 'var(--danger)', borderColor: 'var(--danger)' } : {}}>
              <Heart size={20} fill={inWish ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Trust */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--bg3)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
            {[{ icon: <Truck size={16} />, text: 'Free Delivery' }, { icon: <Shield size={16} />, text: 'Secure Payment' }, { icon: <RotateCcw size={16} />, text: '7-Day Returns' }].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text2)', fontSize: '0.82rem', fontWeight: 600 }}>{icon}{text}</div>
            ))}
          </div>

          {/* Vendor */}
          {vendor && (
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={vendor.avatar} alt={vendor.name} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--border2)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{vendor.name}</span>
                    {vendor.badge && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{vendor.badge}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text3)', fontSize: '0.8rem' }}>
                    <MapPin size={12} />{vendor.location}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--warning)' }}>★ {vendor.rating}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{vendor.totalOrders} orders</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="nav-tabs">
        {['desc', 'reviews'].map(t => (
          <button key={t} className={`nav-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'desc' ? 'Description' : `Reviews (${reviews.length})`}
          </button>
        ))}
      </div>

      {tab === 'desc' && (
        <div style={{ color: 'var(--text2)', lineHeight: 1.8, maxWidth: 800 }}>
          <p>{product.description}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {product.tags?.map(t => <span key={t} className="tag">#{t}</span>)}
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <div style={{ maxWidth: 700 }}>
          {reviews.length === 0 && <p className="text-muted">No reviews yet. Be the first!</p>}
          {reviews.map(r => (
            <div key={r.id} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '0.75rem', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${r.userName}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.userName}</div>
                  <StarRating rating={r.rating} size={12} />
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text3)' }}>{r.date}</span>
              </div>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{r.comment}</p>
            </div>
          ))}
          {currentUser && hasBought && !alreadyReviewed && (
            <div className="card mt-3">
              <div className="card-body">
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Write a Review</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <p className="form-label">Rating</p>
                  <InteractiveStars value={reviewRating} onChange={setReviewRating} />
                </div>
                <textarea className="form-input" placeholder="Share your experience..." value={reviewText} onChange={e => setReviewText(e.target.value)} style={{ marginBottom: '0.75rem' }} />
                <button className="btn btn-primary" onClick={submitReview}><Send size={15} /> Submit Review</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <h2 className="section-title">You May Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
