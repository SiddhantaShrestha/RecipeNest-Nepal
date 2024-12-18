import { Blog } from "../Schema/model.js";

const checkBlogOwnership = async (req, res, next) => {
  try {
    const blogId = req.params.id; // Blog ID from URL
    const userId = req._id; // User ID from authenticated user

    console.log("Decoded User ID:", userId); // Log user ID
    console.log("Blog ID:", blogId); // Log blog ID

    // Fetch only the creator field of the blog
    const blog = await Blog.findById(blogId).select("creator");

    if (!blog) {
      console.log("Blog not found");
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log("Blog Creator:", blog.creator?.toString());

    // Check if the user owns the blog
    if (blog.creator?.toString() !== userId) {
      console.log("Unauthorized user trying to delete the blog");
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    console.log("User authorized to delete the blog");
    next(); // User is authorized, proceed to deleteBlog
  } catch (error) {
    console.error("Error in checkBlogOwnership middleware:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export default checkBlogOwnership;
