import mongoose from "mongoose";

const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      username: String,
      email: String,
      avatar: {
        title: String,
        imageUrl: String,
      },
    },
    overview: {
      type: String,
      required: true,
    },
    thumbnail: {
      title: String,
      imageUrl: String,
    },
    category: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readTime: {
      type: Number,
    },
    comments: [
      {
        type: String,
      },
    ],
    likes: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Article = model("Article", articleSchema);

export default Article;
