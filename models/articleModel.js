import mongoose from "mongoose";

const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author_id: {
      type: String,
      required: true,
    },
    author_details: {
      username: String,
      email: String,
      avatar: {
        title: String,
        imageUrl: String,
      },
      about: String,
      location: String,
      twitterUrl: String,
      linkedinUrl: String,
    },
    overview: {
      type: String,
      required: true,
    },
    reads: {
      type: Number,
      default: 0,
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
