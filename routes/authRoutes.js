import express from "express";
import { login, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/signup", signup);

export default router;
