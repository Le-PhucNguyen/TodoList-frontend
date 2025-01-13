import axios from 'axios';

// Create Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Ensure the token name matches
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error.message); // Log request errors
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors and responses
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response) {
      // Handle specific HTTP error statuses
      const { status, data } = error.response;

      // Unauthorized or token expired
      if (status === 401) {
        console.error('Unauthorized access or token expired. Redirecting to login...');
        localStorage.removeItem('authToken'); // Clear token
        window.location.href = '/login'; // Redirect to login page
      }

      // Forbidden
      if (status === 403) {
        console.error('Forbidden: Access is denied.', data.message);
      }

      // Not Found
      if (status === 404) {
        console.error('Resource not found:', data.message);
      }

      // Server Error
      if (status >= 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Network error (no response received)
      console.error('Network error: Could not reach the server.');
    } else {
      // Other unexpected errors
      console.error('Unexpected error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;