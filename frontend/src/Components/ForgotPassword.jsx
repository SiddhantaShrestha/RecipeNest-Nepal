import React, { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "./FormikComponents/FormikInput";

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
      const response = await axios.post(
        "http://localhost:8000/register/forgot-password",
        {
          email: values.email,
        }
      );

      if (response.data.success) {
        setEmailSent(true);
      } else {
        alert(response.data.message || "Unable to send reset link.");
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
    <div className="flex flex-col justify-center items-center w-full h-screen">
      {emailSent ? (
        <div className="text-center p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl mb-4">Email Sent!</h2>
          <p className="mb-4">
            Please check your inbox for a link to reset your password.
          </p>
          <button
            className="py-2 px-4 bg-[#8b5e34] text-white rounded"
            onClick={() => (window.location.href = "/login")}
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="w-full max-w-[400px] p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl mb-6">Forgot Password</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <FormikInput
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  autocomplete="email"
                  className="input-field mb-4"
                />
                <button
                  type="submit"
                  className="w-full py-2 text-lg bg-[#8b5e34] text-white rounded-md cursor-pointer"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
