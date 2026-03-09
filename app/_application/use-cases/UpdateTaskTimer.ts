import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class UpdateTaskTimer {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, remainingSeconds: number): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.updateTimerSeconds(remainingSeconds);
    await this.taskRepository.save(task);
  }
}
