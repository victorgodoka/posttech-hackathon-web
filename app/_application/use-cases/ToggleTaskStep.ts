import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class ToggleTaskStep {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, stepId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    task.toggleStep(stepId);
    await this.taskRepository.save(task);
  }
}
