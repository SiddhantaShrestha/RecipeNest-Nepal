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
import isAuthenticated from "../Middleware/isAuthenticated.js";
import checkBlogOwnership from "../Middleware/checkBlogOwnership.js";
import upload from "../Middleware/multer.js";
import validation from "../Middleware/validation.js";
import {
  blogCreationValidation,
  blogUpdateValidation,
} from "../validation/blogValidation.js";

const blogRouter = Router();

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
blogRouter.route("/:id").patch(
  isAuthenticated,
  checkBlogOwnership,
  upload.single("image"), // Handle both multipart form data and JSON
  validation(blogUpdateValidation),
  updateBlog
);

// Delete blog route
blogRouter
  .route("/:id")
  .delete(isAuthenticated, checkBlogOwnership, deleteBlog);

// Get user's blogs route
blogRouter.route("/myblogs").get(isAuthenticated, getMyBlogs);

// Comment route
blogRouter.route("/:id/comments").post(addComment);

export default blogRouter;
