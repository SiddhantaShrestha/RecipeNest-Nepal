import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../../api";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Extract the token from the URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      // Call the backend to verify the email
      api
        .patch(
          "/users/verify-email",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Check if response is successful
          setVerifying(false);

          // Show success message with SweetAlert2
          Swal.fire({
            icon: "success",
            title: "Email Verified!",
            text: "Your email has been successfully verified. You can now log in to your account.",
            confirmButtonColor: "#8B5CF6",
            confirmButtonText: "Go to Login",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login"); // Redirect to login page
            } else {
              navigate("/login"); // Redirect anyway when they close the dialog
            }
          });
        })
        .catch((error) => {
          console.log(error.response?.data); // Log error response
          setVerifying(false);

          // Show error message with SweetAlert2
          Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text:
              error.response?.data?.message ||
              "Email verification failed. Please try again or contact support.",
            confirmButtonColor: "#8B5CF6",
            confirmButtonText: "Go to Homepage",
          }).then(() => {
            navigate("/"); // Redirect to home page
          });
        });
    } else {
      setVerifying(false);

      // Show invalid link message with SweetAlert2
      Swal.fire({
        icon: "warning",
        title: "Invalid Verification Link",
        text: "The verification link is invalid or has expired. Please request a new verification link.",
        confirmButtonColor: "#8B5CF6",
        confirmButtonText: "Go to Homepage",
      }).then(() => {
        navigate("/"); // Redirect to home page
      });
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8 text-center">
        <div className="mb-6">
          {verifying ? (
            <svg
              className="animate-spin h-16 w-16 mx-auto text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {verifying ? "Verifying your email..." : "Email Verification"}
        </h2>
        {verifying && (
          <p className="text-gray-300">
            Please wait while we confirm your email address.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
