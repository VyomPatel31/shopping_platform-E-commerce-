import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, ArrowLeft, KeySquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service.ts';

interface ForgotPassResetFormProps {
  email: string;
  onBackToLogin: () => void;
  onSuccess: () => void;
}

const ForgotPassResetForm: React.FC<ForgotPassResetFormProps> = ({ email, onBackToLogin, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      toast.error('PIN registration required.');
      return;
    }
    if (newPassword.length < 5) {
      toast.error('New password must be at least 5 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        forgotToken: pin, // backend expects forgotToken field for the PIN
        newPassword
      });
      toast.success('Security Clearance Restored. Please login.');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Access Restoration Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-100 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
    >
      <div className="mb-12">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">Complete Reset</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Verifying Dispatched PIN</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Security PIN</label>
            <div className="relative">
              <KeySquare className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl py-4 pl-14 pr-6 text-2xl font-black tracking-[0.5em] transition-all outline-none"
                placeholder="0000"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">New Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl py-4 pl-14 pr-6 text-sm font-bold transition-all outline-none focus:bg-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-xl hover:bg-gray-800 transition-all disabled:opacity-30 transform active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span>Update Credentials</span>
          )}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-50 text-center">
        <button
          onClick={onBackToLogin}
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors mx-auto"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Abandon Flow</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ForgotPassResetForm;
