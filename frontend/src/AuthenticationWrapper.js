import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "./slices/authSlice";
import { setUser } from "./slices/userSlice";
import axios from "axios";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAuth());

    const token = localStorage.getItem("authToken");
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/register/my-profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch(setUser(response.data.data));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
