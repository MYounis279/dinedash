import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get stored email
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        localStorage.removeItem('userEmail'); // Clean up
        navigate('/dashboard');
      }
    };

    const interval = setInterval(checkAuth, 3000); // Check every 3 seconds

    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  const handleOpenEmail = () => {
    const emailDomain = userEmail.split('@')[1];
    let emailUrl;
    
    switch(emailDomain) {
      case 'gmail.com':
        emailUrl = 'https://gmail.com';
        break;
      case 'yahoo.com':
        emailUrl = 'https://mail.yahoo.com';
        break;
      case 'outlook.com':
      case 'hotmail.com':
        emailUrl = 'https://outlook.live.com';
        break;
      default:
        emailUrl = `https://mail.${emailDomain}`;
    }
    
    window.open(emailUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to <span className="font-medium">{userEmail}</span>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Click the link in the email to verify your account and access your dashboard.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            onClick={handleOpenEmail}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Open Email
          </button>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Didn't receive the email?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Try again
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 