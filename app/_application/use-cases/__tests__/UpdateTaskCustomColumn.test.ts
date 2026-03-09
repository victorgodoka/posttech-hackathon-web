import { UpdateTaskCustomColumn } from '../UpdateTaskCustomColumn';
import { ITaskRepository } from '../../../_domain/repositories/ITaskRepository';
import { Task } from '../../../_domain/entities/Task';

describe('UpdateTaskCustomColumn Use Case', () => {
  let updateTaskCustomColumn: UpdateTaskCustomColumn;
  let mockRepository: jest.Mocked<ITaskRepository>;
  let mockTask: Task;

  beforeEach(() => {
    mockTask = Task.create('Test task');
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockTask),
      save: jest.fn(),
      delete: jest.fn(),
    };
    updateTaskCustomColumn = new UpdateTaskCustomColumn(mockRepository);
  });

  it('should update task custom column', async () => {
    const customColumnId = 'custom-col-1';

    const result = await updateTaskCustomColumn.execute(mockTask.id, customColumnId);

    expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
    expect(result.customColumnId).toBe(customColumnId);
    expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
  });

  it('should return updated task', async () => {
    const result = await updateTaskCustomColumn.execute(mockTask.id, 'col-2');

    expect(result).toBe(mockTask);
    expect(result).toBeInstanceOf(Task);
  });

  it('should throw error if task not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(
      updateTaskCustomColumn.execute('non-existent-id', 'col-1')
    ).rejects.toThrow('Task not found');
  });

  it('should handle empty custom column id', async () => {
    const result = await updateTaskCustomColumn.execute(mockTask.id, '');

    expect(result.customColumnId).toBe('');
    expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
  });
});
