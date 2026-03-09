'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ReactNode } from 'react';

interface DroppableColumnProps {
  id: string;
  children: ReactNode;
  items: string[];
}

export function DroppableColumn({ id, children, items }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-3 min-h-[200px] h-full transition-all duration-200 ${
        isOver ? 'bg-slate-700/30 rounded-lg' : ''
      }`}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </div>
  );
}
