import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from './services/api'; // Import axiosInstance for API requests

const Navbar = () => {
  const [profile, setProfile] = useState(null); // State to store user profile
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile'); // Fetch profile data
        setProfile(response.data.user); // Set profile data
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

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
        {/* Display Avatar if it exists */}
        {profile?.avatar && (
          <img
            src={`http://localhost:5000/uploads/avatars/${profile.avatar}`} // Adjust the URL based on your server setup
            alt="Profile Avatar"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: '10px',
            }}
          />
        )}
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
