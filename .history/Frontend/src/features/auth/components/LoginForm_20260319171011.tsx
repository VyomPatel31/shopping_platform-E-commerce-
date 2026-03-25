import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service.ts';
import { useAuthStore } from '../../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onVerificationRequired: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup, onVerificationRequired }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const setUser = useAuthStore(state => state.setUser);

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
        toast.success(`Welcome back, ${response.response.name}!`);
        setUser(response.response);
        // ✅ Pass user and token back to AuthPage
    onSuccess(response.data.user, response.data.accessToken);
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Login failed';
      
      if (message === 'EMAIL_NOT_VERIFIED') {
        toast.error('Email not verified. Please verify your email.');
        onVerificationRequired(data.email);
      } else {
        toast.error(message === 'INVALID_CREDENTIALS' ? 'Invalid email or password' : message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 glassmorphism rounded-3xl"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
        <p className="text-gray-400">Welcome back to our shop</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            {...register('email')}
            type="email"
            placeholder="Email Address"
            className={`w-full bg-black/30 border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-xl py-4 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className={`w-full bg-black/30 border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-xl py-4 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-gray-400">
        <p>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-white hover:text-blue-400 font-semibold transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
