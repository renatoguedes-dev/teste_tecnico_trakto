import { RabbitMQServiceFactory } from "../factories/rabbitmq.service.factory";

class UploadService {
  async sendToQueue(file: Express.Multer.File) {
    await RabbitMQServiceFactory.sendToQueue(file);
  }
}

export default UploadService;
