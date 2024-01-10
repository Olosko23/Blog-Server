import express from "express";
import {
  createPost,
  editPost,
  getAllPosts,
  getPostById,
  deletePost,
} from "../controllers/postController2.js";
//import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/api/v1/posts", createPost);
router.put("/api/v1/posts/:postId", editPost);
router.get("/api/v1/posts", getAllPosts);
router.get("/api/v1/posts/:postId", getPostById);
router.delete("/api/v1/posts/:postId", deletePost);

export default router;
