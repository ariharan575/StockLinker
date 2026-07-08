// OAuthSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, loadUser } = useAuth();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      // Get ALL parameters from URL
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');
      const isNewUserParam = searchParams.get('isNewUser');
      const hasBusinessRoleParam = searchParams.get('hasBusinessRole');
      
      console.log("OAuth Params:", { token, userId, isNewUserParam, hasBusinessRoleParam });

      // Validate required fields
      if (!token) {
        setError('No token received from OAuth');
        setTimeout(() => navigate('/login'), 3000);
        setProcessing(false);
        return;
      }

      if (!userId) {
        console.error('Missing userId in OAuth callback');
        setError('Incomplete authentication data');
        setTimeout(() => navigate('/login'), 3000);
        setProcessing(false);
        return;
      }

      try {
        // Convert string params to proper types
        const isNewUser = isNewUserParam === 'true';
        const hasBusinessRole = hasBusinessRoleParam === 'true';
        
        // Store the token
        localStorage.setItem('accessToken', token);
        
        // Create mock response with ALL data from URL params
        const mockResponse = {
          data: {
            accessToken: token,
            userId: userId,
            isNewUser: isNewUser,
            hasBusinessRole: hasBusinessRole,
            roles: [] // Default empty array, you can add roles if passed
          }
        };
        
        console.log("OAuth Login Data:", mockResponse.data);
        
        // Call login to update context
        const loginResult = await login(Promise.resolve(mockResponse));
        
        console.log("OAuth Login Result:", loginResult);
        
        // Redirect based on user status
        if (loginResult.success) {
          if (loginResult.isNewUser) {
            console.log("New user - redirecting to role selection");
            navigate('/role-selection');
          } else {
            console.log("Existing user - redirecting to dashboard");
            navigate('/dashboard');
          }
        } else {
          setError(loginResult.error || 'Login failed');
          console.log("Error" + loginResult.error);
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('OAuth authentication failed:', err);
        // Clear invalid token
        localStorage.removeItem('accessToken');
        setError('Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setProcessing(false);
    }
  };

    handleOAuthSuccess();
  }, [searchParams, navigate, login]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <div className="text-sm text-gray-400 mt-2">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <div className="text-gray-600">Authenticating...</div>
      </div>
    </div>
  );
}