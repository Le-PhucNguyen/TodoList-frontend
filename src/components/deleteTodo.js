const deleteTodos = async (ids, softDelete = true) => {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      console.error('No valid IDs provided for deletion');
      return;
    }

    console.log('Starting deletion for IDs:', ids);

    // Send a single request to handle multiple deletions
    const response = await fetch(`http://localhost:5000/api/todos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }), // Send IDs in the request body
      params: { softDelete }, // Pass softDelete as a query parameter
    });

    if (!response.ok) {
      console.error(
        `Failed to delete todos. Status: ${response.status}, Message: ${response.statusText}`
      );
      throw new Error('Failed to delete todos');
    }

    const result = await response.json();
    console.log(
      `Successfully deleted todos. Message: ${result.message}, Deleted Count: ${result.deletedCount || 'N/A'}`
    );
  } catch (error) {
    console.error('Error in deleteTodos:', error);
  }
};

export default deleteTodos;