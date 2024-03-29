import express from "express";
import {
  createArticle,
  createArticles,
  getAllArticles,
  getRandomArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  uploadThumbnail,
  getUserArticlesByUserId,
  addComment,
  addReplyToComment,
} from "../controllers/articleController.js";
import { protect } from "../middlewares/middleware.js";

const router = express.Router();

// @desc    Create a new article
// @route   POST /api/articles
// @access  Public
router.post("/articles", createArticle);

// @desc    Create articles
// @route   POST /api/articles/multi
// @access  Public
router.post("/articles/multi", createArticles);

// @desc    Create article thumbnail
// @route   PATCH /api/articles/thumbnail/:id
// @access  Private
router.patch("/articles/thumbnail/:id", uploadThumbnail);

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
router.get("/articles", getAllArticles);

// @desc    Get 6 random articles
// @route   GET /api/articles/random
// @access  Public
router.get("/articles/random", getRandomArticles);

// @desc    Get a single article by ID
// @route   GET /api/articles/:id
// @access  Public
router.get("/articles/:id", getArticleById);

// @desc    Get user  article by ID
// @route   GET /api/user/articles/:user_id
// @access  Public
router.get("/user/articles/:user_id", getUserArticlesByUserId);

// @desc    Update an article by ID
// @route   PUT /api/articles/:id
// @access  Public
router.patch("/articles/:id", protect, updateArticle);

// @desc    Delete an article by ID
// @route   DELETE /api/articles/:id
// @access  Public
router.delete("/articles/:id", protect, deleteArticle);

// @desc    Add a comment to an article
// @route   POST /api/articles/:id/comment
// @access  Private
router.post("/articles/:id/comment", addComment);

// @desc    Add a reply to a comment
// @route   POST /api/articles/:articleId/comments/:commentId/reply
// @access  Private
router.post(
  "/articles/:articleId/comments/:commentId/reply",
  protect,
  addReplyToComment
);

export default router;
