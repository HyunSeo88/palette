import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
        // API 요청에 토큰 포함
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 현재 사용자 정보 조회
        const response = await axios.get('/api/auth/me');
        
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
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token } = response.data;
        
        // 토큰 저장
        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        
        // API 요청에 토큰 포함
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 사용자 정보 설정
        const userResponse = await axios.get('/api/auth/me');
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
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { token } = response.data;
        
        // 토큰 저장
        localStorage.setItem('token', token);
        
        // API 요청에 토큰 포함
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 사용자 정보 설정
        const userResponse = await axios.get('/api/auth/me');
        setUser(userResponse.data.data);
        
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // 토큰 제거
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // API 요청 헤더에서 토큰 제거
    delete axios.defaults.headers.common['Authorization'];
    
    // 사용자 정보 초기화
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`/api/users/${user._id}`, userData);
      
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