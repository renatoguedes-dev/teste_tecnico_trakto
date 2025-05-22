import sharp from "sharp";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { ImageTaskModel, ImageVersion } from "../models/imageTask.model";

const stat = promisify(fs.stat);

interface IVersions {
  low?: ImageVersion;
  medium?: ImageVersion;
  high_optimized?: ImageVersion;
}

class ImageProcessingService {
  // Process an image and generate different quality versions
  public async processImage(
    taskId: string,
    filePath: string,
    originalFilename: string
  ): Promise<void> {
    try {
      // Update task status to PROCESSING
      await ImageTaskModel.findOneAndUpdate({ task_id: taskId }, { status: "PROCESSING" });

      // Get image metadata
      const imageMetadata = await sharp(filePath).metadata();

      // Generate base filename for processed images
      const fileNameWithoutExt = path.basename(originalFilename, path.extname(originalFilename));
      const ext = path.extname(originalFilename).toLowerCase();

      // Process and save different versions
      const versions: IVersions = {};

      // Get processed directory
      const uploadDir = path.join(__dirname, "../..", process.env.UPLOAD_DIR || "uploads");
      const processedDir = path.join(uploadDir, "processed");


      // Low quality version (max width 320px)
      const lowQualityPath = path.join(processedDir, `${taskId}_${fileNameWithoutExt}_low${ext}`);
      await sharp(filePath)
        .resize({ width: 320, withoutEnlargement: true })
        .jpeg({ quality: 60 })
        .toFile(lowQualityPath);

      const lowQualityInfo = await sharp(lowQualityPath).metadata();
      const lowQualityStats = await stat(lowQualityPath);

      versions.low = {
        path: lowQualityPath,
        width: lowQualityInfo.width || 0,
        height: lowQualityInfo.height || 0,
        size: lowQualityStats.size,
      };

      // Medium quality version (max width 800px)
      const mediumQualityPath = path.join(processedDir, `${taskId}_${fileNameWithoutExt}_medium${ext}`);
      await sharp(filePath)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(mediumQualityPath);

      const mediumQualityInfo = await sharp(mediumQualityPath).metadata();
      const mediumQualityStats = await stat(mediumQualityPath);

      versions.medium = {
        path: mediumQualityPath,
        width: mediumQualityInfo.width || 0,
        height: mediumQualityInfo.height || 0,
        size: mediumQualityStats.size,
      };

      // High quality (optimized original)
      const highQualityPath = path.join(processedDir, `${taskId}_${fileNameWithoutExt}_high${ext}`);
      await sharp(filePath).jpeg({ quality: 90 }).toFile(highQualityPath);

      const highQualityInfo = await sharp(highQualityPath).metadata();
      const highQualityStats = await stat(highQualityPath);

      versions.high_optimized = {
        path: highQualityPath,
        width: highQualityInfo.width || 0,
        height: highQualityInfo.height || 0,
        size: highQualityStats.size,
      };

      // Extract EXIF data if available
      let exifData = {};
      if (imageMetadata.exif) {
        try {
          exifData = await sharp(filePath).metadata();
        } catch (error) {
          console.warn("Could not extract EXIF data:", error);
        }
      }

      // Update task with metadata and versions
      await ImageTaskModel.findOneAndUpdate(
        { task_id: taskId },
        {
          status: "COMPLETED",
          original_metadata: {
            width: imageMetadata.width,
            height: imageMetadata.height,
            mimetype: imageMetadata.format ? `image/${imageMetadata.format}` : undefined,
            exif: exifData,
          },
          versions,
          processed_at: new Date(),
        }
      );

      // Clean up the original file
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error processing image:", error);

      // Update task with error status
      await ImageTaskModel.findOneAndUpdate(
        { task_id: taskId },
        {
          status: "FAILED",
          error_message:
            error instanceof Error ? error.message : "Unknown error during image processing",
          processed_at: new Date(),
        }
      );

      throw error;
    }
  }
}

export default ImageProcessingService;
