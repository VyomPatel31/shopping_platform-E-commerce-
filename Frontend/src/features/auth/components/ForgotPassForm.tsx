import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service.ts';

interface ForgotPassFormProps {
  onBackToLogin: () => void;
  onSuccess: (email: string) => void;
}

const ForgotPassForm: React.FC<ForgotPassFormProps> = ({ onBackToLogin, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email registration required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      // Backend returns debug: 'USER_NOT_FOUND' if user exists but query fails
      if (response.data?.debug === 'USER_NOT_FOUND') {
        console.warn('⚠️ User not found in database. Email was NOT sent.');
      }
      toast.success('Security PIN dispatched.');
      onSuccess(email);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dispatch failed');
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
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">Reset Security</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Requesting PIN access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl py-4 pl-14 pr-6 text-sm font-bold transition-all outline-none focus:bg-white"
                    placeholder="user@example.com"
                    required
                />
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
            <>
              <span>Dispatch PIN</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-50 text-center">
        <button
          onClick={onBackToLogin}
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors mx-auto"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Return to Gate</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ForgotPassForm;
