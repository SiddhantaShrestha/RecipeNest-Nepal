import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form } from "formik";
import FormikInput from "./FormikComponents/FormikInput";
import FormikTextArea from "./FormikComponents/FormikTextArea";
import FormikCategorySelect from "./FormikComponents/FormikCategorySelect";
import Navbar from "./Navbar"; // Import the Navbar component

const UpdateBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    category: "Beginner",
    image: "",
  });

  // Fetch blog data for initial values
  useEffect(() => {
    axios
      .get(`http://localhost:8000/blogs/${id}`)
      .then((response) => {
        const { title, description, category, image } = response.data.blog;
        setInitialValues({ title, description, category, image });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load blog data.");
        setLoading(false);
      });
  }, [id]);

  // Validation function for Formik
  const validate = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = "Title is required";
    }

    if (!values.description) {
      errors.description = "Description is required";
    }

    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!values.image || !urlPattern.test(values.image)) {
      errors.image = "Please enter a valid image URL";
    }

    if (!values.category) {
      errors.category = "Category is required";
    }

    return errors;
  };

  // Submit handler for Formik
  const handleSubmit = (values, { setSubmitting }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to update a blog!");
      return;
    }

    axios
      .patch(`http://localhost:8000/blogs/${id}`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Blog updated successfully!");
        navigate(`/blog/${id}`); // Redirect to the updated blog details page
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
        alert(err.response?.data?.message || "Failed to update blog.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Navbar included at the top */}
      <Navbar />

      <div className="update-blog-page p-6 lg:p-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Update Blog</h1>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true} // Ensures Formik updates initial values when data is fetched
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, values }) => (
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
                {isSubmitting ? "Updating..." : "Update Blog"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateBlogPage;
