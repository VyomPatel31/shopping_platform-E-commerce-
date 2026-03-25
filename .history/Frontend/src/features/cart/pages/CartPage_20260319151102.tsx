import React, { useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage: React.FC = () => {
  const { items, fetchCart, updateQuantity, removeItem, isLoading, error } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce((acc, item) => {
    if (!item.product || !item.product.price) return acc;
    return acc + item.product.price * item.quantity;
  }, 0);

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <main className="pt-32 px-6 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-400">Loading your cart...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <main className="pt-32 px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 glassmorphism rounded-[3rem] max-w-md w-full border border-red-500/20"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Error Loading Cart</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => fetchCart()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              Try Again
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <main className="pt-32 px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 glassmorphism rounded-[3rem] max-w-md w-full border border-white/5"
          >
            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Shopping</span>
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-12 flex items-center space-x-4">
          <ShoppingBag className="w-10 h-10 text-blue-500" />
          <span>Shopping Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col sm:flex-row items-center p-6 glassmorphism rounded-3xl border border-white/5 space-y-4 sm:space-y-0 sm:space-x-8"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5">
                    <img
                      src={item.product.thumbnails[0] || 'https://via.placeholder.com/150'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between h-full text-center sm:text-left">
                    <div>
                      <h3 className="text-xl font-bold mb-1 hover:text-blue-400 transition-colors cursor-pointer">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.product.category || 'Premium Collection'}</p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-inner">
                          <button
                            onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="p-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500 font-mono text-center">x ${item.product.price}</span>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-gray-500 hover:text-red-500 transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-black min-w-[100px] text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 glassmorphism rounded-[3rem] sticky top-28 border border-white/5 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-8">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold uppercase text-xs">Calculated at checkout</span>
                </div>
                <hr className="border-white/5" />
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span className="text-blue-500 font-black tracking-tighter text-3xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-3xl flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20">
                <CreditCard className="w-6 h-6" />
                <span>Go to Checkout</span>
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default CartPage;
