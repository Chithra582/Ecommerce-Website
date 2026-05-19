
import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  users as initialUsersList, products as mockProducts, vendors as mockVendors,
  initialOrders, initialReviews, initialRefunds, categories
} from '../data/mockData';

const AppContext = createContext(null);

const getLS = (key, def) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
};
const setLS = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const initialState = {
  // Auth
  currentUser: getLS('vh_user', null),
  users: getLS('vh_users', initialUsersList),
  // Products
  products: getLS('vh_products', mockProducts),
  // Vendors
  vendors: getLS('vh_vendors', mockVendors),
  // Orders
  orders: getLS('vh_orders', initialOrders),
  // Reviews
  reviews: getLS('vh_reviews', initialReviews),
  // Refunds
  refunds: getLS('vh_refunds', initialRefunds),
  // Cart: [{ productId, qty }]
  cart: getLS('vh_cart', []),
  // Wishlist: [productId]
  wishlist: getLS('vh_wishlist', []),
  // Commission setting
  commission: getLS('vh_commission', 10),
  // Notification
  notification: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': return { ...state, currentUser: action.payload };
    case 'LOGOUT': return { ...state, currentUser: null, cart: [], wishlist: [] };
    case 'REGISTER_USER': return { ...state, users: [...state.users, action.payload] };
    case 'SET_NOTIFICATION': return { ...state, notification: action.payload };
    case 'CLEAR_NOTIFICATION': return { ...state, notification: null };

    // Cart
    case 'ADD_TO_CART': {
      const exists = state.cart.find(i => i.productId === action.payload.productId);
      const cart = exists
        ? state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: i.qty + (action.payload.qty || 1) } : i)
        : [...state.cart, { productId: action.payload.productId, qty: action.payload.qty || 1 }];
      return { ...state, cart };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) };
    case 'UPDATE_CART_QTY':
      return { ...state, cart: state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: action.payload.qty } : i) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };

    // Wishlist
    case 'TOGGLE_WISHLIST': {
      const inWish = state.wishlist.includes(action.payload);
      return { ...state, wishlist: inWish ? state.wishlist.filter(id => id !== action.payload) : [...state.wishlist, action.payload] };
    }

    // Orders
    case 'PLACE_ORDER': {
      const newOrder = {
        ...action.payload,
        id: 'o' + Date.now(),
        status: 'Placed',
        placedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviewed: false,
      };
      // Reduce stock
      const products = state.products.map(p => {
        const item = action.payload.items.find(i => i.productId === p.id);
        if (item) return { ...p, stock: Math.max(0, p.stock - item.qty), sold: p.sold + item.qty };
        return p;
      });
      return { ...state, orders: [...state.orders, newOrder], cart: [], products };
    }
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.orderId
            ? { ...o, status: action.payload.status, updatedAt: new Date().toISOString() }
            : o
        ),
      };
    case 'MARK_ORDER_REVIEWED':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.payload ? { ...o, reviewed: true } : o),
      };

    // Reviews
    case 'ADD_REVIEW':
      return { ...state, reviews: [...state.reviews, { ...action.payload, id: 'r' + Date.now(), date: new Date().toISOString().split('T')[0] }] };

    // Products (seller)
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, { ...action.payload, id: 'p' + Date.now(), reviews: 0, rating: 0, sold: 0 }] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    // Vendors (admin)
    case 'UPDATE_VENDOR_STATUS':
      return { ...state, vendors: state.vendors.map(v => v.id === action.payload.vendorId ? { ...v, status: action.payload.status } : v) };
    case 'ADD_VENDOR':
      return { ...state, vendors: [...state.vendors, { ...action.payload, id: 'v' + Date.now(), totalSales: 0, totalOrders: 0, status: 'pending' }] };

    // Refunds
    case 'REQUEST_REFUND':
      return { ...state, refunds: [...state.refunds, { ...action.payload, id: 'ref' + Date.now(), status: 'pending', date: new Date().toISOString().split('T')[0] }] };
    case 'UPDATE_REFUND_STATUS':
      return { ...state, refunds: state.refunds.map(r => r.id === action.payload.refundId ? { ...r, status: action.payload.status } : r) };

    // Admin: Commission
    case 'SET_COMMISSION':
      return { ...state, commission: action.payload };

    // Address Management
    case 'ADD_ADDRESS': {
      const newAddress = { ...action.payload, id: 'a' + Date.now() };
      const addresses = [...(state.currentUser.addresses || [])];
      if (newAddress.default) {
        addresses.forEach(a => { a.default = false; });
      }
      addresses.push(newAddress);
      const updatedUser = { ...state.currentUser, addresses };
      return {
        ...state,
        currentUser: updatedUser,
        users: state.users.map(u => u.id === state.currentUser.id ? updatedUser : u),
      };
    }
    case 'DELETE_ADDRESS': {
      const addresses = (state.currentUser.addresses || []).filter(a => a.id !== action.payload);
      const updatedUser = { ...state.currentUser, addresses };
      return {
        ...state,
        currentUser: updatedUser,
        users: state.users.map(u => u.id === state.currentUser.id ? updatedUser : u),
      };
    }
    case 'SET_DEFAULT_ADDRESS': {
      const addresses = (state.currentUser.addresses || []).map(a => ({ ...a, default: a.id === action.payload }));
      const updatedUser = { ...state.currentUser, addresses };
      return {
        ...state,
        currentUser: updatedUser,
        users: state.users.map(u => u.id === state.currentUser.id ? updatedUser : u),
      };
    }

    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist to localStorage
  useEffect(() => { setLS('vh_user', state.currentUser); }, [state.currentUser]);
  useEffect(() => { setLS('vh_users', state.users); }, [state.users]);
  useEffect(() => { setLS('vh_cart', state.cart); }, [state.cart]);
  useEffect(() => { setLS('vh_wishlist', state.wishlist); }, [state.wishlist]);
  useEffect(() => { setLS('vh_orders', state.orders); }, [state.orders]);
  useEffect(() => { setLS('vh_products', state.products); }, [state.products]);
  useEffect(() => { setLS('vh_vendors', state.vendors); }, [state.vendors]);
  useEffect(() => { setLS('vh_reviews', state.reviews); }, [state.reviews]);
  useEffect(() => { setLS('vh_refunds', state.refunds); }, [state.refunds]);
  useEffect(() => { setLS('vh_commission', state.commission); }, [state.commission]);

  // Auto-clear notification
  useEffect(() => {
    if (state.notification) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 3500);
      return () => clearTimeout(t);
    }
  }, [state.notification]);

  // Helpers
  const notify = (message, type = 'success') => dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });

  const login = (email, password) => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      notify(`Welcome back, ${user.name}!`, 'success');
      return user;
    }
    return null;
  };

  const registerUser = (userData) => {
    const exists = state.users.find(u => u.email === userData.email);
    if (exists) return false;

    const newUser = {
      id: userData.id || 'u' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: userData.role || 'buyer',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`,
      joinDate: new Date().toISOString().split('T')[0],
      addresses: userData.role === 'buyer' ? [] : undefined,
      browsingHistory: userData.role === 'buyer' ? [] : undefined,
      vendorId: userData.vendorId || undefined,
    };
    dispatch({ type: 'REGISTER_USER', payload: newUser });
    return true;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    notify('Logged out successfully', 'info');
  };

  const getProduct = (id) => state.products.find(p => p.id === id);
  const getVendor = (id) => state.vendors.find(v => v.id === id);
  const getProductReviews = (id) => state.reviews.filter(r => r.productId === id);
  const getCartItems = () => state.cart.map(i => ({ ...i, product: getProduct(i.productId) })).filter(i => i.product);
  const getCartTotal = () => getCartItems().reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const isInWishlist = (id) => state.wishlist.includes(id);
  const isInCart = (id) => state.cart.some(i => i.productId === id);

  const getBuyerOrders = (userId) => state.orders.filter(o => o.buyerId === userId);
  const getVendorOrders = (vendorId) => state.orders.filter(o => o.vendorId === vendorId);
  const getVendorProducts = (vendorId) => state.products.filter(p => p.vendorId === vendorId);

  return (
    <AppContext.Provider value={{
      ...state, dispatch, notify, login, logout, registerUser, categories,
      getProduct, getVendor, getProductReviews,
      getCartItems, getCartTotal, isInWishlist, isInCart,
      getBuyerOrders, getVendorOrders, getVendorProducts,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
