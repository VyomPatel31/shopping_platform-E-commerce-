import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import Navbar from '../../../components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Shield, ShoppingBag,
  ArrowLeft, LogOut, Calendar, Pencil, X, Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleCancel = () => {
    setFormData({ name: user.name || '', phone: user.phone || '' });
    setIsEditing(false);
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const res = await axiosInstance.put('/user/profile', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      useAuthStore.setState({ user: res.data.data });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  /* ─── shared input style ─── */
  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-black/20 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all';

  /* ─── shared read-only field style ─── */
  const readCls =
    'px-4 py-3 bg-black/5 border border-black/10 rounded-xl text-black text-sm break-all';

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* ── Back Button ── */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </motion.button>

        {/* ── Page Title ── */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-black text-black mb-8"
        >
          My Profile
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ══ LEFT: Identity Card ══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 flex flex-col items-center text-center bg-white rounded-3xl border border-black/8 shadow-sm p-8"
          >
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center bg-black mb-5 flex-shrink-0">
              <User className="w-11 h-11 text-white" />
            </div>

            {/* Name */}
            <h2 className="text-2xl font-black text-black leading-snug break-words w-full">
              {user.name}
            </h2>

            {/* Role Badge */}
            <div className="flex items-center justify-center gap-2 mt-3 mb-6">
              {user.role === 'admin' ? (
                <>
                  <Shield className="w-4 h-4 text-black" />
                  <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-bold tracking-wide">
                    Administrator
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-bold tracking-wide">
                    Customer
                  </span>
                </>
              )}
            </div>

            {/* Verified badge */}
            <div className="w-full mb-6 py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-emerald-700 text-sm font-semibold">✓ Email Verified</p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors duration-200 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>

          {/* ══ RIGHT: Account Details Card ══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-black/8 shadow-sm p-6 sm:p-8"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-black">Account Information</h2>

              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.button
                    key="edit"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Profile
                  </motion.button>
                ) : (
                  <motion.button
                    key="cancel"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Fields */}
            <div className="space-y-5">

              {/* Name — editable */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <User className="w-3.5 h-3.5" />
                  Full Name
                </label>
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.input
                      key="name-input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className={inputCls}
                    />
                  ) : (
                    <motion.div
                      key="name-display"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={readCls}
                    >
                      {user.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Email — always read-only */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </label>
                <div className={`${readCls} font-mono text-gray-500 flex items-center justify-between gap-2`}>
                  <span className="truncate">{user.email}</span>
                  <span className="text-[10px] font-bold bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 flex-shrink-0">
                    Read-only
                  </span>
                </div>
              </div>

              {/* Phone — editable */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number
                </label>
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.input
                      key="phone-input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, phone: value });
                      }}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className={inputCls}
                      inputMode="numeric"
                    />
                  ) : (
                    <motion.div
                      key="phone-display"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={readCls}
                    >
                      {user.phone || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account Type — always read-only */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  Account Type
                </label>
                <div className={readCls}>
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Member Since
                </label>
                <div className={readCls}>
                  {formatDate(user.createdAt || new Date().toISOString())}
                </div>
              </div>
            </div>

            {/* Save Button — shown only in edit mode */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-8 flex flex-col sm:flex-row gap-3"
                >
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Discard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Quick Links ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-3xl border border-black/8 shadow-sm p-6 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/')}
              className="py-3 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="py-3 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              View Cart
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="py-3 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
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
