import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class AddTaskStep {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, stepText: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    task.addStep(stepText);
    await this.taskRepository.save(task);
  }
}
