import { TaskRepository } from '@/app/_domain/repositories/TaskRepository';

export class ResetTaskTimer {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.resetTimer();
    await this.taskRepository.save(task);
  }
}
