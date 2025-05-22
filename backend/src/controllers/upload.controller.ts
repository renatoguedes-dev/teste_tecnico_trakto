import { Request, Response } from "express";
import { createImageUploadConfig } from "../utils/upload.utils";
import { UploadServiceFactory } from "../factories/upload.service.factory";
import checkForVirus from "../utils/checkForMetadata.utils";

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

    try {
      const result = await UploadServiceFactory.sendToQueue(req.file);

      res.status(202).json(result);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to process image upload" });
    }
  }
}

export default UploadController;
