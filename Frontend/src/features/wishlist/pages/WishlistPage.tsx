import React, { useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useWishlistStore } from '../store/wishlistStore';
import { Trash2, Heart, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistPage: React.FC = () => {
  const { items, fetchWishlist, removeFromWishlist, isLoading } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />
        <main className="pt-40 px-6 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-12 h-12 text-black animate-spin opacity-20" />
          <p className="text-[10px] uppercase font-black tracking-[0.5em] text-gray-400 mt-8 animate-pulse">Syncing Wishlist</p>
        </main>
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center pt-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-16 border-2 border-dashed border-gray-100 rounded-[3rem] max-w-md w-full"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h1 className="text-4xl font-black text-black mb-4 uppercase tracking-tighter">Wishlist Empty</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10">Your curated selection is currently empty.</p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-3 bg-black hover:bg-gray-800 text-white font-black py-4 px-10 rounded-full transition-all text-xs uppercase tracking-widest shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Products</span>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      <main className="pt-40 mb-24 px-6 max-w-[1400px] mx-auto w-full">
        <div className="flex items-end justify-between mb-16 border-b-8 border-black pb-8">
          <h1 className="text-6xl font-black uppercase tracking-tighter flex items-center space-x-6">
            <span>Wishlist</span>
            <span className="text-gray-300 text-2xl font-black">({items.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product?._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative flex flex-col p-8 bg-white rounded-3xl border border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative w-full h-64 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 overflow-hidden border border-gray-50 group-hover:border-transparent transition-all">
                  <img
                    src={(item.product?.images && item.product?.images[0]) || 'https://via.placeholder.com/300'}
                    alt={item.product?.name}
                    className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-110 "
                  />
                  <button
                    onClick={() => removeFromWishlist(item.product?._id)}
                    className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-gray-400 hover:bg-black hover:text-white transition-all transform hover:rotate-12"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Ref: {item.product?._id.substring(0, 8)}</span>
                    <h3 className="text-2xl font-black text-black leading-tight uppercase tracking-tighter line-clamp-2 h-16 group-hover:text-gray-600 transition-colors">
                      {item.product?.name}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
                    <div className="text-3xl font-black text-black tracking-tighter">
                      ₹{item.product?.price.toLocaleString()}
                    </div>

                    <Link
                      to={`/products/${item.product?._id}`}
                      className="p-4 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-full border border-gray-100 hover:border-black"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
