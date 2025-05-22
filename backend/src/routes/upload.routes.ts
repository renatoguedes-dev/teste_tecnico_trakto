import { Router } from "express";
import UploadController from "../controllers/upload.controller";

const uploadController = new UploadController();

const uploadRouter = Router();

// Configure upload middleware
const upload = uploadController.configureStorage();

uploadRouter.post("/", upload.single("image"), uploadController.uploadImage);

export default uploadRouter;
