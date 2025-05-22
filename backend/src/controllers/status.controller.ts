import { Request, Response } from "express";
import { StatusServiceFactory } from "../factories/status.service.factory";

class StatusController {
  public async getTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const { task_id } = req.params;

      if (!task_id) {
        res.status(400).json({ error: "Task ID is required" });
        return;
      }

      // Find the task in the database
      const task = await StatusServiceFactory.getTaskStatus(task_id);

      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.status(200).json(task);
      return;
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to get task status" });
    }
  }
}

export default StatusController;
