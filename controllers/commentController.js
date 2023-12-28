import asyncHandler from "express-async-handler";
import Comment from "../models/commentModel.js";

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;
  const userId = req.user.id; // Assuming you have user information in the request

  try {
    const comment = await Comment.create({
      text,
      user: userId,
      post: postId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add comment" });
  }
});

// @desc    Add a reply to a comment
// @route   POST /api/comments/reply/:commentId
// @access  Private
const addReply = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { commentId } = req.params;
  const userId = req.user.id; // Assuming you have user information in the request

  try {
    const reply = await Comment.create({
      text,
      user: userId,
    });

    // Add the reply to the comment
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: reply._id } },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(201).json(reply);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add reply" });
  }
});

export { addComment, addReply };
