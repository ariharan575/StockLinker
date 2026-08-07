import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthSuccess } = useAuth();

  useEffect(() => {
    const status = searchParams.get('status');
    const error = searchParams.get('error');

    console.log('OAuth Success - Status:', status);
    // Handle error case first
    if (error) {
      console.error('OAuth Error:', error);
      navigate('/login?error=' + encodeURIComponent(error), { replace: true });
      return;
    }

    if (status) {
      // Update auth state
      handleOAuthSuccess(status);

      // Clean the URL by removing search params
      window.history.replaceState({}, document.title, window.location.pathname);

      console.log(status);

      // Status-Based Navigation
      if 
      (status === 'PENDING_ROLE') {
        navigate('/role-selection', { replace: true });
      }
       else if
       (status === 'PENDING_ONBOARDING') {
        navigate('/onboarding', { replace: true });
      }
       else if 
      (status === 'ACTIVE') {
        navigate('/dashboard', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
      console.log("navigate to login")
    }
   
   
  }, []); 

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-500 tracking-wide">Authenticating Workspace...</p>
      </div>
    </div>
  );
}