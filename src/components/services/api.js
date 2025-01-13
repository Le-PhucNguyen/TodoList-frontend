import axios from 'axios';

// Axios instance configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Update to match your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for attaching token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance; // Default export for axiosInstance

// Validate token
export const validateToken = async (token) => {
  try {
    const response = await axiosInstance.post('/validate-token', { token });
    return response.data; // Return user data and token validity
  } catch (error) {
    console.error('Error validating token:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch user profile (new function to fetch profile with avatar)
export const fetchUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/profile'); // Call the backend `/auth/profile` route
    return response.data.user; // Return user profile data
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

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
    if (!id) {
      throw new Error('Todo ID is required for deletion.');
    }

    const response = await axiosInstance.delete(`/todos/${id}`, {
      params: { softDelete }, // Soft delete query parameter
    });

    if (response.status === 404) {
      console.error(`Todo with ID ${id} not found.`);
      return { message: `Todo with ID ${id} not found.` };
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
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('No IDs provided for deletion. "ids" must be a non-empty array.');
    }

    const response = await axiosInstance.delete('/todos', {
      data: { ids },
      params: { softDelete }, // Soft delete query parameter
    });

    if (response.status === 404) {
      console.error(`One or more todos not found for IDs: ${ids.join(', ')}`);
      return { message: 'One or more todos not found.', notFoundIds: ids };
    }

    return response.data;
  } catch (error) {
    console.error('Error deleting multiple todos:', error.response?.data || error.message);
    throw error;
  }
};

// New function: Delete todos (alias for deleteMultipleTodos for consistency with your code)
export const deleteTodos = deleteMultipleTodos;

// Restore a soft-deleted todo
export const restoreTodo = async (id) => {
  try {
    if (!id) {
      throw new Error('Todo ID is required for restoration.');
    }

    const response = await axiosInstance.patch(`/todos/undo-delete/${id}`);

    if (response.status === 404) {
      console.error(`Todo with ID ${id} not found.`);
      return { message: `Todo with ID ${id} not found.` };
    }

    return response.data;
  } catch (error) {
    console.error(`Error restoring todo with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Fetch a single todo by ID
export const fetchTodoById = async (id) => {
  try {
    if (!id) {
      throw new Error('Todo ID is required to fetch the todo.');
    }

    const response = await axiosInstance.get(`/todos/${id}`);

    if (response.status === 404) {
      console.error(`Todo with ID ${id} not found.`);
      return { message: `Todo with ID ${id} not found.` };
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching todo with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};