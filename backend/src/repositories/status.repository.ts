import { ImageTaskModel } from "../models/imageTask.model";

class StatusRepository {
  public async getByTaskById(task_id: string) {
    return await ImageTaskModel.findOne({ task_id });
  }
}

export default StatusRepository;
