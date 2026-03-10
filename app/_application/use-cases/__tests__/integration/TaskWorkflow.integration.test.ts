/**
 * Testes de Integração - Fluxo Completo de Tarefas
 * 
 * Testa o fluxo completo de criação, atualização e gerenciamento de tarefas
 * sem mocks, usando repositórios reais (IndexedDB em memória)
 */

import { AddTask } from '../../AddTask';
import { GetTasks } from '../../GetTasks';
import { UpdateTaskState } from '../../UpdateTaskState';
import { DeleteTask } from '../../DeleteTask';
import { AddTaskStep } from '../../AddTaskStep';
import { TaskRepositoryIDB } from '../../../../_infrastructure/persistence/idb/TaskRepositoryIDB';

describe('Task Workflow Integration Tests', () => {
  let taskRepository: TaskRepositoryIDB;
  let addTask: AddTask;
  let getTasks: GetTasks;
  let updateTaskState: UpdateTaskState;
  let deleteTask: DeleteTask;
  let addTaskStep: AddTaskStep;

  beforeEach(() => {
    // Usar repositório real (IndexedDB em memória para testes)
    taskRepository = new TaskRepositoryIDB();
    addTask = new AddTask(taskRepository);
    getTasks = new GetTasks(taskRepository);
    updateTaskState = new UpdateTaskState(taskRepository);
    deleteTask = new DeleteTask(taskRepository);
    addTaskStep = new AddTaskStep(taskRepository);
  });

  describe('Complete Task Lifecycle', () => {
    it('should create, update, and complete a task', async () => {
      // 1. Criar tarefa
      const taskText = 'Integration Test Task';
      await addTask.execute(taskText, 'work', 'Test description');

      // 2. Buscar tarefas
      const tasks = await getTasks.execute();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].text).toBe(taskText);
      expect(tasks[0].state).toBe('active');

      // 3. Adicionar step
      const taskId = tasks[0].id;
      await addTaskStep.execute(taskId, 'First step');

      // 4. Atualizar para paused
      await updateTaskState.execute(taskId, 'paused');
      const pausedTasks = await getTasks.execute();
      expect(pausedTasks[0].state).toBe('paused');

      // 5. Completar tarefa
      await updateTaskState.execute(taskId, 'done');
      const completedTasks = await getTasks.execute();
      expect(completedTasks[0].state).toBe('done');

      // 6. Deletar tarefa
      await deleteTask.execute(taskId);
      const finalTasks = await getTasks.execute();
      expect(finalTasks).toHaveLength(0);
    });

    it('should handle multiple tasks with different states', async () => {
      // Criar múltiplas tarefas
      await addTask.execute('Task 1', 'work');
      await addTask.execute('Task 2', 'study');
      await addTask.execute('Task 3', 'personal');

      const tasks = await getTasks.execute();
      expect(tasks).toHaveLength(3);

      // Atualizar estados diferentes
      await updateTaskState.execute(tasks[0].id, 'paused');
      await updateTaskState.execute(tasks[1].id, 'done');
      // tasks[2] permanece 'active'

      const updatedTasks = await getTasks.execute();
      const states = updatedTasks.map(t => t.state);
      expect(states).toContain('active');
      expect(states).toContain('paused');
      expect(states).toContain('done');
    });
  });

  describe('Task Steps Management', () => {
    it('should add and manage multiple steps', async () => {
      // Criar tarefa
      await addTask.execute('Task with steps', 'work');
      const tasks = await getTasks.execute();
      const taskId = tasks[0].id;

      // Adicionar múltiplos steps
      await addTaskStep.execute(taskId, 'Step 1');
      await addTaskStep.execute(taskId, 'Step 2');
      await addTaskStep.execute(taskId, 'Step 3');

      // Verificar steps
      const updatedTasks = await getTasks.execute();
      const task = updatedTasks.find(t => t.id === taskId);
      expect(task?.steps).toHaveLength(3);
      expect(task?.steps[0].text).toBe('Step 1');
      expect(task?.steps[1].text).toBe('Step 2');
      expect(task?.steps[2].text).toBe('Step 3');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when updating non-existent task', async () => {
      await expect(
        updateTaskState.execute('non-existent-id', 'done')
      ).rejects.toThrow();
    });

    it('should throw error when deleting non-existent task', async () => {
      await expect(
        deleteTask.execute('non-existent-id')
      ).rejects.toThrow();
    });

    it('should throw error when adding step to non-existent task', async () => {
      await expect(
        addTaskStep.execute('non-existent-id', 'Step')
      ).rejects.toThrow();
    });
  });
});
