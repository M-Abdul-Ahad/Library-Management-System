import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/admin/transaction";

export const fetchBorrowRequests = createAsyncThunk(
  "requests/fetchBorrowRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/borrow-requests`);
      return data.borrowRequests;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch borrow requests");
    }
  }
);

export const fetchReturnRequests = createAsyncThunk(
  "requests/fetchReturnRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/return-requests`);
      return data.returnRequests;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch return requests");
    }
  }
);

export const issueBook = createAsyncThunk(
  "requests/issueBook",
  async (requestId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/issue`, { requestId });
      return { requestId, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to issue book");
    }
  }
);

export const fetchRequestsByStatus = createAsyncThunk(
  "requests/fetchRequestsByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/status/${status}`);
      return data.requests;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch requests by status"
      );
    }
  }
);

export const rejectBorrowRequest = createAsyncThunk(
  "requests/rejectBorrowRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/reject-issue`, { requestId });
      return { requestId, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to reject request");
    }
  }
);

export const acceptBookReturn = createAsyncThunk(
  "requests/acceptBookReturn",
  async (requestId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/accept-book`, { requestId });
      return { requestId, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to accept return");
    }
  }
);

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    borrowRequests: [],
    returnRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBorrowRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrowRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowRequests = action.payload;
      })
      .addCase(fetchBorrowRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReturnRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturnRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.returnRequests = action.payload;
      })
      .addCase(fetchReturnRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(issueBook.fulfilled, (state, action) => {
        state.borrowRequests = state.borrowRequests.filter(
          (req) => req.RequestID !== action.payload.requestId
        );
      })
      .addCase(rejectBorrowRequest.fulfilled, (state, action) => {
        state.borrowRequests = state.borrowRequests.filter(
          (req) => req.RequestID !== action.payload.requestId
        );
      })
      .addCase(acceptBookReturn.fulfilled, (state, action) => {
        state.returnRequests = state.returnRequests.filter(
          (req) => req.RequestID !== action.payload.requestId
        );
      })
      .addCase(fetchRequestsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.requestsByStatus = action.payload;
      })
      .addCase(fetchRequestsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestsSlice.reducer;
