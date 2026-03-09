import { UpdateTaskState } from '../UpdateTaskState';
import { ITaskRepository } from '../../../_domain/repositories/ITaskRepository';
import { Task } from '../../../_domain/entities/Task';

describe('UpdateTaskState Use Case', () => {
  let updateTaskState: UpdateTaskState;
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
    updateTaskState = new UpdateTaskState(mockRepository);
  });

  it('should pause a task', async () => {
    await updateTaskState.execute(mockTask.id, 'paused');

    expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
    expect(mockTask.state).toBe('paused');
    expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
  });

  it('should resume a task', async () => {
    mockTask.pause();

    await updateTaskState.execute(mockTask.id, 'active');

    expect(mockTask.state).toBe('active');
    expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
  });

  it('should complete a task', async () => {
    await updateTaskState.execute(mockTask.id, 'done');

    expect(mockTask.state).toBe('done');
    expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
  });

  it('should throw error if task not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(
      updateTaskState.execute('non-existent-id', 'done')
    ).rejects.toThrow('Tarefa não encontrada');
  });

  it('should not throw if repository save fails', async () => {
    mockRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(
      updateTaskState.execute(mockTask.id, 'done')
    ).rejects.toThrow('Database error');
  });
});
