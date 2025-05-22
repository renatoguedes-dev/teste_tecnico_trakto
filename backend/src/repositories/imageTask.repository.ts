import { ImageTaskModel } from "../models/imageTask.model";

interface ITaskData {
  task_id: string;
  original_filename: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

class ImageTaskRepository {
  public async createTask(taskData: ITaskData): Promise<any> {
    const imageTask = new ImageTaskModel(taskData);
    return await imageTask.save();
  }
}

export default ImageTaskRepository;
