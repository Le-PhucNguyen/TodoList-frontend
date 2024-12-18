import React, { useState, useEffect, useCallback } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './services/api';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, not_completed
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTodos, setSelectedTodos] = useState([]);

  // Fetch todos from the backend with search, filter, and pagination
  const fetchTodosData = useCallback(async () => {
    const queryParams = new URLSearchParams({
      search,
      completed: filter === 'all' ? '' : filter === 'completed',
      page,
      limit: 10,
    }).toString();

    const data = await fetchTodos(queryParams);
    // Chỉ lấy các todo chưa bị soft delete
    setTodos(data.todos.filter((todo) => !todo.isDeleted));
    setTotalPages(data.totalPages);
  }, [search, filter, page]);

  useEffect(() => {
    fetchTodosData();
  }, [fetchTodosData]);

  const handleCreateTodo = async () => {
    if (!task.trim()) return;
    const newTodo = await createTodo(task);
    if (newTodo) {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTask('');
    }
  };

  const handleUpdateTodo = async (id, completed) => {
    const updatedTodo = await updateTodo(id, { completed: !completed });
    if (updatedTodo) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    }
  };

  const handleSoftDeleteTodo = async (id) => {
    const deletedResponse = await deleteTodo(id, { softDelete: true });
    if (deletedResponse) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, isDeleted: true } : todo
        )
      );
    }
  };

  const handleSoftDeleteSelectedTodos = async () => {
    if (selectedTodos.length === 0) return;

    const deletePromises = selectedTodos.map((id) =>
      deleteTodo(id, { softDelete: true })
    );
    await Promise.all(deletePromises);

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        selectedTodos.includes(todo._id) ? { ...todo, isDeleted: true } : todo
      )
    );
    setSelectedTodos([]);
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
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>To-Do List</h1>

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
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
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

      {/* Delete Selected Button */}
      <div>
        <button
          onClick={handleSoftDeleteSelectedTodos}
          disabled={selectedTodos.length === 0}
        >
          Soft Delete Selected
        </button>
      </div>

      {/* Display todos */}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={selectedTodos.includes(todo._id)}
              onChange={() => handleSelectTodo(todo._id)}
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
            <button
              onClick={() => handleSoftDeleteTodo(todo._id)}
              style={{ marginLeft: '10px' }}
            >
              Soft Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
