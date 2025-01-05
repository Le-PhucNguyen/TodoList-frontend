import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from './services/api'; // Import the new fetchUserProfile function
import axiosInstance from './services/api'; // Import axiosInstance for updating profile

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', bio: '', avatar: '' }); // Default values for profile state
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile data when the component mounts
    const fetchProfile = async () => {
      try {
        const userData = await fetchUserProfile(); // Use the new fetchUserProfile function
        setProfile({
          username: userData.username || '',
          bio: userData.bio || '',
          avatar: userData.avatar || '',
        }); // Ensure all fields are initialized properly
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
      formData.append('bio', profile.bio); // Update the bio field
      if (selectedFile) {
        formData.append('avatar', selectedFile); // Attach the selected avatar file
      }

      const response = await axiosInstance.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile({
        ...profile,
        ...response.data.user,
      }); // Update the profile data in state
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect the user to the login page
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={profile.username || ''} // Prevent uncontrolled-to-controlled warning
            disabled
            style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="Bio"
            value={profile.bio || ''} // Prevent uncontrolled-to-controlled warning
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
