import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const AdminRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile to check admin status
        const response = await axios.get(
          "http://localhost:8000/api/users/my-profile",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        // Set admin status based on response
        setIsAdmin(response.data.data.isAdmin);
        setLoading(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    // Optional: Show loading indicator
    return <div>Loading...</div>;
  }

  // If admin, render child routes, otherwise redirect to login
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoutes;
