import express from "express";
import {
  createArticle,
  createArticles,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";

const router = express.Router();

// @desc    Create a new article
// @route   POST /api/articles
// @access  Public
router.post("/articles", createArticle);

// @desc    Create articles
// @route   POST /api/articles/multi
// @access  Public
router.post("/articles/multi", createArticles);

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
router.get("/articles", getAllArticles);

// @desc    Get a single article by ID
// @route   GET /api/articles/:id
// @access  Public
router.get("/articles/:id", getArticleById);

// @desc    Update an article by ID
// @route   PUT /api/articles/:id
// @access  Public
router.patch("/articles/:id", updateArticle);

// @desc    Delete an article by ID
// @route   DELETE /api/articles/:id
// @access  Public
router.delete("/articles/:id", deleteArticle);

export default router;