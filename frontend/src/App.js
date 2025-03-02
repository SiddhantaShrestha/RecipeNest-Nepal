import React from "react";
import Navigation from "./Components/E-commerce components/Navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth, updateUser } from "./slices/authSlice";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Separate Authentication wrapper component
const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(restoreAuth()).unwrap();
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(
            "http://localhost:8000/register/my-profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch(updateUser(response.data.data));
        }
      } catch (error) {
        console.error("Failed to restore authentication:", error);
      }
    };

    if (!isAuthenticated && !loading) {
      initializeAuth();
    }
  }, [dispatch, isAuthenticated, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

// Main App component
function App() {
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
      {/* Uncomment AuthWrapper if you need it */}
      {/* <AuthWrapper> */}
      {/* <Navbar /> */}
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
      {/* </AuthWrapper> */}
    </>
  );
}

export default App;
