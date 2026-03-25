import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import axiosInstance from '../../../api/axiosInstance';
import { Loader2, ArrowRight, ShoppingBag, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewModal, setReviewModal] = useState<{ isOpen: boolean, orderId: string, productId: string, productName: string } | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/orders');
                setOrders(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch orders');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleSubmitReview = async () => {
        if (!reviewModal) return;
        setIsSubmitting(true);
        try {
            await axiosInstance.post('/reviews', {
                product: reviewModal.productId,
                order: reviewModal.orderId,
                rating,
                comment
            });
            toast.success('Certification Accepted');
            setReviewModal(null);
            setComment('');
            setRating(5);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Review failure');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white text-black flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-8 opacity-40">Retrieving Vault Records</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Navbar />

            <main className="pt-40 pb-24 px-6 max-w-[1400px] mx-auto w-full">
                <div className="flex items-center space-x-6 mb-16 border-b-8 border-black pb-8 overflow-hidden">
                    <h1 className="text-6xl font-black uppercase tracking-tighter shrink-0">Order History</h1>
                    <div className="flex-1 h-2 bg-gray-50 flex items-center px-4">
                        <div className="w-[15%] h-full bg-black"></div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-16 border-2 border-dashed border-gray-100 rounded-[3rem] max-w-md w-full">
                            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-10" />
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">No Orders Found</h2>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-10">Your purchase history is currently empty.</p>
                            <Link to="/products" className="inline-flex items-center space-x-3 bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all">
                                <span>Start Shopping</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <AnimatePresence>
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative bg-white border border-gray-100 rounded-[3rem] p-10 hover:shadow-2xl hover:border-black/5 transition-all duration-500"
                                >
                                    <div className="flex flex-col lg:flex-row gap-12">
                                        {/* Order Header Info */}
                                        <div className="lg:w-1/3 space-y-8">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Order Certificate</h3>
                                                    <p className="text-xl font-black tracking-tighter uppercase">ID: {order._id.substring(0, 12)}</p>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-[0.2em] ${getStatusStyles(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8 text-[10px] font-black uppercase tracking-widest">
                                                <div className="space-y-1">
                                                    <span className="text-gray-400">Date Placed</span>
                                                    <div className="text-black">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-gray-400">Total Value</span>
                                                    <div className="text-black">₹{order.totalAmount.toLocaleString()}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-gray-400">Payment</span>
                                                    <div className="text-black">{order.paymentMethod || 'Online'}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-gray-400">Status</span>
                                                    <div className="text-black">{order.paymentStatus}</div>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-gray-50">
                                                <Link to={`/order-success/${order._id}`} className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-gray-400 transition-colors">
                                                    <span>View Full Details</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Product List */}
                                        <div className="flex-1">
                                            <div className="space-y-6">
                                                {order.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex items-center gap-8 py-4 border-b border-gray-50 last:border-0 group/item">
                                                        <div className="w-24 h-24 bg-gray-50 rounded-2xl p-4 flex-shrink-0 flex items-center justify-center border border-gray-50 group-hover/item:border-gray-200 transition-all">
                                                            <img
                                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/300'}
                                                                alt=""
                                                                className="w-full h-full object-contain grayscale group-hover/item:grayscale-0 transition-all duration-500"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <h4 className="font-black text-sm uppercase tracking-tight line-clamp-1">{item.product?.name}</h4>
                                                            <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                                <span className="text-black">₹{item.product?.price.toLocaleString()}</span>
                                                                {order.orderStatus === 'delivered' && (
                                                                    <>
                                                                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                                        <button
                                                                            onClick={() => setReviewModal({ isOpen: true, orderId: order._id, productId: item.product?._id, productName: item.product?.name })}
                                                                            className="text-black hover:underline cursor-pointer"
                                                                        >
                                                                            Write Review
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Link
                                                            to={`/products/${item.product?._id}`}
                                                            className="opacity-0 group-hover/item:opacity-100 transition-opacity p-2 hover:bg-black hover:text-white rounded-full"
                                                        >
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
            <Footer />

            {/* Review Modal */}
            <AnimatePresence>
                {reviewModal?.isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[4rem] p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-100 via-black to-gray-100"></div>

                            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Submit Feedback</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">Product: <span className="text-black">{reviewModal.productName}</span></p>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] block">Rating Calibration</label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`text-5xl transition-all duration-300 transform hover:scale-125 ${star <= rating ? 'text-black opacity-100 scale-110' : 'text-gray-100'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] block">Detailed Statement</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Articulate your experience..."
                                        className="w-full h-40 bg-gray-50 rounded-[2rem] p-8 text-sm font-bold border-0 focus:ring-4 focus:ring-black/5 outline-none resize-none transition-all"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        disabled={isSubmitting}
                                        onClick={handleSubmitReview}
                                        className="flex-1 bg-black text-white h-20 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center space-x-4 shadow-2xl shadow-black/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Submit Certification</span>}
                                    </button>
                                    <button
                                        onClick={() => setReviewModal(null)}
                                        className="px-10 h-20 rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderHistoryPage;
