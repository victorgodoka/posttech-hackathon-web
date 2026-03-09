'use client';

import { useState, useEffect } from 'react';
import { TaskTimer } from '@/app/_domain/entities/Task';

interface PomodoroTimerProps {
  taskId: string;
  timer: TaskTimer;
  onStart?: (taskId: string) => void;
  onPause?: (taskId: string) => void;
  onReset?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  hasActiveTimer?: boolean;
}

export function PomodoroTimer({
  taskId,
  timer,
  onStart,
  onPause,
  onReset,
  onComplete,
  hasActiveTimer = false,
}: PomodoroTimerProps) {
  const [localSeconds, setLocalSeconds] = useState(timer.remainingSeconds);

  // Atualizar localSeconds quando o timer mudar de estado (pausar/resetar)
  useEffect(() => {
    if (!timer.isRunning) {
      setLocalSeconds(timer.remainingSeconds);
    }
  }, [timer.remainingSeconds, timer.isRunning]);

  // Intervalo para atualizar o display do timer
  useEffect(() => {
    if (!timer.isRunning || !timer.startedAt) {
      return;
    }

    // Atualizar imediatamente
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - timer.startedAt!) / 1000);
      const remaining = Math.max(0, timer.remainingSeconds - elapsed);
      
      setLocalSeconds(remaining);
      
      if (remaining <= 0) {
        onComplete?.(taskId);
      }
    };

    updateTimer(); // Primeira atualização imediata
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startedAt, taskId, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeLabel = (): string => {
    if (timer.mode === 'work') return 'Foco';
    if (timer.mode === 'break') return 'Pausa';
    return 'Pronto';
  };

  const getModeColor = (): string => {
    if (timer.mode === 'work') return 'text-indigo-400 dark:text-indigo-400';
    if (timer.mode === 'break') return 'text-green-400 dark:text-green-400';
    return 'text-dark-text-secondary';
  };

  return (
    <div className="mb-3 p-3 bg-dark-bg-elevated/50 dark:bg-dark-bg-elevated/50 rounded-lg border border-dark-border-default dark:border-dark-border-default">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-normal ${getModeColor()}`}>
          {getModeLabel()}
        </span>
        <span className="text-lg font-medium text-dark-text-primary tabular-nums">
          {formatTime(localSeconds)}
        </span>
      </div>

      <div className="flex gap-2">
        {!timer.isRunning ? (
          <button
            onClick={() => !hasActiveTimer && onStart?.(taskId)}
            disabled={hasActiveTimer}
            className="flex-1 px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 disabled:bg-dark-surface-muted disabled:text-dark-text-muted disabled:cursor-not-allowed text-white rounded transition-colors font-normal"
            title={hasActiveTimer ? 'Outra tarefa já está em foco' : ''}
          >
            {timer.mode === 'idle' ? 'Iniciar foco' : 'Retomar'}
          </button>
        ) : (
          <button
            onClick={() => onPause?.(taskId)}
            className="flex-1 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors font-normal"
          >
            Pausar
          </button>
        )}
        
        <button
          onClick={() => onReset?.(taskId)}
          className="px-3 py-1.5 text-xs text-dark-text-secondary hover:text-dark-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary border border-dark-border-default dark:border-dark-border-default rounded transition-colors font-normal"
        >
          Resetar
        </button>
      </div>

      {timer.mode !== 'idle' && (
        <p className="mt-2 text-[10px] text-dark-text-muted dark:text-dark-text-muted text-center font-normal">
          {timer.mode === 'work' 
            ? 'Concentre-se na tarefa atual' 
            : 'Hora de descansar um pouco'}
        </p>
      )}
    </div>
  );
}
