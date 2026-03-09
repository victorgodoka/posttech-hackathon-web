import { GetTasks } from '../GetTasks';
import { ITaskRepository } from '../../../_domain/repositories/ITaskRepository';
import { Task } from '../../../_domain/entities/Task';

describe('GetTasks Use Case', () => {
  let getTasks: GetTasks;
  let mockRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    getTasks = new GetTasks(mockRepository);
  });

  it('should return all tasks', async () => {
    const mockTasks = [
      Task.create('Task 1'),
      Task.create('Task 2'),
      Task.create('Task 3'),
    ];
    mockRepository.findAll.mockResolvedValue(mockTasks);

    const result = await getTasks.execute();

    expect(result).toEqual(mockTasks);
    expect(result).toHaveLength(3);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no tasks exist', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await getTasks.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should throw error if repository fails', async () => {
    mockRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(getTasks.execute()).rejects.toThrow('Database error');
  });
});
