import React, { useState } from "react";
import axios from "axios";

const CreateBlogPage = () => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "",
    category: "Beginner", // Default category
    image: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the token from local storage

    if (!token) {
      alert("You must be logged in to create a blog!");
      return;
    }

    // Validate the image URL to ensure it's a valid URL
    const imageUrl = newBlog.image;
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(imageUrl)) {
      alert("Please enter a valid image URL.");
      return;
    }

    axios
      .post("http://localhost:8000/blogs", newBlog, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
      })
      .then((response) => {
        alert("Blog created successfully!");
        setNewBlog({
          title: "",
          description: "",
          category: "Beginner",
          image: "",
        });
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message); // Check the full error
        alert(err.response?.data?.message || "Failed to create blog.");
      });
  };

  return (
    <div className="create-blog-page p-6 lg:p-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Create New Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded-lg"
            value={newBlog.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded-lg"
            value={newBlog.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            name="category"
            className="w-full p-2 border rounded-lg"
            value={newBlog.category}
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
            value={newBlog.image}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          type="submit"
          className="py-2 px-4 bg-[#8b5e34] text-white rounded-lg"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
