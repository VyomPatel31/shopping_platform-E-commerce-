import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service.ts';

interface OTPVerifyFormProps {
  initialEmail: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
}

const OTPVerifyForm: React.FC<OTPVerifyFormProps> = ({ initialEmail, onSuccess, onBackToLogin }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error('Please enter the complete PIN.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyOtp({ email: initialEmail, otp });
      toast.success('Security Clearance Granted.');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendVerification(initialEmail);
      toast.success('New Security PIN dispatched.');
    } catch (error: any) {
      toast.error('Dispatch failed.');
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
    >
      <div className="mb-12">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-8 mx-auto">
          <ShieldCheck className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter text-center mb-4">Security PIN</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 text-center leading-relaxed">
          Verify possession of <br /> {initialEmail}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <div className="flex justify-center flex-col items-center">
            <input
              type="text"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              className="w-full max-w-[200px] bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl py-6 text-4xl font-black text-center tracking-[0.5em] transition-all outline-none"
              placeholder="0000"
              autoFocus
            />
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mt-6">Enter the 4-digit security pin</p>
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
            <span>Authorise</span>
          )}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
        <button
          onClick={onBackToLogin}
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Abandon</span>
        </button>

        <button
          onClick={handleResend}
          disabled={resending}
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-50 transition-opacity disabled:opacity-30"
        >
          {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          <span>Resend PIN</span>
        </button>
      </div>
    </motion.div>
  );
};

export default OTPVerifyForm;
