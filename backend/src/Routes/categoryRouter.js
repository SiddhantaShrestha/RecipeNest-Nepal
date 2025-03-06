import express from "express";
const router = express.Router();

router.route("/").post(createCategory);

export default router;
