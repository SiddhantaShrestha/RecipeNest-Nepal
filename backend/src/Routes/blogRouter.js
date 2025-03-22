import { Router } from "express";
import {
  createBlog,
  updateBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  addComment,
  getBlogsByUser, // Add this import
} from "../Controllers/blogController.js";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import checkBlogOwnership from "../Middleware/checkBlogOwnership.js";
import upload from "../Middleware/multer.js";
import validation from "../Middleware/validation.js";
import {
  blogCreationValidation,
  blogUpdateValidation,
} from "../validation/blogValidation.js";

const blogRouter = Router();

// Protected route for fetching blogs created by the logged-in user
blogRouter.route("/my-blogs").get(isAuthenticated, getBlogsByUser);

// Public routes
blogRouter.route("/").get(getBlogs);
blogRouter.route("/:id").get(getBlogById);

// Create blog route
blogRouter
  .route("/")
  .post(
    isAuthenticated,
    upload.single("image"),
    validation(blogCreationValidation),
    createBlog
  );

// Update blog route with image handling
blogRouter
  .route("/:id")
  .patch(
    isAuthenticated,
    checkBlogOwnership,
    upload.single("image"),
    validation(blogUpdateValidation),
    updateBlog
  );

// Delete blog route
blogRouter
  .route("/:id")
  .delete(isAuthenticated, checkBlogOwnership, deleteBlog);

// Comment route
blogRouter.route("/:id/comments").post(isAuthenticated, addComment);

export default blogRouter;
