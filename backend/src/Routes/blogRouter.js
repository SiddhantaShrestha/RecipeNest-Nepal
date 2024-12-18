import { Router } from "express";
import {
  createBlog,
  updateBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  addComment,
  getMyBlogs,
} from "../Controllers/blogController.js";
import {
  validateJoi,
  blogCreationValidation,
  blogUpdateValidation,
} from "../Middleware/validateJoi.js";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import checkBlogOwnership from "../Middleware/checkBlogOwnership.js";

const blogRouter = Router();

// Public routes
blogRouter.route("/").get(getBlogs); // Get all blogs
blogRouter.route("/:id").get(getBlogById); // Get a specific blog

// Protected route for creating a blog
blogRouter
  .route("/")
  .post(isAuthenticated, validateJoi(blogCreationValidation), createBlog);

// Protected route for updating a blog
blogRouter
  .route("/:id")
  .patch(
    isAuthenticated,
    checkBlogOwnership, // Only the creator can update
    validateJoi(blogUpdateValidation),
    updateBlog
  )
  .delete(
    isAuthenticated,
    checkBlogOwnership, // Only the creator can delete
    deleteBlog
  );

// Protected route for fetching blogs created by the logged-in user
blogRouter.route("/myBlogs").get(isAuthenticated, getMyBlogs);

blogRouter.route("/:id/comments").post(addComment); // Add a new comment

export default blogRouter;
