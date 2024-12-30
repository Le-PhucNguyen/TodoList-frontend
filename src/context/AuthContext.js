import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../components/services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosInstance.get('/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token'); // Clear invalid token
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(null); // Fetch user details on login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
