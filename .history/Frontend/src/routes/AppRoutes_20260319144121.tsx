import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/pages/AuthPage';
import HomePage from '../features/products/pages/HomePage';
import ProductDetailPage from '../features/products/pages/ProductDetailPage';
import CartPage from '../features/cart/pages/CartPage';
import { useAuthStore } from '../store/authStore';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} 
      />
      <Route 
        path="/cart" 
        element={isAuthenticated ? <CartPage /> : <Navigate to="/login" />} 
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
