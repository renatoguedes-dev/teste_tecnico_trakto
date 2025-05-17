import express from "express";
import dotenv from "dotenv";

dotenv.config();

const server = express();

const PORT = process.env.PORT || 3000;

server.get("/", (req, res) => {
  res.send("<h1>Server working</h1>");
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
