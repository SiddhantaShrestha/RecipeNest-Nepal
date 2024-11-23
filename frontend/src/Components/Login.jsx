import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "./FormikComponents/FormikInput";
import axios from "axios"; // Import axios
import "../CSS/auth.css"; // Import shared CSS

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
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
        // Save the JWT or token to localStorage or context
        localStorage.setItem("authToken", response.data.token);

        // Redirect the user to the dashboard or homepage
        window.location.href = "/home"; // or use react-router-dom's navigate
      } else {
        // Handle unsuccessful login
        alert(response.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex w-full h-screen font-sans">
      {/* Left Section */}
      <div className="flex justify-center items-center w-[calc(100vw-445px)] p-12">
        <div className="w-full max-w-[471px] bg-[#f5e8d6] p-8 rounded-lg shadow-md">
          <h2 className="text-2xl mb-6">Login</h2>
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
                  autocomplete="password"
                  className="input-field"
                />

                <p className="text-right text-sm text-[#8b5e34] mb-4 cursor-pointer">
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
      <div className="flex flex-col justify-center items-center w-[445px] bg-[#ececec] p-12 text-center">
        <h2 className="font-bold text-4xl mb-4">New Here?</h2>
        <p className="text-2xl mb-5">Create a Free account.</p>
        <button
          onClick={() => (window.location.href = "/signup")}
          className="py-2 px-6 text-lg bg-[#d9e85e] rounded-md cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
