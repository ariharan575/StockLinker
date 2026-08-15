import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isInitialized, verifySession } = useAuth();
  const [checking, setChecking] = useState(!isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      // User is trying to enter a secure page. Now we ask the backend.
      verifySession().finally(() => setChecking(false));
    }
  }, [isInitialized]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Support both <PrivateRoute><Component/></PrivateRoute> and <Outlet/>
  return children ? children : <Outlet />;
}