import { Request, Response } from "express";
import { createImageUploadConfig } from "../utils/upload.utils";
import { UploadServiceFactory } from "../factories/upload.service.factory";
import checkForVirus from "../utils/checkForVirus.utils";

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
      const fileIsClean = await checkForVirus(req);

      if (!fileIsClean) {
        res.status(400).json({ error: "Invalid or corrupted file" });
        return;
      }

      const task_id = req.file.filename.split(".")[0];

      await UploadServiceFactory.sendToQueue(req.file);

      res.status(202).json({ task_id, status: "PENDING" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to process image upload" });
    }
  }
}

export default UploadController;
