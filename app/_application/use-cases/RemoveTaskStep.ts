import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class RemoveTaskStep {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, stepId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    task.removeStep(stepId);
    await this.taskRepository.save(task);
  }
}
