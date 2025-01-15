import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import store, { persistor } from "./redux/store";
import AppRoutes from "./Routes";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth, updateUser } from "./slices/authSlice"; // Replace setUser with updateUser

// Separate Authentication wrapper component
const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  React.useEffect(() => {
    // Restore auth state
    const initializeAuth = async () => {
      try {
        await dispatch(restoreAuth()).unwrap();

        // Check for token and fetch user data if token exists
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

          // Update user data in Redux store
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
    return <div>Loading...</div>; // Or your loading component
  }

  return children;
};

// Main App component
function App() {
  return <AppRoutes />;
}

export default App;
