import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate for navigation
import axios from "axios"; // Axios for API requests

import "../CSS/blog.css"; // Create this CSS file for custom styling

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch blogs from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/blogs") // Replace with your actual backend URL
      .then((response) => {
        setBlogs(response.data.blogs);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch blogs");
        setLoading(false);
      });
  }, []);

  // Handle blog deletion
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:8000/blogs/${id}`)
        .then(() => {
          alert("Blog deleted successfully");
          setBlogs(blogs.filter((blog) => blog._id !== id)); // Update the state to remove the deleted blog
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to delete the blog.");
        });
    }
  };

  // Categories derived from the fetched blogs
  const categories = ["All", ...new Set(blogs.map((blog) => blog.category))];

  // Filter blogs based on category and search term
  const filteredBlogs = blogs.filter(
    (blog) =>
      (selectedCategory === "All" || blog.category === selectedCategory) &&
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blog-section p-6 lg:p-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Blog Section</h1>

      {/* Button to navigate to the Create Blog Page */}
      <div className="text-center mb-8">
        <Link
          to="/create-blog" // Navigate to the Create Blog Page
          className="py-2 px-4 bg-[#8b5e34] text-white rounded-lg"
        >
          Create Blog
        </Link>
      </div>

      {/* Search and Category Filter */}
      <div className="filters flex flex-col lg:flex-row items-center justify-between mb-8">
        <input
          type="text"
          placeholder="Search blogs..."
          className="search-input w-full lg:w-1/3 p-2 border rounded-lg mb-4 lg:mb-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="category-select w-full lg:w-1/4 p-2 border rounded-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

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
              key={blog._id} // Use the blog's unique ID here
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
                  to={`/blog/${blog._id}`} // Navigate to the details page using the blog ID
                  className="py-2 px-4 bg-blue-500 text-white rounded-lg"
                >
                  Read More
                </Link>
                <Link
                  to={`/blogs/edit/${blog._id}`} // Navigate to the edit page
                  className="py-2 px-4 bg-yellow-500 text-white rounded-lg"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)} // Handle delete action
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
  );
};

export default BlogSection;
