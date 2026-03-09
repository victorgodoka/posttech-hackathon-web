'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { ProtectedRoute } from '@/app/_components/ProtectedRoute';
import { useAuth } from '@/app/_components/AuthProvider';
import { useCognitive } from '@/app/_components/CognitiveProvider';
import { useCognitiveLayout } from '@/app/_components/hooks/useCognitiveLayout';
import { useToast } from '@/app/_components/ToastProvider';
import { useBrowserNotification } from '@/app/_components/BrowserNotification';
import { useRouter } from 'next/navigation';
import { useCases } from '@/app/_infrastructure/di/container';
import { Task, TaskState } from '@/app/_domain/entities/Task';
import { TaskCard } from '@/app/_components/TaskCard';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DraggableTaskCard } from '@/app/_components/DraggableTaskCard';
import { DroppableColumn } from '@/app/_components/DroppableColumn';
import { Onboarding } from '@/app/_components/Onboarding';
import { AddTaskModal } from '@/app/_components/AddTaskModal';
import { TaskCategory } from '@/app/_domain/entities/TaskCategory';

export default function DashboardPage() {
  const { user, isGuest, logout } = useAuth();
  const { preferences, addCustomColumn, updateCustomColumn, removeCustomColumn } = useCognitive();
  const layout = useCognitiveLayout();
  const { showSuccess, showError } = useToast();
  const { showNotification, requestPermission, permission } = useBrowserNotification();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [afterColumnId, setAfterColumnId] = useState<string>('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');

  useEffect(() => {
    loadTasks();
    
    // Solicitar permissão de notificação ao carregar
    if ('Notification' in window && Notification.permission === 'default') {
      requestPermission();
    }
    
    // Verificar se é primeira visita para exibir onboarding
    const hasSeenOnboarding = localStorage.getItem('mindease-onboarding-completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez ao montar

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

  function handleCompleteOnboarding() {
    localStorage.setItem('mindease-onboarding-completed', 'true');
    setShowOnboarding(false);
  }

  async function handleLogout() {
    await logout();
    router.push('/welcome');
  }

  async function handleAddTask(text: string, category: TaskCategory, description?: string, usePomodoro?: boolean) {
    try {
      const customColumnId = preferences?.layoutMode === 'custom' && afterColumnId ? afterColumnId : undefined;
      await useCases.addTask.execute(text, category, description, customColumnId, usePomodoro);
      setShowAddTask(false);
      setAfterColumnId('');
      await loadTasks();
      showSuccess('Tarefa adicionada');
    } catch (error) {
      showError('Erro ao adicionar tarefa');
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
      const workDuration = preferences?.pomodoroSettings.workDuration || 25;
      await useCases.startTaskTimer.execute(taskId, workDuration);
      // Mover tarefa para 'paused' (Fazendo) ao iniciar timer
      await useCases.updateTaskState.execute(taskId, 'paused');
      await loadTasks();
    } catch (error) {
      showError('Erro ao iniciar timer');
    }
  }

  async function handlePauseTimer(taskId: string) {
    try {
      await useCases.pauseTaskTimer.execute(taskId);
      // Voltar tarefa para 'active' (A fazer) ao pausar timer
      await useCases.updateTaskState.execute(taskId, 'active');
      await loadTasks();
    } catch (error) {
      showError('Erro ao pausar timer');
    }
  }

  async function handleResetTimer(taskId: string) {
    try {
      const workDuration = preferences?.pomodoroSettings.workDuration || 25;
      await useCases.resetTaskTimer.execute(taskId, workDuration);
      await loadTasks();
    } catch (error) {
      showError('Erro ao resetar timer');
    }
  }

  async function handleCompleteTimer(taskId: string) {
    try {
      const task = tasks.find(t => t.id === taskId);
      const workDuration = preferences?.pomodoroSettings.workDuration || 25;
      const breakDuration = preferences?.pomodoroSettings.breakDuration || 5;
      
      await useCases.completeTimerCycle.execute(taskId, workDuration, breakDuration);
      await loadTasks();
      
      // Determinar mensagem baseada no modo atual (antes de completar)
      const isWorkMode = task?.timer.mode === 'work';
      const message = isWorkMode 
        ? '✓ Ciclo de foco completo! Hora de descansar.' 
        : '✓ Pausa terminada. Pronto para focar?';
      
      // Mostrar notificação nativa do browser
      showNotification('MindEase - Pomodoro', {
        body: message,
        icon: '/mindease.png',
        tag: 'pomodoro-complete',
        requireInteraction: true,
      });
      
      // Também mostrar toast
      showSuccess(message);
    } catch (error) {
      console.error('Erro ao completar ciclo:', error);
      showError('Erro ao completar ciclo do timer');
    }
  }

  async function handleAddCustomColumn() {
    if (newColumnName.trim()) {
      try {
        const maxColumns = preferences?.allowExtraCustomColumns ? 5 : 3;
        const currentCount = preferences?.customColumns?.length || 0;
        
        if (currentCount >= maxColumns) {
          showError(`Limite de ${maxColumns} colunas atingido. ${!preferences?.allowExtraCustomColumns ? 'Ative "Ultrapassar limite" nas configurações para criar até 5 colunas.' : ''}`);
          return;
        }
        
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


  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // No modo list, mostrar todas as tarefas não concluídas juntas
  const activeTasks = preferences?.layoutMode === 'list' 
    ? tasks.filter(t => t.state !== 'done')
    : tasks.filter(t => t.state === 'active');
  const pausedTasks = tasks.filter(t => t.state === 'paused');
  const doneTasks = tasks.filter(t => t.state === 'done');
  
  // Verificar se já existe uma tarefa em foco (com timer rodando)
  const hasActiveTimer = tasks.some(t => t.timer?.isRunning);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const targetId = over.id as string;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Modo customizado: atualizar customColumnId
    if (preferences?.layoutMode === 'custom') {
      // Verificar se é uma coluna customizada válida
      const isCustomColumn = preferences.customColumns.some(col => col.id === targetId);
      
      if (!isCustomColumn) return; // Não é uma coluna customizada válida
      if (task.customColumnId === targetId) return; // Já está na mesma coluna
      
      try {
        await useCases.updateTaskCustomColumn.execute(taskId, targetId);
        await loadTasks();
        showSuccess('Tarefa movida');
      } catch (error) {
        showError('Erro ao mover tarefa');
      }
    } else {
      // Modo lista/completo: atualizar state
      const newState = targetId as TaskState;
      if (task.state === newState) return;
      await handleUpdateTaskState(taskId, newState);
    }
  }

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-gradient-to-b from-dark-bg-primary to-dark-bg-secondary ${layout.isFullScreen ? 'full-screen-mode' : ''}`}>
        <header className="bg-dark-bg-elevated/80 dark:bg-dark-bg-elevated/80 backdrop-blur-sm border-b border-dark-border-default">
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
                <h1 className="text-lg font-medium text-dark-accent-teal-light dark:text-dark-accent-teal-light">MindEase</h1>
                {isGuest && (
                  <p className="text-xs text-dark-text-secondary font-normal">Modo visitante</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isGuest && user && (
                <span className="text-sm text-dark-text-secondary font-light">Olá, {user.name}</span>
              )}
              {isGuest && (
                <span className="text-sm text-dark-text-secondary font-light">Modo visitante</span>
              )}
              <button
                onClick={() => router.push('/settings')}
                className="px-4 py-2 text-sm text-dark-text-secondary hover:text-dark-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary transition-colors font-light"
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
                className="px-4 py-2 text-sm text-dark-text-secondary hover:text-dark-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary border border-dark-border-default dark:border-dark-border-default rounded-lg hover:bg-dark-bg-hover transition-colors font-light"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-dark-text-primary dark:text-dark-text-primary mb-2">Board Cognitivo</h2>
            <p className="text-base text-dark-text-secondary font-normal">
              Foque em uma coisa por vez, sem sobrecarga
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-dark-text-secondary font-normal text-base">Carregando...</p>
            </div>
          ) : (
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              {/* Coluna: A fazer (lista de tarefas pendentes) */}
              {layout.visibleColumns.includes('active') && (
              <div className="flex-1 bg-dark-bg-elevated/60 dark:bg-dark-bg-elevated/60 backdrop-blur-sm rounded-xl border border-dark-border-default p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-dark-text-primary">
                    {preferences?.layoutMode === 'list' ? 'Lista' : 'A fazer'}
                  </h3>
                  {preferences?.layoutMode === 'list' && doneTasks.length > 0 && (
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      onKeyDown={(e) => e.key === 'Enter' && setShowHistory(!showHistory)}
                      className="text-xs text-dark-text-muted hover:text-dark-text-primary transition-colors font-normal flex items-center gap-1"
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
                      <p className="text-dark-text-secondary font-normal text-base text-center mb-4">
                        Nada por aqui ainda
                      </p>
                      <button
                        onClick={() => setShowAddTask(true)}
                        onKeyDown={(e) => e.key === 'Enter' && setShowAddTask(true)}
                        className="flex items-center gap-2 text-sm text-dark-text-secondary hover:text-dark-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary font-normal transition-colors"
                        aria-label="Adicionar nova tarefa"
                      >
                        <Icon icon="mdi:plus-circle-outline" className="w-5 h-5" />
                        Adicionar algo
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
                          hasActiveTimer={hasActiveTimer}
                        />
                      ))}

                      {showAddTask ? (
                        <AddTaskModal
                          mode={preferences?.taskCreationMode || 'simple'}
                          onAdd={handleAddTask}
                          onCancel={() => setShowAddTask(false)}
                        />
                      ) : (
                        <button
                          onClick={() => setShowAddTask(true)}
                          onKeyDown={(e) => e.key === 'Enter' && setShowAddTask(true)}
                          className="w-full p-3 border border-dashed border-dark-border-default dark:border-dark-border-default rounded-lg text-dark-text-secondary hover:text-dark-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary hover:border-dark-border-emphasis transition-colors font-normal text-sm flex items-center justify-center gap-2"
                          aria-label="Adicionar mais uma tarefa"
                        >
                          <Icon icon="mdi:plus" className="w-4 h-4" />
                          Adicionar mais uma
                        </button>
                      )}
                    </>
                  )}
                </DroppableColumn>
              </div>
              )}

              {/* Seta entre colunas */}
              {layout.visibleColumns.includes('active') && layout.visibleColumns.includes('paused') && (
                <div className="hidden md:flex items-center justify-center">
                  <Icon icon="mdi:arrow-right" className="w-8 h-8 text-dark-text-muted" />
                </div>
              )}

              {/* Coluna: Fazendo (tarefa em execução) */}
              {layout.visibleColumns.includes('paused') && (
              <div className="flex-1 bg-dark-bg-elevated/60 dark:bg-dark-bg-elevated/60 backdrop-blur-sm rounded-xl border border-dark-border-default p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-dark-text-primary">Fazendo</h3>
                </div>

                <DroppableColumn id="paused" items={pausedTasks.map(t => t.id)}>
                  {pausedTasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-dark-text-secondary font-normal text-base text-center">
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

              {/* Seta entre colunas */}
              {layout.visibleColumns.includes('paused') && layout.visibleColumns.includes('done') && (
                <div className="hidden md:flex items-center justify-center">
                  <Icon icon="mdi:arrow-right" className="w-8 h-8 text-dark-text-muted" />
                </div>
              )}

              {/* Coluna: Concluído */}
              {layout.visibleColumns.includes('done') && preferences?.layoutMode !== 'custom' && (
              <div className="flex-1 bg-dark-bg-elevated/60 dark:bg-dark-bg-elevated/60 backdrop-blur-sm rounded-xl border border-dark-border-default p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-dark-text-primary">Concluído</h3>
                </div>

                <DroppableColumn id="done" items={doneTasks.map(t => t.id)}>
                  {doneTasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-dark-text-secondary font-normal text-base text-center">
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

              {/* Modo Customizado: Coluna de Tarefas Sem Categoria */}
              {preferences?.layoutMode === 'custom' && (() => {
                const unassignedTasks = tasks.filter(t => !t.customColumnId);
                if (unassignedTasks.length === 0) return null;
                
                return (
                  <div className="flex-1 bg-dark-bg-elevated/60 dark:bg-dark-bg-elevated/60 backdrop-blur-sm rounded-xl border border-dark-border-default p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-dark-text-primary">Sem Categoria</h3>
                      <span className="text-xs text-dark-text-muted dark:text-dark-text-muted">Arraste para organizar</span>
                    </div>
                    <DroppableColumn id="unassigned" items={unassignedTasks.map(t => t.id)}>
                      {unassignedTasks.map((task) => (
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
                      ))}
                    </DroppableColumn>
                  </div>
                );
              })()}

              {/* Modo Customizado: Colunas Personalizadas */}
              {preferences?.layoutMode === 'custom' && preferences.customColumns
                .sort((a, b) => a.order - b.order)
                .map((column, index, array) => {
                  const columnTasks = tasks.filter(t => t.customColumnId === column.id);
                  
                  return (
                    <React.Fragment key={column.id}>
                    <div className="flex-1 bg-dark-bg-elevated/60 dark:bg-dark-bg-elevated/60 backdrop-blur-sm rounded-xl border border-dark-border-default p-4">
                      <div className="flex items-center justify-between mb-4">
                        {editingColumnId === column.id ? (
                          <input
                            type="text"
                            value={editingColumnName}
                            onChange={(e) => setEditingColumnName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateCustomColumn(column.id);
                              if (e.key === 'Escape') {
                                setEditingColumnId(null);
                                setEditingColumnName('');
                              }
                            }}
                            onBlur={() => handleUpdateCustomColumn(column.id)}
                            className="text-lg font-medium text-dark-text-primary bg-dark-surface-muted px-2 py-1 rounded border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            aria-label="Editar nome da coluna"
                            autoFocus
                          />
                        ) : (
                          <h3 
                            className="text-lg font-medium text-dark-text-primary cursor-pointer hover:text-indigo-400 transition-colors"
                            onClick={() => {
                              setEditingColumnId(column.id);
                              setEditingColumnName(column.name);
                            }}
                            title="Clique para editar"
                          >
                            {column.name}
                          </h3>
                        )}
                        <button
                          onClick={() => handleRemoveCustomColumn(column.id)}
                          className="text-dark-text-muted hover:text-red-400 transition-colors"
                          aria-label={`Remover coluna ${column.name}`}
                          title="Remover coluna"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>

                      <DroppableColumn id={column.id} items={columnTasks.map(t => t.id)}>
                        {columnTasks.length === 0 && !(showAddTask && afterColumnId === column.id) ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-dark-text-secondary font-normal text-base text-center mb-4">
                              Nada por aqui ainda
                            </p>
                            <button
                              onClick={() => {
                                setShowAddTask(true);
                                setAfterColumnId(column.id);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-normal"
                              aria-label={`Adicionar primeira tarefa em ${column.name}`}
                            >
                              <Icon icon="mdi:plus-circle-outline" className="w-5 h-5" />
                              Adicionar primeira tarefa
                            </button>
                          </div>
                        ) : (
                          <>
                            {columnTasks.map((task) => (
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
                            ))}

                            {showAddTask && afterColumnId === column.id ? (
                              <AddTaskModal
                                mode={preferences?.taskCreationMode || 'simple'}
                                onAdd={handleAddTask}
                                onCancel={() => {
                                  setShowAddTask(false);
                                  setAfterColumnId('');
                                }}
                              />
                            ) : (
                              <button
                                onClick={() => {
                                  setShowAddTask(true);
                                  setAfterColumnId(column.id);
                                }}
                                className="w-full p-3 border border-dashed border-dark-border-default dark:border-dark-border-default rounded-lg text-dark-text-secondary hover:text-dark-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary hover:border-dark-border-emphasis transition-colors font-normal text-sm flex items-center justify-center gap-2"
                                aria-label={`Adicionar tarefa em ${column.name}`}
                              >
                                <Icon icon="mdi:plus" className="w-4 h-4" />
                                Adicionar mais uma
                              </button>
                            )}
                          </>
                        )}
                      </DroppableColumn>
                    </div>

                    {/* Seta entre colunas customizadas */}
                    {index < array.length - 1 && (
                      <div className="hidden md:flex items-center justify-center">
                        <Icon icon="mdi:arrow-right" className="w-8 h-8 text-dark-text-muted" />
                      </div>
                    )}
                    </React.Fragment>
                  );
                })}

              {/* Modo Customizado: Botão + para Adicionar Coluna */}
              {preferences?.layoutMode === 'custom' && (() => {
                const maxColumns = preferences.allowExtraCustomColumns ? 5 : 3;
                const currentCount = preferences.customColumns?.length || 0;
                const canAddMore = currentCount < maxColumns;
                
                return canAddMore ? (
                <div className="bg-dark-bg-elevated/30 backdrop-blur-sm rounded-xl border-2 border-dashed border-dark-border-default dark:border-dark-border-default p-4 flex items-center justify-center min-h-[200px]">
                  {showAddColumn ? (
                    <div className="w-full space-y-3">
                      <div>
                        <label htmlFor="columnName" className="block text-sm text-dark-text-secondary mb-1">
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
                          className="w-full px-3 py-2 text-base text-dark-text-primary dark:text-dark-text-primary font-normal border border-indigo-500 dark:border-indigo-500 rounded bg-dark-surface-muted dark:bg-dark-surface-muted focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500"
                          aria-label="Digite o nome da nova coluna"
                          autoFocus
                        />
                      </div>
                      
                      {preferences?.customColumns && preferences.customColumns.length > 0 && (
                        <div>
                          <label htmlFor="afterColumn" className="block text-sm text-dark-text-secondary mb-1">
                            Vem após <span className="text-red-400">*</span>
                          </label>
                          <select
                            id="afterColumn"
                            value={afterColumnId}
                            onChange={(e) => setAfterColumnId(e.target.value)}
                            className="w-full px-3 py-2 text-base text-dark-text-primary dark:text-dark-text-primary font-normal border border-dark-border-default dark:border-dark-border-default rounded bg-dark-surface-muted dark:bg-dark-surface-muted focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500"
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
                          <p className="text-xs text-dark-text-muted mt-1">
                            A nova coluna aparecerá logo após a coluna selecionada
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddCustomColumn}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomColumn()}
                          disabled={preferences?.customColumns.length > 0 && !afterColumnId}
                          className="flex items-center gap-1.5 px-3 py-1 text-sm bg-indigo-500 hover:bg-indigo-600 disabled:bg-dark-surface-subtle disabled:cursor-not-allowed text-white rounded transition-colors font-normal"
                          aria-label="Confirmar e adicionar coluna"
                        >
                          <Icon icon="mdi:check" className="w-4 h-4" />
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
                          className="flex items-center gap-1.5 px-3 py-1 text-sm text-dark-text-secondary hover:text-dark-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary transition-colors font-normal"
                          aria-label="Cancelar adição de coluna"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddColumn(true)}
                      onKeyDown={(e) => e.key === 'Enter' && setShowAddColumn(true)}
                      className="flex items-center gap-2 text-dark-text-muted hover:text-dark-text-primary transition-colors"
                      aria-label="Adicionar nova coluna personalizada"
                    >
                      <Icon icon="mdi:view-column-outline" className="w-12 h-12" />
                      <span className="text-sm font-normal">Adicionar coluna</span>
                    </button>
                  )}
                </div>
                ) : null;
              })()}
            </div>

            {/* Modal de Histórico - Modo Lista */}
            {preferences?.layoutMode === 'list' && showHistory && doneTasks.length > 0 && (
              <div className="mt-6 bg-dark-bg-elevated/40 backdrop-blur-sm rounded-xl border border-dark-border-default/50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-dark-text-primary">Histórico de tarefas concluídas</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-dark-text-secondary hover:text-dark-text-primary transition-colors"
                    aria-label="Fechar histórico"
                  >
                    <Icon icon="mdi:close" className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {doneTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-dark-surface-muted/30 rounded-lg border border-dark-border-default/30">
                      <p className="text-sm text-dark-text-primary line-through">{task.text}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateTaskState(task.id, 'active')}
                          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                          aria-label={`Reabrir tarefa: ${task.text}`}
                        >
                          <Icon icon="mdi:restore" className="w-3.5 h-3.5" />
                          Reabrir
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex items-center gap-1 text-xs text-dark-text-muted hover:text-dark-text-primary transition-colors ml-auto"
                          aria-label={`Remover tarefa: ${task.text}`}
                        >
                          <Icon icon="mdi:delete-outline" className="w-3.5 h-3.5" />
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
            <div className="mt-8 p-4 bg-dark-accent-blue/30 border border-dark-accent-blue rounded-lg">
              <p className="text-base text-dark-accent-blue-light font-normal text-center">
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

      {/* Onboarding para novos usuários */}
      {showOnboarding && <Onboarding onComplete={handleCompleteOnboarding} />}
    </ProtectedRoute>
  );
}
