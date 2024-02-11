import asyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import upload from "../middlewares/multer.js";
import { calculateReadTime } from "../middlewares/readTime.js";

cloudinary.v2.config({
  cloud_name: "dhw8uj9ct",
  api_key: "951637631872152",
  api_secret: "bN7WULjwv0udfl9HeAO9K4mAyNw",
});

// @desc    Create a new article
// @route   POST /api/articles
// @access  Public
const createArticle = asyncHandler(async (req, res) => {
  const { title, author_id, overview, thumbnail, category, content } = req.body;

  const readTimeMinutes = calculateReadTime(content);

  const newArticle = new Article({
    title,
    author_id,
    overview,
    thumbnail,
    category,
    content,
    readTime: readTimeMinutes,
  });

  const createdArticle = await newArticle.save();

  const authorDetails = await User.findById(author_id, {
    username: 1,
    email: 1,
    avatar: 1,
    about: 1,
    location: 1,
    twitterUrl: 1,
    linkedinUrl: 1,
  });

  createdArticle.author_details = authorDetails;

  await createdArticle.save();

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
    article.reads = (article.reads || 0) + 1;

    await article.save();

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

// @desc    Get six random articles from different categories
// @route   GET /api/articles/random
// @access  Public
const getRandomArticles = asyncHandler(async (req, res) => {
  try {
    const categories = await Article.distinct("category");

    // Shuffle the categories to get a random order
    const shuffledCategories = categories.sort(() => Math.random() - 0.5);

    // Retrieve one random article from each category
    const randomArticles = await Promise.all(
      shuffledCategories.slice(0, 6).map(async (category) => {
        const article = await Article.findOne({ category }).limit(1);
        return article;
      })
    );

    res.json(randomArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Upload thumbnail
const uploadThumbnail = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Handle thumbnail upload
    upload.single("thumbnail")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading file" });
      }
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);

        article.thumbnail = {
          title: req.file.originalname,
          imageUrl: result.secure_url,
        };

        const updatedArticle = await article.save();
        res.status(200).json(updatedArticle);
      } else {
        return res.status(400).json({ message: "No file uploaded" });
      }
    });
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
  }
});

// @desc    Get all articles for a specific user by user ID
// @route   GET /api/user/articles/:user_id
// @access  Public
const getUserArticlesByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userArticles = await Article.find({ author_id: user_id });

    res.json(userArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc    Add a comment to an article
// @route   POST /api/articles/:id/comment
// @access  Public
const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, author_id, author_details } = req.body;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const newComment = {
      content,
      author_id,
      author_details,
    };

    article.comments.push(newComment);

    await article.save();

    res
      .status(200)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc    Add a reply to a comment
// @route   POST /api/articles/:articleId/comments/:commentId/reply
// @access  Public
const addReplyToComment = asyncHandler(async (req, res) => {
  const { articleId, commentId } = req.params;
  const { content, author_id, author_details } = req.body;

  try {
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comment = article.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newReply = {
      content,
      author_id,
      author_details,
    };

    comment.replies.push(newReply);

    await article.save();

    res
      .status(200)
      .json({ message: "Reply added successfully", reply: newReply });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export {
  createArticle,
  getRandomArticles,
  getUserArticlesByUserId,
  createArticles,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  uploadThumbnail,
  addComment,
  addReplyToComment,
};
