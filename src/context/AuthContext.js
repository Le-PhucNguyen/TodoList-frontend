import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../components/services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on app load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosInstance.get('/auth/profile');
          setUser(response.data.user); // Set the user if the token is valid
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token'); // Clear invalid token
        }
      }
      setLoading(false); // Clear the loading state regardless of success
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const response = await axiosInstance.get('/auth/profile');
      setUser(response.data.user); // Fetch user details after login
    } catch (error) {
      console.error('Error fetching user profile after login:', error);
      logout(); // Clear token if fetching fails
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Refresh profile function
  const refreshProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      logout(); // Clear token if refreshing fails
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
