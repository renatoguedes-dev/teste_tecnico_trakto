import { Channel, connect, Connection } from "amqplib";

const uri = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

export class SetupRabbitMQ {
  private connection!: Connection;
  private channel!: Channel;
  private QUEUE: string = "image-processing";

  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.getConnection();
      await this.createChannel();
      await this.channel.assertQueue(this.QUEUE, { durable: false });
    } catch (err: any) {
      console.log("Error initializing RabbitMQ: " + err);
    }
  }

  private async getConnection(): Promise<void> {
    this.connection = await connect(uri);
  }

  private async createChannel(): Promise<void> {
    this.channel = await this.connection.createChannel();
  }
}
