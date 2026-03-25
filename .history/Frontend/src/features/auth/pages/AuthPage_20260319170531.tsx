import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import OTPVerifyForm from '../components/OTPVerifyForm';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
// In your signup success handler
const { setUser } = useAuthStore()

const AuthPage: React.FC = () => {
  const [view, setView] = React.useState<'login' | 'signup' | 'verify'>('login');
  const [emailToVerify, setEmailToVerify] = React.useState('');
  const navigate = useNavigate();

  const handleSignupSuccess = (email: string) => {
    setEmailToVerify(email);
      setUser(userData)  ;
    setView('verify');
  };

  const handleVerificationSuccess = () => {
    setView('login');
  };

  const handleLoginSuccess = () => {
    navigate('/');
  };

  const handleVerificationRequired = (email: string) => {
      setEmailToVerify(email);
      setView('verify');
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Dynamic Animated Circles background */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/30 blur-[120px] rounded-full animate-pulse delay-1000" />
      
      {view === 'login' && (
        <LoginForm 
          onSuccess={handleLoginSuccess} 
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
