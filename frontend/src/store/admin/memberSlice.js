import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/admin/member';

export const fetchMembers = createAsyncThunk('members/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_URL}/`);
    return res.data.members;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch members');
  }
});

export const addMember = createAsyncThunk('members/add', async (memberData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BASE_URL}/add`, memberData);
    return res.data.member;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add member');
  }
});

export const updateMember = createAsyncThunk(
  'members/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/update/${id}`, updatedData);
      return res.data.member;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update member');
    }
  }
);

export const deleteMember = createAsyncThunk('members/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/delete/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete member');
  }
});

export const searchMembers = createAsyncThunk('members/search', async (name, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
    return res.data.members;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Search failed');
  }
});

const memberSlice = createSlice({
  name: 'members',
 initialState: {
  members: [],
  loading: false,
  error: null,
 
},
  reducers: {
    clearMemberError: (state) => {
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.unshift(action.payload);
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.members.findIndex((m) => m.MemberID === action.payload.MemberID);
        if (index !== -1) state.members[index] = action.payload;
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter((m) => m.MemberID !== action.payload);
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(searchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

  },
});

export const { clearMemberError} = memberSlice.actions;
export default memberSlice.reducer;
