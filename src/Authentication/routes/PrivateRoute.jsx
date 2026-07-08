// =========================================================
// ✅ PrivateRoute.jsx
// =========================================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


// =========================================================
// ✅ PRIVATE ROUTE
// =========================================================

export const PrivateRoute = ({ children }) => {

  const { isAuthenticated, loading } = useAuth();

  // =========================================================
  // ✅ LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">

        <div className="relative">
          
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full blur-2xl bg-pink-500/40 animate-pulse"></div>

          {/* Spinner */}
          <div className="relative h-14 w-14 rounded-full border-4 border-white/10 border-t-pink-500 animate-spin"></div>

        </div>

      </div>
    );
  }

  // =========================================================
  // ✅ NOT AUTHENTICATED
  // =========================================================

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // =========================================================
  // ✅ AUTHENTICATED
  // =========================================================

  return children;
};


// =========================================================
// ✅ PUBLIC ROUTE
// =========================================================

export const PublicRoute = ({ children }) => {

  const { isAuthenticated, loading, isNewUser } = useAuth();

  // =========================================================
  // ✅ LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">

        <div className="relative">

          {/* Glow */}
          <div className="absolute inset-0 rounded-full blur-2xl bg-pink-500/40 animate-pulse"></div>

          {/* Spinner */}
          <div className="relative h-14 w-14 rounded-full border-4 border-white/10 border-t-pink-500 animate-spin"></div>

        </div>

      </div>
    );
  }

  // =========================================================
  // ✅ ALREADY LOGGED IN
  // =========================================================

  if (isAuthenticated && !isNewUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // =========================================================
  // ✅ SHOW PUBLIC PAGE
  // =========================================================

  return children;
};