import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from './services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Null indicates loading state
  const token = localStorage.getItem('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Decode JWT and check expiration
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          // Call backend to validate the token
          await axiosInstance.post('/auth/validate-token', { token }, {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token as Bearer
            },
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token'); // Remove malformed or invalid token
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, [token]);

  if (isAuthenticated === null) {
    // Loading state: Render a placeholder or spinner
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;