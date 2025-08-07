import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/admin/book';


export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const res = await axios.get(`${BASE_URL}/`);
  return res.data.books;
});

export const searchBooks = createAsyncThunk('books/searchBooks', async (filters) => {
  const params = new URLSearchParams();
  if (filters.title) params.append('title', filters.title);
  if (filters.author) params.append('author', filters.author);
  if (filters.category) params.append('category', filters.category);

  const res = await axios.get(`${BASE_URL}/search?${params.toString()}`);
  return res.data.books;
});

export const addBook = createAsyncThunk('books/addBook', async (bookData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BASE_URL}/add`, bookData);
    return res.data.book;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Add book failed');
  }
});

export const updateBook = createAsyncThunk('books/updateBook', async ({ BookID, updatedData }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${BASE_URL}/${BookID}`, updatedData);
    return res.data.book;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (BookID, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/${BookID}`);
    return BookID;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});


const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBookError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch All
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Search
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.unshift(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex((b) => b.BookID === action.payload.BookID);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book.BookID !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookError } = bookSlice.actions;
export default bookSlice.reducer;
