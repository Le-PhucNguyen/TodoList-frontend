import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './services/api';

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', bio: '', avatar: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile data when the component mounts
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setProfile(response.data.user);
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('bio', profile.bio);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      const response = await axiosInstance.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(response.data.user); // Update state with the latest profile data
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    navigate('/login'); // Redirect to login
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={profile.username}
            disabled
            style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {profile.avatar && (
          <div style={{ marginBottom: '10px' }}>
            <img
              src={`http://localhost:5000/uploads/avatars/${profile.avatar}`}
              alt="Avatar"
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      <button
        onClick={handleLogout}
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '10px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
