import { Blog } from "../Schema/model.js";
import { validationResult } from "express-validator"; // Input validation

// Create a new blog
export const createBlog = async (req, res) => {
  const { title, description, category, image } = req.body;

  // Validate request inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the blog title already exists
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({ message: "Blog title already exists" });
    }

    // Create and save a new blog
    const newBlog = new Blog({
      title,
      description,
      category,
      image,
      creator: req._id,
    });
    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a blog
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, image } = req.body;

  // Validate request inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description, category, image },
      { new: true, runValidators: true } // Enforce validation on update
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params; // Blog ID
  const { user, text } = req.body; // Comment fields

  // Input validation
  if (!user || !text) {
    return res
      .status(400)
      .json({ message: "User and text fields are required." });
  }

  try {
    // Find blog and push new comment
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = { user, text, createdAt: new Date() };
    blog.comments.push(newComment);
    await blog.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Fetch blogs created by the authenticated user
export const getMyBlogs = async (req, res) => {
  try {
    const userId = req._id; // Retrieved from the token middleware
    const blogs = await Blog.find({ creator: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Your blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    console.error("Error fetching user-specific blogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
