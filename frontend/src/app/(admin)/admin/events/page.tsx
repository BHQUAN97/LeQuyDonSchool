'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImagePicker from '@/components/admin/ImagePicker';

interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  link_url: string | null;
  status: 'upcoming' | 'ongoing' | 'past';
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EventsResponse {
  success: boolean;
  data: Event[];
  pagination: Pagination;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  upcoming: { label: 'Sắp diễn ra', className: 'bg-blue-100 text-blue-800' },
  ongoing: { label: 'Đang diễn ra', className: 'bg-green-100 text-green-800' },
  past: { label: 'Đã kết thúc', className: 'bg-gray-100 text-gray-600' },
};

const STATUS_TABS = [
  { label: 'Tất cả', value: '' },
  { label: 'Sắp diễn ra', value: 'upcoming' },
  { label: 'Đang diễn ra', value: 'ongoing' },
  { label: 'Đã kết thúc', value: 'past' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  imageUrl: '',
  startDate: '',
  endDate: '',
  location: '',
  linkUrl: '',
  status: 'upcoming' as 'upcoming' | 'ongoing' | 'past',
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [dateError, setDateError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await api<EventsResponse>(`/events?${params.toString()}`);
      if (res.success) {
        setEvents(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Loi khi tai danh sach su kien:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /** Debounce search */
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /** Mo form tao moi */
  const handleAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDateError('');
    setShowForm(true);
  };

  /** Mo form chinh sua */
  const handleEdit = (event: Event) => {
    setForm({
      title: event.title,
      description: event.description || '',
      imageUrl: event.image_url || '',
      startDate: event.start_date ? event.start_date.slice(0, 16) : '',
      endDate: event.end_date ? event.end_date.slice(0, 16) : '',
      location: event.location || '',
      linkUrl: event.link_url || '',
      status: event.status,
    });
    setEditingId(event.id);
    setDateError('');
    setShowForm(true);
  };

  // State cho confirm dialog va error
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [eventError, setEventError] = useState('');

  /** Luu su kien (tao moi hoac cap nhat) */
  const handleSave = async () => {
    if (!form.title || !form.startDate) {
      setEventError('Vui lòng nhập tiêu đề và ngày bắt đầu');
      return;
    }
    if (form.endDate && form.startDate && new Date(form.endDate) < new Date(form.startDate)) {
      setDateError('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    setDateError('');
    setSaving(true);
    try {
      const body: any = {
        title: form.title,
        startDate: new Date(form.startDate).toISOString(),
        status: form.status,
      };
      if (form.description) body.description = form.description;
      if (form.imageUrl) body.imageUrl = form.imageUrl;
      if (form.endDate) body.endDate = new Date(form.endDate).toISOString();
      if (form.location) body.location = form.location;
      if (form.linkUrl) body.linkUrl = form.linkUrl;

      if (editingId) {
        await api(`/events/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/events', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      fetchEvents();
    } catch (err: any) {
      setEventError(err.message || 'Không thể lưu sự kiện');
    } finally {
      setSaving(false);
    }
  };

  /** Xoa su kien sau khi xac nhan */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api(`/events/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchEvents();
    } catch (err: any) {
      setDeleteTarget(null);
      setEventError(err.message || 'Không thể xóa sự kiện');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Sự kiện</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors"
        >
          + Thêm sự kiện
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatus(tab.value); setPage(1); }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                status === tab.value
                  ? 'bg-green-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm tiêu đề, địa điểm..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày bắt đầu *</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => { setForm({ ...form, endDate: e.target.value }); if (dateError) setDateError(''); }}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 ${dateError ? 'border-red-500' : 'border-slate-300'}`}
                  />
                </div>
              </div>
              {dateError && <p className="text-red-500 text-sm -mt-1">{dateError}</p>}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <ImagePicker
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
                label="Ảnh sự kiện"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link URL</label>
                <input
                  type="text"
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="past">Đã kết thúc</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/5" />
                  <div className="h-3 bg-slate-100 rounded w-2/5" />
                </div>
                <div className="h-4 w-28 bg-slate-100 rounded hidden sm:block" />
                <div className="h-4 w-28 bg-slate-100 rounded hidden md:block" />
                <div className="h-6 w-20 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Không có sự kiện nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tiêu đề</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Ngày kết thúc</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Địa điểm</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1">{event.title}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(event.start_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {event.end_date
                        ? new Date(event.end_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{event.location || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${
                          STATUS_BADGE[event.status]?.className || ''
                        }`}
                      >
                        {STATUS_BADGE[event.status]?.label || event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: event.id, title: event.title })}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <span className="text-sm text-slate-500">
              Hiển thị {events.length} / {pagination.total} sự kiện
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
              >
                Trước
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 text-sm rounded border ${
                        p === page
                          ? 'bg-green-700 text-white border-green-700'
                          : 'border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm dialog xoa su kien */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa sự kiện"
        message={`Bạn có chắc muốn xóa sự kiện "${deleteTarget?.title}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Error dialog */}
      <ConfirmDialog
        open={!!eventError}
        title="Lỗi"
        message={eventError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setEventError('')}
        onCancel={() => setEventError('')}
      />
    </div>
  );
}
