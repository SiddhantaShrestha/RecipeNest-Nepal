import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, user, expirationDate } = action.payload;

      // Store the token and user details in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenExpiration", expirationDate);

      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.error = null;
    },
    logout(state) {
      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiration");

      // Reset state
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
    restoreAuth(state) {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      const expirationDate = localStorage.getItem("tokenExpiration");

      if (token && expirationDate && Date.now() < parseInt(expirationDate)) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = JSON.parse(user);
        state.error = null;
      } else {
        // Clear invalid/expired tokens
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiration");

        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = "Invalid or expired token";
      }
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, restoreAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
