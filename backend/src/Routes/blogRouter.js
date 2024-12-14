import { Router } from "express";
import {
  createBlog,
  updateBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  addComment,
} from "../Controllers/blogController.js";
import {
  validateJoi,
  blogCreationValidation,
  blogUpdateValidation,
} from "../Middleware/validateJoi.js";

const blogRouter = Router();

// Public routes
blogRouter.route("/").get(getBlogs); // Get all blogs
blogRouter.route("/:id").get(getBlogById); // Get a specific blog

// Public route for creating a blog (no authentication required)
blogRouter.route("/").post(
  validateJoi(blogCreationValidation), // Validate the blog data with Joi
  createBlog // Call the createBlog controller function to create the blog
);

// Update a blog (requires authorization)
blogRouter
  .route("/:id")
  .patch(
    validateJoi(blogUpdateValidation), // Validate blog updates
    updateBlog // Call the updateBlog controller function to update the blog
  )
  .delete(deleteBlog); // Delete a blog (requires authorization)

blogRouter.route("/:id/comments").post(addComment); // Add a new comment

export default blogRouter;
