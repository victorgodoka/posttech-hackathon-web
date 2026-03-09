import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class CompleteTimerCycle {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, workDuration?: number, breakDuration?: number): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.completeTimerCycle(workDuration, breakDuration);
    await this.taskRepository.save(task);
  }
}
