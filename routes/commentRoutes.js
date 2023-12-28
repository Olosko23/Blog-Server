import express from "express";
import { addComment, addReply } from "../controllers/commentController.js";

const router = express.Router();

router.post("/comments/:postId", addComment);
router.post("/comments/reply/:commentId", addReply);

export default router;
