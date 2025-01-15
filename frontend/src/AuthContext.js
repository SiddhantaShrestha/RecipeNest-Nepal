import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const expirationDate = localStorage.getItem("tokenExpiration");

    // Add debug logging
    console.log("Initial auth state check:", {
      hasToken: !!token,
      hasUser: !!user,
      expiration: expirationDate,
      now: Date.now(),
    });

    try {
      if (token && expirationDate && Date.now() < parseInt(expirationDate)) {
        const parsedUser = user ? JSON.parse(user) : null;
        return { isAuthenticated: true, token, user: parsedUser };
      }
    } catch (error) {
      console.error("Auth state initialization error:", error);
    }

    // Clear storage if token is invalid or expired
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");

    return { isAuthenticated: false, token: null, user: null };
  });

  const login = (token, user) => {
    const tokenExpirationTime = 24 * 3600 * 1000; // Increase to 24 hours
    const expirationDate = Date.now() + tokenExpirationTime;

    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenExpiration", expirationDate.toString());

      console.log("Login data saved:", {
        token: token.substring(0, 20) + "...",
        expirationDate,
        user,
      });

      setAuthState({ isAuthenticated: true, token, user });

      // Set timeout for auto-logout
      const timeoutId = setTimeout(logout, tokenExpirationTime);
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error("Failed to save auth data:", error);
    }
  };

  const logout = () => {
    console.log("Logging out, clearing auth data");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
    setAuthState({ isAuthenticated: false, token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
