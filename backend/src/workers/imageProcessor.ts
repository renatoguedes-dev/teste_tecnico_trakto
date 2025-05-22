import dotenv from "dotenv";
import RabbitMQService from "../services/rabbitmq.service";
import { RabbitMQServiceFactory } from "../factories/rabbitmq.service.factory";
import { ImageProcessingServiceFactory } from "../factories/imageProcessing.service.factory";

dotenv.config();

// Worker class for processing images from the queue
class ImageProcessorWorker {
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.rabbitMQService = RabbitMQServiceFactory;
    this.initialize();
  }

  // Initialize the worker
  private async initialize(): Promise<void> {
    try {
      // Connect to RabbitMQ
      await this.rabbitMQService.connect();

      // Start consuming messages
      await this.startConsumer();
    } catch (err: any) {
      console.error("Failed to initialize image processor worker:", err);
      // Attempt to reconnect after a delay
      setTimeout(() => this.initialize(), 5000);
    }
  }

  // Start consuming messages from the queue
  private async startConsumer(): Promise<void> {
    try {
      await this.rabbitMQService.consumeFromQueue(async (message) => {
        console.log("Received message:", message);

        const { taskId, path: filePath, originalname } = message;

        if (!taskId || !filePath || !originalname) {
          throw new Error("Invalid message format: missing required fields");
        }

        // Process the image
        await ImageProcessingServiceFactory.processImage(taskId, filePath, originalname);

        console.log(`Successfully processed image: ${originalname}`);
      });
    } catch (err: any) {
      console.error("Error in consumer:", err);
      // Attempt to restart consumer in case of error
      setTimeout(() => this.startConsumer(), 5000);
    }
  }
}

// Create and start the worker
const worker = new ImageProcessorWorker();

// Handle process termination
process.on("SIGINT", async () => {
  console.log("Shutting down worker...");
  await RabbitMQService.getInstance().close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down worker...");
  await RabbitMQService.getInstance().close();
  process.exit(0);
});

export default worker;
