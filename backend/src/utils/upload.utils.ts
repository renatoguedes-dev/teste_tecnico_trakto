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
    const allowedFileTypes = {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    };

    const allowedExtensions = Object.values(allowedFileTypes).flat();

    function verifyExtensions() {
      let extension = path.extname(file.originalname);

      if (allowedExtensions.includes(extension)) {
        cb(null, true);
      } else {
        const err = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);
        err.message = "Only image files are allowed";

        cb(err);
      }
    }

    verifyExtensions();
  };

  const maxSize = parseInt(process.env.MAX_FILE_SIZE || "10485760", 10);

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize },
  });
}
