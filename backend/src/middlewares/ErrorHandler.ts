import { Request, Response, NextFunction } from "express";
import multer from "multer";

// Centralized error handling function
const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = err.message;

  if (err instanceof multer.MulterError) {
    const status =
      err.code === "LIMIT_FILE_SIZE"
        ? 413 // Payload Too Large
        : err.code === "LIMIT_UNEXPECTED_FILE"
        ? 400 // Bad Request
        : 400; // default

    res.status(status).json({
      status: "Error",
      code: err.code,
      message: errorMessage,
    });

    return;
  }

  console.error(`Error: ${errorMessage}`);
  // Send a response with a status code and error message
  res.status(err.statusCode || 500).json({
    status: "Error",
    message: err.message || "Internal Server Error",
  });
};

export default ErrorHandler;
