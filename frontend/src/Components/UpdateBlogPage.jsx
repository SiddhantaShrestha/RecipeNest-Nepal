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
  const [imagePreview, setImagePreview] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    category: "Beginner",
    image: "",
  });

  // Fetch blog data for initial values
  // Fetch blog data for initial values
  useEffect(() => {
    axios
      .get(`http://localhost:8000/blogs/${id}`)
      .then((response) => {
        const { title, description, category, image } = response.data.blog;

        // Ensure the image URL has the correct protocol
        const imageUrl =
          image.startsWith("http://") || image.startsWith("https://")
            ? image
            : `http://${image}`;

        setInitialValues({ title, description, category, image: imageUrl });
        setImagePreview(imageUrl);
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

    if (!values.category) {
      errors.category = "Category is required";
    }

    return errors;
  };

  // Handle image change and preview
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

  // Submit handler for Formik
  const handleSubmit = (values, { setSubmitting }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to update a blog!");
      return;
    }

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
                <label htmlFor="image" className="block font-bold mb-1">
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageChange(event, setFieldValue)}
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
