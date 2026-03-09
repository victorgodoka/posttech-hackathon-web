import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class PauseTaskTimer {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.pauseTimer();
    await this.taskRepository.save(task);
  }
}
