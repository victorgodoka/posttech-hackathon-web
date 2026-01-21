import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class DeleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    await this.taskRepository.delete(taskId);
  }
}
