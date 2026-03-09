import { Task } from '@/app/_domain/entities/Task';
import { TaskCategory } from '@/app/_domain/entities/TaskCategory';
import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class AddTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(
    text: string, 
    category: TaskCategory = 'other', 
    description?: string, 
    customColumnId?: string
  ): Promise<void> {
    const task = Task.create(text, category, description, customColumnId);
    await this.taskRepository.save(task);
  }
}
