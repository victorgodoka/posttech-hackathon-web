import { Task } from '@/app/_domain/entities/Task';
import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class UpdateTaskCustomColumn {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, customColumnId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.updateCustomColumnId(customColumnId);
    await this.taskRepository.save(task);
    return task;
  }
}
