import { ImageTaskRepositoryFactory } from "../factories/imageTask.repository.factory";
import { RabbitMQServiceFactory } from "../factories/rabbitmq.service.factory";

class UploadService {
  async sendToQueue(file: Express.Multer.File) {
    try {
      const taskId = file.filename.split(".")[0];

      const message = {
        taskId,
        ...file,
      };

      await ImageTaskRepositoryFactory.createTask({
        task_id: taskId,
        original_filename: file.originalname,
        status: "PENDING",
      });

      await RabbitMQServiceFactory.sendToQueue(message);

      return { task_id: taskId, status: "PENDING" };
    } catch (err: any) {
      const error: any = new Error(err.message || "Failed to process upload");
      error.statusCode = 500;

      if (err.name === "ValidationError") {
        error.statusCode = 400;
      } else if (err.name === "ConnectionError") {
        error.statusCode = 503;
      }

      // Throw the error to be caught by the error handler middleware
      throw error;
    }
  }
}

export default UploadService;
