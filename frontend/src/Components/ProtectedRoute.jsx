import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const authenticated = authToken !== null;
    setIsAuthenticated(authenticated);

    if (!authenticated) {
      Swal.fire({
        title: "Authentication Required",
        text: "You need to be logged in to access this page",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Go to Login",
        cancelButtonText: "Stay here",
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to login with current location saved
          navigate("/login", { state: { from: location } });
        }
        // If they click "Stay here", do nothing - they remain at the current URL
      });
    } else {
      setShowChildren(true);
    }
  }, [location, navigate]);

  // If authenticated, render the children
  if (isAuthenticated && showChildren) {
    return children;
  }

  // For unauthenticated users or while dialog is showing
  return (
    <div className="unauthorized-page">
      {/* Optional: Display some limited content for unauthenticated users */}
      <h2>Restricted Content</h2>
      <p>Please log in to view this page.</p>
    </div>
  );
};

export default ProtectedRoute;
