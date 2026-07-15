export const getBooks = async () => {
  try {
    const response = await fetch('/api/books');
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id: number | string) => {
  try {
    const response = await fetch(`/api/books/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};