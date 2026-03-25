import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/pages/AuthPage';
import HomePage from '../features/products/pages/HomePage.tsx';
import ProductDetailPage from '../features/products/pages/ProductDetailPage.tsx';
import CartPage from '../features/cart/pages/CartPage.tsx';
import ProfilePage from '../features/auth/pages/ProfilePage.tsx';
import { useAuthStore } from '../store/authStore';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);

 
  // ✅ Wait for localStorage to rehydrate before rendering routes
  if (isLoading) return <div>Loading...</div>

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
        element={isAuthenticated ?<CartPage/>: <Navigate to="/login"/>} 
      />
      <Route 
        path="/profile" 
        element={isAuthenticated ?<ProfilePage/>: <Navigate to="/login"/> } 
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
