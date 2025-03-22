import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setUserBlogs,
  setLoading,
  setError,
  deleteBlog,
} from "../../slices/blogsSlice";
import Navbar from "../Navbar";
import SubNavbar from "../SubNavbar";

const MyBlogsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userBlogs, isLoading, error } = useSelector((state) => state.blogs);
  const token = localStorage.getItem("authToken");

  // Fetch user's blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          "http://localhost:8000/blogs/my-blogs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setUserBlogs(response.data.blogs));
        dispatch(setError(null)); // Clear any existing error after successful fetch
      } catch (err) {
        console.error("Error fetching blogs:", err);
        dispatch(
          setError(err.response?.data?.message || "Failed to fetch blogs")
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (token) {
      fetchUserBlogs();
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [dispatch, token, navigate]);

  // Handle blog deletion
  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:8000/blogs/${blogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(deleteBlog(blogId)); // Update Redux state after deletion
        alert("Blog deleted successfully");
      } catch (err) {
        console.error("Failed to delete blog:", err);
        alert(err.response?.data?.message || "Failed to delete blog");
      }
    }
  };

  // Navigate to blog edit page
  const handleEdit = (blogId) => {
    navigate(`/blogs/edit/${blogId}`); // Navigate to the edit page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SubNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl mb-8 text-center underline">My Blogs</h2>
        <div className="space-y-6">
          {isLoading && (
            <p className="text-xl text-center">Loading your blogs...</p>
          )}
          {error && <p className="text-xl text-red-500 text-center">{error}</p>}
          {!isLoading && !error && userBlogs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">
                You have not created any blogs yet.
              </p>
              <button
                onClick={() => navigate("/addblog")}
                className="mt-4 inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Write Your First Blog
              </button>
            </div>
          )}
          {!isLoading &&
            !error &&
            userBlogs.length > 0 &&
            userBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-md flex overflow-hidden"
              >
                <img
                  src={
                    `http://${blog.image}` ||
                    "https://via.placeholder.com/400x300?text=No+Image+Available"
                  }
                  alt={blog.title}
                  className="w-1/3 object-cover h-auto"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image+Available")
                  }
                />
                <div className="p-4 flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {blog.content && blog.content.length > 150
                      ? `${blog.content.substring(0, 150)}...`
                      : blog.content}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-500">
                      Category: {blog.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-500">
                      {blog.comments?.length || 0} Comments
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(blog._id)}
                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyBlogsPage;
