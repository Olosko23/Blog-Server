import express from "express";
import {
  createPost,
  editPost,
  deletePost,
  getAllPosts,
  getPostsByTag,
  getPostsByAuthor,
  getPostsByDate,
  viewPostById,
} from "../controllers/postController.js";
import { protect } from "../middlewares/middleware.js";

const router = express.Router();

// Private Routes
router.post("/posts", protect, createPost);
router.put("/posts/:postId", protect, editPost);
router.delete("/posts/:postId", protect, deletePost);

// Public Routes
router.get("/posts", getAllPosts);
router.get("/posts/tags/:tag", getPostsByTag);
router.get("/posts/author/:authorId", getPostsByAuthor);
router.get("/posts/date/:month", getPostsByDate);
router.get("/posts/:postId", viewPostById);

export default router;
