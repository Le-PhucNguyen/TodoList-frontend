import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To handle loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Data:', data);

      if (response.ok) {
        // Store token and optional expiration in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('expiresIn', data.expiresIn); // Optional

        // Redirect to the homepage or a protected route
        navigate('/');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading} // Disable input during loading
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading} // Disable input during loading
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
      <p>
        Forgot your password? <a href="/forgot-password">Reset it here</a>
      </p>
    </div>
  );
};

export default Login;
