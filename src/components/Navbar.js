import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null; // Don't render if no user is logged in
  }

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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          to="/"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#007bff',
          }}
        >
          Home
        </Link>
        <Link
          to="/todos"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#007bff',
          }}
        >
          Todos
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          to="/profile"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#007bff',
          }}
        >
          Profile
        </Link>
        <img
          src={user.avatar} // Dynamically display the latest avatar
          alt="Profile Avatar"
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
