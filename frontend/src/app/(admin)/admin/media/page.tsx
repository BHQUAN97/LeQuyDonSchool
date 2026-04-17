'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, getAccessToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LayoutGrid, List, Upload, File, X, Copy, Trash2, Search } from 'lucide-react';
import Image from 'next/image';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
// Khi NEXT_PUBLIC_API_URL la relative ('/api') → UPLOADS_BASE = '' → dung Next.js rewrite proxy /uploads
// Khi undefined → fallback localhost cho local dev khong co .env
const UPLOADS_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
  : 'http://localhost:4000';

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

  // Confirm dialog va error cho media
  const [deleteMediaId, setDeleteMediaId] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState('');

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

  // Debounce search — dung searchInput rieng, chi cap nhat search sau delay
  // useEffect tren fetchMedia (phu thuoc search) se tu dong goi API
  const [searchInput, setSearchInput] = useState('');
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
    }, 400);
  };

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState<{ total: number; done: number } | null>(null);

  // Upload nhieu file cung luc qua endpoint upload-multiple
  const uploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress({ total: files.length, done: 0 });

    try {
      const token = getAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      if (files.length === 1) {
        // Upload 1 file — dung endpoint cu
        const formData = new FormData();
        formData.append('file', files[0]);
        const res = await fetch(`${API_BASE}/media/upload`, {
          method: 'POST', headers, credentials: 'include', body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Upload thất bại' }));
          throw new Error(err.message);
        }
        setUploadProgress({ total: 1, done: 1 });
      } else {
        // Upload nhieu file — dung endpoint upload-multiple
        const formData = new FormData();
        files.forEach(f => formData.append('files', f));
        const res = await fetch(`${API_BASE}/media/upload-multiple`, {
          method: 'POST', headers, credentials: 'include', body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Upload thất bại' }));
          throw new Error(err.message);
        }
        const json = await res.json();
        const successCount = json.data?.success?.length || files.length;
        const errors = json.data?.errors || [];
        setUploadProgress({ total: files.length, done: successCount });
        if (errors.length > 0) {
          setMediaError(`${successCount}/${files.length} file thành công.\n${errors.join('\n')}`);
        }
      }

      await fetchMedia(1);
    } catch (err) {
      console.error('Upload error:', err);
      setMediaError(err instanceof Error ? err.message : 'Upload thất bại');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) uploadFiles(files);
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
    if (files && files.length > 0) uploadFiles(files);
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

  // Xoa media sau khi xac nhan
  const handleDeleteMediaConfirm = async () => {
    if (!deleteMediaId) return;
    try {
      await api(`/media/${deleteMediaId}`, { method: 'DELETE' });
      setSelectedItem(null);
      setDeleteMediaId(null);
      await fetchMedia(pagination.page);
    } catch (err) {
      console.error('Xoa that bai:', err);
      setDeleteMediaId(null);
      setMediaError(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  // Toast sao chep URL
  const [copyToast, setCopyToast] = useState(false);

  // Copy URL vao clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(fullUrl(url));
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Copy toast */}
      {copyToast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium bg-green-600 text-white">
          Đã sao chép!
        </div>
      )}
      {/* Tieu de + controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900">Quản lý Media</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Upload button */}
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
            <Upload className="w-4 h-4" />
            {uploading ? 'Đang tải...' : 'Tải lên'}
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} multiple accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,video/mp4,video/webm" />

          {/* View toggle */}
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2', viewMode === 'grid' ? 'bg-slate-200 text-slate-900' : 'bg-white text-slate-500 hover:bg-slate-50')}
              title="Dạng lưới"
              aria-label="Chuyển sang dạng lưới"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2', viewMode === 'list' ? 'bg-slate-200 text-slate-900' : 'bg-white text-slate-500 hover:bg-slate-50')}
              title="Dạng danh sách"
              aria-label="Chuyển sang dạng danh sách"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
          <Input
            placeholder="Tìm kiếm file..."
            aria-label="Tìm kiếm file trong thư viện"
            value={searchInput}
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
          <Upload className="mx-auto mb-2 text-slate-400 w-[18px] h-[18px]" />
          <p className="text-slate-500 text-sm">Kéo thả file vào đây hoặc click để chọn (hỗ trợ nhiều file)</p>
          {uploadProgress && (
            <div className="mt-2">
              <div className="w-48 mx-auto bg-slate-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full transition-all" style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }} />
              </div>
              <p className="text-sm text-slate-400 mt-1">{uploadProgress.done}/{uploadProgress.total} file</p>
            </div>
          )}
        </div>
      )}

      {/* Loading — skeleton grid match layout */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="aspect-square bg-slate-100 animate-pulse" />
              <div className="p-2 space-y-1">
                <div className="h-3 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <File className="mx-auto mb-3 text-slate-300 w-6 h-6" />
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
                  <Image src={fullUrl(item.url)} alt={item.alt_text || item.original_name} width={0} height={0} sizes="100vw" className="w-full h-full object-cover" />
                ) : (
                  <File className="text-slate-300 w-10 h-10" />
                )}
              </div>
              <div className="p-2">
                <p className="text-sm font-medium text-slate-700 truncate">{item.original_name}</p>
                <p className="text-sm text-slate-400">{formatFileSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {!loading && items.length > 0 && viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="sticky top-0 z-10">
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
                        <Image src={fullUrl(item.url)} alt={item.alt_text || ''} width={48} height={48} className="w-full h-full object-cover" />
                      ) : (
                        <File className="text-slate-300 w-6 h-6" />
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
                      onClick={(e) => { e.stopPropagation(); setDeleteMediaId(item.id); }}
                      className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
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
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Preview */}
            <div className="p-4">
              <div className="bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden mb-4" style={{ minHeight: 200 }}>
                {isImage(selectedItem.mime_type) ? (
                  <Image src={fullUrl(selectedItem.url)} alt={selectedItem.alt_text || ''} width={0} height={0} sizes="100vw" className="max-w-full max-h-[300px] w-auto h-auto object-contain" />
                ) : (
                  <div className="py-12 text-center">
                    <File className="mx-auto text-slate-300 w-16 h-16 mb-2" />
                    <p className="text-slate-500 text-sm">{selectedItem.mime_type}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-slate-500 text-sm">Tên gốc</label>
                  <p className="text-slate-800 font-medium">{selectedItem.original_name}</p>
                </div>

                <div>
                  <label className="text-slate-500 text-sm">Kích thước</label>
                  <p className="text-slate-800">{formatFileSize(selectedItem.size)}</p>
                </div>

                <div>
                  <label className="text-slate-500 text-sm">Loại file</label>
                  <p className="text-slate-800">{selectedItem.mime_type}</p>
                </div>

                <div>
                  <label className="text-slate-500 text-sm">Ngày tải lên</label>
                  <p className="text-slate-800">{formatDate(selectedItem.created_at)}</p>
                </div>

                {/* URL + copy */}
                <div>
                  <label className="text-slate-500 text-sm">URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={fullUrl(selectedItem.url)} readOnly className="text-sm bg-slate-50" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyUrl(selectedItem.url)}
                      title="Sao chép URL"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Alt text — editable */}
                <div>
                  <label className="text-slate-500 text-sm">Alt text</label>
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
                  onClick={() => setDeleteMediaId(selectedItem.id)}
                >
                  <Trash2 className="w-4 h-4" /> Xóa file
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog xoa file */}
      <ConfirmDialog
        open={!!deleteMediaId}
        title="Xóa file"
        message="Bạn có chắc muốn xóa file này? Thao tác này không thể hoàn tác."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDeleteMediaConfirm}
        onCancel={() => setDeleteMediaId(null)}
      />

      {/* Error dialog */}
      <ConfirmDialog
        open={!!mediaError}
        title="Lỗi"
        message={mediaError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setMediaError('')}
        onCancel={() => setMediaError('')}
      />
    </div>
  );
}
