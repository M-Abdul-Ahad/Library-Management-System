import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/member";

export const signupUser = createAsyncThunk(
  "memberAuth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        MemberName: formData.fullName,
        Email: formData.email,
        Password: formData.password,
      });

      return {
        user: response.data.member,
        token: response.data.token,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "memberAuth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        Email: email,
        Password: password,
      });

      return {
        user: response.data.member,
        token: response.data.token,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// in memberAuthSlice.js

export const loadUserFromToken = createAsyncThunk(
  "memberAuth/loadUserFromToken",
  async (_, { rejectWithValue }) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) return rejectWithValue("No token");

    try {
      const response = await axios.get("http://localhost:3000/api/auth/member/checkauth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        user: response.data.user,
        token: token,
      };
    } catch (err) {
      sessionStorage.removeItem("authToken");
      return rejectWithValue("Session expired");
    }
  }
);



const memberAuthSlice = createSlice({
  name: "memberAuth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem("authToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem("authToken", action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUserFromToken.pending, (state) => {
  state.loading = true;
})
.addCase(loadUserFromToken.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
})
.addCase(loadUserFromToken.rejected, (state) => {
  state.loading = false;
  state.user = null;
  state.token = null;
})

  },
});


export const { logout } = memberAuthSlice.actions;
export default memberAuthSlice.reducer;
