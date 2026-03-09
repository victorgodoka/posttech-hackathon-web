import { TaskRepository } from '@/app/_domain/repositories/TaskRepository';

export class ResetTaskTimer {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string, workDuration?: number): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.resetTimer(workDuration);
    await this.taskRepository.save(task);
  }
}
