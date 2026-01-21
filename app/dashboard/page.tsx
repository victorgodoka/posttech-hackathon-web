'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/app/_components/ProtectedRoute';
import { useAuth } from '@/app/_components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useCases } from '@/app/_infrastructure/di/container';
import { Task, TaskState } from '@/app/_domain/entities/Task';
import { TaskCard } from '@/app/_components/TaskCard';

export default function DashboardPage() {
  const { user, isGuest, logout } = useAuth();
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
    router.push('/login');
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

  const activeTasks = tasks.filter(t => t.state === 'active');
  const pausedTasks = tasks.filter(t => t.state === 'paused');
  const doneTasks = tasks.filter(t => t.state === 'done');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/mindease.png"
                alt="MindEase"
                width={32}
                height={32}
                className="object-contain"
              />
              <h1 className="text-xl font-light text-gray-800">MindEase</h1>
            </div>
            <div className="flex items-center gap-4">
              {!isGuest && user && (
                <span className="text-sm text-gray-600 font-light">Olá, {user.name}</span>
              )}
              {isGuest && (
                <span className="text-sm text-gray-400 font-light">Modo visitante</span>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-white/50 transition-colors font-light"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-light text-gray-800 mb-2">Board Cognitivo</h2>
            <p className="text-sm text-gray-500 font-light">
              Organize suas tarefas no seu ritmo
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-400 font-light text-sm">Carregando...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Coluna: Agora */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-normal text-gray-700">Agora</h3>
                  <span className="text-xs text-gray-400 font-light">{activeTasks.length}</span>
                </div>

                <div className="space-y-3 min-h-[400px]">
                  {activeTasks.length === 0 && !showAddTask ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-gray-400 font-light text-sm text-center mb-4">
                        Nada por aqui ainda
                      </p>
                      <button
                        onClick={() => setShowAddTask(true)}
                        className="text-xs text-gray-500 hover:text-gray-700 font-light"
                      >
                        + Adicionar algo
                      </button>
                    </div>
                  ) : (
                    <>
                      {activeTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdateState={handleUpdateTaskState}
                          onDelete={handleDeleteTask}
                          onAddStep={handleAddStep}
                          onToggleStep={handleToggleStep}
                          onRemoveStep={handleRemoveStep}
                        />
                      ))}

                      {showAddTask ? (
                        <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                          <input
                            type="text"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            placeholder="O que está na sua cabeça?"
                            className="w-full px-0 py-2 text-sm text-gray-700 font-light border-0 focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400"
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleAddTask}
                              className="px-3 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors font-light"
                            >
                              Adicionar
                            </button>
                            <button
                              onClick={() => {
                                setShowAddTask(false);
                                setTaskInput('');
                              }}
                              className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors font-light"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddTask(true)}
                          className="w-full p-3 border border-dashed border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors font-light text-xs"
                        >
                          + Adicionar outra
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Coluna: Pausado */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-normal text-gray-700">Pausado</h3>
                  <span className="text-xs text-gray-400 font-light">{pausedTasks.length}</span>
                </div>

                <div className="space-y-3 min-h-[400px]">
                  {pausedTasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-gray-400 font-light text-sm text-center">
                        Nenhuma tarefa pausada
                      </p>
                    </div>
                  ) : (
                    pausedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onUpdateState={handleUpdateTaskState}
                        onDelete={handleDeleteTask}
                        onAddStep={handleAddStep}
                        onToggleStep={handleToggleStep}
                        onRemoveStep={handleRemoveStep}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Coluna: Feito */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-normal text-gray-700">Feito</h3>
                  <span className="text-xs text-gray-400 font-light">{doneTasks.length}</span>
                </div>

                <div className="space-y-3 min-h-[400px]">
                  {doneTasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-gray-400 font-light text-sm text-center">
                        Nenhuma tarefa concluída
                      </p>
                    </div>
                  ) : (
                    doneTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onUpdateState={handleUpdateTaskState}
                        onDelete={handleDeleteTask}
                        onAddStep={handleAddStep}
                        onToggleStep={handleToggleStep}
                        onRemoveStep={handleRemoveStep}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {isGuest && tasks.length > 0 && (
            <div className="mt-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg">
              <p className="text-sm text-indigo-700 font-light text-center">
                Se quiser, você pode{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="underline hover:text-indigo-800"
                >
                  salvar isso em outros dispositivos
                </button>
              </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
