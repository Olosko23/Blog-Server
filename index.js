import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import AuthRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
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
