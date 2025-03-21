import React, { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import FormikInput from "../FormikComponents/FormikInput";
import FormikTextArea from "../FormikComponents/FormikTextArea";
import FormikCategorySelect from "../FormikComponents/FormikCategorySelect";
import Navbar from "../Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../slices/blogsSlice"; // Updated path
import { logout } from "../../slices/authSlice"; // Updated path

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
  const auth = useSelector((state) => state.auth);

  console.log("Auth State:", auth); // This will show the entire auth state
  const token = auth.token || localStorage.getItem("authToken");

  const dispatch = useDispatch();

  const initialValues = {
    title: "",
    description: "",
    category: "",
    image: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!token) {
      alert("You must be logged in to create a blog!");
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
      alert("Blog created successfully!");
      dispatch(fetchBlogs()); // Refresh the blogs list after creation
      resetForm();
      setImagePreview(null);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert(err.response?.data?.message || "Failed to create blog.");
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
    <div>
      <Navbar />

      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: `url('/Images/RecipeBg.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative create-blog-page p-6 lg:p-12">
          <h1 className="text-4xl font-bold mb-6 text-center text-white">
            Create New Blog
          </h1>
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
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
                    onChange={(event) =>
                      handleImageChange(event, setFieldValue)
                    }
                    required
                    className="border py-2 px-3 rounded w-full"
                  />

                  {imagePreview && (
                    <div className="mt-4">
                      <p className="font-bold mb-2">Image Preview:</p>
                      <div className="relative w-full max-w-md mx-auto">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
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
    </div>
  );
};

export default CreateBlogPage;
