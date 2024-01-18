import asyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import { calculateReadTime } from "../middlewares/readTime.js";

// @desc    Create a new article
// @route   POST /api/articles
// @access  Public
const createArticle = asyncHandler(async (req, res) => {
  const { title, author, overview, thumbnail, category, content } = req.body;

  const readTimeMinutes = calculateReadTime(content);

  const newArticle = new Article({
    title,
    author,
    overview,
    thumbnail,
    category,
    content,
    readTime: readTimeMinutes,
  });

  const createdArticle = await newArticle.save();

  res.status(201).json(createdArticle);
});

// @desc    Create multiple new articles
// @route   POST /api/articles
// @access  Public
const createArticles = asyncHandler(async (req, res) => {
  const articlesData = req.body;

  if (!Array.isArray(articlesData)) {
    return res.status(400).json({
      message: "Invalid request format. Expected an array of articles.",
    });
  }

  const createdArticles = await Article.create(articlesData);

  res.status(201).json(createdArticles);
});

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getAllArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

// @desc    Get a single article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});

// @desc    Update an article by ID
// @route   PATCH /api/articles/:id
// @access  Public
const updateArticle = asyncHandler(async (req, res) => {
  const { title, author, overview, thumbnail, category, content } = req.body;

  const updateFields = {};

  if (title) updateFields.title = title;
  if (author) updateFields.author = author;
  if (overview) updateFields.overview = overview;
  if (thumbnail) updateFields.thumbnail = thumbnail;
  if (category) updateFields.category = category;
  if (content) {
    updateFields.content = content;
    updateFields.readTime = calculateReadTime(content);
  }

  const updatedArticle = await Article.findByIdAndUpdate(
    req.params.id,
    { $set: updateFields },
    { new: true }
  );

  if (updatedArticle) {
    res.json(updatedArticle);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});

// @desc    Delete an article by ID
// @route   DELETE /api/articles/:id
// @access  Public
const deleteArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;

  try {
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await article.deleteOne(); // Use deleteOne() instead of remove()

    res.json({ message: "Article deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export {
  createArticle,
  createArticles,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
