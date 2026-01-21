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

  // Cores baseadas no estado
  const stateColors = {
    active: {
      bg: 'bg-white',
      border: 'border-gray-200',
      hoverBorder: 'hover:border-indigo-200',
    },
    paused: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      hoverBorder: 'hover:border-amber-300',
    },
    done: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      hoverBorder: 'hover:border-green-300',
    },
  };

  const colors = stateColors[task.state];

  return (
    <div className={`p-3 ${colors.bg} border ${colors.border} rounded-lg group ${colors.hoverBorder} transition-colors`}>
      {/* Texto da tarefa */}
      <p className={`text-sm text-gray-700 font-light mb-2 ${task.state === 'done' ? 'line-through text-gray-600' : ''}`}>
        {task.text}
      </p>

      {/* Indicador de progresso dos passos */}
      {hasSteps && (
        <div className="mb-3">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 font-light"
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
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                {step.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`text-xs flex-1 ${step.completed ? 'line-through text-gray-400' : 'text-gray-600'} font-light`}>
                {step.text}
              </span>
              <button
                onClick={() => onRemoveStep(task.id, step.id)}
                className="opacity-0 group-hover/step:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
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
            className="w-full px-2 py-1 text-xs text-gray-700 font-light border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white"
            autoFocus
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleAddStep}
              className="px-2 py-0.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors font-light"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowAddStep(false);
                setStepInput('');
              }}
              className="px-2 py-0.5 text-xs text-gray-500 hover:text-gray-700 transition-colors font-light"
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
          className="ml-2 mb-3 text-xs text-gray-400 hover:text-gray-600 font-light"
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
          className="mb-3 text-xs text-indigo-500 hover:text-indigo-600 font-light flex items-center gap-1"
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
              className="text-xs text-amber-600 hover:text-amber-700 font-light"
              title="Pausar"
            >
              Pausar
            </button>
            <button
              onClick={() => onUpdateState(task.id, 'done')}
              className="text-xs text-green-600 hover:text-green-700 font-light"
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
              className="text-xs text-indigo-600 hover:text-indigo-700 font-light"
              title="Retomar"
            >
              Retomar
            </button>
            <button
              onClick={() => onUpdateState(task.id, 'done')}
              className="text-xs text-green-600 hover:text-green-700 font-light"
              title="Concluir"
            >
              Concluir
            </button>
          </>
        )}
        {task.state === 'done' && (
          <button
            onClick={() => onUpdateState(task.id, 'active')}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-light"
            title="Reabrir"
          >
            Reabrir
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-gray-400 hover:text-gray-600 font-light ml-auto"
          title="Remover"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
