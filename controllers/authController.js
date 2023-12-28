import asyncHandler from "express-async-handler";
import { createToken } from "../middlewares/middleware.js";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

// Function to validate password complexity
const isStrongPassword = (password) => {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  return password.length >= 8 && passwordRegex.test(password);
};

const maxAge = 24 * 60 * 60; // 1 day in seconds

// Register a new user
const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      // Return an error if username or email is already in use
      const errors = {};
      if (existingUser.username === username) {
        errors.username = "Username is already taken.";
      }
      if (existingUser.email === email) {
        errors.email = "Email is already registered.";
      }
      throw errors;
    }

    if (!isStrongPassword(password)) {
      const errors = {
        password:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      };
      throw errors;
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
    console.log(error);
    res.status(400).json({ errors: error });
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

export { signup, login };
