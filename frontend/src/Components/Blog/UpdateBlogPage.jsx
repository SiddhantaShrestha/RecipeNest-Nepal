// src/components/UpdateBlogPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlog } from "../../slices/blogsSlice";
import axios from "axios";
import { Formik, Form } from "formik";
import FormikInput from "../FormikComponents/FormikInput";
import FormikTextArea from "../FormikComponents/FormikTextArea";
import FormikCategorySelect from "../FormikComponents/FormikCategorySelect";
import Navbar from "../Navbar";
import Swal from "sweetalert2";

const UpdateBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog, isLoading } = useSelector((state) => state.blogs);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchBlog(id));
  }, [id, dispatch]);

  useEffect(() => {
    // Set image preview from the existing blog image if available
    if (blog?.image) {
      // If the image is a full URL
      setImagePreview(
        blog.image.startsWith("http") ? blog.image : `http://${blog.image}`
      );
    }
  }, [blog]);

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

    return errors;
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      Swal.fire({
        title: "Authentication Error",
        text: "You must be logged in to update a blog!",
        icon: "error",
        confirmButtonColor: "#f59e0b", // amber-500
        background: "#1f2937", // gray-800
        color: "#f3f4f6", // gray-100
      });
      return;
    }

    // Show loading toast while updating
    Swal.fire({
      title: "Updating...",
      html: "Please wait while we update your blog",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: "#1f2937", // gray-800
      color: "#f3f4f6", // gray-100
    });

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    axios
      .patch(`http://localhost:8000/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Success notification
        Swal.fire({
          title: "Success!",
          text: "Your blog has been updated successfully",
          icon: "success",
          confirmButtonColor: "#f59e0b", // amber-500
          timer: 2000,
          timerProgressBar: true,
          background: "#1f2937", // gray-800
          color: "#f3f4f6", // gray-100
        }).then(() => {
          navigate(`/blog/${id}`);
        });
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);

        // Error notification
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || "Failed to update blog.",
          icon: "error",
          confirmButtonColor: "#f59e0b", // amber-500
          background: "#1f2937", // gray-800
          color: "#f3f4f6", // gray-100
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const confirmCancel = () => {
    Swal.fire({
      title: "Discard changes?",
      text: "Any unsaved changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b", // amber-500
      cancelButtonColor: "#4b5563", // gray-600
      confirmButtonText: "Yes, discard changes",
      background: "#1f2937", // gray-800
      color: "#f3f4f6", // gray-100
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/blog/${id}`);
      }
    });
  };

  const confirmImageRemoval = (setFieldValue) => {
    Swal.fire({
      title: "Remove image?",
      text: "Are you sure you want to remove this image?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // red-500
      cancelButtonColor: "#4b5563", // gray-600
      confirmButtonText: "Yes, remove it!",
      background: "#1f2937", // gray-800
      color: "#f3f4f6", // gray-100
    }).then((result) => {
      if (result.isConfirmed) {
        setFieldValue("image", "");
        setImagePreview(null);
      }
    });
  };

  const initialValues = {
    title: blog?.title || "",
    description: blog?.description || "",
    category: blog?.category || "",
    image: "",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-amber-500 mb-4"
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
            <p className="text-xl text-gray-300">Loading blog details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
            Update Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Edit your blog details below
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting, errors, touched }) => (
            <Form className="bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-700">
              {/* Header */}
              <div className="bg-gray-700 border-b border-gray-600 px-8 py-5">
                <h2 className="text-2xl font-bold text-white">Blog Details</h2>
                <p className="text-gray-300 mt-1">
                  Update the information below to edit your blog
                </p>
              </div>

              {/* Form content */}
              <div className="p-8">
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
                      placeholder="Enter blog title"
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

                  {/* Category field */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-base font-medium text-gray-200 mb-2"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FormikCategorySelect
                        name="category"
                        id="category"
                        selectedCategory={values.category}
                        setFieldValue={setFieldValue}
                        className="appearance-none w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 focus:outline-none transition-all duration-200 pr-10"
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

                  {/* Image upload */}
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-base font-medium text-gray-200 mb-2"
                    >
                      Featured Image
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
                                  Upload a new image
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
                                onClick={() =>
                                  confirmImageRemoval(setFieldValue)
                                }
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
                    <p className="mt-2 text-sm text-gray-400">
                      Leave empty to keep the current image
                    </p>
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="bg-gray-700 px-8 py-5 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={confirmCancel}
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
                      Updating...
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Update Blog
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

export default UpdateBlogPage;
