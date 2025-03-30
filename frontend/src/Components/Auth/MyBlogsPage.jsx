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

  // Navigate to blog details page
  const handleViewBlog = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <SubNavbar />
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            My Blogs
          </h2>
          <button
            onClick={() => navigate("/addblog")}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            New Blog
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-200"></div>
              <div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-400"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg text-center my-8">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && userBlogs.length === 0 && (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <svg
              className="mx-auto h-16 w-16 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              ></path>
            </svg>
            <p className="text-xl text-gray-300 mb-4">
              You haven't created any blogs yet.
            </p>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Share your thoughts, experiences, and ideas with the world. Start
              writing your first blog today.
            </p>
            <button
              onClick={() => navigate("/addblog")}
              className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              Write Your First Blog
            </button>
          </div>
        )}

        {/* Blog List */}
        {!isLoading && !error && userBlogs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {userBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 flex flex-col md:flex-row"
              >
                <div
                  className="w-full md:w-1/3 h-48 md:h-auto bg-gray-700 cursor-pointer overflow-hidden"
                  onClick={() => handleViewBlog(blog._id)}
                >
                  <img
                    src={
                      `http://${blog.image}` ||
                      "https://via.placeholder.com/400x300?text=No+Image+Available"
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image+Available")
                    }
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div
                    onClick={() => handleViewBlog(blog._id)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 mt-2 line-clamp-3">
                      {blog.description && blog.description.length > 150
                        ? `${blog.description.substring(0, 150)}...`
                        : blog.description || "No description available"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full">
                      {blog.category || "Uncategorized"}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        ></path>
                      </svg>
                      {blog.comments?.length || 0} Comments
                    </span>
                  </div>

                  <div className="mt-auto pt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewBlog(blog._id)}
                      className="py-1.5 px-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="py-1.5 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="py-1.5 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogsPage;
