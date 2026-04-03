import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../../features/cart/store/cartStore';
import { useWishlistStore } from '../../features/wishlist/store/wishlistStore';

const MobileBottomNav: React.FC = () => {
    const { items: cartItems } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();
    const location = useLocation();

    // Hide on login/signup pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null;
    }

    // Only show on mobile
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Home</span>
                </NavLink>

                <NavLink 
                    to="/products" 
                    className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <Search className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Catalog</span>
                </NavLink>

                <NavLink 
                    to="/wishlist" 
                    className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <div className="relative">
                        <Heart className="w-5 h-5" />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[6px] font-bold w-3 h-3 flex items-center justify-center rounded-full">
                                {wishlistItems.length}
                            </span>
                        )}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Saved</span>
                </NavLink>

                <NavLink 
                    to="/cart" 
                    className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[6px] font-bold w-3 h-3 flex items-center justify-center rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Bag</span>
                </NavLink>

                <NavLink 
                    to="/profile" 
                    className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Account</span>
                </NavLink>
            </div>
        </div>
    );
};

export default MobileBottomNav;
