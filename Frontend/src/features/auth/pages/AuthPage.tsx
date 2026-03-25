import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import OTPVerifyForm from '../components/OTPVerifyForm';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import type { User } from '../../../types/api.types';

import ForgotPassForm from '../components/ForgotPassForm';
import ForgotPassResetForm from '../components/ForgotPassResetForm';

const AuthPage: React.FC = () => {
  const [view, setView] = React.useState<'login' | 'signup' | 'verify' | 'forgot' | 'reset_pass'>('login');
  const [emailToVerify, setEmailToVerify] = React.useState('');
  const navigate = useNavigate();
  const { setUser} = useAuthStore() // ✅ inside component

  const handleSignupSuccess = (email: string) => {
    setEmailToVerify(email);
    setView('verify'); // ✅ just go to OTP, no setUser here
  };

  const handleVerificationSuccess = () => {
    setView('login'); // ✅ after OTP verified, go to login
  };

  // ✅ setUser called here — after login API returns user data
  const handleLoginSuccess = (user: User) => {
    setUser(user)                        // ✅ sets isAuthenticated = true
   
    navigate('/cart')                    // ✅ now cart page will show
  };

  const handleVerificationRequired = (email: string) => {
    setEmailToVerify(email);
    setView('verify');
  }

  const handleForgotSuccess = (email: string) => {
     setEmailToVerify(email);
     setView('reset_pass');
  }

  const handleResetSuccess = () => {
     setView('login');
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-10 bg-white">
      <div className="mb-12">
        <span className="text-4xl font-black text-black tracking-tighter uppercase">
          SHOP<span className="text-gray-300">HUB</span>
        </span>
      </div>
      
      <div className="w-full max-w-[450px] px-6">
        {view === 'login' && (
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setView('signup')}
            onVerificationRequired={handleVerificationRequired}
            onForgotPassword={() => setView('forgot')}
          />
        )}
        
        {view === 'signup' && (
          <SignupForm 
            onSuccess={handleSignupSuccess} 
            onSwitchToLogin={() => setView('login')} 
          />
        )}
        
        {view === 'verify' && (
          <OTPVerifyForm 
            initialEmail={emailToVerify} 
            onSuccess={handleVerificationSuccess} 
            onBackToLogin={() => setView('login')} 
          />
        )}

        {view === 'forgot' && (
          <ForgotPassForm
             onBackToLogin={() => setView('login')}
             onSuccess={handleForgotSuccess}
          />
        )}

        {view === 'reset_pass' && (
          <ForgotPassResetForm
             email={emailToVerify}
             onBackToLogin={() => setView('login')}
             onSuccess={handleResetSuccess}
          />
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-50 w-full max-w-[450px] text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
        © 2026, SHOPHUB DIGITAL ARCHIVE
      </div>
    </div>
  );
};

export default AuthPage;