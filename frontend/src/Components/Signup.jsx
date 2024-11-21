import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "./FormikComponents/FormikInput";
import "../CSS/auth.css"; // Import shared CSS

const Signup = () => {
  const initialValues = {
    name: "",
    username: "",
    email: "",
    phone: "",
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
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleSubmit = (values) => {
    console.log("Signup Values", values);
    // Perform signup logic here
  };

  return (
    <div className="flex w-full h-screen font-sans">
      {/* Left Section */}
      <div className="flex justify-center items-center w-[calc(100vw-445px)] p-12">
        <div className="w-full max-w-[471px] bg-[#f5e8d6] p-8 rounded-lg shadow-md">
          <h2 className="text-2xl mb-6">Sign Up</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <FormikInput
                  name="name"
                  placeholder="Enter your full name"
                  required
                  className="input-field"
                />
                <FormikInput
                  name="username"
                  required
                  placeholder="Enter your username"
                  autocomplete="username"
                />
                <FormikInput
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                  className="input-field"
                />
                <FormikInput
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  autocomplete="email"
                />
                <FormikInput
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  autocomplete="new-password"
                />
                <FormikInput
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Retype your password"
                  autocomplete="new-password"
                />

                <button
                  type="submit"
                  className="w-full py-2 text-lg bg-[#8b5e34] text-white rounded-md cursor-pointer"
                >
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-[445px] bg-[#ececec] p-12 text-center">
        <h2 className="font-bold text-4xl mb-4">Already have an Account?</h2>{" "}
        {/* Adjusted font size */}
        <p className="text-2xl mb-5">Go back to Login.</p>{" "}
        {/* Adjusted font size */}
        <button
          onClick={() => (window.location.href = "/login")}
          className="py-2 px-6 text-lg bg-[#d9e85e] rounded-md cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
