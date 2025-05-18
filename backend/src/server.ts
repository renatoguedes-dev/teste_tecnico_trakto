import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { SetupRabbitMQ } from "./config/rabbitmq-setup";


const server = express();

const PORT = process.env.PORT || 3000;

const producer = new SetupRabbitMQ();

server.get("/", (req, res) => {
  res.send("<h1>Server working</h1>");
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
