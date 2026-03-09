import { Task } from '../Task';

describe('Task Entity - Extended Coverage', () => {
  describe('updateCustomColumnId', () => {
    it('should update custom column id', () => {
      const task = Task.create('Test task');
      
      task.updateCustomColumnId('custom-col-1');
      
      expect(task.customColumnId).toBe('custom-col-1');
    });

    it('should update to empty string', () => {
      const task = Task.create('Test task', 'work', undefined, 'col-1');
      
      task.updateCustomColumnId('');
      
      expect(task.customColumnId).toBe('');
    });

    it('should update multiple times', () => {
      const task = Task.create('Test task');
      
      task.updateCustomColumnId('col-1');
      expect(task.customColumnId).toBe('col-1');
      
      task.updateCustomColumnId('col-2');
      expect(task.customColumnId).toBe('col-2');
    });
  });

  describe('timer with usePomodoro false', () => {
    it('should create task without pomodoro', () => {
      const task = Task.create('Test task', 'work', undefined, undefined, false);
      
      expect(task.usePomodoro).toBe(false);
    });

    it('should create task with pomodoro by default', () => {
      const task = Task.create('Test task');
      
      expect(task.usePomodoro).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle task with all optional parameters', () => {
      const task = Task.create(
        'Complete task',
        'work',
        'Detailed description',
        'custom-col-1',
        true
      );
      
      expect(task.text).toBe('Complete task');
      expect(task.category).toBe('work');
      expect(task.description).toBe('Detailed description');
      expect(task.customColumnId).toBe('custom-col-1');
      expect(task.usePomodoro).toBe(true);
    });

    it('should handle empty description', () => {
      const task = Task.create('Test', 'work', '');
      
      expect(task.description).toBe('');
    });

    it('should maintain timer state through serialization', () => {
      const task = Task.create('Test task');
      task.startTimer();
      task.updateTimerSeconds(500);
      
      const json = task.toJSON();
      const restored = Task.fromJSON(json);
      
      expect(restored.timer.remainingSeconds).toBe(500);
      expect(restored.timer.isRunning).toBe(true);
    });
  });

  describe('fromPersistence', () => {
    it('should create task from persistence data', () => {
      const now = new Date();
      const task = Task.fromPersistence({
        id: 'task-123',
        text: 'Persisted task',
        description: 'Description',
        category: 'work',
        state: 'active',
        createdAt: now,
        steps: [],
        timer: {
          mode: 'idle',
          remainingSeconds: 1500,
          isRunning: false,
        },
        usePomodoro: true,
      });
      
      expect(task.id).toBe('task-123');
      expect(task.text).toBe('Persisted task');
      expect(task.category).toBe('work');
      expect(task.createdAt).toBe(now);
    });

    it('should restore custom column from persistence', () => {
      const task = Task.fromPersistence({
        id: 'task-123',
        text: 'Task',
        category: 'work',
        state: 'active',
        createdAt: new Date(),
        steps: [],
        timer: {
          mode: 'idle',
          remainingSeconds: 1500,
          isRunning: false,
        },
        customColumnId: 'col-1',
        usePomodoro: true,
      });
      
      expect(task.customColumnId).toBe('col-1');
    });
  });
});
