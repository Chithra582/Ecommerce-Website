import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { StarRating } from './StarRating';
import { formatCurrency, getDiscount } from '../utils/ai';

export default function ProductCard({ product }) {
  const { dispatch, isInWishlist, isInCart, currentUser, notify } = useApp();
  const navigate = useNavigate();
  const inWish = isInWishlist(product.id);
  const inCart = isInCart(product.id);
  const discount = getDiscount(product.price, product.originalPrice);
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleCart = (e) => {
    e.preventDefault();
    if (!currentUser) { navigate('/login'); return; }
    if (inCart) { navigate('/cart'); return; }
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, qty: 1 } });
    notify(`${product.name} added to cart!`);
  };

  const handleWish = (e) => {
    e.preventDefault();
    if (!currentUser) { navigate('/login'); return; }
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    notify(inWish ? 'Removed from wishlist' : 'Added to wishlist!', inWish ? 'info' : 'success');
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card card-hover" style={{ display: 'block' }}>
      <div className="product-card-img-wrap">
        <img src={product.images[0]} alt={product.name} className="product-card-img" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=60'; }} />
        {discount > 0 && (
          <div className="product-badge">
            <span className="badge badge-success">{discount}% OFF</span>
          </div>
        )}
        {product.trending && !discount && (
          <div className="product-badge">
            <span className="badge badge-primary"><Zap size={10} /> Trending</span>
          </div>
        )}
        <button className={`wishlist-btn ${inWish ? 'active' : ''}`} onClick={handleWish} title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Heart size={15} fill={inWish ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-card-body">
        <p className="product-card-name">{product.name}</p>
        <StarRating rating={product.rating} count={product.reviews} size={12} />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <span className="product-card-price">{formatCurrency(product.price)}</span>
          {discount > 0 && <span className="product-card-original">{formatCurrency(product.originalPrice)}</span>}
        </div>
        {lowStock && <p className="low-stock">⚠ Only {product.stock} left!</p>}
        {product.stock === 0 && <p className="low-stock">Out of stock</p>}
        <button
          className={`btn btn-sm w-full mt-2 ${inCart ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleCart}
          disabled={product.stock === 0}
          style={{ justifyContent: 'center' }}
        >
          <ShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : inCart ? 'Go to Cart' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
