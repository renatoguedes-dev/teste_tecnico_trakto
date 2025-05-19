import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import cors from "cors";
import path from "path";
import express from "express";
import uploadRouter from "./routes/upload.routes";
import ErrorHandler from "./middlewares/ErrorHandler";

// Create upload directories if they don't exist
const uploadDir = process.env.UPLOAD_DIR || "uploads";
const originalDir = path.join(uploadDir, "original");
const processedDir = path.join(uploadDir, "processed");

const foldersArray = [uploadDir, originalDir, processedDir];

foldersArray.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// server and routes configurations
const server = express();

const PORT = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/upload", uploadRouter);

server.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// handle all errors
server.use(ErrorHandler);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Import and start the worker
import "./workers/imageProcessor";

