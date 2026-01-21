'use client';

import { useState, useEffect } from 'react';
import { TaskTimer } from '@/app/_domain/entities/Task';

interface PomodoroTimerProps {
  taskId: string;
  timer: TaskTimer;
  onStart: (taskId: string) => void;
  onPause: (taskId: string) => void;
  onReset: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function PomodoroTimer({
  taskId,
  timer,
  onStart,
  onPause,
  onReset,
  onComplete,
}: PomodoroTimerProps) {
  const [localSeconds, setLocalSeconds] = useState(timer.remainingSeconds);

  useEffect(() => {
    setLocalSeconds(timer.remainingSeconds);
  }, [timer.remainingSeconds, timer.mode, timer.isRunning]);

  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      setLocalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete(taskId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isRunning, taskId, onComplete]);

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
    return 'text-slate-400 dark:text-slate-400';
  };

  return (
    <div className="mb-3 p-3 bg-slate-800/50 dark:bg-slate-800/50 rounded-lg border border-slate-600 dark:border-slate-600">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-normal ${getModeColor()}`}>
          {getModeLabel()}
        </span>
        <span className="text-lg font-medium text-slate-200 dark:text-slate-200 tabular-nums">
          {formatTime(localSeconds)}
        </span>
      </div>

      <div className="flex gap-2">
        {!timer.isRunning ? (
          <button
            onClick={() => onStart(taskId)}
            className="flex-1 px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors font-normal"
          >
            {timer.mode === 'idle' ? 'Iniciar foco' : 'Retomar'}
          </button>
        ) : (
          <button
            onClick={() => onPause(taskId)}
            className="flex-1 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors font-normal"
          >
            Pausar
          </button>
        )}
        
        <button
          onClick={() => onReset(taskId)}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-600 dark:border-slate-600 rounded transition-colors font-normal"
        >
          Resetar
        </button>
      </div>

      {timer.mode !== 'idle' && (
        <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-500 text-center font-normal">
          {timer.mode === 'work' 
            ? 'Concentre-se na tarefa atual' 
            : 'Hora de descansar um pouco'}
        </p>
      )}
    </div>
  );
}
