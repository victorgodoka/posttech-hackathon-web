import { TaskRepository } from '@/app/_domain/repositories/TaskRepository';

export class CompleteTimerCycle {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string, workDuration?: number, breakDuration?: number): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.completeTimerCycle(workDuration, breakDuration);
    await this.taskRepository.save(task);
  }
}
