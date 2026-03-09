import { UpdateTaskTimer } from '../UpdateTaskTimer';
import { TaskRepository } from '../../../_domain/repositories/TaskRepository';
import { Task } from '../../../_domain/entities/Task';

describe('UpdateTaskTimer Use Case', () => {
  let updateTaskTimer: UpdateTaskTimer;
  let mockRepository: jest.Mocked<TaskRepository>;
  let mockTask: Task;

  beforeEach(() => {
    mockTask = Task.create('Test task');
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockTask),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;
    updateTaskTimer = new UpdateTaskTimer(mockRepository);
  });

  it('should update timer seconds', async () => {
    const newSeconds = 600; // 10 minutes

    await updateTaskTimer.execute(mockTask.id, newSeconds);

    expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
    expect(mockTask.timer.remainingSeconds).toBe(newSeconds);
    expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
  });

  it('should update to zero seconds', async () => {
    await updateTaskTimer.execute(mockTask.id, 0);

    expect(mockTask.timer.remainingSeconds).toBe(0);
    expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
  });

  it('should update to large number of seconds', async () => {
    const largeSeconds = 3600; // 1 hour

    await updateTaskTimer.execute(mockTask.id, largeSeconds);

    expect(mockTask.timer.remainingSeconds).toBe(largeSeconds);
    expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
  });

  it('should throw error if task not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(
      updateTaskTimer.execute('non-existent-id', 600)
    ).rejects.toThrow('Task not found');
  });

  it('should handle repository save errors', async () => {
    mockRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(
      updateTaskTimer.execute(mockTask.id, 600)
    ).rejects.toThrow('Database error');
  });
});
