import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the Navbar component
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import TodoApp from './components/TodoApp'; // Main Todo application
import Profile from './components/Profile'; // Profile page for authenticated users
import ForgotPassword from './components/ForgotPassword'; // Forgot Password page
import { AuthProvider } from './context/AuthContext'; // AuthProvider for managing authentication state
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Conditionally render Navbar only when the user is logged in */}
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodoApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TodoApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;