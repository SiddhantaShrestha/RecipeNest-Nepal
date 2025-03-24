import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../FormikComponents/FormikInput";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setEmailSent(true);
      } else {
        alert(data.message || "Unable to send reset link.");
      }
    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error.response?.data?.message || error.message
      );
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-gray-800 border border-gray-700">
        {emailSent ? (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Email Sent</h2>
            <p className="mb-6 text-gray-300">
              Please check your inbox for a link to reset your password.
            </p>
            <button
              className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium transition duration-300 w-full"
              onClick={() => (window.location.href = "/login")}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-amber-600 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Reset Password</h2>
              <p className="text-gray-400 mt-2">
                Enter your email to receive a reset link
              </p>
            </div>
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
                      placeholder="Enter your email address"
                      autocomplete="email"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-lg bg-amber-600 hover:bg-amber-700 text-white rounded-md cursor-pointer font-medium transition duration-300 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
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
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                  <div className="text-center mt-6">
                    <Link
                      to="/login"
                      className="text-amber-500 hover:text-amber-400 font-medium"
                    >
                      Remember your password? Login
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
