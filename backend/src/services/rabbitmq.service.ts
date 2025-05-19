import { Channel, connect, Connection } from "amqplib";

class RabbitMQService {
  private static instance: RabbitMQService;
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly url: string;
  private QUEUE_NAME: string;

  private constructor() {
    this.url = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
    this.QUEUE_NAME = process.env.RABBITMQ_QUEUE_NAME || "image-processing";
  }

  // Get the singleton instance of RabbitMQService
  public static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  // Connect to RabbitMQ server
  public async connect(): Promise<void> {
    try {
      this.connection = await connect(this.url);
      this.channel = await this.connection.createChannel();

      // Assert queue exists
      await this.channel.assertQueue(this.QUEUE_NAME, {
        durable: true,
      });

      console.log("Connected to RabbitMQ");
    } catch (error) {
      console.error("RabbitMQ connection error:", error);
      throw error;
    }
  }

  // Send a message to the queue
  public async sendToQueue(message: any): Promise<boolean> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      return this.channel!.sendToQueue(this.QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
    } catch (err: any) {
      console.error("Error sending message to queue:", err);
      throw err;
    }
  }

  // Consume messages from queue
  public async consumeFromQueue(callback: (message: any) => Promise<void>): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel!.prefetch(1);

      console.log(`Waiting for messages in queue: ${this.QUEUE_NAME}`);

      this.channel!.consume(this.QUEUE_NAME, async (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());

          try {
            await callback(content);
            this.channel!.ack(msg);
          } catch (error) {
            console.error("Error processing message:", error);
            // Negative acknowledgment, message will be requeued
            this.channel!.nack(msg, false, true);
          }
        }
      });
    } catch (error) {
      console.error("Error consuming from queue:", error);
      throw error;
    }
  }

  // Close the connection to RabbitMQ
  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log("Disconnected from RabbitMQ");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
      throw error;
    }
  }
}

export default RabbitMQService;
