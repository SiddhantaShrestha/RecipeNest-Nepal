import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    category: "Beginner", // Default category
    image: "", // Default image URL
  });
  const [loading, setLoading] = useState(true);

  // Fetch blog data from the backend
  useEffect(() => {
    axios
      .get(`http://localhost:8000/blogs/${id}`)
      .then((response) => {
        const { title, description, category, image } = response.data.blog;
        setBlog({ title, description, category, image });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load blog.");
      });
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  // Handle form submission for updating the blog
  const handleUpdate = (e) => {
    e.preventDefault(); // Prevent default form submit behavior
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to update a blog!");
      return;
    }

    // Validate the image URL to ensure it's a valid URL
    const imageUrl = blog.image;
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(imageUrl)) {
      alert("Please enter a valid image URL.");
      return;
    }

    axios
      .patch(`http://localhost:8000/blogs/${id}`, blog, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
      })
      .then(() => {
        alert("Blog updated successfully!");

        // Delay the redirect to allow user to see success message
        setTimeout(() => {
          navigate(`/blog/${id}`); // Redirect to the blog details page
        }, 1000); // 1 second delay (can adjust as needed)
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message); // Check the full error
        alert(err.response?.data?.message || "Failed to update blog.");
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="update-blog-page p-6 lg:p-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Update Blog</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded-lg"
            value={blog.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded-lg"
            value={blog.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            name="category"
            className="w-full p-2 border rounded-lg"
            value={blog.category}
            onChange={handleInputChange}
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Cuisine">Cuisine</option>
            <option value="Health">Health</option>
            <option value="Dessert">Dessert</option>
            <option value="Tips">Tips</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Image URL</label>
          <input
            type="text"
            name="image"
            className="w-full p-2 border rounded-lg"
            value={blog.image}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          type="submit"
          className="py-2 px-4 bg-[#8b5e34] text-white rounded-lg"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default UpdateBlogPage;
