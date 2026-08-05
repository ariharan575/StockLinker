import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children }) {
  const { isAuthenticated, isInitialized, verifySession, accountStatus } = useAuth();
  const [checking, setChecking] = useState(!isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      // User clicked "Login". Check if they already have an active cookie session.
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

  if (isAuthenticated) {
    if (accountStatus === 'PENDING_ROLE') return <Navigate to="/role-selection" replace />;
    if (accountStatus === 'PENDING_ONBOARDING') return <Navigate to="/onboarding" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}