import { Task } from '@/app/_domain/entities/Task';
import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class AddTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(text: string): Promise<Task> {
    const task = Task.create(text);
    await this.taskRepository.save(task);
    return task;
  }
}
