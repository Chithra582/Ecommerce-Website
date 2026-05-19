import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterVendor from './pages/RegisterVendor';
import SearchPage from './pages/SearchPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import BuyerDashboard from './pages/BuyerDashboard';

// Seller
import SellerLayout from './pages/seller/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerEarnings from './pages/seller/SellerEarnings';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVendors from './pages/admin/AdminVendors';
import AdminCategories from './pages/admin/AdminCategories';
import AdminReports from './pages/admin/AdminReports';
import AdminRefunds from './pages/admin/AdminRefunds';
import AdminSettings from './pages/admin/AdminSettings';

// Guards
function RequireAuth({ children, role }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { currentUser } = useApp();
  return (
    <>
      <Navbar />
      <Notification />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
        <Route path="/register-vendor" element={<RegisterVendor />} />

        {/* Buyer */}
        <Route path="/dashboard" element={<RequireAuth role="buyer"><BuyerDashboard /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth role="buyer"><Cart /></RequireAuth>} />
        <Route path="/wishlist" element={<RequireAuth role="buyer"><Wishlist /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth role="buyer"><Checkout /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth role="buyer"><Orders /></RequireAuth>} />

        {/* Seller */}
        <Route path="/seller" element={<RequireAuth role="seller"><SellerLayout><SellerDashboard /></SellerLayout></RequireAuth>} />
        <Route path="/seller/products" element={<RequireAuth role="seller"><SellerLayout><SellerProducts /></SellerLayout></RequireAuth>} />
        <Route path="/seller/orders" element={<RequireAuth role="seller"><SellerLayout><SellerOrders /></SellerLayout></RequireAuth>} />
        <Route path="/seller/earnings" element={<RequireAuth role="seller"><SellerLayout><SellerEarnings /></SellerLayout></RequireAuth>} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout><AdminDashboard /></AdminLayout></RequireAuth>} />
        <Route path="/admin/vendors" element={<RequireAuth role="admin"><AdminLayout><AdminVendors /></AdminLayout></RequireAuth>} />
        <Route path="/admin/categories" element={<RequireAuth role="admin"><AdminLayout><AdminCategories /></AdminLayout></RequireAuth>} />
        <Route path="/admin/reports" element={<RequireAuth role="admin"><AdminLayout><AdminReports /></AdminLayout></RequireAuth>} />
        <Route path="/admin/refunds" element={<RequireAuth role="admin"><AdminLayout><AdminRefunds /></AdminLayout></RequireAuth>} />
        <Route path="/admin/settings" element={<RequireAuth role="admin"><AdminLayout><AdminSettings /></AdminLayout></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
