import React, { useEffect } from "react";
import Navigation from "./Components/E-commerce components/Navigation";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { restoreAuth } from "./slices/authSlice";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin || false;

  const hideNavigationRoutes = [
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
  ];

  const shouldHideNavigation = hideNavigationRoutes.includes(location.pathname);

  useEffect(() => {
    // Check for existing auth token on initial load
    dispatch(restoreAuth());
  }, [dispatch]);

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

      {/* Show Navigation only for authenticated admin users */}
      {!shouldHideNavigation && isAuthenticated && isAdmin && <Navigation />}

      {/* Show Navbar for non-authenticated or non-admin users */}
      {!shouldHideNavigation &&
        (!isAuthenticated || (isAuthenticated && !isAdmin)) && <Navbar />}

      <main className={!shouldHideNavigation ? "py-3" : ""}>
        <Outlet />
      </main>
    </>
  );
}

export default App;
