const deleteTodos = async (ids) => {
  try {
    if (!ids || ids.length === 0) {
      console.error('No IDs provided for deletion');
      return;
    }

    console.log('Starting deletion for IDs:', ids);

    const deletePromises = ids.map((id) => {
      console.log(`Sending DELETE request for ID: ${id}`);
      return fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      });
    });

    const responses = await Promise.all(deletePromises);

    responses.forEach((response, index) => {
      if (!response.ok) {
        console.error(
          `Failed to delete todo with ID: ${ids[index]}. Status: ${response.status}, Message: ${response.statusText}`
        );
        throw new Error(`Failed to delete todo with ID: ${ids[index]}`);
      }
    });

    console.log(
      `Successfully deleted ${ids.length} todos with IDs: ${ids.join(', ')}`
    );
  } catch (error) {
    console.error('Error in deleteTodos:', error);
  }
};

export default deleteTodos;