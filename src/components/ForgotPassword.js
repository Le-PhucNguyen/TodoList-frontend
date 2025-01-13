import React, { useState } from 'react';
import axios from '../axiosInstance'; // Adjust this path to match your axios instance file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setMessage('A reset password email has been sent to your inbox.');
      } else {
        setError(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while trying to reset the password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your registered email"
          />
        </div>
        <button type="submit">Send Reset Password Email</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ForgotPassword;