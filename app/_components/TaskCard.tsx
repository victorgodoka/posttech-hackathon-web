'use client';

import { useState } from 'react';
import { Task, TaskState, TaskStep } from '@/app/_domain/entities/Task';

interface TaskCardProps {
  task: Task;
  onUpdateState: (taskId: string, newState: TaskState) => void;
  onDelete: (taskId: string) => void;
  onAddStep: (taskId: string, stepText: string) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
  onRemoveStep: (taskId: string, stepId: string) => void;
}

export function TaskCard({
  task,
  onUpdateState,
  onDelete,
  onAddStep,
  onToggleStep,
  onRemoveStep,
}: TaskCardProps) {
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
      bg: 'bg-slate-700 dark:bg-slate-700',
      border: 'border-slate-600 dark:border-slate-600',
      hoverBorder: 'hover:border-indigo-500 dark:hover:border-indigo-500',
    },
    paused: {
      bg: 'bg-amber-900/30 dark:bg-amber-900/30',
      border: 'border-amber-700 dark:border-amber-700',
      hoverBorder: 'hover:border-amber-600 dark:hover:border-amber-600',
    },
    done: {
      bg: 'bg-green-900/30 dark:bg-green-900/30',
      border: 'border-green-700 dark:border-green-700',
      hoverBorder: 'hover:border-green-600 dark:hover:border-green-600',
    },
  };

  const colors = stateColors[task.state];

  return (
    <div className={`p-3 ${colors.bg} border ${colors.border} rounded-lg group ${colors.hoverBorder} transition-colors`}>
      {/* Texto da tarefa */}
      <p className={`text-base text-slate-200 dark:text-slate-200 font-normal mb-2 ${task.state === 'done' ? 'line-through text-slate-400 dark:text-slate-400' : ''}`}>
        {task.text}
      </p>

      {/* Indicador de progresso dos passos */}
      {hasSteps && (
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

      {/* Lista de passos (expansível) */}
      {showSteps && hasSteps && (
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

      {/* Adicionar novo passo */}
      {showSteps && showAddStep && (
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

      {/* Botão para adicionar passo */}
      {showSteps && !showAddStep && (
        <button
          onClick={() => setShowAddStep(true)}
          className="ml-2 mb-3 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 font-normal"
        >
          + Adicionar passo
        </button>
      )}

      {/* Botão para quebrar em passos (se não tem passos ainda) */}
      {!hasSteps && task.state === 'active' && (
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

      {/* Ações da tarefa */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {task.state === 'active' && (
          <>
            <button
              onClick={() => onUpdateState(task.id, 'paused')}
              className="text-sm text-amber-400 hover:text-amber-300 dark:text-amber-400 dark:hover:text-amber-300 font-normal"
              title="Pausar"
            >
              Pausar
            </button>
            <button
              onClick={() => onUpdateState(task.id, 'done')}
              className="text-sm text-green-400 hover:text-green-300 dark:text-green-400 dark:hover:text-green-300 font-normal"
              title="Concluir"
            >
              Concluir
            </button>
          </>
        )}
        {task.state === 'paused' && (
          <>
            <button
              onClick={() => onUpdateState(task.id, 'active')}
              className="text-sm text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 font-normal"
              title="Retomar"
            >
              Retomar
            </button>
            <button
              onClick={() => onUpdateState(task.id, 'done')}
              className="text-sm text-green-400 hover:text-green-300 dark:text-green-400 dark:hover:text-green-300 font-normal"
              title="Concluir"
            >
              Concluir
            </button>
          </>
        )}
        {task.state === 'done' && (
          <button
            onClick={() => onUpdateState(task.id, 'active')}
            className="text-sm text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 font-normal"
            title="Reabrir"
          >
            Reabrir
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-slate-500 hover:text-slate-300 dark:text-slate-500 dark:hover:text-slate-300 font-normal ml-auto"
          title="Remover"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
