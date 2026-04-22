'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, getAccessToken } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { X, Search, Upload, Check, ImageIcon } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const UPLOADS_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
  : 'http://localhost:4000';

interface MediaItem {
  id: string;
  url: string;
  original_name: string;
  mime_type: string;
  size: number;
  created_at: string;
}

interface ImagePickerProps {
  /** URL hien tai */
  value: string;
  /** Callback khi chon anh */
  onChange: (url: string) => void;
  /** Label hien thi */
  label?: string;
  /** Placeholder cho input */
  placeholder?: string;
}

function fullUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${UPLOADS_BASE}${url}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImagePicker({ value, onChange, label = 'Hình ảnh', placeholder = 'Nhập URL hoặc chọn từ kho...' }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media library (chi anh)
  const fetchMedia = useCallback(async (p = 1, q = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: '20',
        mimeType: 'image',
      });
      if (q) params.set('search', q);
      const res = await api<any>(`/media?${params}`);
      if (res.success) {
        setItems(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
        setPage(p);
      }
    } catch (err) {
      console.error('Fetch media error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchMedia(1, search);
  }, [open, fetchMedia, search]);

  // Upload file moi tu modal
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const token = getAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      if (files.length === 1) {
        const formData = new FormData();
        formData.append('file', files[0]);
        const res = await fetch(`${API_BASE}/media/upload`, {
          method: 'POST', headers, credentials: 'include', body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          // Tu dong chon anh vua upload
          const url = json.data?.url || json.url;
          if (url) {
            onChange(fullUrl(url));
            setOpen(false);
            return;
          }
        }
      } else {
        const formData = new FormData();
        Array.from(files).forEach(f => formData.append('files', f));
        await fetch(`${API_BASE}/media/upload-multiple`, {
          method: 'POST', headers, credentials: 'include', body: formData,
        });
      }
      // Refresh list
      await fetchMedia(1, search);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Chon anh tu kho
  const selectImage = (item: MediaItem) => {
    onChange(fullUrl(item.url));
    setOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>

      {/* Input URL + nut chon tu kho */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="gap-1.5 shrink-0"
        >
          <ImageIcon className="w-4 h-4" />
          Chọn ảnh
        </Button>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-2 relative group">
          <Image
            src={value}
            alt="Preview"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-32 rounded-lg object-cover border border-slate-200"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Modal chon anh */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Chọn hình ảnh</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar: search + upload */}
            <div className="flex gap-2 p-4 border-b border-slate-50">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm ảnh..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-1.5 shrink-0"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Đang tải...' : 'Upload mới'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleUpload}
              />
            </div>

            {/* Grid anh */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ImageIcon className="mx-auto mb-2 w-8 h-8" />
                  <p className="text-sm">Chưa có ảnh nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {items.map((item) => {
                    const isSelected = value === fullUrl(item.url);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectImage(item)}
                        className={cn(
                          'relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:shadow-md group',
                          isSelected ? 'border-green-600 ring-2 ring-green-200' : 'border-transparent hover:border-slate-300',
                        )}
                      >
                        <Image
                          src={fullUrl(item.url)}
                          alt={item.original_name}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay ten file */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-sm text-white truncate">{item.original_name}</p>
                          <p className="text-sm text-white/70">{formatSize(item.size)}</p>
                        </div>
                        {/* Check icon khi chon */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-3 border-t border-slate-100">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchMedia(page - 1, search)}>
                  Trước
                </Button>
                <span className="text-sm text-slate-500">{page}/{totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => fetchMedia(page + 1, search)}>
                  Sau
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
