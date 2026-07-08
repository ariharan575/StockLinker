import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  // Load user from token on mount
  const loadUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const response = await authApi.getUserInfo();
      const userData = response.data;
      
      const userObj = {
        id: userData.userId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        roles: userData.roles || [],
        hasBusinessRole: userData.hasBusinessRole || false,
        businessRole: userData.businessRole
      };
      
      setUser(userObj);
      setIsNewUser(userData.isNewUser || false);
      
      return userObj;
    } catch (error) {
      console.error('Failed to load user:', error);
      // Token might be invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsNewUser(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (loginPromise) => {
    try {
      const response = await loginPromise;
      const { accessToken, refreshToken, userId, isNewUser: newUser, hasBusinessRole, roles } = response.data;
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      const userData = { 
        id: userId, 
        isNewUser: newUser,
        hasBusinessRole: hasBusinessRole || false,
        roles: roles || []
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsNewUser(newUser);
      
      return { success: true, isNewUser: newUser };
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setIsNewUser(false);
      // Force navigate to login
      window.location.href = '/login';
    }
  };

  const logoutAll = async () => {
    try {
      await authApi.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setIsNewUser(false);
      // Force navigate to login
      window.location.href = '/login';
    }
  };

  const selectRole = async (role) => {
    try {
      const response = await authApi.selectRole(role);
      console.log("Role selection response:", response.data);
      
      // Reload user info after role upgrade
      await loadUser();
      
      return { success: true };
    } catch (error) {
      console.error('Role selection failed:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to select role' };
    }
  };

  const value = {
    user,
    loading,
    isNewUser,
    login,
    logout,
    logoutAll,
    selectRole,
    loadUser,
    isAuthenticated: !!localStorage.getItem('accessToken'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};