import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import Navbar from '../../../components/layout/Navbar';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, ShoppingBag, ArrowLeft, LogOut, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-28 pb-12 px-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 p-8 glassmorphism rounded-3xl border border-white/5 text-center"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-6 p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <User className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-black text-white mb-2">{user.name}</h1>

            {/* Role Badge */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              {user.role === 'admin' ? (
                <>
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-bold">
                    Administrator
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-bold">
                    Customer
                  </span>
                </>
              )}
            </div>

            {/* Verification Status */}
            <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
              <p className="text-green-300 text-sm font-semibold">
                ✓ Email Verified
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 p-8 glassmorphism rounded-3xl border border-white/5"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Account Information</h2>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </div>
                </label>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-white font-mono break-all">
                  {user.email}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </div>
                </label>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-white">
                  {user.phone || 'Not provided'}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Account Type</span>
                  </div>
                </label>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-white capitalize">
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Member Since</span>
                  </div>
                </label>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-white">
                  {formatDate(user.createdAt || new Date().toISOString())}
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> Profile editing features coming soon. Contact support if you need to update your information.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 p-8 glassmorphism rounded-3xl border border-white/5"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-colors text-blue-300 font-semibold"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-colors text-blue-300 font-semibold"
            >
              View Cart
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-colors text-purple-300 font-semibold"
              >
                Admin Dashboard
              </button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;
