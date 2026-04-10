'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import type { HomepageBlock } from '@/types/homepage';
import { BLOCK_ICONS } from '@/types/homepage';

interface Props {
  blocks: HomepageBlock[];
  onChange: (blocks: HomepageBlock[]) => void;
}

/** Danh sach block keo tha — cho phep sap xep thu tu va bat/tat hien thi */
export default function BlockSortableList({ blocks, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({
      ...b,
      order: i,
    }));
    onChange(reordered);
  };

  const toggleVisibility = (id: string) => {
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)),
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              onToggleVisibility={() => toggleVisibility(block.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/** Mot block item co the keo tha */
function SortableBlockItem({
  block,
  onToggleVisibility,
}: {
  block: HomepageBlock;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-slate-200 transition-all ${
        isDragging ? 'shadow-lg z-10 ring-2 ring-green-500' : ''
      } ${!block.visible ? 'opacity-50' : ''}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
        title="Kéo để sắp xếp"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Icon + label */}
      <span className="text-lg" role="img" aria-label={block.id}>
        {BLOCK_ICONS[block.id] || '📦'}
      </span>
      <span className="flex-1 text-sm font-medium text-slate-800">{block.label}</span>

      {/* Visibility toggle */}
      <button
        onClick={onToggleVisibility}
        className={`p-1.5 rounded-md transition-colors ${
          block.visible
            ? 'text-green-700 hover:bg-green-50'
            : 'text-slate-400 hover:bg-slate-100'
        }`}
        title={block.visible ? 'Ẩn block này' : 'Hiện block này'}
      >
        {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  );
}
