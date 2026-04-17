'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, Check, Search, Image as ImageIcon } from 'lucide-react';
import { api, getAccessToken } from '@/lib/api';
import type { Media, PaginatedResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

function mediaUrl(url: string) {
  if (url.startsWith('http')) return url;
  return `${SITE_URL}${url}`;
}

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  /** Chi hien anh (image/*) hoac tat ca */
  filterImages?: boolean;
}

/** Modal chon anh tu Media library hoac upload moi */
export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
  filterImages = true,
}: MediaPickerModalProps) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: '1', limit: '30' });
      if (search) params.set('search', search);
      if (filterImages) params.set('mimeType', 'image');
      const res = await api<PaginatedResponse<Media>>(`/media?${params}`);
      if (res.success) setItems(res.data);
    } catch (err) {
      console.error('Loi tai media:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterImages]);

  useEffect(() => {
    if (open) {
      setSelected(null);
      fetchMedia();
    }
  }, [open, fetchMedia]);

  // Dong modal voi phim ESC — UX chuan cho dialog
  useEffect(() => {
    if (!open) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [open, onClose]);

  /** Upload file moi */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        credentials: 'include',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          // Chon luon file vua upload
          onSelect(mediaUrl(json.data.url));
          onClose();
          return;
        }
      }
      // Reload danh sach neu upload thanh cong nhung khong co data
      fetchMedia();
    } catch (err) {
      console.error('Loi upload:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chọn hình ảnh từ thư viện"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Chọn hình ảnh</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar: search + upload */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-green-800 transition-colors">
            <Upload size={16} />
            {uploading ? 'Đang tải...' : 'Tải lên'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Media grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              Đang tải...
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ImageIcon size={48} className="mb-3 opacity-40" />
              <p className="text-sm">Chưa có hình ảnh nào</p>
              <p className="text-sm mt-1">Nhấn &ldquo;Tải lên&rdquo; để thêm hình ảnh mới</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {items.map((m) => {
                const url = mediaUrl(m.url);
                const isSelected = selected === url;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelected(url)}
                    onDoubleClick={() => { onSelect(url); onClose(); }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-green-600 ring-2 ring-green-200'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={url}
                      alt={m.alt_text || m.original_name}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-0.5">
                      <p className="text-sm text-white truncate">{m.original_name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Chọn
          </button>
        </div>
      </div>
    </div>
  );
}
