const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the to-do');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in deleteTodo:', error);
    }
  };
  
  export default deleteTodo;
  