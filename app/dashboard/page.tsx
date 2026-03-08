'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/app/_components/ProtectedRoute';
import { useAuth } from '@/app/_components/AuthProvider';
import { useCognitive } from '@/app/_components/CognitiveProvider';
import { useCognitiveLayout } from '@/app/_components/hooks/useCognitiveLayout';
import { useToast } from '@/app/_components/ToastProvider';
import { useRouter } from 'next/navigation';
import { useCases } from '@/app/_infrastructure/di/container';
import { Task, TaskState } from '@/app/_domain/entities/Task';
import { TaskCard } from '@/app/_components/TaskCard';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DraggableTaskCard } from '@/app/_components/DraggableTaskCard';
import { DroppableColumn } from '@/app/_components/DroppableColumn';

export default function DashboardPage() {
  const { user, isGuest, logout } = useAuth();
  const { preferences, addCustomColumn, updateCustomColumn, removeCustomColumn } = useCognitive();
  const layout = useCognitiveLayout();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [afterColumnId, setAfterColumnId] = useState<string>('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const loadedTasks = await useCases.getTasks.execute();
      setTasks(loadedTasks);
    } catch (error) {
      showError('Erro ao carregar tarefas');
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
        showSuccess('Tarefa adicionada');
      } catch (error) {
        showError('Erro ao adicionar tarefa');
      }
    }
  }

  async function handleUpdateTaskState(taskId: string, newState: TaskState) {
    try {
      await useCases.updateTaskState.execute(taskId, newState);
      await loadTasks();
      showSuccess('Tarefa atualizada');
    } catch (error) {
      showError('Erro ao atualizar tarefa');
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await useCases.deleteTask.execute(taskId);
      await loadTasks();
      showSuccess('Tarefa removida');
    } catch (error) {
      showError('Erro ao remover tarefa');
    }
  }

  async function handleAddStep(taskId: string, stepText: string) {
    try {
      await useCases.addTaskStep.execute(taskId, stepText);
      await loadTasks();
    } catch (error) {
      showError('Erro ao adicionar passo');
    }
  }

  async function handleToggleStep(taskId: string, stepId: string) {
    try {
      await useCases.toggleTaskStep.execute(taskId, stepId);
      await loadTasks();
    } catch (error) {
      showError('Erro ao alternar passo');
    }
  }

  async function handleRemoveStep(taskId: string, stepId: string) {
    try {
      await useCases.removeTaskStep.execute(taskId, stepId);
      await loadTasks();
    } catch (error) {
      showError('Erro ao remover passo');
    }
  }

  async function handleStartTimer(taskId: string) {
    try {
      await useCases.startTaskTimer.execute(taskId);
      await loadTasks();
    } catch (error) {
      showError('Erro ao iniciar timer');
    }
  }

  async function handlePauseTimer(taskId: string) {
    try {
      await useCases.pauseTaskTimer.execute(taskId);
      await loadTasks();
    } catch (error) {
      showError('Erro ao pausar timer');
    }
  }

  async function handleResetTimer(taskId: string) {
    try {
      await useCases.resetTaskTimer.execute(taskId);
      await loadTasks();
    } catch (error) {
      showError('Erro ao resetar timer');
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

  async function handleAddCustomColumn() {
    if (newColumnName.trim()) {
      try {
        const hasColumns = preferences?.customColumns && preferences.customColumns.length > 0;
        const columnIdToUse = hasColumns && afterColumnId ? afterColumnId : undefined;
        await addCustomColumn(newColumnName.trim(), columnIdToUse);
        setNewColumnName('');
        setAfterColumnId('');
        setShowAddColumn(false);
        showSuccess('Coluna adicionada');
      } catch (error) {
        showError('Erro ao adicionar coluna');
      }
    }
  }

  async function handleUpdateCustomColumn(columnId: string) {
    if (editingColumnName.trim()) {
      try {
        await updateCustomColumn(columnId, editingColumnName.trim());
        setEditingColumnId(null);
        setEditingColumnName('');
        showSuccess('Coluna renomeada');
      } catch (error) {
        showError('Erro ao renomear coluna');
      }
    }
  }

  async function handleRemoveCustomColumn(columnId: string) {
    try {
      await removeCustomColumn(columnId);
      showSuccess('Coluna removida');
    } catch (error) {
      showError('Erro ao remover coluna');
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
                aria-label="Abrir configurações"
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
              {/* Coluna: Lista/A fazer */}
              {layout.visibleColumns.includes('active') && (
              <div className="bg-slate-800/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-200 dark:text-slate-200">
                    {preferences?.layoutMode === 'list' ? 'Lista' : preferences?.layoutMode === 'complete' ? 'A fazer' : 'Tarefas'}
                  </h3>
                  {preferences?.layoutMode === 'list' && doneTasks.length > 0 && (
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      onKeyDown={(e) => e.key === 'Enter' && setShowHistory(!showHistory)}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-normal flex items-center gap-1"
                      aria-label={showHistory ? 'Fechar histórico' : 'Ver histórico de tarefas concluídas'}
                      aria-expanded={showHistory}
                      title="Ver histórico"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Histórico
                    </button>
                  )}
                </div>


                <DroppableColumn id="active" items={activeTasks.map(t => t.id)}>
                  {activeTasks.length === 0 && !showAddTask ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-slate-400 dark:text-slate-400 font-normal text-base text-center mb-4">
                        Nada por aqui ainda
                      </p>
                      <button
                        onClick={() => setShowAddTask(true)}
                        onKeyDown={(e) => e.key === 'Enter' && setShowAddTask(true)}
                        className="text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 font-normal"
                        aria-label="Adicionar nova tarefa"
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
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddTask();
                              if (e.key === 'Escape') {
                                setShowAddTask(false);
                                setTaskInput('');
                              }
                            }}
                            placeholder="O que está na sua cabeça?"
                            className="w-full px-0 py-2 text-base text-slate-100 dark:text-slate-100 font-normal border-0 focus:outline-none focus:ring-0 bg-transparent placeholder-slate-400 dark:placeholder-slate-400"
                            aria-label="Digite o texto da nova tarefa"
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleAddTask}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                              className="px-3 py-1 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors font-normal"
                              aria-label="Confirmar e adicionar tarefa"
                            >
                              Adicionar
                            </button>
                            <button
                              onClick={() => {
                                setShowAddTask(false);
                                setTaskInput('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Escape') {
                                  setShowAddTask(false);
                                  setTaskInput('');
                                }
                              }}
                              className="px-3 py-1 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-normal"
                              aria-label="Cancelar adição de tarefa"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddTask(true)}
                          onKeyDown={(e) => e.key === 'Enter' && setShowAddTask(true)}
                          className="w-full p-3 border border-dashed border-slate-600 dark:border-slate-600 rounded-lg text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-500 dark:hover:border-slate-500 transition-colors font-normal text-sm"
                          aria-label="Adicionar mais uma tarefa"
                        >
                          Adicionar mais uma
                        </button>
                      )}
                    </>
                  )}
                </DroppableColumn>
              </div>
              )}

              {/* Coluna: Fazendo */}
              {layout.visibleColumns.includes('paused') && (
              <div className="bg-slate-800/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-200 dark:text-slate-200">Fazendo</h3>
                </div>

                <DroppableColumn id="paused" items={pausedTasks.map(t => t.id)}>
                  {pausedTasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-slate-400 dark:text-slate-400 font-normal text-base text-center">
                        Nada aqui ainda
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

              {/* Coluna: Completo */}
              {layout.visibleColumns.includes('done') && preferences?.layoutMode !== 'custom' && (
              <div className="bg-slate-800/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-200 dark:text-slate-200">Completo</h3>
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

              {/* Modo Customizado: Botão + para Adicionar Coluna */}
              {preferences?.layoutMode === 'custom' && (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border-2 border-dashed border-slate-600 dark:border-slate-600 p-4 flex items-center justify-center min-h-[200px]">
                  {showAddColumn ? (
                    <div className="w-full space-y-3">
                      <div>
                        <label htmlFor="columnName" className="block text-sm text-slate-400 mb-1">
                          Nome da coluna
                        </label>
                        <input
                          id="columnName"
                          type="text"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (!preferences?.customColumns.length || afterColumnId)) {
                              handleAddCustomColumn();
                            }
                            if (e.key === 'Escape') {
                              setShowAddColumn(false);
                              setNewColumnName('');
                              setAfterColumnId('');
                            }
                          }}
                          placeholder="Ex: Em andamento"
                          className="w-full px-3 py-2 text-base text-slate-100 dark:text-slate-100 font-normal border border-indigo-500 dark:border-indigo-500 rounded bg-slate-700 dark:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500"
                          aria-label="Digite o nome da nova coluna"
                          autoFocus
                        />
                      </div>
                      
                      {preferences?.customColumns && preferences.customColumns.length > 0 && (
                        <div>
                          <label htmlFor="afterColumn" className="block text-sm text-slate-400 mb-1">
                            Vem após <span className="text-red-400">*</span>
                          </label>
                          <select
                            id="afterColumn"
                            value={afterColumnId}
                            onChange={(e) => setAfterColumnId(e.target.value)}
                            className="w-full px-3 py-2 text-base text-slate-100 dark:text-slate-100 font-normal border border-slate-600 dark:border-slate-600 rounded bg-slate-700 dark:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500"
                            aria-label="Selecione após qual coluna esta deve aparecer"
                            required
                          >
                            <option value="" disabled>Selecione uma coluna</option>
                            {preferences.customColumns
                              .sort((a, b) => a.order - b.order)
                              .map((col) => (
                                <option key={col.id} value={col.id}>
                                  {col.name}
                                </option>
                              ))}
                          </select>
                          <p className="text-xs text-slate-500 mt-1">
                            A nova coluna aparecerá logo após a coluna selecionada
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddCustomColumn}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomColumn()}
                          disabled={preferences?.customColumns.length > 0 && !afterColumnId}
                          className="px-3 py-1 text-sm bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded transition-colors font-normal"
                          aria-label="Confirmar e adicionar coluna"
                        >
                          Adicionar
                        </button>
                        <button
                          onClick={() => {
                            setShowAddColumn(false);
                            setNewColumnName('');
                            setAfterColumnId('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Escape') {
                              setShowAddColumn(false);
                              setNewColumnName('');
                              setAfterColumnId('');
                            }
                          }}
                          className="px-3 py-1 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-normal"
                          aria-label="Cancelar adição de coluna"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddColumn(true)}
                      onKeyDown={(e) => e.key === 'Enter' && setShowAddColumn(true)}
                      className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
                      aria-label="Adicionar nova coluna personalizada"
                    >
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm font-normal">Adicionar coluna</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal de Histórico - Modo Lista */}
            {preferences?.layoutMode === 'list' && showHistory && doneTasks.length > 0 && (
              <div className="mt-6 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-slate-200">Histórico de tarefas concluídas</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  {doneTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <p className="text-sm text-slate-300 line-through">{task.text}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateTaskState(task.id, 'active')}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Reabrir
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-xs text-slate-500 hover:text-slate-300 transition-colors ml-auto"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
