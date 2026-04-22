'use client';

import { useEffect } from 'react';

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    // Log error to the console so it shows up in devtools
    console.error('[Admin Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5 text-red-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Đã xảy ra lỗi</h1>
            <p className="text-sm text-slate-500">Không thể tải trang quản trị</p>
          </div>
        </div>

        {error.message && (
          <pre className="text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 whitespace-pre-wrap break-words max-h-40 overflow-auto">
            {error.message}
          </pre>
        )}

        {error.digest && (
          <p className="text-xs text-slate-400">Error ID: {error.digest}</p>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors"
          >
            Thử lại
          </button>
          <button
            onClick={() => (window.location.href = '/admin')}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
