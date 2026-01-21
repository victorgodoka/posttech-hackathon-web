import { TaskRepository } from '@/app/_domain/repositories/TaskRepository';

export class UpdateTaskTimer {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string, remainingSeconds: number): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.updateTimerSeconds(remainingSeconds);
    await this.taskRepository.save(task);
  }
}
