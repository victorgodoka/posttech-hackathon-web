'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/app/_components/ProtectedRoute';
import { useAuth } from '@/app/_components/AuthProvider';
import { useCognitive } from '@/app/_components/CognitiveProvider';
import { useCognitiveLayout } from '@/app/_components/hooks/useCognitiveLayout';
import { useRouter } from 'next/navigation';
import { useCases } from '@/app/_infrastructure/di/container';
import { Task, TaskState } from '@/app/_domain/entities/Task';
import { TaskCard } from '@/app/_components/TaskCard';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DraggableTaskCard } from '@/app/_components/DraggableTaskCard';
import { DroppableColumn } from '@/app/_components/DroppableColumn';

export default function DashboardPage() {
  const { user, isGuest, logout } = useAuth();
  const { preferences } = useCognitive();
  const layout = useCognitiveLayout();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const loadedTasks = await useCases.getTasks.execute();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push('/welcome');
  }

  async function handleAddTask() {
    if (taskInput.trim()) {
      try {
        await useCases.addTask.execute(taskInput.trim());
        await loadTasks();
        setTaskInput('');
        setShowAddTask(false);
      } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
      }
    }
  }

  async function handleUpdateTaskState(taskId: string, newState: TaskState) {
    try {
      await useCases.updateTaskState.execute(taskId, newState);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await useCases.deleteTask.execute(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
  }

  async function handleAddStep(taskId: string, stepText: string) {
    try {
      await useCases.addTaskStep.execute(taskId, stepText);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao adicionar passo:', error);
    }
  }

  async function handleToggleStep(taskId: string, stepId: string) {
    try {
      await useCases.toggleTaskStep.execute(taskId, stepId);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao alternar passo:', error);
    }
  }

  async function handleRemoveStep(taskId: string, stepId: string) {
    try {
      await useCases.removeTaskStep.execute(taskId, stepId);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao remover passo:', error);
    }
  }

  async function handleStartTimer(taskId: string) {
    try {
      await useCases.startTaskTimer.execute(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao iniciar timer:', error);
    }
  }

  async function handlePauseTimer(taskId: string) {
    try {
      await useCases.pauseTaskTimer.execute(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao pausar timer:', error);
    }
  }

  async function handleResetTimer(taskId: string) {
    try {
      await useCases.resetTaskTimer.execute(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao resetar timer:', error);
    }
  }

  async function handleCompleteTimer(taskId: string) {
    try {
      await useCases.completeTimerCycle.execute(taskId);
      await loadTasks();
      
      const task = tasks.find(t => t.id === taskId);
      if (task?.timer.mode === 'break') {
        showTransitionNotification('Ciclo completo! Hora de descansar.');
      } else {
        showTransitionNotification('Pausa terminada. Pronto para focar?');
      }
    } catch (error) {
      console.error('Erro ao completar ciclo:', error);
    }
  }

  function showTransitionNotification(message: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MindEase', {
        body: message,
        icon: '/mindease.png',
        tag: 'pomodoro',
      });
    }
  }

  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeTasks = tasks.filter(t => t.state === 'active');
  const pausedTasks = tasks.filter(t => t.state === 'paused');
  const doneTasks = tasks.filter(t => t.state === 'done');

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newState = over.id as TaskState;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.state === newState) return;

    await handleUpdateTaskState(taskId, newState);
  }

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 ${layout.isFullScreen ? 'full-screen-mode' : ''}`}>
        <header className="bg-slate-800/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 dark:border-slate-700">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/mindease.png"
                alt="MindEase"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-lg font-medium text-teal-400 dark:text-teal-400">MindEase</h1>
                {isGuest && (
                  <p className="text-xs text-slate-400 dark:text-slate-400 font-normal">Modo visitante</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isGuest && user && (
                <span className="text-sm text-gray-600 font-light">Olá, {user.name}</span>
              )}
              {isGuest && (
                <span className="text-sm text-gray-400 font-light">Modo visitante</span>
              )}
              <button
                onClick={() => router.push('/settings')}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-light"
                title="Configurações"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-600 dark:border-slate-600 rounded-lg hover:bg-slate-700/50 dark:hover:bg-slate-700/50 transition-colors font-light"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-slate-100 dark:text-slate-100 mb-2">Board Cognitivo</h2>
            <p className="text-base text-slate-400 dark:text-slate-400 font-normal">
              Foque em uma coisa por vez, sem sobrecarga
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-slate-400 dark:text-slate-400 font-normal text-base">Carregando...</p>
            </div>
          ) : (
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={`grid gap-4 ${
              layout.isFullScreen 
                ? 'grid-cols-1' 
                : layout.visibleColumns.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : layout.visibleColumns.length === 3 
                    ? 'grid-cols-1 md:grid-cols-3' 
                    : 'grid-cols-1 md:grid-cols-4'
            }`}>
              {/* Coluna: Foco */}
              {layout.visibleColumns.includes('active') && (
              <div className="bg-slate-800/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-200 dark:text-slate-200">Foco</h3>
                </div>

                {/* Aviso suave de sobrecarga cognitiva */}
                {preferences && activeTasks.length > preferences.maxTasksInFocus && preferences.overloadBehavior !== 'no-warning' && (
                  <div className="mb-4 p-3 bg-amber-900/20 dark:bg-amber-900/20 border border-amber-700/50 dark:border-amber-700/50 rounded-lg">
                    <p className="text-sm text-amber-300 dark:text-amber-300 font-normal">
                      {preferences.overloadBehavior === 'suggest-move' 
                        ? '💡 Talvez seja mais confortável mover algumas para "Próximas"'
                        : '💡 Você tem mais tarefas em foco do que o usual'}
                    </p>
                  </div>
                )}

                <DroppableColumn id="active" items={activeTasks.map(t => t.id)}>
                  {activeTasks.length === 0 && !showAddTask ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-slate-400 dark:text-slate-400 font-normal text-base text-center mb-4">
                        Nada por aqui ainda
                      </p>
                      <button
                        onClick={() => setShowAddTask(true)}
                        className="text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 font-normal"
                      >
                        + Adicionar algo
                      </button>
                    </div>
                  ) : (
                    <>
                      {activeTasks.map((task, index) => (
                        <DraggableTaskCard
                          key={task.id}
                          task={task}
                          onUpdateState={handleUpdateTaskState}
                          onDelete={handleDeleteTask}
                          onAddStep={handleAddStep}
                          onToggleStep={handleToggleStep}
                          onRemoveStep={handleRemoveStep}
                          onStartTimer={handleStartTimer}
                          onPauseTimer={handlePauseTimer}
                          onResetTimer={handleResetTimer}
                          onCompleteTimer={handleCompleteTimer}
                          isPrimaryFocus={index === 0}
                        />
                      ))}

                      {showAddTask ? (
                        <div className="p-3 bg-slate-700 dark:bg-slate-700 border border-indigo-500 dark:border-indigo-500 rounded-lg">
                          <input
                            type="text"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            placeholder="O que está na sua cabeça?"
                            className="w-full px-0 py-2 text-base text-slate-100 dark:text-slate-100 font-normal border-0 focus:outline-none focus:ring-0 bg-transparent placeholder-slate-400 dark:placeholder-slate-400"
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleAddTask}
                              className="px-3 py-1 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors font-normal"
                            >
                              Adicionar
                            </button>
                            <button
                              onClick={() => {
                                setShowAddTask(false);
                                setTaskInput('');
                              }}
                              className="px-3 py-1 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-normal"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddTask(true)}
                          className="w-full p-3 border border-dashed border-slate-600 dark:border-slate-600 rounded-lg text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-500 dark:hover:border-slate-500 transition-colors font-normal text-sm"
                        >
                          Adicionar mais uma
                        </button>
                      )}
                    </>
                  )}
                </DroppableColumn>
              </div>
              )}

              {/* Coluna: Próximas */}
              {layout.visibleColumns.includes('paused') && (
              <div className="bg-slate-800/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-200 dark:text-slate-200">Próximas</h3>
                </div>

                <DroppableColumn id="paused" items={pausedTasks.map(t => t.id)}>
                  {pausedTasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-slate-400 dark:text-slate-400 font-normal text-base text-center">
                        Nada na fila ainda
                      </p>
                    </div>
                  ) : (
                    pausedTasks.map((task) => (
                      <DraggableTaskCard
                        key={task.id}
                        task={task}
                        onUpdateState={handleUpdateTaskState}
                        onDelete={handleDeleteTask}
                        onAddStep={handleAddStep}
                        onToggleStep={handleToggleStep}
                        onRemoveStep={handleRemoveStep}
                        onStartTimer={handleStartTimer}
                        onPauseTimer={handlePauseTimer}
                        onResetTimer={handleResetTimer}
                        onCompleteTimer={handleCompleteTimer}
                      />
                    ))
                  )}
                </DroppableColumn>
              </div>
              )}

              {/* Coluna: Feito */}
              {layout.visibleColumns.includes('done') && (
              <div className="bg-slate-800/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-200 dark:text-slate-200">Feito</h3>
                </div>

                <DroppableColumn id="done" items={doneTasks.map(t => t.id)}>
                  {doneTasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-slate-400 dark:text-slate-400 font-normal text-base text-center">
                        Nada aqui ainda — e tudo bem.
                      </p>
                    </div>
                  ) : (
                    doneTasks.map((task) => (
                      <DraggableTaskCard
                        key={task.id}
                        task={task}
                        onUpdateState={handleUpdateTaskState}
                        onDelete={handleDeleteTask}
                        onAddStep={handleAddStep}
                        onToggleStep={handleToggleStep}
                        onRemoveStep={handleRemoveStep}
                        onStartTimer={handleStartTimer}
                        onPauseTimer={handlePauseTimer}
                        onResetTimer={handleResetTimer}
                        onCompleteTimer={handleCompleteTimer}
                      />
                    ))
                  )}
                </DroppableColumn>
              </div>
              )}
            </div>
            
            <DragOverlay>
              {activeTask ? (
                <div className="opacity-80">
                  <TaskCard
                    task={activeTask}
                    onUpdateState={() => {}}
                    onDelete={() => {}}
                    onAddStep={() => {}}
                    onToggleStep={() => {}}
                    onRemoveStep={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
            </DndContext>
          )}

          {isGuest && tasks.length > 0 && (
            <div className="mt-8 p-4 bg-indigo-900/30 dark:bg-indigo-900/30 border border-indigo-700 dark:border-indigo-700 rounded-lg">
              <p className="text-base text-indigo-300 dark:text-indigo-300 font-normal text-center">
                Se quiser, você pode{' '}
                <button
                  onClick={() => router.push('/welcome')}
                  className="underline hover:text-indigo-800"
                >
                  fazer login
                </button>
              </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
