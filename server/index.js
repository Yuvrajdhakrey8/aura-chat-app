import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./src/routes/AuthRoutes.js";
import contactRoutes from "./src/routes/ContactRoutes.js";
import socket from "./socket.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const url = process.env.MONGO_URI;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

socket(server);

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("err", err.message);
  });
