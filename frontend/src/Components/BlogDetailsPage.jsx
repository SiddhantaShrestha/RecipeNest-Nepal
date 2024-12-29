import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // State to hold comments
  const [newComment, setNewComment] = useState({ user: "", text: "" }); // Comment form state

  useEffect(() => {
    axios
      .get(`http://localhost:8000/blogs/${id}`)
      .then((response) => {
        setBlog(response.data.blog);
        setComments(response.data.blog.comments || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch the blog.");
        setLoading(false);
      });
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8000/blogs/${id}/comments`, newComment)
      .then((response) => {
        setComments([...comments, response.data.comment]); // Update comments list
        setNewComment({ user: "", text: "" }); // Reset form
      })
      .catch(() => alert("Failed to post comment"));
  };

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="blog-details-page p-6 lg:p-12">
      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
      <img
        src={`http://${blog.image}`}
        alt={blog.title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <p className="text-gray-700 mb-4">{blog.description}</p>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="border p-4 mb-2 rounded-lg">
              <p className="font-semibold">{comment.user}</p>
              <p>{comment.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <input
            type="text"
            placeholder="Your Name"
            value={newComment.user}
            onChange={(e) =>
              setNewComment({ ...newComment, user: e.target.value })
            }
            className="block w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Write a comment..."
            value={newComment.text}
            onChange={(e) =>
              setNewComment({ ...newComment, text: e.target.value })
            }
            className="block w-full p-2 border rounded mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
