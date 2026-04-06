import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// 🔐 Initial State
const initialState = {
  users: [],
  loading: false,
  error: null,
};

//
// 🚀 Async Actions
//

// 📥 Get Users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/users");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

// ➕ Add User
export const addUser = createAsyncThunk(
  "users/addUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/users", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add user");
    }
  }
);

// ✏️ Update User
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/users/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

// ❌ Delete User
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

//
// 🧠 Slice
//

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // ❌ Clear Error
    clearUserError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 📥 Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Add User
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // ✏️ Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // ❌ Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user._id !== action.payload
        );
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;