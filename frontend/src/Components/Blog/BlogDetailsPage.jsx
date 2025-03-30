import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Navbar";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ text: "" });

  // Get auth state from Redux
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/blogs/${id}`);
        setBlog(response.data.blog);
        setComments(response.data.blog.comments || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch the blog.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.text.trim()) {
      alert("Please write a comment before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/blogs/${id}/comments`,
        { text: newComment.text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new comment with the current user's information
      const newCommentWithUser = {
        ...response.data.comment,
        user: response.data.comment.user || user, // Fallback to current user if not populated
      };

      setComments([...comments, newCommentWithUser]);
      setNewComment({ text: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post comment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <p className="text-xl text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <p className="text-xl text-gray-300">Blog not found</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="blog-details-page p-4 md:p-8 lg:p-12 max-w-4xl mx-auto">
        {/* Blog Header */}
        <div className="blog-header mb-8 bg-gray-800 rounded-xl p-6 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {blog.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm">
              {blog.category}
            </span>
            <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="blog-image-container mb-10 overflow-hidden rounded-xl">
          <img
            src={`http://${blog.image}`}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover transform hover:scale-105 transition duration-500"
          />
        </div>

        {/* Blog Content */}
        <div className="blog-content mb-12">
          <div className="prose prose-lg max-w-none prose-invert">
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {blog.description}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section mt-14 bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            Comments ({comments.length})
          </h2>

          {/* Comment List */}
          <div className="comments-list mb-8 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 shadow-md transition-transform hover:translate-x-1"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2">
                      {typeof comment.user === "string"
                        ? comment.user.charAt(0).toUpperCase()
                        : comment.user?.username?.charAt(0).toUpperCase() ||
                          "A"}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-100">
                        {/* Handle both string and object user fields */}
                        {typeof comment.user === "string"
                          ? comment.user
                          : comment.user?.username || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 pl-10">{comment.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <p className="mt-2 text-gray-400 italic">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </div>

          {/* Comment Form */}
          {isAuthenticated ? (
            <div className="comment-form mt-8 bg-gray-700 p-5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Add Your Thoughts
              </h3>
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment.text}
                  onChange={(e) => setNewComment({ text: e.target.value })}
                  placeholder="Write your comment here..."
                  className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] mb-4 bg-gray-800 text-white placeholder-gray-400"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center"
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-6 p-5 bg-gray-700 rounded-lg text-center">
              <p className="text-gray-300 mb-3">
                Please log in to leave a comment.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
