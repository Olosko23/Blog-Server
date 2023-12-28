import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, images, videos, tags } = req.body;
  const author = req.user;

  try {
    const post = await Post.create({
      title,
      content,
      images,
      videos,
      tags,
      author,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create post" });
  }
});

// @desc    Edit a post
// @route   PUT /api/posts/:postId
// @access  Private
const editPost = asyncHandler(async (req, res) => {
  const { title, content, images, videos, tags } = req.body;

  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the authenticated user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this post" });
    }

    // Update the post
    post.title = title;
    post.content = content;
    post.images = images;
    post.videos = videos;
    post.tags = tags;

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to edit post" });
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the authenticated user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this post" });
    }

    // Delete the post
    await post.remove();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete post" });
  }
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch posts" });
  }
});

// @desc    Get posts by tags
// @route   GET /api/posts/tags/:tag
// @access  Public
const getPostsByTag = asyncHandler(async (req, res) => {
  const tag = req.params.tag.toLowerCase();

  try {
    const posts = await Post.find({ tags: tag });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch posts by tag" });
  }
});

// @desc    Get posts by author
// @route   GET /api/posts/author/:authorId
// @access  Public
const getPostsByAuthor = asyncHandler(async (req, res) => {
  const authorId = req.params.authorId;

  try {
    const posts = await Post.find({ author: authorId });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch posts by author" });
  }
});

// @desc    Get posts by date created (sorted by most recent)
// @route   GET /api/posts/date/:month
// @access  Public
const getPostsByDate = asyncHandler(async (req, res) => {
  const month = parseInt(req.params.month);

  try {
    // Filter posts based on the month
    const posts = await Post.find({
      $expr: { $eq: [{ $month: "$createdAt" }, month] },
    })
      .sort({ createdAt: "desc" })
      .populate("author", "username");

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch posts by date" });
  }
});

// @desc    View a single post by ID
// @route   GET /api/posts/:postId
// @access  Public
const viewPostById = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch post by ID" });
  }
});

// @desc    Like a post
// @route   PUT /api/posts/:postId/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: "Post already liked" });
    }

    // Add the user to the likes array
    post.likes.push(userId);

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like post" });
  }
});

// @desc    Unlike a post
// @route   PUT /api/posts/:postId/unlike
// @access  Private
const unlikePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has liked the post
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "Post not liked" });
    }

    // Remove the user from the likes array
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unlike post" });
  }
});

export {
  createPost,
  editPost,
  deletePost,
  getAllPosts,
  getPostsByTag,
  getPostsByAuthor,
  getPostsByDate,
  viewPostById,
  likePost,
  unlikePost,
};
