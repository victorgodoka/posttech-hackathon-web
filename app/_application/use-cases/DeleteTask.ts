import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class DeleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    await this.taskRepository.delete(taskId);
  }
}
