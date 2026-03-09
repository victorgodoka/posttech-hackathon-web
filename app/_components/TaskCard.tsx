'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskState, TaskStep } from '@/app/_domain/entities/Task';
import { getCategoryConfig } from '@/app/_domain/entities/TaskCategory';
import { Icon } from '@iconify/react';
import { PomodoroTimer } from './PomodoroTimer';
import { useCognitiveLayout } from './hooks/useCognitiveLayout';

interface TaskCardProps {
  task: Task;
  onUpdateState: (taskId: string, newState: TaskState) => void;
  onDelete: (taskId: string) => void;
  onAddStep: (taskId: string, stepText: string) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
  onRemoveStep: (taskId: string, stepId: string) => void;
  onStartTimer?: (taskId: string) => void;
  onPauseTimer?: (taskId: string) => void;
  onResetTimer?: (taskId: string) => void;
  onCompleteTimer?: (taskId: string) => void;
  isPrimaryFocus?: boolean;
}

export function TaskCard({
  task,
  onUpdateState,
  onDelete,
  onAddStep,
  onToggleStep,
  onRemoveStep,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onCompleteTimer,
  isPrimaryFocus = true,
}: TaskCardProps) {
  const layout = useCognitiveLayout();
  const [showSteps, setShowSteps] = useState(false);
  const [showAddStep, setShowAddStep] = useState(false);
  const [stepInput, setStepInput] = useState('');

  const handleAddStep = () => {
    if (stepInput.trim()) {
      onAddStep(task.id, stepInput.trim());
      setStepInput('');
      setShowAddStep(false);
    }
  };

  const completedSteps = task.steps.filter(s => s.completed).length;
  const totalSteps = task.steps.length;
  const hasSteps = totalSteps > 0;

  // Cores baseadas no estado (dark mode)
  const stateColors = {
    active: {
      bg: 'bg-slate-800/40 dark:bg-slate-800/40',
      border: 'border-slate-700/50 dark:border-slate-700/50',
      hoverBorder: 'hover:border-slate-600 dark:hover:border-slate-600',
    },
    paused: {
      bg: 'bg-indigo-950/40 dark:bg-indigo-950/40',
      border: 'border-indigo-500/50 dark:border-indigo-500/50',
      hoverBorder: 'hover:border-indigo-400 dark:hover:border-indigo-400',
    },
    done: {
      bg: 'bg-emerald-900/20 dark:bg-emerald-900/20',
      border: 'border-emerald-800/50 dark:border-emerald-800/50',
      hoverBorder: 'hover:border-emerald-700/60 dark:hover:border-emerald-700/60',
    },
  };

  const colors = stateColors[task.state];

  const categoryConfig = getCategoryConfig(task.category);

  return (
    <div className={`p-3 ${colors.bg} border-2 ${colors.border} rounded-lg group ${colors.hoverBorder} transition-all duration-300 ease-out animate-fade-slide-in ${task.state === 'paused' ? 'shadow-lg shadow-indigo-500/20' : ''}`}>
      {/* Categoria e Texto da tarefa */}
      <div className="flex items-start gap-2 mb-2">
        <Icon icon={categoryConfig.icon} className={`w-5 h-5 ${categoryConfig.color} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-base text-slate-200 dark:text-slate-200 font-normal flex-1 ${task.state === 'done' ? 'line-through text-slate-400 dark:text-slate-400' : ''}`}>
              {task.text}
            </p>
            {task.state === 'paused' && task.timer?.isRunning && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-xs text-indigo-300 font-medium">Em execução</span>
              </div>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-slate-400 dark:text-slate-400 font-normal mt-1">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Timer Pomodoro - apenas se tarefa usar Pomodoro e se densidade permitir */}
      {layout.showTimer && task.usePomodoro && (task.state === 'active' || task.state === 'paused') && onStartTimer && onPauseTimer && onResetTimer && onCompleteTimer && (
        <PomodoroTimer
          taskId={task.id}
          timer={task.timer}
          onStart={onStartTimer}
          onPause={onPauseTimer}
          onReset={onResetTimer}
          onComplete={onCompleteTimer}
        />
      )}

      {/* Botão Iniciar para tarefas sem Pomodoro em A fazer */}
      {!task.usePomodoro && task.state === 'active' && (
        <div className="mb-3">
          <button
            onClick={() => onUpdateState(task.id, 'paused')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-normal"
            aria-label="Iniciar tarefa"
          >
            <Icon icon="mdi:play" className="w-5 h-5" />
            Iniciar
          </button>
        </div>
      )}

      {/* Estado de aguardando - tarefas secundárias em foco */}
      {task.state === 'active' && !isPrimaryFocus && (
        <div className="mb-3 p-2 bg-slate-800/30 dark:bg-slate-800/30 rounded border border-slate-600/30 dark:border-slate-600/30">
          <p className="text-xs text-slate-400 dark:text-slate-400 font-normal text-center">
            Aguardando
          </p>
        </div>
      )}

      {/* Indicador de progresso dos passos - se densidade permitir */}
      {layout.showSteps && hasSteps && (
        <div className="mb-3">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 font-normal"
          >
            <svg className={`w-3 h-3 transition-transform ${showSteps ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {completedSteps}/{totalSteps} passos
          </button>
        </div>
      )}

      {/* Lista de passos (expansível) - se densidade permitir */}
      {layout.showSteps && showSteps && hasSteps && (
        <div className="mb-3 ml-2 space-y-2">
          {task.steps.map((step) => (
            <div key={step.id} className="flex items-start gap-2 group/step">
              <button
                onClick={() => onToggleStep(task.id, step.id)}
                className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                  step.completed
                    ? 'bg-indigo-500 border-indigo-500 dark:bg-indigo-500 dark:border-indigo-500'
                    : 'border-slate-500 hover:border-indigo-400 dark:border-slate-500 dark:hover:border-indigo-400'
                }`}
              >
                {step.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`text-sm flex-1 ${step.completed ? 'line-through text-slate-400 dark:text-slate-400' : 'text-slate-300 dark:text-slate-300'} font-normal`}>
                {step.text}
              </span>
              <button
                onClick={() => onRemoveStep(task.id, step.id)}
                className="opacity-0 group-hover/step:opacity-100 text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-opacity"
                title="Remover passo"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Adicionar novo passo - se densidade permitir */}
      {layout.showSteps && showSteps && showAddStep && (
        <div className="mb-3 ml-2">
          <input
            type="text"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
            placeholder="Próximo passo..."
            className="w-full px-2 py-1 text-sm text-slate-100 dark:text-slate-100 font-normal border border-slate-600 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500 bg-slate-600 dark:bg-slate-600"
            autoFocus
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleAddStep}
              className="px-2 py-0.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors font-normal"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowAddStep(false);
                setStepInput('');
              }}
              className="px-2 py-0.5 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-normal"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Botão para adicionar passo - se densidade permitir */}
      {layout.showSteps && showSteps && !showAddStep && (
        <button
          onClick={() => setShowAddStep(true)}
          className="ml-2 mb-3 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 font-normal"
        >
          + Adicionar passo
        </button>
      )}

      {/* Botão para quebrar em passos (se não tem passos ainda) - se densidade permitir */}
      {layout.showSteps && !hasSteps && (task.state === 'active' || task.state === 'paused') && (
        <button
          onClick={() => {
            setShowSteps(true);
            setShowAddStep(true);
          }}
          className="mb-3 text-sm text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 font-normal flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Quebrar em passos
        </button>
      )}

      {/* Ações da tarefa - adaptadas pela complexidade visual */}
      <div className="flex items-center gap-3 pt-2 mt-2 border-t border-slate-600/30 opacity-0 group-hover:opacity-100 transition-opacity">
        {task.state === 'active' && (
          <>
            {layout.maxActions >= 1 && (
              <button
                onClick={() => onUpdateState(task.id, 'done')}
                className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 dark:text-emerald-400 dark:hover:text-emerald-300 font-normal transition-colors"
                title="Marcar como concluída"
                aria-label="Marcar como concluída"
              >
                <Icon icon="mdi:check-circle" className="w-4 h-4" />
                Concluir
              </button>
            )}
          </>
        )}
        {task.state === 'paused' && (
          <>
            {layout.maxActions >= 1 && (
              <button
                onClick={() => onUpdateState(task.id, 'done')}
                className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 dark:text-emerald-400 dark:hover:text-emerald-300 font-normal transition-colors"
                title="Marcar como concluída"
                aria-label="Marcar como concluída"
              >
                <Icon icon="mdi:check-circle" className="w-4 h-4" />
                Concluir
              </button>
            )}
          </>
        )}
        {task.state === 'done' && layout.maxActions >= 1 && (
          <button
            onClick={() => onUpdateState(task.id, 'active')}
            className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 font-normal transition-colors"
            title="Reabrir tarefa"
            aria-label="Reabrir tarefa"
          >
            <Icon icon="mdi:refresh" className="w-4 h-4" />
            Reabrir
          </button>
        )}
        {layout.showSecondaryActions && (
          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 dark:text-slate-500 dark:hover:text-red-400 font-normal ml-auto transition-colors"
            title="Remover tarefa"
            aria-label="Remover tarefa"
          >
            <Icon icon="mdi:delete" className="w-4 h-4" />
            Remover
          </button>
        )}
      </div>
    </div>
  );
}
