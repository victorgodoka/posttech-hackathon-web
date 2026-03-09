import { AddTask } from '../AddTask';
import { ITaskRepository } from '../../../_domain/repositories/ITaskRepository';
import { Task } from '../../../_domain/entities/Task';

describe('AddTask Use Case', () => {
  let addTask: AddTask;
  let mockRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    addTask = new AddTask(mockRepository);
  });

  it('should create and save a task with minimal data', async () => {
    const text = 'Test task';

    await addTask.execute(text);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    const savedTask = mockRepository.save.mock.calls[0][0];
    expect(savedTask).toBeInstanceOf(Task);
    expect(savedTask.text).toBe(text);
    expect(savedTask.category).toBe('other');
    expect(savedTask.state).toBe('active');
  });

  it('should create task with category', async () => {
    const text = 'Work task';
    const category = 'work';

    await addTask.execute(text, category);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    const savedTask = mockRepository.save.mock.calls[0][0];
    expect(savedTask.text).toBe(text);
    expect(savedTask.category).toBe(category);
  });

  it('should create task with description', async () => {
    const text = 'Task with description';
    const category = 'study';
    const description = 'Detailed description';

    await addTask.execute(text, category, description);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    const savedTask = mockRepository.save.mock.calls[0][0];
    expect(savedTask.text).toBe(text);
    expect(savedTask.category).toBe(category);
    expect(savedTask.description).toBe(description);
  });

  it('should create task with custom column', async () => {
    const text = 'Custom column task';
    const category = 'other';
    const description = undefined;
    const customColumnId = 'custom-col-1';

    await addTask.execute(text, category, description, customColumnId);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    const savedTask = mockRepository.save.mock.calls[0][0];
    expect(savedTask.customColumnId).toBe(customColumnId);
  });

  it('should throw error if repository save fails', async () => {
    mockRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(addTask.execute('Test task')).rejects.toThrow('Database error');
  });
});
