import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import Navbar from "../Navbar"; // Updated path
import { fetchBlogs, deleteBlog } from "../../slices/blogsSlice"; // Updated path
import { categories } from "../../categories"; // Updated path
import "../../CSS/blog.css"; // Keep the same if the CSS location is unchanged

const BlogSection = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);
  const status = useSelector((state) => state.blogs.status);
  const error = useSelector((state) => state.blogs.error);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogs());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmDelete) {
      setLoadingId(id);
      try {
        await dispatch(deleteBlog(id));
        alert("Blog deleted successfully.");
      } catch (err) {
        alert("Failed to delete blog.");
      } finally {
        setLoadingId(null);
      }
    }
  };

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

  return (
    <div>
      <Navbar />
      <div className="blog-section p-6 lg:p-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Blog Section</h1>
        <div className="text-center mb-8">
          <Link
            to="/create-blog"
            className="py-2 px-4 bg-[#8b5e34] text-white rounded-lg hover:bg-[#724c2a]"
          >
            Create Blog
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
            <Form className="filters flex flex-col lg:flex-row items-center justify-between mb-8">
              <input
                type="text"
                placeholder="Search blogs..."
                className="search-input w-full lg:w-1/3 p-2 border rounded-lg mb-4 lg:mb-0"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  filterBlogs(values.category, e.target.value);
                }}
              />
              <Field name="category">
                {({ field }) => (
                  <Select
                    options={categoryOptions}
                    value={values.category}
                    onChange={(option) => {
                      setFieldValue("category", option);
                      filterBlogs(option, searchTerm);
                    }}
                    isSearchable
                    className="w-full lg:w-1/4"
                    placeholder="Select a category"
                  />
                )}
              </Field>
            </Form>
          )}
        </Formik>

        {status === "loading" && (
          <p className="text-center text-lg text-gray-600">Loading blogs...</p>
        )}
        {error && (
          <p className="text-center text-lg text-red-600">
            {error.message || "Something went wrong. Please try again."}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="blog-card p-4 bg-white shadow-md rounded-lg hover:shadow-lg"
              >
                <img
                  src={
                    blog.image.startsWith("http")
                      ? blog.image
                      : `http://${blog.image}`
                  }
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
                    disabled={loadingId === blog._id}
                    className={`py-2 px-4 ${
                      loadingId === blog._id
                        ? "bg-gray-500"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white rounded-lg`}
                  >
                    {loadingId === blog._id ? "Deleting..." : "Delete"}
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
