import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useCartStore } from '../store/cartStore';
import { Plus, Minus, Loader2, MapPin, Trash2, ShieldCheck, ArrowRight, X, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';
import { useAuthStore } from '../../../store/authStore';

const CartPage: React.FC = () => {
  const { items, fetchCart, updateQuantity: storeUpdateQuantity, removeItem: storeRemoveItem, isLoading } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    pincode: '',
    addressLine1: '',
    city: '',
    state: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  const fetchAddresses = async () => {
    if (!user) return;
    setIsFetchingAddresses(true);
    try {
      const res = await axiosInstance.get('/address');
      const data = res.data.data || [];
      setAddresses(data);
      if (data.length > 0) {
        const def = data.find((a: any) => a.isDefault) || data[0];
        setSelectedAddress(def._id);
      }
    } catch (err) {
      console.error('Failed to fetch addresses');
    } finally {
      setIsFetchingAddresses(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, [fetchCart]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await storeUpdateQuantity(productId, quantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await storeRemoveItem(productId);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = items.reduce((acc, item) => {
    if (!item.product || !item.product.price) return acc;
    return acc + item.product.price * item.quantity;
  }, 0);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/address', newAddress);
      toast.success('Address added successfully!');
      setShowAddressForm(false);
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!user) {
      toast.error('Please secure an account to proceed to checkout');
      navigate('/login');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please add and select a delivery address first');
      setShowAddressForm(true);
      return;
    }

    setIsCheckingOut(true);
    try {
      if (paymentMethod === 'online') {
        const paymentRes = await axiosInstance.post('/payment/create-order', { amount: subtotal });
        const { id: order_id } = paymentRes.data.data;

        const options = {
          key: 'rzp_test_arbitrary', // Replace with your real key or fetch from backend
          amount: Math.round(subtotal * 100),
          currency: 'INR',
          name: 'SHOPHUB',
          description: 'Secure Payment',
          order_id: order_id,
          handler: async function (response: any) {
            try {
              const res = await axiosInstance.post('/orders', {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                addressId: selectedAddress,
                paymentMethod: 'online'
              });
              await fetchCart();
              toast.success('Order Placed Successfully!');
              navigate('/order-success/' + res.data.data._id);
            } catch (err: any) {
              toast.error('Order Finalization Failed');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#000000'
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
      } else {
        // COD logic
        const res = await axiosInstance.post('/orders', {
          addressId: selectedAddress,
          paymentMethod: 'cod'
        });
        await fetchCart();
        toast.success('Order Placed (COD) Successfully!');
        navigate('/order-success/' + res.data.data._id);
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment Error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24">
          <div className="p-16 border-2 border-dashed border-gray-100 rounded-[3rem] max-w-md w-full">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-10" />
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Cart is Empty</h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-10">You haven't added anything to your cart yet.</p>
            <Link to="/products" className="inline-flex items-center space-x-3 bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all">
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      <main className="pt-40 pb-24 px-6 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row items-baseline space-x-6 mb-16 border-b-8 border-black pb-8 overflow-hidden">
          <h1 className="text-6xl font-black uppercase tracking-tighter shrink-0">Your Shopping Cart</h1>
          <div className="flex-1 h-2 bg-gray-50 flex items-center px-4">
            <div className="w-[30%] h-full bg-black"></div>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all items from cart?')) {
                  useCartStore.getState().clearCart();
                  toast.success('Cart cleared');
                }
              }}
              className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-all border-b-2 border-red-500 hover:border-red-700"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {/* Cart Items List */}
            <div className="space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product?._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col md:flex-row items-center md:items-stretch py-8 border-b border-gray-100 gap-8 group"
                  >
                    <div className="w-40 h-40 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-6 border border-gray-50 group-hover:border-gray-200 transition-all">
                      <img
                        src={(item.product?.images && item.product?.images[0]) || 'https://via.placeholder.com/300'}
                        alt=""
                        className="w-full h-full object-contain  transition-all duration-500"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-black text-black uppercase tracking-tighter line-clamp-2 max-w-sm">{item.product?.name}</h3>
                          <div className="text-2xl font-black text-black tracking-tighter">₹{item.product?.price.toLocaleString()}</div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">SKU: {item.product?._id.substring(0, 8)}</span>
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center space-x-6 bg-gray-50 rounded-full px-6 py-3 border border-gray-100">
                          <button
                            onClick={() => handleUpdateQuantity(item.product?._id, Math.max(1, item.quantity - 1))}
                            className="text-black hover:text-gray-400 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-black text-black">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product?._id, item.quantity + 1)}
                            className="text-black hover:text-gray-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.product?._id)}
                          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Delivery Address Section */}
            <div className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="space-y-2">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Indian Market Checkout</h2>
                  <p className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">Delivery Address</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black hover:text-gray-400 hover:border-gray-400 transition-all"
                >
                  {showAddressForm ? 'Cancel Entry' : 'Add New Address'}
                </button>
              </div>

              {!showAddressForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isFetchingAddresses ? (
                    <div className="col-span-2 py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-black opacity-20" /></div>
                  ) : addresses.length === 0 ? (
                    <div className="col-span-2 py-12 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center opacity-50">
                      <MapPin className="w-8 h-8 mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">No verified addresses found</p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <motion.div
                        whileHover={{ y: -4 }}
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr._id)}
                        className={`p-8 rounded-[2rem] cursor-pointer transition-all border-2 relative overflow-hidden ${selectedAddress === addr._id ? 'border-black bg-white shadow-xl' : 'border-gray-100 bg-white/50 hover:border-black/20 opacity-60'}`}
                      >
                        {selectedAddress === addr._id && (
                          <div className="absolute top-0 right-0 bg-black text-white px-4 py-1.5 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest">Deliver to this</div>
                        )}
                        <div className="font-black text-sm uppercase tracking-tight mb-4">{addr.fullName}</div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                          {addr.addressLine1}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <div className="mt-6 text-[10px] font-black text-black opacity-40 uppercase tracking-widest">{addr.phone} (Mobile)</div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddAddress}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl"
                >
                  <div className="flex justify-between items-center col-span-2 mb-4 border-b border-gray-50 pb-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">New Shipping Profile</h3>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">Full Name</label>
                    <input required className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" value={newAddress.fullName} onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">Mobile Number</label>
                    <input required className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">House No, Road, Area</label>
                    <input required className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" value={newAddress.addressLine1} onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">City</label>
                    <input required className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">Pincode</label>
                    <input required className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">State</label>
                    <input required className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all outline-none" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                  </div>
                  <div className="col-span-2 pt-4">
                    <button type="submit" className="w-full bg-black text-white font-black px-10 py-5 rounded-full text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-gray-800 transition-all">Save & Continue</button>
                  </div>
                </motion.form>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 h-fit sticky top-40 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-10">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Price Summary</h2>
                  <p className="text-3xl font-black uppercase tracking-tighter">Tax Invoice</p>
                </div>

                <div className="space-y-6 pt-10 border-t border-gray-50 text-xs font-bold uppercase tracking-widest">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Subtotal ({items.length} units)</span>
                    <span className="text-black">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Standard Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-50">
                  <div className="flex justify-between items-end mb-10">
                    <span className="text-sm font-black uppercase tracking-widest mb-1">Total Amount</span>
                    <span className="text-5xl font-black text-black tracking-tighter">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setPaymentMethod('online')}
                        className={`py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'online' ? 'border-black bg-black text-white' : 'border-gray-100 text-gray-400 hover:border-black/20'}`}
                      >
                        Online Pay
                      </button>
                      <button
                        onClick={() => setPaymentMethod('cod')}
                        className={`py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'cod' ? 'border-black bg-black text-white' : 'border-gray-100 text-gray-400 hover:border-black/20'}`}
                      >
                        Cash (COD)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || isLoading || items.length === 0}
                    className="w-full h-20 bg-black text-white rounded-full font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all disabled:opacity-30 transform active:scale-95"
                  >
                    {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <span>Pay & Buy Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-50 opacity-20 transition-opacity">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-none">RBI Compliant Payment Interface</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
