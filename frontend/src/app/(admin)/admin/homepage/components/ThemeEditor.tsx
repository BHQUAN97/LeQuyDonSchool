'use client';

import Image from 'next/image';
import type { HomepageTheme } from '@/types/homepage';
import { FONT_OPTIONS, SPACING_OPTIONS } from '@/types/homepage';

interface Props {
  theme: HomepageTheme;
  onChange: (theme: HomepageTheme) => void;
}

/** Form chinh sua giao dien trang chu — mau sac, font, logo, spacing */
export default function ThemeEditor({ theme, onChange }: Props) {
  const update = <K extends keyof HomepageTheme>(key: K, value: HomepageTheme[K]) => {
    onChange({ ...theme, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* ── Mau sac ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Màu sắc</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorField
            label="Màu chính (Primary)"
            value={theme.primaryColor}
            onChange={(v) => update('primaryColor', v)}
          />
          <ColorField
            label="Màu nhấn (Accent)"
            value={theme.accentColor}
            onChange={(v) => update('accentColor', v)}
          />
        </div>

        {/* Preview swatch */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-slate-500">Xem trước:</span>
          <div
            className="w-8 h-8 rounded-md border border-slate-200"
            style={{ backgroundColor: theme.primaryColor }}
            title="Primary"
          />
          <div
            className="w-8 h-8 rounded-md border border-slate-200"
            style={{ backgroundColor: theme.accentColor }}
            title="Accent"
          />
        </div>
      </div>

      {/* ── Font ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Font chữ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Font tiêu đề"
            value={theme.headingFont}
            options={FONT_OPTIONS}
            onChange={(v) => update('headingFont', v)}
          />
          <SelectField
            label="Font nội dung"
            value={theme.bodyFont}
            options={FONT_OPTIONS}
            onChange={(v) => update('bodyFont', v)}
          />
        </div>
      </div>

      {/* ── Logo ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Logo</h3>

        {theme.logoUrl && (
          <div className="mb-3">
            <Image
              src={theme.logoUrl}
              alt="Logo preview"
              width={0}
              height={0}
              sizes="100vw"
              className="h-16 w-auto object-contain rounded border border-slate-200 p-1"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">URL Logo</label>
          <input
            type="text"
            value={theme.logoUrl || ''}
            onChange={(e) => update('logoUrl', e.target.value || null)}
            placeholder="https://... hoặc để trống dùng mặc định"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* ── Spacing ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Khoảng cách (Spacing)</h3>
        <div className="flex gap-3">
          {SPACING_OPTIONS.map((opt) => {
            const isSelected = theme.spacing === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update('spacing', opt.value as HomepageTheme['spacing'])}
                className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm transition-all ${
                  isSelected
                    ? 'border-green-600 bg-green-50 text-green-800 font-medium'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Color picker ket hop input[type=color] + text hex */
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-md border border-slate-300 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
        />
      </div>
    </div>
  );
}

/** Select field voi label */
function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
