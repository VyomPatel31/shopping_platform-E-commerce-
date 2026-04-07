import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, User, Search, Heart, ShoppingCart, ShoppingBag, Home } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../features/cart/store/cartStore';
import { useSearchStore } from '../../store/searchStore';
import { motion, AnimatePresence } from 'framer-motion';

import { useWishlistStore } from '../../features/wishlist/store/wishlistStore';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { fetchCart, items: cartItems } = useCartStore();
  const { fetchWishlist, items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const { query, setQuery } = useSearchStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const cartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    useCartStore.getState().clearCart();
    useWishlistStore.getState().clearWishlist();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  return (
    <>
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm border-b border-gray-100' : 'bg-white py-5'}`}>
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2 z-50">
          <span className="text-xl md:text-2xl font-black tracking-tighter text-black uppercase">
            SHOP<span className="text-gray-400">HUB</span>
          </span>
        </Link>

        {/* SEARCH - Modern Minimalist */}
        <div className="hidden md:flex flex-1 max-w-lg mx-12 relative group">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (window.location.pathname !== '/products') navigate('/products');
              }}
              placeholder="Search products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 px-6 pl-12 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center space-x-2 md:space-x-6">
          <Link to="/products" className="hidden lg:block text-xs font-bold uppercase tracking-wider text-black hover:text-gray-500 transition-colors">
            Shop
          </Link>
          {isAuthenticated && (
            <Link to="/orders" className="hidden lg:block text-xs font-bold uppercase tracking-wider text-black hover:text-gray-500 transition-colors">
              Orders
            </Link>
          )}

          <div className="flex items-center space-x-2 md:space-x-5">
            <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/wishlist" className="relative text-gray-500 hover:text-black transition-colors">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-black text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative text-gray-500 hover:text-black transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartQuantity > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-black text-white">
                    {cartQuantity}
                  </span>
                )}
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-black border-b-2 border-transparent group-hover:border-black transition-all">{user?.name.split(' ')[0]}</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-black px-3 py-1.5 rounded-md hover:bg-black hover:text-white transition-all">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-400 hover:text-black transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
                <Link to="/login" className="hidden md:flex items-center space-x-2 group">
                  <span className="text-sm font-bold text-black border-b-2 border-transparent group-hover:border-black transition-all">Login</span>
                </Link>
            )}

            {/* Removed Mobile Menu Icon */}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <LogOut className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Wait, Don't Go</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                  Are you absolutely sure you want to terminate your current session?
                </p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="py-3.5 px-6 rounded-2xl border-2 border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 hover:text-black transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="py-3.5 px-6 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 shadow-lg shadow-black/20 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </nav>
    
    {/* MOBILE BOTTOM NAVIGATION */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black text-white z-[100] px-6 py-4 flex items-center justify-between rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <Link to="/" className="flex flex-col items-center space-y-1 text-white/50 hover:text-white transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Home</span>
        </Link>
        <Link to="/products" className="flex flex-col items-center space-y-1 text-white/50 hover:text-white transition-colors">
            <Search className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Explore</span>
        </Link>
        <Link to="/cart" className="relative flex flex-col items-center space-y-1 text-white/50 hover:text-white transition-colors">
            <div className="bg-white text-black p-3 rounded-full -mt-8 shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white shadow-sm ring-2 ring-white">
                  {cartQuantity}
                </span>
              )}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none text-white pt-1">Bag</span>
        </Link>
        <Link to="/wishlist" className="relative flex flex-col items-center space-y-1 text-white/50 hover:text-white transition-colors">
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[8px] font-black text-black">
                    {wishlistCount}
                </span>
            )}
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Saves</span>
        </Link>
        <Link to={isAuthenticated ? "/profile" : "/login"} className="flex flex-col items-center space-y-1 text-white/50 hover:text-white transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Account</span>
        </Link>
    </div>
    </>
  );
};

export default Navbar;
