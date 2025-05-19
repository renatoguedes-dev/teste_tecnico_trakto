import { RabbitMQServiceFactory } from "../factories/rabbitmq.service.factory";

class UploadService {
  async sendToQueue(file: Express.Multer.File) {
    console.log("log no upload.service.ts");
    console.log(file);

    await RabbitMQServiceFactory.sendToQueue(file);
  }
}

export default UploadService;
