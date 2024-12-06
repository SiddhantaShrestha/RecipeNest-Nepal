import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "./FormikComponents/FormikInput";
import axios from "axios";
import "../CSS/auth.css";
import { AuthContext } from "../AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const { login } = useContext(AuthContext); // Access login function from context
  const navigate = useNavigate(); // Use navigate hook from react-router-dom

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Login Values", values);

      // Send a POST request to the backend
      const response = await axios.post(
        "http://localhost:8000/register/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      // Handle successful login
      if (response.data.success) {
        // Call the login method from AuthContext
        login(response.data.token, response.data.user);

        // Redirect the user to the homepage or dashboard
        navigate("/navbar");
      } else {
        // Handle unsuccessful login
        alert(response.data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error(
        "Login error",
        error.response?.data?.message || error.message
      );
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen font-sans">
      {/* Left Section */}
      <div className="flex justify-center items-center w-full lg:w-[calc(100vw-445px)] p-6 lg:p-12">
        <div className="w-full max-w-[471px] bg-[#f5e8d6] p-8 rounded-lg shadow-md">
          <h2 className="text-2xl mb-6 text-center lg:text-left">Login</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <FormikInput
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  autocomplete="email"
                  className="input-field"
                />
                <FormikInput
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  className="input-field"
                />

                <p
                  className="text-right text-sm text-[#8b5e34] mb-4 cursor-pointer"
                  onClick={() => navigate("/forgot-password")} // Use navigate hook for Forgot Password
                >
                  Forgot Password?
                </p>

                <button
                  type="submit"
                  className="w-full py-2 text-lg bg-[#8b5e34] text-white rounded-md cursor-pointer"
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[445px] bg-[#ececec] p-6 lg:p-12 text-center">
        <h2 className="font-bold text-3xl lg:text-4xl mb-4">New Here?</h2>
        <p className="text-lg lg:text-2xl mb-5">Create a Free account.</p>
        <button
          onClick={() => navigate("/signup")} // Use navigate hook for Sign Up
          className="py-2 px-4 lg:px-6 text-lg bg-[#d9e85e] rounded-md cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
