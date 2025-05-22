import { StatusRepositoryFactory } from "../factories/status.repository.factory";

interface ISafeTaskData {
  task_id: string;
  status: string;
}

class StatusService {
  async getTaskStatus(task_id: string): Promise<ISafeTaskData | null> {
    const task = await StatusRepositoryFactory.getByTaskById(task_id);

    if (!task) {
      return null;
    }

    const safeTaskData = {
      task_id: task.task_id,
      status: task.status,
    };

    return safeTaskData;
  }
}

export default StatusService;
