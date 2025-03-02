import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("authToken") !== null;

  if (!isAuthenticated) {
    // Use setTimeout to ensure the toast displays before redirect
    setTimeout(() => {
      toast.error("Please login to access this page", {
        toastId: "auth-required",
        autoClose: 3000,
      });
    }, 0);

    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
