import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author_id: {
      type: String,
      required: true,
    },
    author_Image: {
      type: String,
    },
    author_username: {
      type: String,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

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
    comments: [commentSchema],
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.link = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

const Article = model("Article", articleSchema);

export default Article;
