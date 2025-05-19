import { Request, Response } from "express";
import { createImageUploadConfig } from "../utils/upload.utils";
import { UploadServiceFactory } from "../factories/upload.service.factory";

class UploadController {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || "uploads";
  }

  configureStorage() {
    return createImageUploadConfig(this.uploadDir);
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const task_id = req.file.filename.split(".")[0];

    const result = await UploadServiceFactory.sendToQueue(req.file);

    res.status(200).json({ task_id, status: "PENDING" });
  }
}

export default UploadController;
