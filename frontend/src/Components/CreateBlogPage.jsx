import React, { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import FormikInput from "./FormikComponents/FormikInput";
import FormikTextArea from "./FormikComponents/FormikTextArea";
import FormikCategorySelect from "./FormikComponents/FormikCategorySelect"; // Reuse the FormikCategorySelect
import Navbar from "./Navbar"; // Import Navbar component

// Form validation function
const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = "Title is required";
  }

  if (!values.description) {
    errors.description = "Description is required";
  }

  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  if (values.image && !urlPattern.test(values.image)) {
    errors.image = "Please enter a valid image URL";
  }

  if (!values.category) {
    errors.category = "Category is required";
  }

  return errors;
};

const CreateBlogPage = () => {
  // Initial values for Formik
  const initialValues = {
    title: "",
    description: "",
    category: "", // Initially empty string or null, will be set by FormikCategorySelect
    image: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to create a blog!");
      return;
    }

    axios
      .post("http://localhost:8000/blogs", values, {
        headers: {
          "Content-Type": "application/json",
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

  return (
    <div>
      {/* Navbar added here */}
      <Navbar />

      {/* Form section */}
      <div className="create-blog-page p-6 lg:p-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Create New Blog</h1>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
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
                  required={true} // Make the category field required
                />
              </div>

              <div className="mb-4">
                <FormikInput
                  name="image"
                  label="Image URL"
                  required={true}
                  placeholder="Enter image URL"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-4 bg-[#8b5e34] text-white rounded-lg"
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
