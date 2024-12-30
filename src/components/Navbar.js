import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove authentication token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Left Links */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>
          Home
        </Link>
        <Link to="/todos" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>
          Todos
        </Link>
      </div>

      {/* Right Links */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/profile" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>
          Profile
        </Link>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#dc3545',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
