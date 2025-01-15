import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create async thunk for auth restoration
export const restoreAuth = createAsyncThunk(
  "auth/restore",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const expirationDate = localStorage.getItem("tokenExpiration");

    if (token && expirationDate && Date.now() < parseInt(expirationDate)) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      };
    } else {
      // Clear invalid/expired tokens
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiration");
      throw new Error("Invalid or expired token");
    }
  }
);

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, user, expirationDate } = action.payload;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenExpiration", expirationDate);

      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.error = null;
    },
    logout(state) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiration");

      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(restoreAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
