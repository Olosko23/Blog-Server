import express from "express";
import {
  resetPassword,
  sendResetLink,
} from "../controllers/passwordController.js";

const router = express.Router();

//PASSWORD RECOVERY
router.post("/password", sendResetLink);
router.post("/password/reset", resetPassword);

export default router;
