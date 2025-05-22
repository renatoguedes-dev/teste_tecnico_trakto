import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

export function createImageUploadConfig(uploadDir: string) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const originalDir = path.join(uploadDir, "original");
      cb(null, originalDir);
    },
    filename: (req, file, cb) => {
      const taskId = uuidv4();
      const extension = path.extname(file.originalname);
      cb(null, `${taskId}${extension}`);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedMimes.includes(file.mimetype)) {
      const err = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);

      err.message = "Only image files are allowed";

      return cb(err);
    }

    cb(null, true);
  };

  const maxSize = parseInt(process.env.MAX_FILE_SIZE || "10485760", 10);

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize },
  });
}
