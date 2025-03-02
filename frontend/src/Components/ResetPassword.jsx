import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "./FormikComponents/FormikInput";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resetSuccess, setResetSuccess] = useState(false);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/users/reset-password",
        {
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setResetSuccess(true);
      } else {
        alert(response.data.message || "Unable to reset password.");
      }
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error.response?.data?.message || error.message
      );
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      {resetSuccess ? (
        <div className="text-center p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl mb-4">Password Reset Successful!</h2>
          <p className="mb-4">You can now log in with your new password.</p>
          <button
            className="py-2 px-4 bg-[#8b5e34] text-white rounded"
            onClick={() => (window.location.href = "/login")}
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="w-full max-w-[400px] p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl mb-6">Reset Password</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <FormikInput
                  name="password"
                  type="password"
                  required
                  placeholder="Enter new password"
                  autocomplete="new-password"
                  className="input-field mb-4"
                />
                <FormikInput
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm new password"
                  autocomplete="new-password"
                  className="input-field mb-4"
                />
                <button
                  type="submit"
                  className="w-full py-2 text-lg bg-[#8b5e34] text-white rounded-md cursor-pointer"
                >
                  Reset Password
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
