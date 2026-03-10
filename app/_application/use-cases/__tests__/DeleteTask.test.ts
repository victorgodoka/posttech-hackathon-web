import { DeleteTask } from '../DeleteTask';
import { ITaskRepository } from '../../../_domain/repositories/ITaskRepository';

describe('DeleteTask Use Case', () => {
  let deleteTask: DeleteTask;
  let mockRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    deleteTask = new DeleteTask(mockRepository);
  });

  it('should delete task by id', async () => {
    const taskId = 'task-123';
    const mockTask = { id: taskId, text: 'Test task' } as any;
    mockRepository.findById.mockResolvedValue(mockTask);

    await deleteTask.execute(taskId);

    expect(mockRepository.delete).toHaveBeenCalledWith(taskId);
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should propagate repository errors', async () => {
    const mockTask = { id: 'task-123', text: 'Test task' } as any;
    mockRepository.findById.mockResolvedValue(mockTask);
    mockRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(
      deleteTask.execute('task-123')
    ).rejects.toThrow('Database error');
  });
});
