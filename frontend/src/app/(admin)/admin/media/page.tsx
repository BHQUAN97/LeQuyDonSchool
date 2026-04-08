'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, getAccessToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const UPLOADS_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

// ==================== Types ====================

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  success: boolean;
  data: MediaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Helpers ====================

/** Format kich thuoc file cho de doc */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Kiem tra file co phai anh khong */
function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/** URL day du cua file */
function fullUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${UPLOADS_BASE}${url}`;
}

/** Format ngay gio */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ==================== Icons (inline SVG) ====================

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ==================== Filter options ====================

type FilterType = 'all' | 'image' | 'document';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'image', label: 'Hình ảnh' },
  { value: 'document', label: 'Tài liệu' },
];

// ==================== Component ====================

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Lay danh sach media tu API
  const fetchMedia = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);

      // Map filter sang mime type prefix
      if (filter === 'image') params.set('mimeType', 'image');
      else if (filter === 'document') params.set('mimeType', 'application');

      const res = await api<PaginatedResponse>(`/media?${params}`);
      if (res.success) {
        setItems(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Loi khi tai danh sach media:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    fetchMedia(1);
  }, [fetchMedia]);

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchMedia(1);
    }, 400);
  };

  // Upload file qua fetch (khong dung api() vi can FormData)
  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Upload that bai' }));
        throw new Error(err.message);
      }

      // Tai lai danh sach sau khi upload thanh cong
      await fetchMedia(1);
    } catch (err) {
      console.error('Upload error:', err);
      alert(err instanceof Error ? err.message : 'Upload that bai');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) uploadFile(files[0]);
    // Reset input de co the chon cung file
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) uploadFile(files[0]);
  };

  // Cap nhat alt text
  const updateAltText = async (id: string, altText: string) => {
    try {
      await api(`/media/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ alt_text: altText }),
      });
      // Cap nhat local state
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, alt_text: altText } : item)));
      if (selectedItem?.id === id) setSelectedItem((prev) => prev ? { ...prev, alt_text: altText } : null);
    } catch (err) {
      console.error('Cap nhat alt text that bai:', err);
    }
  };

  // Xoa media (soft delete)
  const deleteMedia = async (id: string) => {
    if (!confirm('Ban co chac muon xoa file nay?')) return;
    try {
      await api(`/media/${id}`, { method: 'DELETE' });
      setSelectedItem(null);
      await fetchMedia(pagination.page);
    } catch (err) {
      console.error('Xoa that bai:', err);
      alert(err instanceof Error ? err.message : 'Xoa that bai');
    }
  };

  // Copy URL vao clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(fullUrl(url));
  };

  return (
    <div className="space-y-4">
      {/* Tieu de + controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900">Quản lý Media</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Upload button */}
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
            <UploadIcon />
            {uploading ? 'Đang tải...' : 'Tải lên'}
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />

          {/* View toggle */}
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2', viewMode === 'grid' ? 'bg-slate-200 text-slate-900' : 'bg-white text-slate-500 hover:bg-slate-50')}
              title="Dạng lưới"
            >
              <GridIcon />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2', viewMode === 'list' ? 'bg-slate-200 text-slate-900' : 'bg-white text-slate-500 hover:bg-slate-50')}
              title="Dạng danh sách"
            >
              <ListIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm kiếm file..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'px-3 py-2 text-sm rounded-md whitespace-nowrap transition-colors',
                filter === opt.value
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drag & drop zone — chi hien khi khong co filter active */}
      {filter === 'all' && !search && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
            dragOver ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white hover:border-slate-400',
          )}
        >
          <UploadIcon className="mx-auto mb-2 text-slate-400" />
          <p className="text-slate-500 text-sm">Kéo thả file vào đây hoặc click để chọn</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileIcon className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500">Chưa có file nào</p>
        </div>
      )}

      {/* Grid view */}
      {!loading && items.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={cn(
                'bg-white rounded-lg border overflow-hidden cursor-pointer hover:shadow-md transition-shadow',
                selectedItem?.id === item.id ? 'ring-2 ring-green-600' : 'border-slate-200',
              )}
            >
              <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                {isImage(item.mime_type) ? (
                  <img src={fullUrl(item.url)} alt={item.alt_text || item.original_name} className="w-full h-full object-cover" />
                ) : (
                  <FileIcon className="text-slate-300 w-10 h-10" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-slate-700 truncate">{item.original_name}</p>
                <p className="text-xs text-slate-400">{formatFileSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {!loading && items.length > 0 && viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left p-3 font-medium text-slate-600 w-16"></th>
                <th className="text-left p-3 font-medium text-slate-600">Tên file</th>
                <th className="text-left p-3 font-medium text-slate-600 hidden sm:table-cell">Loại</th>
                <th className="text-left p-3 font-medium text-slate-600 hidden md:table-cell">Kích thước</th>
                <th className="text-left p-3 font-medium text-slate-600 hidden lg:table-cell">Ngày tải lên</th>
                <th className="text-right p-3 font-medium text-slate-600 w-20">
                  {/* Actions */}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    'border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors',
                    selectedItem?.id === item.id ? 'bg-green-50' : '',
                  )}
                >
                  <td className="p-3">
                    <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                      {isImage(item.mime_type) ? (
                        <img src={fullUrl(item.url)} alt={item.alt_text || ''} className="w-full h-full object-cover" />
                      ) : (
                        <FileIcon className="text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-slate-700 truncate max-w-[200px]">{item.original_name}</p>
                  </td>
                  <td className="p-3 text-slate-500 hidden sm:table-cell">{item.mime_type.split('/')[1]}</td>
                  <td className="p-3 text-slate-500 hidden md:table-cell">{formatFileSize(item.size)}</td>
                  <td className="p-3 text-slate-500 hidden lg:table-cell">{formatDate(item.created_at)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMedia(item.id); }}
                      className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchMedia(pagination.page - 1)}
          >
            Trước
          </Button>
          <span className="text-sm text-slate-600">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchMedia(pagination.page + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Detail panel — modal overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedItem(null)}>
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900 truncate pr-4">Chi tiết file</h2>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded hover:bg-slate-100">
                <XIcon />
              </button>
            </div>

            {/* Preview */}
            <div className="p-4">
              <div className="bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden mb-4" style={{ minHeight: 200 }}>
                {isImage(selectedItem.mime_type) ? (
                  <img src={fullUrl(selectedItem.url)} alt={selectedItem.alt_text || ''} className="max-w-full max-h-[300px] object-contain" />
                ) : (
                  <div className="py-12 text-center">
                    <FileIcon className="mx-auto text-slate-300 w-16 h-16 mb-2" />
                    <p className="text-slate-500 text-sm">{selectedItem.mime_type}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-slate-500 text-xs">Tên gốc</label>
                  <p className="text-slate-800 font-medium">{selectedItem.original_name}</p>
                </div>

                <div>
                  <label className="text-slate-500 text-xs">Kích thước</label>
                  <p className="text-slate-800">{formatFileSize(selectedItem.size)}</p>
                </div>

                <div>
                  <label className="text-slate-500 text-xs">Loại file</label>
                  <p className="text-slate-800">{selectedItem.mime_type}</p>
                </div>

                <div>
                  <label className="text-slate-500 text-xs">Ngày tải lên</label>
                  <p className="text-slate-800">{formatDate(selectedItem.created_at)}</p>
                </div>

                {/* URL + copy */}
                <div>
                  <label className="text-slate-500 text-xs">URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={fullUrl(selectedItem.url)} readOnly className="text-xs bg-slate-50" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyUrl(selectedItem.url)}
                      title="Sao chép URL"
                    >
                      <CopyIcon />
                    </Button>
                  </div>
                </div>

                {/* Alt text — editable */}
                <div>
                  <label className="text-slate-500 text-xs">Alt text</label>
                  <Input
                    value={selectedItem.alt_text || ''}
                    placeholder="Nhập mô tả hình ảnh..."
                    onChange={(e) =>
                      setSelectedItem((prev) => prev ? { ...prev, alt_text: e.target.value } : null)
                    }
                    onBlur={(e) => updateAltText(selectedItem.id, e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Delete button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => deleteMedia(selectedItem.id)}
                >
                  <TrashIcon /> Xóa file
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
