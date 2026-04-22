'use client';

/**
 * SortableList — generic drag-drop list helper using @dnd-kit.
 *
 * Wraps DndContext + SortableContext + keyboard sensor. Consumer passes:
 *  - `items`: T[] to render
 *  - `getId`: (item) => string stable id
 *  - `onReorder`: (newItems) => void called after drop with reordered array
 *  - `renderItem`: (item, dragHandle) => ReactNode, where `dragHandle` is a
 *     ReactNode the consumer MUST render somewhere inside the row so the user
 *     has a visible handle to start a drag.
 *
 * Keyboard: Tab to focus handle, Space to pick up, arrow keys to move, Space to drop.
 */

import { ReactNode } from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  onReorder: (newItems: T[]) => void;
  renderItem: (item: T, dragHandle: ReactNode) => ReactNode;
  /** Optional: disable drag (e.g. while saving) */
  disabled?: boolean;
}

export default function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  disabled = false,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((it) => getId(it) === active.id);
    const newIndex = items.findIndex((it) => getId(it) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  const ids = items.map(getId);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy} disabled={disabled}>
        {items.map((item) => (
          <SortableRow key={getId(item)} id={getId(item)} disabled={disabled}>
            {(handle) => renderItem(item, handle)}
          </SortableRow>
        ))}
      </SortableContext>
    </DndContext>
  );
}

// ─── INTERNAL: single sortable row with drag handle ──────────────────

interface SortableRowProps {
  id: string;
  disabled?: boolean;
  children: (dragHandle: ReactNode) => ReactNode;
}

function SortableRow({ id, disabled, children }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: 'relative',
  };

  const dragHandle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      disabled={disabled}
      className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label="Kéo để thay đổi thứ tự"
      title="Kéo để thay đổi thứ tự"
    >
      <GripVertical className="w-4 h-4" />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style}>
      {children(dragHandle)}
    </div>
  );
}
