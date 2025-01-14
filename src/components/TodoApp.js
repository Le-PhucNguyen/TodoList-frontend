import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  restoreTodo,
  deleteTodos,
} from './services/api';

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
        completed:
          filter === 'completed' ? true : filter === 'not_completed' ? false : '',
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

  const handleDelete = async () => {
    try {
      await deleteTodos(selectedTodos);
      fetchTodosData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1 className="todo-header">To-Do List</h1>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Search Bar */}
      <div className="todo-search-wrapper">
        <input
          className="todo-search"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search todos"
        />
        <select
          className="todo-filter"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="not_completed">Not Completed</option>
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
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
      <div className="new-task-wrapper">
        <input
          className="new-task-input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button className="new-task-button" onClick={handleCreateTodo}>
          Add
        </button>
      </div>

      {/* Display todos */}
      <div className="todo-list">
        {todos.length === 0 && !loading && <div>No todos found.</div>}
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedTodos.includes(todo._id)}
              onChange={() => handleSelectTodo(todo._id)}
              disabled={todo.isDeleted} // Disable checkbox for deleted todos
            />
            <span
              onClick={() => handleUpdateTodo(todo._id, todo.completed)}
            >
              {todo.task}
            </span>
            {!todo.isDeleted ? (
              <button
                className="todo-delete"
                onClick={() => handleSoftDeleteTodo(todo._id)}
              >
                Delete
              </button>
            ) : (
              <button
                className="todo-restore"
                onClick={() => handleRestoreTodo(todo._id)}
              >
                Restore
              </button>
            )}
          </div>
        ))}

        {selectedTodos.length > 0 && (
          <button
            onClick={handleDelete}
            className="multi-delete-button"
          >
            Multiple Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
