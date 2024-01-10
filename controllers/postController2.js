import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, overview, tags } = req.body;

  const newPost = new Post({
    title,
    content,
    overview,
    tags,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc    Edit a post
// @route   PUT /api/posts/:postId
// @access  Private
const editPost = asyncHandler(async (req, res) => {
  const { title, content, overview, tags } = req.body;

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
    post.overview = overview;
    post.tags = tags;

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to edit post" });
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

// @desc    Get a single post by ID
// @route   GET /api/posts/:postId
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
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

export { createPost, editPost, getAllPosts, getPostById, deletePost };
