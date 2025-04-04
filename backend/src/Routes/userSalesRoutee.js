import express from "express";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import {
  getUserProductSales,
  getUserSalesMetrics,
} from "../Controllers/userSalesController.js";

const router = express.Router();

router.route("/product-sales").get(isAuthenticated, getUserProductSales);
router.route("/sales-metrics").get(isAuthenticated, getUserSalesMetrics);

export default router;
