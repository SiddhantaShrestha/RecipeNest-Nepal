import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// Controllers
import {
  addProduct,
  submitProduct,
  reviewProductSubmission,
  fetchPendingProducts,
  fetchUserSubmittedProducts,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../Controllers/productController.js";

import isAuthenticated from "../Middleware/isAuthenticated.js";
import authorized from "../Middleware/authorized.js";
import checkId from "../Middleware/checkId.js";
import upload from "../Middleware/multer.js";

router.route("/").get(fetchProducts);
router.route("/allproducts").get(fetchAllProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.route("/filtered-products").post(filterProducts);

router.route("/submit").post(isAuthenticated, formidable(), submitProduct);
router
  .route("/my-submissions")
  .get(isAuthenticated, fetchUserSubmittedProducts);

router
  .route("/admin/create")
  .post(isAuthenticated, authorized, formidable(), addProduct);
router
  .route("/admin/pending")
  .get(isAuthenticated, authorized, fetchPendingProducts);
router
  .route("/admin/review/:id")
  .put(isAuthenticated, authorized, reviewProductSubmission);

router.route("/:id/reviews").post(isAuthenticated, checkId, addProductReview);

router
  .route("/:id")
  .get(fetchProductById)
  .put(isAuthenticated, formidable(), updateProductDetails)
  .delete(isAuthenticated, removeProduct);

export default router;
