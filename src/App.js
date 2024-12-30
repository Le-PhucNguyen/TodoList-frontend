import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import TodoApp from './components/TodoApp'; // Renamed your original App component to TodoApp
import Profile from './components/Profile'; // Profile page for authenticated users
import ForgotPassword from './components/ForgotPassword'; // Import the ForgotPassword component
import { AuthProvider } from './context/AuthContext'; // AuthProvider for global auth state

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New Route */}

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
