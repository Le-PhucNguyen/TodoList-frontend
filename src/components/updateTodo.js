const updateTodo = async (id, updatedFields) => {
  try {
    const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });
    if (!response.ok) {
      throw new Error('Failed to update the to-do');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateTodo:', error);
  }
};

export default updateTodo;