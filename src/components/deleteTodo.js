const deleteTodos = async (ids) => {
  try {
    const deletePromises = ids.map((id) =>
      fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      })
    );

    const responses = await Promise.all(deletePromises);

    responses.forEach((response) => {
      if (!response.ok) {
        throw new Error('Failed to delete one or more todos');
      }
    });

    console.log('Successfully deleted selected todos');
  } catch (error) {
    console.error('Error in deleteTodos:', error);
  }
};

export default deleteTodos;
