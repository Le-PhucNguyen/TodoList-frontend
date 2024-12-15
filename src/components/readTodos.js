const readTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch to-dos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in readTodos:', error);
    }
  };
  
  export default readTodos;
  