import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Shield, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
  phone: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

type SignupInput = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'user' | 'admin'>('user');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'user' },
  });

  const handleRoleChange = (role: 'user' | 'admin') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const response = await authService.signup(data);
      toast.success('Account created! Please verify your email.');
      onSuccess(data.email);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 glassmorphism rounded-3xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400">Join our shopping platform today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            {...register('name')}
            placeholder="Full Name"
            className={`w-full bg-black/30 border ${errors.name ? 'border-red-500' : 'border-gray-800'} rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            {...register('email')}
            type="email"
            placeholder="Email Address"
            className={`w-full bg-black/30 border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            {...register('phone')}
            placeholder="Phone Number (Optional)"
            className="w-full bg-black/30 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className={`w-full bg-black/30 border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-lg shadow-blue-500/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-gray-400">
        <p>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-white hover:text-blue-400 font-semibold transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupForm;
