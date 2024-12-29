import React, { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import FormikInput from "./FormikComponents/FormikInput";
import FormikTextArea from "./FormikComponents/FormikTextArea";
import FormikCategorySelect from "./FormikComponents/FormikCategorySelect";
import Navbar from "./Navbar";

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

const CreateBlogPage = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const initialValues = {
    title: "",
    description: "",
    category: "",
    image: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to create a blog!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("image", values.image);

    axios
      .post("http://localhost:8000/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert("Blog created successfully!");
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
        alert(err.response?.data?.message || "Failed to create blog.");
      })
      .finally(() => {
        setSubmitting(false);
      });
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
    <div>
      <Navbar />

      <div className="create-blog-page p-6 lg:p-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Create New Blog</h1>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="max-w-2xl mx-auto">
              <div className="mb-4">
                <FormikInput
                  name="title"
                  label="Title"
                  required={true}
                  placeholder="Enter blog title"
                />
              </div>

              <div className="mb-4">
                <FormikTextArea
                  name="description"
                  label="Description"
                  required={true}
                  placeholder="Enter blog description"
                />
              </div>

              <div className="mb-4">
                <FormikCategorySelect
                  name="category"
                  selectedCategory={values.category}
                  setFieldValue={setFieldValue}
                  required={true}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block font-bold mb-1">
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageChange(event, setFieldValue)}
                  required
                  className="border py-2 px-3 rounded w-full"
                />

                {/* Image Preview Section */}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="font-bold mb-2">Image Preview:</p>
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFieldValue("image", "");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
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
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-[#8b5e34] text-white rounded-lg hover:bg-[#724c2a] transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Create Blog"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateBlogPage;
