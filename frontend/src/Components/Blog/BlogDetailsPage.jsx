import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Navbar"; // Updated path

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
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Blog not found</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="blog-details-page p-6 lg:p-12 max-w-4xl mx-auto">
        {/* Blog Content */}
        <div className="blog-content mb-8">
          <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Category: {blog.category}
            </span>
          </div>
          <img
            src={`http://${blog.image}`}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {blog.description}
          </p>
        </div>

        {/* Comments Section */}
        <div className="comments-section mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          {/* Comment List */}
          <div className="comments-list mb-8">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 mb-4 shadow-sm"
                >
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-gray-800">
                      {/* Handle both string and object user fields */}
                      {typeof comment.user === "string"
                        ? comment.user
                        : comment.user?.username || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Comment Form */}
          {isAuthenticated ? (
            <div className="comment-form mt-6">
              <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment.text}
                  onChange={(e) => setNewComment({ text: e.target.value })}
                  placeholder="Write your comment here..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] mb-4"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                  Post Comment
                </button>
              </form>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">Please log in to leave a comment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
