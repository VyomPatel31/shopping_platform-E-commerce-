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
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-safe">
            <div className="flex w-full h-16 items-center">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => `flex-1 flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Home</span>
                </NavLink>

                <NavLink 
                    to="/products" 
                    className={({ isActive }) => `flex-1 flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <Search className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Search</span>
                </NavLink>

                <NavLink 
                    to="/wishlist" 
                    className={({ isActive }) => `flex-1 flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <div className="relative">
                        <Heart className="w-5 h-5" />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white">
                                {wishlistItems.length}
                            </span>
                        )}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Saved</span>
                </NavLink>

                <NavLink 
                    to="/cart" 
                    className={({ isActive }) => `flex-1 flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Bag</span>
                </NavLink>

                <NavLink 
                    to="/profile" 
                    className={({ isActive }) => `flex-1 flex flex-col items-center justify-center space-y-1 transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Account</span>
                </NavLink>
            </div>
        </div>
    );
};

export default MobileBottomNav;
