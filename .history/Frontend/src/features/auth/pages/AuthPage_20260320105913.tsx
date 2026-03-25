import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import OTPVerifyForm from '../components/OTPVerifyForm';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const AuthPage: React.FC = () => {
  const [view, setView] = React.useState<'login' | 'signup' | 'verify'>('login');
  const [emailToVerify, setEmailToVerify] = React.useState('');
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useAuthStore() // ✅ inside component

  const handleSignupSuccess = (email: string) => {
    setEmailToVerify(email);
    setView('verify'); // ✅ just go to OTP, no setUser here
  };

  const handleVerificationSuccess = () => {
    setView('login'); // ✅ after OTP verified, go to login
  };

  // ✅ setUser called here — after login API returns user data
  const handleLoginSuccess = (user: any) => {
    setUser(user)                        // ✅ sets isAuthenticated = true
   
    navigate('/cart')                    // ✅ now cart page will show
  };

  const handleVerificationRequired = (email: string) => {
    setEmailToVerify(email);
    setView('verify');
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/30 blur-[120px] rounded-full animate-pulse delay-1000" />
      
      {view === 'login' && (
        <LoginForm 
          onSuccess={handleLoginSuccess}  // ✅ now passes user data
          onSwitchToSignup={() => setView('signup')}
          onVerificationRequired={handleVerificationRequired}
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
    </div>
  );
};

export default AuthPage;