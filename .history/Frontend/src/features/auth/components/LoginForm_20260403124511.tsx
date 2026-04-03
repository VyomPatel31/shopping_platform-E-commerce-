import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service.ts';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../cart/store/cartStore';
import { useWishlistStore } from '../../wishlist/store/wishlistStore';
import type { User } from '../../../types/api.types.ts';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: (user: User) => void;
  onSwitchToSignup: () => void;
  onVerificationRequired: (email: string) => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup, onVerificationRequired, onForgotPassword }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { setUser, setAccessToken } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        toast.success(`Welcome back, ${response.data.name}!`);
        setUser(response.data);
        if (response.data.accessToken) {
          setAccessToken(response.data.accessToken);
          // Load user's remote data (discarding guest cart/wishlist)
          fetchCart();
          fetchWishlist();
        }
        onSuccess(response.data);
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Login failed';
      
      if (message === 'EMAIL_NOT_VERIFIED') {
        toast.error('Email verification pending.');
        onVerificationRequired(data.email);
      } else {
        toast.error(message === 'INVALID_CREDENTIALS' ? 'Invalid credentials' : message);
      }
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
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">Account Login</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Indian Market Portal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        {...register('email')}
                        className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold transition-all outline-none focus:bg-white ${errors.email ? 'border-red-500' : 'border-transparent focus:border-black'}`}
                        placeholder="user@example.com"
                    />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 mt-2">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center ml-4 mr-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                    <button type="button" onClick={onForgotPassword} className="text-[9px] font-black uppercase tracking-widest text-black hover:opacity-50 transition-opacity">Forgot?</button>
                </div>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        {...register('password')}
                        type="password"
                        className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold transition-all outline-none focus:bg-white ${errors.password ? 'border-red-500' : 'border-transparent focus:border-black'}`}
                        placeholder="••••••••"
                    />
                </div>
                {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 mt-2">{errors.password.message}</p>}
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
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-50 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          New to the platform?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-black ml-2 hover:opacity-50 transition-opacity"
          >
            Create Account
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
