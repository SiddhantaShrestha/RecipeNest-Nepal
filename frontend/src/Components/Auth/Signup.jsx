import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authSlice";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../FormikComponents/FormikInput";
import axios from "axios";
import "../../CSS/auth.css";

const Signup = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    dob: Yup.date().required("Date of Birth is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:8000/api/users", {
        name: values.name,
        username: values.username,
        email: values.email,
        contact: values.phone,
        dob: values.dob,
        password: values.password,
      });

      const { user, token, expirationDate } = response.data;
      dispatch(login({ token, user, expirationDate }));

      alert("Account created successfully! Please verify your email.");
      resetForm();
    } catch (error) {
      console.error(
        "Signup Error",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen font-sans bg-gray-900">
      {/* Left Section - Form */}
      <div className="flex justify-center items-center w-full lg:w-3/5 p-6 lg:p-12">
        <div className="w-full max-w-xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-bold mb-8 text-center lg:text-left text-white">
            Create Account
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormikInput
                      name="name"
                      placeholder="Full name"
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <FormikInput
                      name="username"
                      placeholder="Username"
                      required
                      autocomplete="username"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormikInput
                      name="email"
                      type="email"
                      placeholder="Email address"
                      required
                      autocomplete="email"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <FormikInput
                      name="phone"
                      type="tel"
                      placeholder="Phone number"
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <FormikInput
                  name="dob"
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormikInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                      autocomplete="new-password"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <FormikInput
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      required
                      autocomplete="new-password"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
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
                      Creating Account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </Form>
            )}
          </Formik>
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
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="font-bold text-3xl lg:text-4xl mb-4 text-white">
            Already have an Account?
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-gray-300">
            Log in to continue your journey and access your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="py-3 px-8 text-lg bg-transparent hover:bg-purple-600 text-purple-500 font-semibold hover:text-white border border-purple-500 hover:border-transparent rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
