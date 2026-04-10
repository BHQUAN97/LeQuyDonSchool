'use client';

import type { HomepageBlock } from '@/types/homepage';
import { VALID_BLOCK_VARIANTS, BLOCK_ICONS } from '@/types/homepage';

interface Props {
  blocks: HomepageBlock[];
  onChange: (blocks: HomepageBlock[]) => void;
}

/** Chon variant (kieu bo cuc) cho tung block dang hien thi */
export default function LayoutVariantPicker({ blocks, onChange }: Props) {
  const visibleBlocks = blocks.filter((b) => b.visible);

  const setVariant = (blockId: string, variant: string) => {
    onChange(
      blocks.map((b) => (b.id === blockId ? { ...b, variant } : b)),
    );
  };

  if (visibleBlocks.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-8">
        Chưa có block nào đang hiển thị. Bật hiển thị ở tab &quot;Bố cục&quot;.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {visibleBlocks.map((block) => {
        const variants = VALID_BLOCK_VARIANTS[block.id] || [];
        if (variants.length === 0) return null;

        return (
          <div key={block.id} className="bg-white rounded-lg border border-slate-200 p-4">
            {/* Block header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{BLOCK_ICONS[block.id] || '📦'}</span>
              <h3 className="text-sm font-semibold text-slate-800">{block.label}</h3>
            </div>

            {/* Variant options — radio-style cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {variants.map((v) => {
                const isSelected = block.variant === v.value;
                return (
                  <button
                    key={v.value}
                    onClick={() => setVariant(block.id, v.value)}
                    className={`px-4 py-3 rounded-lg border-2 text-sm text-left transition-all ${
                      isSelected
                        ? 'border-green-600 bg-green-50 text-green-800 font-medium'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
