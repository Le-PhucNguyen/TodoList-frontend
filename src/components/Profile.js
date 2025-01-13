import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from './services/api';

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', bio: '', avatar: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const { user, loading, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch profile data only when user is available and loading is complete
  useEffect(() => {
    if (!loading && user) {
      setProfile({
        username: user.username,
        bio: user.profile?.bio || '',
        avatar: user.profile?.avatar || '',
      });
    }
  }, [loading, user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
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
      setSuccessMessage('Profile updated successfully!');
      await refreshProfile(); // Fetch the latest user data from context
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
    setIsLoading(true);

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      setPasswordChangeSuccess(response.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Error changing password:', err.response?.data || err.message);
      setPasswordChangeError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading message when fetching user data
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>; // Show message if user is not logged in
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={profile.username || ''}
            disabled
            style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="Bio"
            value={profile.bio || ''}
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
              src={`http://localhost:5000${profile.avatar}`}
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

      <h3>Change Password</h3>
      {passwordChangeError && <p style={{ color: 'red' }}>{passwordChangeError}</p>}
      {passwordChangeSuccess && <p style={{ color: 'green' }}>{passwordChangeSuccess}</p>}
      <form onSubmit={handleChangePassword}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Updating...' : 'Change Password'}
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
