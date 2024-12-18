import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import Select from "react-select"; // Import react-select
import Navbar from "./Navbar";
import { categories } from "../categories"; // Import predefined categories
import "../CSS/blog.css";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/blogs")
      .then((response) => {
        setBlogs(response.data.blogs);
        setFilteredBlogs(response.data.blogs); // Initialize filteredBlogs with all blogs
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch blogs");
        setLoading(false);
      });
  }, []);

  // Handle blog deletion
  const handleDelete = (id) => {
    const token = localStorage.getItem("authToken");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:8000/blogs/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("Blog deleted successfully");
          setBlogs(blogs.filter((blog) => blog._id !== id));
          setFilteredBlogs(filteredBlogs.filter((blog) => blog._id !== id)); // Update filteredBlogs after delete
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to delete the blog.");
        });
    }
  };

  // Map categories into react-select options
  const categoryOptions = [
    { value: "All", label: "All" },
    ...categories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  // Function to filter blogs based on search and selected category
  const filterBlogs = (category, searchTerm) => {
    const filtered = blogs.filter(
      (blog) =>
        (category.value === "All" || blog.category === category.value) &&
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered); // Update filtered blogs
  };

  return (
    <div>
      <Navbar />

      <div className="blog-section p-6 lg:p-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Blog Section</h1>

        <div className="text-center mb-8">
          <Link
            to="/create-blog"
            className="py-2 px-4 bg-[#8b5e34] text-white rounded-lg"
          >
            Create Blog
          </Link>
        </div>

        {/* Search and Category Filter */}
        <Formik
          initialValues={{
            category: { value: "All", label: "All" },
          }}
          onSubmit={(values) => {
            // Trigger filter on form submit
            filterBlogs(values.category, searchTerm);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className="filters flex flex-col lg:flex-row items-center justify-between mb-8">
              <input
                type="text"
                placeholder="Search blogs..."
                className="search-input w-full lg:w-1/3 p-2 border rounded-lg mb-4 lg:mb-0"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  filterBlogs(values.category, e.target.value); // Filter blogs when search term changes
                }}
              />
              <Field name="category">
                {({ field }) => (
                  <Select
                    options={categoryOptions} // Predefined category options
                    value={values.category} // Currently selected category
                    onChange={(option) => {
                      setFieldValue("category", option);
                      filterBlogs(option, searchTerm); // Filter blogs when category changes
                    }} // Update category value and trigger filtering
                    isSearchable // Enable searching
                    className="w-full lg:w-1/4" // Style the dropdown
                    placeholder="Select a category"
                  />
                )}
              </Field>
            </Form>
          )}
        </Formik>

        {/* Loading and Error States */}
        {loading && (
          <p className="text-center text-lg text-gray-600">Loading blogs...</p>
        )}
        {error && <p className="text-center text-lg text-red-600">{error}</p>}

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="blog-card p-4 bg-white shadow-md rounded-lg hover:shadow-lg"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">
                  {blog.description.substring(0, 100)}...
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="py-2 px-4 bg-blue-500 text-white rounded-lg"
                  >
                    Read More
                  </Link>
                  <Link
                    to={`/blogs/edit/${blog._id}`}
                    className="py-2 px-4 bg-yellow-500 text-white rounded-lg"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="py-2 px-4 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-600">No blogs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
