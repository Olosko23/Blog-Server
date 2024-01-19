import express from "express";
import {
  uploadAvatar,
  getAllUsers,
  getOneUser,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/user/:id", getOneUser);
router.patch("/profile/avatar/:id", uploadAvatar);

export default router;
