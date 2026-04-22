'use client';

import dynamic from 'next/dynamic';

/** Lazy-load Tiptap editor to keep it out of the admin shell bundle */
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-slate-300 overflow-hidden">
      <div className="border-b border-slate-200 px-2 py-1.5 bg-slate-50 h-10 animate-pulse" />
      <div className="min-h-[300px] p-4 text-sm text-slate-400">Đang tải editor...</div>
    </div>
  ),
});

export default RichTextEditor;
