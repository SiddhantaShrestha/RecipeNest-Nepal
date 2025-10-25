import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../FormikComponents/FormikInput";
import axios from "axios";
import "../../CSS/auth.css";
import { useDispatch, useSelector } from "react-redux";
import { login, updateUser } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../redux/constants";
import Swal from "sweetalert2";
import api from "../../api";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const fetchUserProfile = async (token) => {
    try {
      const response = await api.get(`${BASE_URL}/users/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post("/users/login", {
        email: values.email,
        password: values.password,
      });

      if (response.data.success && response.data.token) {
        const token = response.data.token;
        const expirationDate = Date.now() + 24 * 60 * 60 * 1000;

        // Success message
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          confirmButtonColor: "#8B5CF6",
          timer: 1500,
          showConfirmButton: false,
        });

        // Dispatch the login action with token and expiration
        dispatch(
          login({
            token: token,
            user: {}, // Empty placeholder
            expirationDate: expirationDate,
          })
        );

        // Now fetch the user profile
        const userProfile = await fetchUserProfile(token);
        // console.log("User profile:", userProfile); // Debug log

        if (userProfile) {
          // Update the user data in the store
          dispatch(updateUser(userProfile));

          // Check if user is admin using isAdmin flag
          if (userProfile.isAdmin) {
            // console.log("User is admin, redirecting to admin dashboard");
            navigate("/admin/dashboard");
          } else {
            // console.log("Regular user, redirecting to home page");
            navigate("/");
          }
        } else {
          console.warn("Failed to fetch user profile");
          navigate("/");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message || "Login failed - no token received",
          confirmButtonColor: "#8B5CF6",
        });
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: error.response?.data?.message || "An error occurred during login",
        confirmButtonColor: "#8B5CF6",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen font-sans bg-gray-900">
      {/* Left Section - Form */}
      <div className="flex justify-center items-center w-full lg:w-3/5 p-6 lg:p-12">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-bold mb-8 text-center lg:text-left text-white">
            Welcome Back
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <FormikInput
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <FormikInput
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <p
                    className="text-purple-400 hover:text-purple-300 text-sm cursor-pointer transition duration-300"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Logging in...
                    </span>
                  ) : (
                    "Log In"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <span>Don't have an account?</span>
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-400 hover:text-purple-300 font-medium transition duration-300"
              >
                Sign up here
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Call to action */}
      <div className="flex flex-col justify-center items-center w-full lg:w-2/5 bg-gray-800 p-8 lg:p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <svg
              className="w-20 h-20 mx-auto mb-6 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
          </div>
          <h2 className="font-bold text-3xl lg:text-4xl mb-4 text-white">
            New Here?
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-gray-300">
            Join us today and create your account to access all features.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="py-3 px-8 text-lg bg-transparent hover:bg-purple-600 text-purple-500 font-semibold hover:text-white border border-purple-500 hover:border-transparent rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
