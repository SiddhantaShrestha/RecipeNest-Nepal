import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authSlice";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../FormikComponents/FormikInput";
import axios from "axios";
import Swal from "sweetalert2";
import "../../CSS/auth.css";

const Signup = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const initialValues = {
    name: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
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
    acceptTerms: Yup.boolean()
      .required("Required")
      .oneOf([true], "You must accept the Terms and Conditions"),
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
        acceptedTerms: values.acceptTerms,
      });

      const { user, token, expirationDate } = response.data;
      dispatch(login({ token, user, expirationDate }));

      // Success popup
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully! Please verify your email.",
        confirmButtonColor: "#8B5CF6", // Purple to match your theme
        confirmButtonText: "Great!",
      });

      resetForm();
    } catch (error) {
      console.error(
        "Signup Error",
        error.response?.data?.message || error.message
      );

      // Error popup
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#8B5CF6",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Terms and Conditions modal
  const TermsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">
          🍴 Recipe Nest Nepal – Terms & Conditions
        </h2>
        <p className="text-gray-300 mb-4">
          By using our platform, you agree to the terms outlined below.
          <br />
          <strong>Last updated: 4/18/2025</strong>
        </p>

        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="text-xl font-semibold text-white">
              📌 General Usage
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Use of this platform implies acceptance of all terms and
                policies
              </li>
              <li>
                Users must register with valid email and complete profile
                information
              </li>
              <li>Premium content is accessible only to subscribed users</li>
              <li>Contact support at recipenest@gmail.com for issues</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              📥 Content Access
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>Free and premium recipes are for personal use only</li>
              <li>
                Redistribution or resale of recipes is strictly prohibited
              </li>
              <li>Users can bookmark and comment on recipes they access</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              💸 Purchases & Subscriptions
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Ingredient purchases and premium recipe downloads are
                non-refundable
              </li>
              <li>
                Subscriptions must be renewed after every expiry in order to
                continue viewing premium content
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              🧾 Orders & Deliveries
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>All deliveries are handled by third-party vendors</li>
              <li>
                Delivery delays are communicated via email or in-app
                notifications
              </li>
              <li>Shipping charges vary by location and vendor</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              🧑‍🍳 User Conduct
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Respectful communication is required in comments and reviews
              </li>
              <li>
                Offensive language, spam, or abuse may lead to account
                suspension
              </li>
              <li>Duplicate or misleading recipe uploads will be removed</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              📤 Recipe Upload Policy
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Only original or properly credited recipes should be uploaded
              </li>
              <li>
                Clear steps and accurate ingredient quantities must be provided
              </li>
              <li>
                Uploaded content may be reviewed or edited for quality assurance
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              🔐 Privacy & Data
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>
                We never share or sell your personal data to third parties
              </li>
              <li>
                Contact info is used solely for recipe recommendations and order
                fulfillment
              </li>
              <li>
                Users may delete their account and data at any time by
                contacting support
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              🧪 Ratings & Feedback
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>Ratings should reflect honest experiences with recipes</li>
              <li>Inappropriate or fake reviews will be moderated</li>
              <li>
                Feedback helps us improve content quality and user experience
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              🕒 Account Activity
            </h3>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Inactive accounts may be archived after 6 months of no login
              </li>
              <li>
                Saved recipes and preferences are retained unless account is
                deleted
              </li>
              <li>
                Subscription access is revoked immediately upon cancellation or
                expiration
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowTerms(false)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen font-sans bg-gray-900">
      {showTerms && <TermsModal />}

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
            {({ errors, touched, values, handleChange, setFieldValue }) => (
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
                      autoComplete="username"
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
                      autoComplete="email"
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
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <FormikInput
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      required
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={values.acceptTerms}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 focus:ring-2 focus:ring-purple-500 text-purple-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="text-gray-300">
                      I accept the{" "}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-purple-500 hover:text-purple-400 underline"
                      >
                        Terms and Conditions
                      </button>
                    </label>
                    {errors.acceptTerms && touched.acceptTerms && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.acceptTerms}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !values.acceptTerms}
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
