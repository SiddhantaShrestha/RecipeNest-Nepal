import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const BlogDetailsPage = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/blogs/${id}`) // Fetch the blog by ID
      .then((response) => {
        setBlog(response.data.blog);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch the blog.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="blog-details-page p-6 lg:p-12">
      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
      <img
        src={blog.image || "https://via.placeholder.com/300"}
        alt={blog.title}
        className="w-full h-64 object-cover mb-4"
      />
      <div
        className="text-gray-700 mb-4"
        style={{ whiteSpace: "pre-wrap" }} // Preserve spaces and newlines
      >
        {blog.description}
      </div>
      <p className="text-sm text-gray-500">Category: {blog.category}</p>
    </div>
  );
};

export default BlogDetailsPage;
