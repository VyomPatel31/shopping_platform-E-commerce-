import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service.ts';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema) as any,
    defaultValues: { role: 'user' },
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const response = await authService.signup(data);
      if (response.data?.devOtp) {
        console.log('--- DEVELOPMENT OTP ---');
        console.log(`The verification code is: ${response.data.devOtp}`);
        console.log('-----------------------');
      }
      toast.success('Account Ready! We sent a code to verify.');
      onSuccess(data.email);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
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
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">New Account</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Indian Market Signup</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('name')}
                className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold transition-all outline-none focus:bg-white ${errors.name ? 'border-red-500' : 'border-transparent focus:border-black'}`}
                placeholder="Your Name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 mt-2">{errors.name.message}</p>}
          </div>

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
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Mobile Number</label>
            <div className="relative">
              <input
                {...register('phone')}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none focus:bg-white focus:border-black"
                placeholder="+91-0000000000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
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
              <span>Submit & Join</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-50 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Already a client?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-black ml-2 hover:opacity-50 transition-opacity"
          >
            Access Account
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupForm;
