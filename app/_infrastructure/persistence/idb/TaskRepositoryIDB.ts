import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';
import { Task } from '@/app/_domain/entities/Task';
import { getDB } from './db';

export class TaskRepositoryIDB implements ITaskRepository {
  async save(task: Task): Promise<void> {
    const db = await getDB();
    await db.put('tasks', task.toJSON());
  }

  async findAll(): Promise<Task[]> {
    const db = await getDB();
    const tasksData = await db.getAll('tasks');
    return tasksData.map(data => Task.fromJSON(data));
  }

  async findById(id: string): Promise<Task | null> {
    const db = await getDB();
    const taskData = await db.get('tasks', id);
    
    if (!taskData) {
      return null;
    }

    return Task.fromJSON(taskData);
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('tasks', id);
  }
}
