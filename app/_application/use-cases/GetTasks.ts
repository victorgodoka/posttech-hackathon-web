import { Task } from '@/app/_domain/entities/Task';
import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';

export class GetTasks {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }
}
