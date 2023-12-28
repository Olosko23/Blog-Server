import asyncHandler from "express-async-handler";
import axios from "axios";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userModel.js";

// Request Reset Link
const sendResetLink = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    const name = user.name;

    const link = `https://beta-assist.netlify.app/password/${resetToken}`;
    const data = {
      from: "oloogeorge633@gmail.com",
      to: email,
      subject: "Password Reset",
      body: `
        <html>
        <head>
          <style>
            /* Add your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background: linear-gradient(to bottom, #007ACC, #007ACC, #00f);
              background-repeat: repeat;
              color: white;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            h2 {
              color: blue;
              font-size: 28px;
            }
            p {
              font-size: 18px;
            }
            a {
              color: blue;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="color: blue;">MERN STACK BLOG</h2>
            <p>Hello, ${name}!</p>
            <p>Your password reset link is:</p>
            <p><a href="${link}" style="color: blue; text-decoration: none;">${link}</a></p>
          </div>
        </body>
        </html>
      `,
      apiKey: process.env.ELASTIC_EMAIL_API_KEY,
    };

    const response = await axios.post(
      "https://api.elasticemail.com/v2/email/send",
      new URLSearchParams(data).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.success) {
      res
        .status(200)
        .json({ message: "Password reset link sent successfully." });
    } else {
      res.status(500).json({ message: response.data.error });
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
});

// Verify Link and Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

export { sendResetLink, resetPassword };
