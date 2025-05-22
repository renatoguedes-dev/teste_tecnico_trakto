import { Router } from "express";
import StatusController from "../controllers/status.controller";

const statusController = new StatusController();

const statusRouter = Router();

statusRouter.get("/:task_id", statusController.getTaskStatus);

export default statusRouter;
