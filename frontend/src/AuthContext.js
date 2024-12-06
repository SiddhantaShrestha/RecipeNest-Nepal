import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    let parsedUser = null;
    try {
      if (user) {
        parsedUser = JSON.parse(user);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      parsedUser = null;
    }

    const expirationDate = localStorage.getItem("tokenExpiration");

    if (token && expirationDate && Date.now() < expirationDate) {
      return { isAuthenticated: true, token, user: parsedUser };
    }

    // Clear invalid or expired data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");

    return { isAuthenticated: false, token: null, user: null };
  });

  const login = (token, user) => {
    const tokenExpirationTime = 3600 * 1000; // 1 hour in milliseconds
    const expirationDate = Date.now() + tokenExpirationTime;

    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenExpiration", expirationDate);
    } catch (error) {
      console.error("Failed to save auth data:", error);
    }

    setAuthState({ isAuthenticated: true, token, user });

    // Set a timeout to auto-logout when the token expires
    setTimeout(logout, tokenExpirationTime);
  };

  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiration");
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    } finally {
      setAuthState({ isAuthenticated: false, token: null, user: null });
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
