import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import Navbar from "../Navbar";
import { fetchBlogs } from "../../slices/blogsSlice";
import { categories } from "../../categories";
import "../../CSS/blog.css";

const BlogSection = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);
  const status = useSelector((state) => state.blogs.status);
  const error = useSelector((state) => state.blogs.error);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogs());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  const categoryOptions = [
    { value: "All", label: "All" },
    ...categories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  const filterBlogs = (category, searchTerm) => {
    const term = searchTerm.toLowerCase();
    const filtered =
      category.value === "All" && !term
        ? blogs
        : blogs.filter(
            (blog) =>
              (category.value === "All" || blog.category === category.value) &&
              blog.title.toLowerCase().includes(term)
          );
    setFilteredBlogs([...filtered]);
  };

  // Custom styles for react-select to match dark theme
  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderColor: "#374151",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#4B5563",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#374151" : "#1f2937",
      "&:hover": {
        backgroundColor: "#374151",
      },
      color: "#fff",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
    }),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Explore Our Blog
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the latest articles, guides, and updates from our team
          </p>
        </div>

        <div className="mb-8">
          <Link
            to="/create-blog"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Blog
          </Link>
        </div>

        <Formik
          initialValues={{
            category: { value: "All", label: "All" },
          }}
          onSubmit={(values) => {
            filterBlogs(values.category, searchTerm);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className="mb-12">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="search"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Search Blogs
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="search"
                        placeholder="Search by title..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          filterBlogs(values.category, e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="md:w-64">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Category
                    </label>
                    <Field name="category">
                      {({ field }) => (
                        <Select
                          id="category"
                          options={categoryOptions}
                          value={values.category}
                          onChange={(option) => {
                            setFieldValue("category", option);
                            filterBlogs(option, searchTerm);
                          }}
                          isSearchable
                          styles={selectStyles}
                          placeholder="Select a category"
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {status === "loading" && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md mb-8">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>
                {error.message || "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
        )}

        {!status === "loading" && filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-400">
              No blogs found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or category filter
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog._id}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-gray-800 border border-gray-700 hover:border-amber-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    blog.image.startsWith("http")
                      ? blog.image
                      : `http://${blog.image}`
                  }
                  alt={blog.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-0 right-0 m-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-gray-900">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-3 text-white">
                  {blog.title}
                </h2>
                <p className="text-gray-400 mb-4 flex-1">
                  {blog.description.substring(0, 120)}...
                </p>
                <div className="mt-auto pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {new Date(
                        blog.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="inline-flex items-center text-amber-500 hover:text-amber-400 font-medium"
                    >
                      Read More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
