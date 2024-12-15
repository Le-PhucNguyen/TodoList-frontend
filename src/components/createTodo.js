const createTodo = async (task) => {
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });
      if (!response.ok) {
        throw new Error('Failed to create a new to-do');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in createTodo:', error);
    }
  };
  
  export default createTodo;
  