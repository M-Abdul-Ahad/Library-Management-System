import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/admin";

export const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        Email: email,
        Password: password,
      });

      return {
        admin: response.data.admin,
        token: response.data.token,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Admin login failed");
    }
  }
);

export const loadAdminFromToken = createAsyncThunk(
  "adminAuth/loadAdminFromToken",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return rejectWithValue("No token");

    try {
      const response = await axios.get("http://localhost:3000/api/auth/admin/checkauth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        admin: response.data.admin,
        token: token,
      };
    } catch (err) {
      localStorage.removeItem("adminToken");
      return rejectWithValue("Session expired");
    }
  }
);


const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    admin: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        localStorage.setItem("adminToken", action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadAdminFromToken.pending, (state) => {
  state.loading = true;
})
.addCase(loadAdminFromToken.fulfilled, (state, action) => {
  state.loading = false;
  state.admin = action.payload.admin;
  state.token = action.payload.token;
})
.addCase(loadAdminFromToken.rejected, (state) => {
  state.loading = false;
  state.admin = null;
  state.token = null;
})

  },
});

export const { logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
