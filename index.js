import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import AuthRoutes from "./routes/authRoutes.js";
import PostRoutes from "./routes/postRoutes.js";
import PostRoutes2 from "./routes/postRoutes2.js";
import CommentRoutes from "./routes/commentRoutes.js";
import PasswordRoutes from "./routes/userRoutes.js";
import ArticleRoutes from "./routes/articleRoutes.js";

const app = express();
const corsOptions = {
  origin: "https://phreddy.netlify.app",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGO_URI;

mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database Connected and Server Running on Port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.log({ error: error.message });
  });

app.get("/", (req, res) => {
  try {
    res.status(200).json("API Is Working Well!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api", AuthRoutes);
app.use("/api", PostRoutes);
app.use("/", PostRoutes2);
app.use("/api", CommentRoutes);
app.use("/api", PasswordRoutes);
app.use("/api", ArticleRoutes);

export default app;
