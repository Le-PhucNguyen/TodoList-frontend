import axios from 'axios';

// Axios instance configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for attaching token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ensure a valid token is stored
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch todos with optional query parameters
export const fetchTodos = async (queryParams = '') => {
  try {
    const response = await axiosInstance.get(`/todos?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error.response?.data || error.message);
    throw error;
  }
};

// Create a new todo
export const createTodo = async (task) => {
  try {
    const response = await axiosInstance.post('/todos', { task });
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error.response?.data || error.message);
    throw error;
  }
};

// Update a todo (e.g., mark as completed or update task)
export const updateTodo = async (id, updates) => {
  try {
    const response = await axiosInstance.put(`/todos/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a todo (supports soft delete via query parameter)
export const deleteTodo = async (id, softDelete = false) => {
  try {
    const response = await axiosInstance.delete(`/todos/${id}`, {
      params: { softDelete }, // Use query parameter for soft delete
    });

    if (response.status === 404) {
      console.error(`Todo with ID ${id} not found.`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error deleting todo with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete multiple todos (supports soft delete via query parameter)
export const deleteMultipleTodos = async (ids, softDelete = false) => {
  try {
    if (!ids || ids.length === 0) {
      throw new Error('No IDs provided for deletion.');
    }

    const response = await axiosInstance.delete('/todos', {
      data: { ids },
      params: { softDelete }, // Use query parameter for soft delete
    });

    if (response.status === 404) {
      console.error(`One or more todos not found for IDs: ${ids.join(', ')}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error deleting multiple todos:', error.response?.data || error.message);
    throw error;
  }
};
