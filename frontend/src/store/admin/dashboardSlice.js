import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/admin/dashboard"; 

// --- Async Thunks ---
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching stats");
    }
  }
);

export const fetchQuickOverview = createAsyncThunk(
  "dashboard/fetchQuickOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/quick-overview`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching overview");
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  "dashboard/fetchRecentActivities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/recent-activities`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching activities");
    }
  }
);

export const fetchRecentTransactions = createAsyncThunk(
  "dashboard/fetchRecentTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/recent-transactions`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching transactions");
    }
  }
);

// --- Slice ---
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {},
    quickOverview: {},
    activities: [],
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Stats
    builder.addCase(fetchDashboardStats.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchDashboardStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Quick Overview
    builder.addCase(fetchQuickOverview.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchQuickOverview.fulfilled, (state, action) => {
      state.loading = false;
      state.quickOverview = action.payload;
    });
    builder.addCase(fetchQuickOverview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Recent Activities
    builder.addCase(fetchRecentActivities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRecentActivities.fulfilled, (state, action) => {
      state.loading = false;
      state.activities = action.payload.activities;
    });
    builder.addCase(fetchRecentActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Recent Transactions
    builder.addCase(fetchRecentTransactions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRecentTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = action.payload.transactions;
    });
    builder.addCase(fetchRecentTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default dashboardSlice.reducer;
