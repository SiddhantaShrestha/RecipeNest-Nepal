import React, { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import FormikInput from "../FormikComponents/FormikInput";
import FormikTextArea from "../FormikComponents/FormikTextArea";
import FormikCategorySelect from "../FormikComponents/FormikCategorySelect";
import Navbar from "../Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../slices/blogsSlice";
import { logout } from "../../slices/authSlice";

const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = "Title is required";
  }

  if (!values.description) {
    errors.description = "Description is required";
  }

  if (!values.category) {
    errors.category = "Category is required";
  }

  if (!values.image) {
    errors.image = "Image is required";
  }

  return errors;
};

const CreateBlogPage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const auth = useSelector((state) => state.auth);
  const token = auth.token || localStorage.getItem("authToken");
  const dispatch = useDispatch();

  const initialValues = {
    title: "",
    description: "",
    category: "",
    image: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError(null);

    if (!token) {
      setSubmitError("You must be logged in to create a blog!");
      dispatch(logout());
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("image", values.image);

    try {
      const response = await axios.post(
        "http://localhost:8000/blogs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Success notification
      dispatch(fetchBlogs()); // Refresh the blogs list after creation
      resetForm();
      setImagePreview(null);

      // Show success message
      const successMessage = document.getElementById("success-message");
      successMessage.classList.remove("hidden");
      setTimeout(() => {
        successMessage.classList.add("hidden");
      }, 5000);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setSubmitError(err.response?.data?.message || "Failed to create blog.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("image", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Improved success notification */}
      <div
        id="success-message"
        className="hidden fixed top-5 right-5 bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 transform transition-all duration-500 ease-in-out"
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3 text-emerald-300"
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
          <p className="font-medium text-lg">Blog created successfully!</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
            Create New Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Share your thoughts with the world
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting, errors, touched }) => (
            <Form className="bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-700">
              {/* Header */}
              <div className="bg-gray-700 border-b border-gray-600 px-8 py-5">
                <h2 className="text-2xl font-bold text-white">Blog Details</h2>
                <p className="text-gray-300 mt-1">
                  Fill in the information below to create your blog
                </p>
              </div>

              {/* Form content */}
              <div className="p-8">
                {submitError && (
                  <div
                    className="mb-8 bg-red-900/50 border-l-4 border-red-500 text-red-100 p-4 rounded-r-md"
                    role="alert"
                  >
                    <div className="flex items-start">
                      <svg
                        className="h-6 w-6 text-red-400 mr-4 mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-lg">Error</p>
                        <p className="mt-1">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Title field */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-base font-medium text-gray-200 mb-2"
                    >
                      Title <span className="text-red-500">*</span>
                    </label>
                    <FormikInput
                      name="title"
                      id="title"
                      placeholder="Enter a compelling title for your blog"
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 focus:outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Description field */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-base font-medium text-gray-200 mb-2"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <FormikTextArea
                      name="description"
                      id="description"
                      rows="8"
                      placeholder="Write your blog content here..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 focus:outline-none transition-all duration-200 resize-y"
                    />
                  </div>

                  {/* Category field - improved dropdown */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-base font-medium text-gray-200 mb-2"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    // For the dropdown option items (the blue "Beginner" item)
                    <div className="relative">
                      <FormikCategorySelect
                        name="category"
                        id="category"
                        selectedCategory={values.category}
                        setFieldValue={setFieldValue}
                        className="appearance-none w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 focus:outline-none transition-all duration-200 pr-10"
                        // Add these props to pass to your component
                        dropdownItemClassName="py-2 px-4 hover:bg-gray-600 cursor-pointer text-gray-100"
                        activeDropdownItemClassName="bg-amber-500 text-gray-900 py-2 px-4 cursor-pointer"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Select the category that best fits your blog content
                    </p>
                  </div>

                  {/* Image upload - improved design */}
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-base font-medium text-gray-200 mb-2"
                    >
                      Featured Image <span className="text-red-500">*</span>
                    </label>

                    <div
                      className={`
                      mt-1 flex justify-center px-6 py-8 border-2 ${
                        imagePreview ? "border-solid" : "border-dashed"
                      } 
                      border-gray-500 rounded-lg transition-all duration-300 
                      ${
                        !imagePreview &&
                        "hover:border-amber-500 hover:bg-gray-700/30"
                      }
                    `}
                    >
                      <div className="space-y-2 text-center">
                        {!imagePreview ? (
                          <>
                            <svg
                              className="mx-auto h-14 w-14 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 items-center justify-center text-sm">
                              <label
                                htmlFor="image"
                                className="relative cursor-pointer rounded-md font-medium text-amber-500 hover:text-amber-400 focus-within:outline-none"
                              >
                                <span className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg inline-block transition-colors">
                                  Upload a file
                                </span>
                                <input
                                  id="image"
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) =>
                                    handleImageChange(event, setFieldValue)
                                  }
                                  className="sr-only"
                                />
                              </label>
                              <p className="text-gray-400">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        ) : (
                          <div className="text-center">
                            <div className="relative w-full max-w-lg mx-auto">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-72 object-cover rounded-md shadow-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue("image", "");
                                  setImagePreview(null);
                                }}
                                className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                            <p className="mt-3 text-sm text-gray-400">
                              Click the X to remove or upload a different image
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.image && touched.image && (
                      <p className="mt-2 text-sm text-red-500 font-medium">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form actions - improved buttons */}
              <div className="bg-gray-700 px-8 py-5 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="py-2.5 px-5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-700 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 bg-amber-500 text-gray-900 font-medium rounded-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-700 transition-colors duration-200 flex items-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900"
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
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Publish Blog
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateBlogPage;
