import React, { useState, useEffect, useCallback } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo, restoreTodo } from './services/api';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, not_completed
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce delay
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch todos from the backend with search, filter, and pagination
  const fetchTodosData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        completed: filter === 'completed' ? true : filter === 'not_completed' ? false : '',
        page,
        limit: 10,
      }).toString();

      const data = await fetchTodos(queryParams);
      setTodos(data.todos);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to fetch todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter, page]);

  useEffect(() => {
    fetchTodosData();
  }, [fetchTodosData]);

  const handleCreateTodo = async () => {
    if (!task.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const newTodo = await createTodo(task);
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTask('');
    } catch (err) {
      setError('Failed to create todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async (id, completed) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTodo = await updateTodo(id, { completed: !completed });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDeleteTodo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTodo(id, true); // Soft delete the todo
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, isDeleted: true } : todo
        )
      );
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Here is the updated TodoApp.js with the restoredTodo variable utilized in the handleRestoreTodo function, while keeping all other functions the same:
  const handleRestoreTodo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const restoredTodo = await restoreTodo(id); // Retrieve the restored todo from the API
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, ...restoredTodo, isDeleted: false } : todo
        )
      );
    } catch (err) {
      setError('Failed to restore todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTodo = (id) => {
    setSelectedTodos((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page when searching
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to the first page when filtering
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>To-Do List</h1>

      {/* Error Message */}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Loading Indicator */}
      {loading && <div>Loading...</div>}

      {/* Search Bar */}
      <div>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search todos"
        />
      </div>

      {/* Filter Dropdown */}
      <div>
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="not_completed">Not Completed</option>
        </select>
      </div>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Input for new todo */}
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={handleCreateTodo}>Add</button>
      </div>

      {/* Display todos */}
      <ul>
        {todos.length === 0 && !loading && <li>No todos found.</li>}
        {todos.map((todo) => (
          <li key={todo._id} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={selectedTodos.includes(todo._id)}
              onChange={() => handleSelectTodo(todo._id)}
              disabled={todo.isDeleted} // Disable checkbox for deleted todos
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleUpdateTodo(todo._id, todo.completed)}
            >
              {todo.task}
            </span>
            {!todo.isDeleted ? (
              <button
                onClick={() => handleSoftDeleteTodo(todo._id)}
                style={{ marginLeft: '10px' }}
              >
                Soft Delete
              </button>
            ) : (
              <button
                onClick={() => handleRestoreTodo(todo._id)}
                style={{ marginLeft: '10px' }}
              >
                Restore
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
