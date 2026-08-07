import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, profileApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    accountStatus: null,
    role: null,
    isInitialized: false,
  });

  // Global Profile State
  const [profileData, setProfileData] = useState({
    ownerName: 'Loading...',
    role: 'Loading...',
    businessProfileId: null
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

  // fetchProfile wrapped in useCallback so we can export it safely
  const fetchProfile = useCallback(async () => {
    try {
      const res = await profileApi.getProfile();
      // Gracefully handle nested data structures from Spring Boot ApiResponse
      const data = res.data?.data || res.data; 
      
      setProfileData({
        ownerName: data.ownerName || 'User',
        role: data.businessType || 'Partner',
        businessProfileId: data.businessProfileId || ''
      });
    } catch (err) {
      console.error("Failed to load global profile", err);
      // ✅ FIX: Prevent UI from getting stuck on "Loading..." if profile fetch fails
      setProfileData({
        ownerName: 'User',
        role: 'Partner',
        businessProfileId: null
      });
    }
  }, []);

  // Triggers when auth status changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchProfile();
    } else {
      // Reset profile data when logged out or unauthenticated
      setProfileData({
        ownerName: 'Loading...',
        role: 'Loading...',
        businessProfileId: null
      });
    }
  }, [authState.isAuthenticated, fetchProfile]); 

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
        error: error.response?.data?.message || error.message || 'Authentication failed.' 
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
       return { 
           success: false, 
           error: error.response?.data?.message || error.message || 'Failed to assign role.' 
       };
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

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
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
    profileData,     // Export the fetched profile data
    setProfileData,  // EXPORTED: Allows instant injection during onboarding
    fetchProfile,    // EXPORTED: Allows manual refreshing if ever needed
    verifySession,
    login,
    logout,
    logoutAll,
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