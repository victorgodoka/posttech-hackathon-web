import { StartTaskTimer } from '../StartTaskTimer';
import { PauseTaskTimer } from '../PauseTaskTimer';
import { ResetTaskTimer } from '../ResetTaskTimer';
import { CompleteTimerCycle } from '../CompleteTimerCycle';
import { ITaskRepository } from '../../../_domain/repositories/ITaskRepository';
import { Task } from '../../../_domain/entities/Task';

describe('Timer Use Cases', () => {
  let mockRepository: jest.Mocked<ITaskRepository>;
  let mockTask: Task;

  beforeEach(() => {
    mockTask = Task.create('Test task');
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockTask),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('StartTaskTimer', () => {
    let startTaskTimer: StartTaskTimer;

    beforeEach(() => {
      startTaskTimer = new StartTaskTimer(mockRepository);
    });

    it('should start timer with default duration', async () => {
      await startTaskTimer.execute(mockTask.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
      expect(mockTask.timer.isRunning).toBe(true);
      expect(mockTask.timer.startedAt).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should start timer with custom duration', async () => {
      await startTaskTimer.execute(mockTask.id, 30);

      expect(mockTask.timer.isRunning).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should throw error if task not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        startTaskTimer.execute('non-existent-id')
      ).rejects.toThrow('Task not found');
    });
  });

  describe('PauseTaskTimer', () => {
    let pauseTaskTimer: PauseTaskTimer;

    beforeEach(() => {
      pauseTaskTimer = new PauseTaskTimer(mockRepository);
    });

    it('should pause running timer', async () => {
      mockTask.startTimer();

      await pauseTaskTimer.execute(mockTask.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
      expect(mockTask.timer.isRunning).toBe(false);
      expect(mockTask.timer.startedAt).toBeUndefined();
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should throw error if task not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        pauseTaskTimer.execute('non-existent-id')
      ).rejects.toThrow('Task not found');
    });
  });

  describe('ResetTaskTimer', () => {
    let resetTaskTimer: ResetTaskTimer;

    beforeEach(() => {
      resetTaskTimer = new ResetTaskTimer(mockRepository);
    });

    it('should reset timer to default duration', async () => {
      mockTask.startTimer();
      mockTask.updateTimerSeconds(100);

      await resetTaskTimer.execute(mockTask.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
      expect(mockTask.timer.mode).toBe('idle');
      expect(mockTask.timer.remainingSeconds).toBe(25 * 60);
      expect(mockTask.timer.isRunning).toBe(false);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should reset timer to custom duration', async () => {
      mockTask.startTimer();

      await resetTaskTimer.execute(mockTask.id, 30);

      expect(mockTask.timer.remainingSeconds).toBe(30 * 60);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should throw error if task not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        resetTaskTimer.execute('non-existent-id')
      ).rejects.toThrow('Task not found');
    });
  });

  describe('CompleteTimerCycle', () => {
    let completeTimerCycle: CompleteTimerCycle;

    beforeEach(() => {
      completeTimerCycle = new CompleteTimerCycle(mockRepository);
    });

    it('should complete cycle from work to break', async () => {
      mockTask.timer.mode = 'work';

      await completeTimerCycle.execute(mockTask.id, 25, 5);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockTask.id);
      expect(mockTask.timer.mode).toBe('break');
      expect(mockTask.timer.remainingSeconds).toBe(5 * 60);
      expect(mockTask.timer.isRunning).toBe(false);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should complete cycle from break to work', async () => {
      mockTask.timer.mode = 'break';

      await completeTimerCycle.execute(mockTask.id, 25, 5);

      expect(mockTask.timer.mode).toBe('work');
      expect(mockTask.timer.remainingSeconds).toBe(25 * 60);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should use default durations if not provided', async () => {
      mockTask.timer.mode = 'work';

      await completeTimerCycle.execute(mockTask.id);

      expect(mockTask.timer.mode).toBe('break');
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should throw error if task not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        completeTimerCycle.execute('non-existent-id')
      ).rejects.toThrow('Task not found');
    });
  });
});
