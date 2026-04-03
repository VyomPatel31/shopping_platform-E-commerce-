import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/pages/AuthPage';
import HomePage from '../features/products/pages/HomePage.tsx';
import ProductsPage from '../features/products/pages/ProductsPage.tsx';
import ProductDetailPage from '../features/products/pages/ProductDetailPage.tsx';
import CartPage from '../features/cart/pages/CartPage.tsx';
import ProfilePage from '../features/auth/pages/ProfilePage.tsx';
import OrderSuccessPage from '../features/orders/pages/OrderSuccessPage.tsx';
import OrderHistoryPage from '../features/orders/pages/OrderHistoryPage.tsx';
import AdminDashboard from '../features/admin/pages/AdminDashboard.tsx';
import AdminUserDetailsPage from '../features/admin/pages/AdminUserDetailsPage.tsx';
import WishlistPage from '../features/wishlist/pages/WishlistPage.tsx';
import { useAuthStore } from '../store/authStore';

import MobileBottomNav from '../components/layout/MobileBottomNav';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const user = useAuthStore(state => state.user);

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} 
        />
        <Route 
          path="/cart" 
          element={<CartPage/>} 
        />
        <Route 
          path="/wishlist" 
          element={<WishlistPage />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <ProfilePage/> : <Navigate to="/login"/> } 
        />
        <Route 
          path="/orders" 
          element={isAuthenticated ? <OrderHistoryPage /> : <Navigate to="/login" />}
        />
        <Route 
          path="/order-success/:orderId" 
          element={isAuthenticated ? <OrderSuccessPage /> : <Navigate to="/login" />}
        />
        <Route 
          path="/admin" 
          element={(isAuthenticated && user?.role === 'admin') ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route 
          path="/admin/users/:id" 
          element={(isAuthenticated && user?.role === 'admin') ? <AdminUserDetailsPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <MobileBottomNav />
    </>
  );
};

export default AppRoutes;
