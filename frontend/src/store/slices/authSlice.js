import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  adminLogin,
  userLogin,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../../services/authService";

// 🔐 Initial State
const initialState = {
  user: getCurrentUser() || null,
  loading: false,
  error: null,
};

//
// 🚀 Async Actions
//

// Admin Login
export const adminLoginAction = createAsyncThunk(
  "auth/adminLogin",
  async (data, { rejectWithValue }) => {
    try {
      return await adminLogin(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User Login
export const userLoginAction = createAsyncThunk(
  "auth/userLogin",
  async (data, { rejectWithValue }) => {
    try {
      return await userLogin(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Register
export const registerAction = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await registerUser(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//
// 🧠 Slice
//

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🚪 Logout
    logout: (state) => {
      logoutUser();
      state.user = null;
    },

    // ❌ Clear Error
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔐 Admin Login
      .addCase(adminLoginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(adminLoginAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 👤 User Login
      .addCase(userLoginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLoginAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userLoginAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📝 Register
      .addCase(registerAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;