import express from "express";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import authorized from "../Middleware/authorized.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../Controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, createOrder)
  .get(isAuthenticated, authorized, getAllOrders);

router.route("/mine").get(isAuthenticated, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);
router.route("/:id").get(isAuthenticated, findOrderById);
router.route("/:id/pay").put(isAuthenticated, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(isAuthenticated, authorized, markOrderAsDelivered);

export default router;
