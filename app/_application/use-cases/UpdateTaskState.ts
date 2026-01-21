import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';
import { TaskState } from '@/app/_domain/entities/Task';

export class UpdateTaskState {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, newState: TaskState): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    if (newState === 'paused') {
      task.pause();
    } else if (newState === 'active') {
      task.resume();
    } else if (newState === 'done') {
      task.complete();
    }

    await this.taskRepository.save(task);
  }
}
