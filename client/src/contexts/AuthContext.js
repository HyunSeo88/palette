import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      try {
        const response = await api.get('/auth/me');
        
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        logout();
      }
    }
    
    setLoading(false);
  };

  const login = async (email, password, rememberMe) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token } = response.data;
        
        // Store token
        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        
        // Get user info
        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data.data);
        
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        
        // Get user info
        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data.data);
        
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // Remove tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Reset user state
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put(`/users/${user._id}`, userData);
      
      if (response.data.success) {
        setUser(response.data.data);
        return true;
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;