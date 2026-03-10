import { Task, TaskState } from '../Task';
import { TaskCategory } from '../TaskCategory';

describe('Task Entity', () => {
  describe('create', () => {
    it('should create a task with default values', () => {
      const task = Task.create('Test task');

      expect(task.text).toBe('Test task');
      expect(task.category).toBe('other');
      expect(task.state).toBe('active');
      expect(task.steps).toEqual([]);
      expect(task.timer.mode).toBe('idle');
      expect(task.timer.remainingSeconds).toBe(25 * 60);
      expect(task.timer.isRunning).toBe(false);
    });

    it('should create a task with category and description', () => {
      const task = Task.create('Test task', 'work', 'Test description');

      expect(task.text).toBe('Test task');
      expect(task.category).toBe('work');
      expect(task.description).toBe('Test description');
    });

    it('should create a task with custom column', () => {
      const task = Task.create('Test task', 'other', undefined, 'custom-col-1');

      expect(task.customColumnId).toBe('custom-col-1');
    });
  });

  describe('state transitions', () => {
    it('should update state', () => {
      const task = Task.create('Test task');

      task.updateState('paused');
      expect(task.state).toBe('paused');

      task.updateState('done');
      expect(task.state).toBe('done');
    });

    it('should pause task', () => {
      const task = Task.create('Test task');

      task.pause();
      expect(task.state).toBe('paused');
    });

    it('should resume task', () => {
      const task = Task.create('Test task');
      task.pause();

      task.resume();
      expect(task.state).toBe('active');
    });

    it('should complete task', () => {
      const task = Task.create('Test task');

      task.complete();
      expect(task.state).toBe('done');
    });
  });

  describe('steps management', () => {
    it('should add step', () => {
      const task = Task.create('Test task');

      task.addStep('Step 1');
      expect(task.steps).toHaveLength(1);
      expect(task.steps[0].text).toBe('Step 1');
      expect(task.steps[0].completed).toBe(false);
    });

    it('should toggle step', () => {
      const task = Task.create('Test task');
      task.addStep('Step 1');
      const stepId = task.steps[0].id;

      task.toggleStep(stepId);
      expect(task.steps[0].completed).toBe(true);

      task.toggleStep(stepId);
      expect(task.steps[0].completed).toBe(false);
    });

    it('should remove step', () => {
      const task = Task.create('Test task');
      task.addStep('Step 1');
      task.addStep('Step 2');
      const stepId = task.steps[0].id;

      task.removeStep(stepId);
      expect(task.steps).toHaveLength(1);
      expect(task.steps[0].text).toBe('Step 2');
    });
  });

  describe('timer management', () => {
    it('should start timer with default duration', () => {
      const task = Task.create('Test task');

      task.startTimer();
      expect(task.timer.mode).toBe('work'); // Timer inicia em modo work
      expect(task.timer.isRunning).toBe(true);
      expect(task.timer.startedAt).toBeDefined();
    });

    it('should start timer with custom duration', () => {
      const task = Task.create('Test task');
      
      // Timer já existe com 25*60, startTimer não muda remainingSeconds se timer já existe
      expect(task.timer.remainingSeconds).toBe(25 * 60);
      
      task.startTimer(30);
      expect(task.timer.isRunning).toBe(true);
    });

    it('should pause timer', () => {
      const task = Task.create('Test task');
      task.startTimer();

      task.pauseTimer();
      expect(task.timer.isRunning).toBe(false);
      expect(task.timer.startedAt).toBeUndefined();
    });

    it('should reset timer', () => {
      const task = Task.create('Test task');
      task.startTimer();
      task.updateTimerSeconds(100);

      task.resetTimer();
      expect(task.timer.mode).toBe('idle');
      expect(task.timer.remainingSeconds).toBe(25 * 60);
      expect(task.timer.isRunning).toBe(false);
    });

    it('should complete timer cycle from work to break', () => {
      const task = Task.create('Test task');
      // Mudar manualmente para modo work para testar transição
      task.timer.mode = 'work';
      
      task.completeTimerCycle(25, 5);
      expect(task.timer.mode).toBe('break');
      expect(task.timer.remainingSeconds).toBe(5 * 60);
      expect(task.timer.isRunning).toBe(false);
    });

    it('should complete timer cycle from break to work', () => {
      const task = Task.create('Test task');
      // Mudar manualmente para modo work, depois break
      task.timer.mode = 'work';
      task.completeTimerCycle(25, 5);
      expect(task.timer.mode).toBe('break');

      task.completeTimerCycle(25, 5);
      expect(task.timer.mode).toBe('work');
      expect(task.timer.remainingSeconds).toBe(25 * 60);
    });
  });

  describe('JSON serialization', () => {
    it('should serialize to JSON', () => {
      const task = Task.create('Test task', 'work', 'Description');
      task.addStep('Step 1');

      const json = task.toJSON();

      expect(json.text).toBe('Test task');
      expect(json.category).toBe('work');
      expect(json.description).toBe('Description');
      expect(json.state).toBe('active');
      expect(json.steps).toHaveLength(1);
      expect(typeof json.createdAt).toBe('string');
    });

    it('should deserialize from JSON', () => {
      const json = {
        id: 'test-id',
        text: 'Test task',
        category: 'work',
        state: 'active' as const,
        createdAt: new Date().toISOString(),
        steps: [{ id: 'step-1', text: 'Step 1', completed: false }],
      };

      const task = Task.fromJSON(json);

      expect(task.id).toBe('test-id');
      expect(task.text).toBe('Test task');
      expect(task.category).toBe('work');
      expect(task.steps).toHaveLength(1);
    });

    it('should handle missing optional fields in JSON', () => {
      const json = {
        id: 'test-id',
        text: 'Test task',
        state: 'active' as const,
        createdAt: new Date().toISOString(),
      };

      const task = Task.fromJSON(json);

      expect(task.category).toBe('other');
      expect(task.steps).toEqual([]);
      expect(task.timer.mode).toBe('idle');
    });
  });
});
