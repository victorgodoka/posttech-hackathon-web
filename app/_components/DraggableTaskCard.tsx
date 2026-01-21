'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskState } from '@/app/_domain/entities/Task';
import { TaskCard } from './TaskCard';

interface DraggableTaskCardProps {
  task: Task;
  onUpdateState: (taskId: string, newState: TaskState) => void;
  onDelete: (taskId: string) => void;
  onAddStep: (taskId: string, stepText: string) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
  onRemoveStep: (taskId: string, stepId: string) => void;
}

export function DraggableTaskCard({
  task,
  onUpdateState,
  onDelete,
  onAddStep,
  onToggleStep,
  onRemoveStep,
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onUpdateState={onUpdateState}
        onDelete={onDelete}
        onAddStep={onAddStep}
        onToggleStep={onToggleStep}
        onRemoveStep={onRemoveStep}
      />
    </div>
  );
}
