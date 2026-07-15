import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    accountStatus: null,
    role: null,
    isInitialized: false,
  });


  // Global listener to catch Axios 401s if a token expires mid-session
  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthState({
        isAuthenticated: false,
        accountStatus: null,
        role: null,
        isInitialized: true,
      });
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);


  // Use useCallback to prevent unnecessary re-renders
  const verifySession = useCallback(async () => {
    try {
      const response = await authApi.refresh();
      setAuthState({
        isAuthenticated: true,
        accountStatus: response.data.accountStatus,
        role: response.data.role,
        isInitialized: true,
      });
      return true;
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        accountStatus: null,
        role: null,
        isInitialized: true,
      });
      return false;
    }
  }, []);

  const login = useCallback(async (apiCallPromise) => {
    try {
      const response = await apiCallPromise;
      const { accountStatus, role } = response.data;
      
      setAuthState({
        isAuthenticated: true,
        accountStatus,
        role,
        isInitialized: true,
      });

      return { 
        success: true, 
        needsRole: accountStatus === 'PENDING_ROLE',
        needsOnboarding: accountStatus === 'PENDING_ONBOARDING'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Authentication failed.' 
      };
    }
  }, []);

  const selectRole = useCallback(async (roleName) => {
    try {
      const response = await authApi.selectRole(roleName);
      setAuthState((prev) => ({
        ...prev,
        role: roleName,
        accountStatus: response.data.accountStatus,
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to assign role.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        accountStatus: null,
        isInitialized: true,
      });
    }
  }, []);

  const handleOAuthSuccess = useCallback((status) => {
    setAuthState({
      isAuthenticated: true,
      accountStatus: status,
      role: null,
      isInitialized: true,
    });
  }, []);


  const contextValue = {
    ...authState,
    verifySession,
    login,
    logout,
    selectRole,
    handleOAuthSuccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};