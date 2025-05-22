import { Request } from "express";
import fs from "fs/promises";
import sharp from "sharp";

async function checkForVirus(req: Request): Promise<Boolean> {
  const filePath = req.file!.path;

  try {
    const buffer = await fs.readFile(filePath);
    const meta = await sharp(buffer).metadata();

    if (!["jpeg", "png", "webp", "gif"].includes(meta.format || "")) {
      // Format not allowed -> deletes the file and returns false
      await fs.unlink(filePath);
      return false;
    }

    // valid file with no virus
    return true;
  } catch (err) {
    // Invalid or corrupted file -> deletes file and returns error
    await fs.unlink(filePath).catch(() => {
      /* swallow */
    });

    return false;
  }
}

export default checkForVirus;
