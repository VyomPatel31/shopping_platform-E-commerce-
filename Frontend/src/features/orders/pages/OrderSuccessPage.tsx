import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Loader2, Download } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(response.data.data);
      } catch (error) {
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-32 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          <p className="text-gray-600 mt-4">Generating your bill...</p>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-32 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Order Not Found</h1>
          <Link to="/" className="text-black hover:underline">Return to Home</Link>
        </main>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      
      <main className="pt-28 pb-12 px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-12 glassmorphism rounded-[3rem] border border-green-500/20 shadow-2xl shadow-green-500/10"
        >
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            <h1 className="text-4xl font-black text-black mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your order has been placed successfully.</p>
          </div>

          <div className="bg-black/5 rounded-3xl p-6 md:p-8 mb-8 border border-black/10" id="bill-section">
            <div className="flex justify-between items-center border-b border-black/10 pb-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="font-mono text-black tracking-wider">{order._id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-black" />
              Bill Details
            </h3>

            <div className="space-y-4 mb-8">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm md:text-base">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">{item.quantity}x</span>
                    <span className="font-medium">{item.product?.name || 'Product'}</span>
                  </div>
                  <span className="font-mono text-black font-black">₹{(item.quantity * item.product?.price || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 pt-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount Paid</span>
                <span className="text-black font-black text-3xl tracking-tighter">
                  ₹{order.totalAmount?.toLocaleString() || '0.00'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center print:hidden">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-10 h-16 bg-gray-50 hover:bg-gray-100 text-black font-black text-[10px] uppercase tracking-widest rounded-full flex items-center justify-center gap-3 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Bill</span>
            </button>
            <Link
              to="/orders"
              className="w-full sm:w-auto px-10 h-16 bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-full flex items-center justify-center gap-3 transition-all shadow-2xl shadow-black/10 hover:bg-gray-800"
            >
              <FileText className="w-4 h-4" />
              <span>Proceed to Reviews / Orders</span>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderSuccessPage;
