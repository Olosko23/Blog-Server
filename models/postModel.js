import mongoose from "mongoose";

const { Schema, model } = mongoose;

const validTags = [
  "science",
  "technology",
  "politics",
  "health",
  "travel",
  "food",
  "sports",
  "entertainment",
  "education",
  "business",
  "environment",
  "culture",
  "fashion",
  "lifestyle",
  "programming",
  "music",
  "books",
  "fitness",
  "photography",
  "art",
];

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      title: String,
      imageUrl: String,
    },
    overview: {
      type: String,
    },
    images: [
      {
        title: String,
        imageUrl: String,
      },
    ],
    videos: [
      {
        title: String,
        videoUrl: String,
      },
    ],
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return tags.every((tag) => validTags.includes(tag));
        },
        message: (props) => `${props.value} is not a valid tag.`,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

export default Post;
