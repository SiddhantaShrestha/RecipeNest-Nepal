import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the token from the URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      // Call the backend to verify the email
      axios
        .patch(
          "http://localhost:8000/api/users/verify-email",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Check if response is successful
          alert("Email verified successfully!");
          navigate("/login"); // Redirect to login page
        })
        .catch((error) => {
          console.log(error.response?.data); // Log error response
          alert("Email verification failed. Please try again.");
        });
    } else {
      alert("Invalid verification link.");
      navigate("/"); // Redirect to home or error page
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Verifying your email...</h2>
    </div>
  );
};

export default VerifyEmail;
