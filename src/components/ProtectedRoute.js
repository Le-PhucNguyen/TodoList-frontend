import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Optional: Add validation logic here (e.g., decoding token to check expiry)
  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decoding JWT (if used)
    const isExpired = tokenPayload.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  } catch (error) {
    localStorage.removeItem('token'); // Remove malformed token
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
