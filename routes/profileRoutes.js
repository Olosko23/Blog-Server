import express from "express";
import {
  uploadAvatar,
  getAllUsers,
  getOneUser,
  createProfile,
  verifyUser,
  followUser,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/user/:id", getOneUser);
router.patch("/profile/create/:id", createProfile);
router.patch("/profile/avatar/:id", uploadAvatar);
router.patch("/verify/:id", verifyUser);
router.post("/follow/:userId/:followUserId", followUser);

export default router;
