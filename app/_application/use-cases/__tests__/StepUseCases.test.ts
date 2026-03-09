import { AddTaskStep } from '../AddTaskStep';
import { ToggleTaskStep } from '../ToggleTaskStep';
import { RemoveTaskStep } from '../RemoveTaskStep';
import { ITaskRepository } from '../../../_domain/repositories/ITaskRepository';
import { Task } from '../../../_domain/entities/Task';

describe('Step Use Cases', () => {
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
  });

  describe('AddTaskStep', () => {
    let addTaskStep: AddTaskStep;

    beforeEach(() => {
      addTaskStep = new AddTaskStep(mockRepository);
    });

    it('should add step to task', async () => {
      const stepText = 'New step';

      await addTaskStep.execute(mockTask.id, stepText);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
      expect(mockTask.steps).toHaveLength(1);
      expect(mockTask.steps[0].text).toBe(stepText);
      expect(mockTask.steps[0].completed).toBe(false);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should add multiple steps', async () => {
      await addTaskStep.execute(mockTask.id, 'Step 1');
      await addTaskStep.execute(mockTask.id, 'Step 2');

      expect(mockTask.steps).toHaveLength(2);
      expect(mockTask.steps[0].text).toBe('Step 1');
      expect(mockTask.steps[1].text).toBe('Step 2');
    });

    it('should throw error if task not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        addTaskStep.execute('non-existent-id', 'Step')
      ).rejects.toThrow('Tarefa não encontrada');
    });
  });

  describe('ToggleTaskStep', () => {
    let toggleTaskStep: ToggleTaskStep;

    beforeEach(() => {
      toggleTaskStep = new ToggleTaskStep(mockRepository);
    });

    it('should toggle step from incomplete to complete', async () => {
      mockTask.addStep('Test step');
      const stepId = mockTask.steps[0].id;

      await toggleTaskStep.execute(mockTask.id, stepId);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
      expect(mockTask.steps[0].completed).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should toggle step from complete to incomplete', async () => {
      mockTask.addStep('Test step');
      const stepId = mockTask.steps[0].id;
      mockTask.toggleStep(stepId); // Complete it first

      await toggleTaskStep.execute(mockTask.id, stepId);

      expect(mockTask.steps[0].completed).toBe(false);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should throw error if task not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        toggleTaskStep.execute('non-existent-id', 'step-id')
      ).rejects.toThrow('Tarefa não encontrada');
    });
  });

  describe('RemoveTaskStep', () => {
    let removeTaskStep: RemoveTaskStep;

    beforeEach(() => {
      removeTaskStep = new RemoveTaskStep(mockRepository);
    });

    it('should remove step from task', async () => {
      mockTask.addStep('Step 1');
      mockTask.addStep('Step 2');
      const stepIdToRemove = mockTask.steps[0].id;

      await removeTaskStep.execute(mockTask.id, stepIdToRemove);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
      expect(mockTask.steps).toHaveLength(1);
      expect(mockTask.steps[0].text).toBe('Step 2');
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should handle removing non-existent step gracefully', async () => {
      mockTask.addStep('Step 1');

      await removeTaskStep.execute(mockTask.id, 'non-existent-step-id');

      expect(mockTask.steps).toHaveLength(1);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should throw error if task not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        removeTaskStep.execute('non-existent-id', 'step-id')
      ).rejects.toThrow('Tarefa não encontrada');
    });
  });
});
