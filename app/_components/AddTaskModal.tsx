'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { TaskCategory, TASK_CATEGORIES, getCategoryConfig } from '@/app/_domain/entities/TaskCategory';

interface AddTaskModalProps {
  mode: 'simple' | 'full';
  onAdd: (text: string, category: TaskCategory, description?: string, usePomodoro?: boolean) => void;
  onCancel: () => void;
}

export function AddTaskModal({ mode, onAdd, onCancel }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('other');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [usePomodoro, setUsePomodoro] = useState(true);

  const handleSubmit = () => {
    if (taskName.trim()) {
      onAdd(
        taskName.trim(),
        category,
        mode === 'full' && description.trim() ? description.trim() : undefined,
        mode === 'full' ? usePomodoro : true
      );
      setTaskName('');
      setDescription('');
      setCategory('other');
      setUsePomodoro(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const selectedCategoryConfig = getCategoryConfig(category);

  return (
    <div className="space-y-4 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Nome da Tarefa */}
        <div className='w-full'>
          <label htmlFor="task-name" className="block text-sm text-slate-300 mb-2 font-normal">
            Nome da tarefa
          </label>
          <input
            id="task-name"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Estudar para prova de matemática"
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-normal text-base"
            autoFocus
            aria-label="Digite o nome da tarefa"
          />
        </div>

        {/* Categoria */}
        <div className='w-full md:max-w-48'>
          <label className="block text-sm text-slate-300 mb-2 font-normal">
            Categoria
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCategoryPicker(!showCategoryPicker)}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-left flex items-center gap-2 hover:border-slate-500 transition-colors"
              aria-label="Selecionar categoria"
              aria-expanded={showCategoryPicker}
            >
              <Icon icon={selectedCategoryConfig.icon} className={`w-5 h-5 ${selectedCategoryConfig.color}`} />
              <span className="text-slate-100 font-normal flex-1">{selectedCategoryConfig.label}</span>
              <Icon
                icon={showCategoryPicker ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                className="w-5 h-5 text-slate-400"
              />
            </button>

            {showCategoryPicker && (
              <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {TASK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setShowCategoryPicker(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${category === cat.id
                          ? 'bg-indigo-500/20 border border-indigo-500/50'
                          : 'hover:bg-slate-700/50'
                        }`}
                      aria-label={`Selecionar categoria ${cat.label}`}
                    >
                      <Icon icon={cat.icon} className={`w-5 h-5 ${cat.color}`} />
                      <span className="text-slate-100 font-normal text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Descrição e Pomodoro (apenas no modo full) */}
      {mode === 'full' && (
        <>
          <div>
            <label htmlFor="task-description" className="block text-sm text-slate-300 mb-2 font-normal">
              Descrição <span className="text-slate-500">(opcional)</span>
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Adicione detalhes sobre a tarefa..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-normal text-base resize-none"
              aria-label="Digite a descrição da tarefa (opcional)"
            />
          </div>
          
          {/* Checkbox Pomodoro */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="use-pomodoro"
              checked={usePomodoro}
              onChange={(e) => setUsePomodoro(e.target.checked)}
              className="w-4 h-4 bg-slate-900/50 border border-slate-600 rounded text-indigo-500 focus:ring-2 focus:ring-indigo-500"
              aria-label="Usar método Pomodoro"
            />
            <label htmlFor="use-pomodoro" className="flex items-center gap-2 text-sm text-slate-300 font-normal cursor-pointer">
              <Icon icon="mdi:timer" className="w-5 h-5 text-indigo-400" />
              Usar método Pomodoro
            </label>
          </div>
        </>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSubmit}
          disabled={!taskName.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-normal"
          aria-label="Adicionar tarefa"
        >
          <Icon icon="mdi:plus-circle" className="w-5 h-5" />
          Adicionar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors font-normal"
          aria-label="Cancelar"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
