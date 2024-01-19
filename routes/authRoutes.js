import express from "express";
import { login, signup, uploadAvatar } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/signup", signup);
router.patch("/profile/avatar/:id", uploadAvatar);

export default router;
