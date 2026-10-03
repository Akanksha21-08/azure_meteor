import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setUser(data);
      setLoading(false);
      return { success: true, user: data };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const data = await authService.register(formData);
      setUser(data);
      setLoading(false);
      return { success: true, user: data };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserState = (updatedFields) => {
    setUser(prev => {
      const newObj = { ...prev, ...updatedFields };
      localStorage.setItem('userInfo', JSON.stringify(newObj));
      return newObj;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginUser,
      registerUser,
      logoutUser,
      updateUserState,
      isAuthenticated: !!user,
      isCandidate: user?.role === 'candidate',
      isRecruiter: user?.role === 'recruiter',
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
