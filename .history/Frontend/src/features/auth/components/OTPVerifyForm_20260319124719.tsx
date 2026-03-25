import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight, Loader2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

type OTPInput = z.infer<typeof otpSchema>;

interface OTPVerifyFormProps {
  initialEmail: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
}

const OTPVerifyForm: React.FC<OTPVerifyFormProps> = ({ initialEmail, onSuccess, onBackToLogin }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: initialEmail },
  });

  const onSubmit = async (data: OTPInput) => {
    setIsLoading(true);
    try {
      await authService.verifyOtp(data);
      toast.success('Email verified! You can now login.');
      onSuccess();
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Verification failed';
      toast.error(message === 'INVALID_OTP' ? 'Invalid or expired OTP' : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 glassmorphism rounded-3xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Verify Email</h2>
        <p className="text-gray-400">Enter the 4-digit OTP sent to your email</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5 pointer-events-none opacity-50" />
          <input
            {...register('email')}
            type="email"
            readOnly
            className="w-full bg-black/10 border border-gray-900 rounded-xl py-4 pl-11 pr-4 text-gray-500 cursor-not-allowed italic"
          />
        </div>

        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            {...register('otp')}
            placeholder="0000"
            maxLength={4}
            className={`w-full bg-black/30 border ${errors.otp ? 'border-red-500' : 'border-gray-800'} rounded-xl py-4 pl-11 pr-4 text-white text-2xl tracking-[1em] placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center`}
          />
          {errors.otp && <p className="text-red-500 text-xs mt-1 text-center">{errors.otp.message}</p>}
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
              <span>Verify OTP</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-gray-400">
        <p>
          Didn't receive it?{' '}
          <button
            onClick={onBackToLogin}
            className="text-white hover:text-blue-400 font-semibold transition-colors"
          >
            Back to Login
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default OTPVerifyForm;
