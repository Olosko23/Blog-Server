import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import upload from "../middlewares/multer.js";
import User from "../models/userModel.js";
import { createToken } from "../middlewares/middleware.js";

// Function to validate password complexity
const isStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  return password.length >= 8 && passwordRegex.test(password);
};

const maxAge = 24 * 60 * 60; // 1 day in seconds

// Register a new user
const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json("Fill in all the details to create an account");
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username is already taken." });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email is already registered" });
      }
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Log in an existing user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const auth = await bcrypt.compare(password, user.password);

      if (auth) {
        const token = createToken(user._id);

        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json(user);
      } else {
        res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      res.status(401).json({ error: "No user with that email" });
    }
  } catch (err) {
    res.status(400).json({ error: "Login failed" });
  }
});

//Upload Avatar
const uploadAvatar = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle avatar upload
    upload.single("avatar")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading file" });
      }
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);

        user.avatar = {
          title: req.file.originalname,
          imageUrl: result.secure_url,
        };

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
      } else {
        return res.status(400).json({ message: "No file uploaded" });
      }
    });
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
  }
});

//get all user
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get one user

const getOneUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "User ID not provided" });
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(400).json({ message: "User ID not provided" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to create or update user profile
const createProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    twitterUrl,
    about,
    instagramUrl,
    facebookUrl,
    youtubeUrl,
    linkedinUrl,
    occupation,
    location,
  } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.twitterUrl = twitterUrl || user.twitterUrl;
    user.about = about || user.about;
    user.instagramUrl = instagramUrl || user.instagramUrl;
    user.facebookUrl = facebookUrl || user.facebookUrl;
    user.youtubeUrl = youtubeUrl || user.youtubeUrl;
    user.linkedinUrl = linkedinUrl || user.linkedinUrl;
    user.occupation = occupation || user.occupation;
    user.location = location || user.location;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to update isVerified state
const verifyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to follow another user
const followUser = asyncHandler(async (req, res) => {
  const { userId, followUserId } = req.params;

  try {
    if (!userId || !followUserId) {
      return res.status(400).json({ message: "Both user IDs are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userToFollow = await User.findById(followUserId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    if (user.following.includes(followUserId)) {
      return res
        .status(400)
        .json({ message: "User is already following this user" });
    }

    user.following.push(followUserId);
    await user.save();

    userToFollow.followers.push(userId);
    await userToFollow.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  signup,
  login,
  uploadAvatar,
  getOneUser,
  getAllUsers,
  createProfile,
  verifyUser,
  followUser,
};
