import { Router } from "express";
import {
  initiatePremiumSubscription,
  verifyPremiumPayment,
  checkPremiumStatus,
} from "../Controllers/premiumController.js";
import isAuthenticated from "../Middleware/isAuthenticated.js";

const router = Router();

router.post("/initiate", isAuthenticated, initiatePremiumSubscription);
router.post("/verify", isAuthenticated, verifyPremiumPayment);
router.get("/status", isAuthenticated, checkPremiumStatus);

export default router;
