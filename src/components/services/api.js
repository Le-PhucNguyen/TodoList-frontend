const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchTodos = async (queryParams) => {
  const response = await fetch(`${API_BASE_URL}/todos?${queryParams}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const createTodo = async (task) => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ task }),
  });
  return response.json();
};

export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return response.json();
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
};
