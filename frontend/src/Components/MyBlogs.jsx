import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get("http://localhost:8000/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userBlogs = response.data.blogs.filter(
          (blog) => blog.creator === localStorage.getItem("userId")
        );
        setBlogs(userBlogs);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch blogs.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:8000/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setBlogs(blogs.filter((blog) => blog._id !== id));
          alert("Blog deleted successfully.");
        })
        .catch(() => alert("Failed to delete the blog."));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">My Blogs</h1>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-2xl mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">
                  {blog.description.substring(0, 100)}...
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View
                  </Link>
                  <Link
                    to={`/blogs/edit/${blog._id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">You have not created any blogs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
