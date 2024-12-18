const deleteTodos = async (ids) => {
  try {
    const deletePromises = ids.map((id) =>
      fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      })
    );

    const responses = await Promise.all(deletePromises);

    responses.forEach((response, index) => {
      if (!response.ok) {
        throw new Error(`Failed to delete todo with ID: ${ids[index]}`);
      }
    });

    console.log(
      `Successfully soft deleted ${ids.length} todos with IDs: ${ids.join(', ')}`
    );
  } catch (error) {
    console.error('Error in deleteTodos:', error.message);
  }
};

export default deleteTodos;
