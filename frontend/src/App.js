import React from "react";
import Navigation from "./Components/E-commerce components/Navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth, updateUser } from "./slices/authSlice";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Main App component
function App() {
  const location = useLocation();

  // List of routes where Navigation should be hidden
  const hideNavigationRoutes = [
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
  ];

  // Check if Navigation should be hidden on current route
  const shouldHideNavigation = hideNavigationRoutes.includes(location.pathname);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />

      {/* Only render Navigation if not in the hidden routes list */}
      {!shouldHideNavigation && <Navigation />}

      <main className={!shouldHideNavigation ? "py-3" : ""}>
        <Outlet />
      </main>
    </>
  );
}

export default App;
