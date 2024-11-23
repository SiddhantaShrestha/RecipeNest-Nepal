import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import all your components
// import Home from "./components/Home"; // Example component for the homepage
import Signup from "./Components/Signup.jsx"; // Signup form component
import Login from "./Components/Login.jsx"; // Login form component
import VerifyEmail from "./Components/VerifyEmail"; // Email verification component
// import Profile from "./components/Profile"; // User profile component
// import UpdateProfile from "./components/UpdateProfile"; // Profile update component
// import ForgotPassword from "./components/ForgotPassword"; // Forgot password component
// import ResetPassword from "./components/ResetPassword"; // Reset password component
import NotFound from "./Components/NotFound"; // Not Found page for invalid routes
import HomePage from "./Components/HomePage.jsx";

// Protected Route for authenticated pages
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if user is logged in
  return isAuthenticated ? children : <Login />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/home" element={<HomePage></HomePage>}></Route>
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}

        {/* Protected Routes */}
        {/* <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        /> */}

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
