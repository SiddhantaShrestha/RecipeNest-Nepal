import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  const login = (token, user) => {
    setAuthState({ isAuthenticated: true, token, user });
    localStorage.setItem("authToken", token); // Save token to localStorage
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, token: null, user: null });
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
