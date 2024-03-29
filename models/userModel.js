import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { model, Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    title: String,
    imageUrl: String,
  },
  about: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  occupation: {
    type: String,
  },
  location: {
    type: String,
  },
  twitterUrl: {
    type: String,
  },
  instagramUrl: {
    type: String,
  },
  facebookUrl: {
    type: String,
  },
  youtubeUrl: {
    type: String,
  },
  whatsappUrl: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  likedTags: [
    {
      label: String,
      value: String,
    },
  ],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Method to compare a password with the stored password hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);

export default User;
