'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  content: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Contact[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_CONFIG: Record<string, { text: string; class: string }> = {
  new: { text: 'Mới', class: 'bg-blue-100 text-blue-800' },
  read: { text: 'Đã đọc', class: 'bg-yellow-100 text-yellow-800' },
  replied: { text: 'Đã phản hồi', class: 'bg-green-100 text-green-800' },
};

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'new', label: 'Mới' },
  { key: 'read', label: 'Đã đọc' },
  { key: 'replied', label: 'Đã phản hồi' },
];

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  /** Debounce search — cap nhat search state sau 400ms */
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 400);
  };
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Chi tiet lien he
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Confirm dialog va error
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [contactError, setContactError] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api<ApiResponse>(`/contacts?${params}`);
      if (res.success) {
        setContacts(res.data);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error('Loi tai danh sach lien he:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  /** Xem chi tiet lien he */
  const handleView = async (id: string) => {
    try {
      const res = await api<{ success: boolean; data: Contact }>(`/contacts/${id}`);
      if (res.success) {
        setSelectedContact(res.data);
      }
    } catch (err) {
      console.error('Loi tai chi tiet lien he:', err);
    }
  };

  /** Cap nhat trang thai lien he */
  const handleUpdateStatus = async (id: string, status: 'read' | 'replied') => {
    try {
      await api(`/contacts/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      // Cap nhat lai chi tiet va danh sach
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
      fetchContacts();
    } catch (err: any) {
      setContactError(err.message || 'Lỗi cập nhật trạng thái');
    }
  };

  /** Xoa lien he sau khi xac nhan */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api(`/contacts/${deleteTarget.id}`, { method: 'DELETE' });
      if (selectedContact?.id === deleteTarget.id) setSelectedContact(null);
      setDeleteTarget(null);
      fetchContacts();
    } catch (err: any) {
      setDeleteTarget(null);
      setContactError(err.message || 'Lỗi khi xóa');
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  /** Cat ngan noi dung */
  const truncate = (text: string, max: number) =>
    text.length > max ? text.substring(0, max) + '...' : text;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Quản lý liên hệ</h1>

      {/* Filter tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setStatusFilter(tab.key); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Input
          placeholder="Tìm theo tên, email, SĐT..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Modal chi tiet lien he */}
      {selectedContact && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Chi tiết liên hệ</h2>
            <button
              onClick={() => setSelectedContact(null)}
              className="text-slate-400 hover:text-slate-600 text-lg"
            >
              x
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-600">Họ tên:</span>{' '}
              <span className="text-slate-900">{selectedContact.full_name}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Email:</span>{' '}
              <span className="text-slate-900">{selectedContact.email}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600">SĐT:</span>{' '}
              <span className="text-slate-900">{selectedContact.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Ngày gửi:</span>{' '}
              <span className="text-slate-900">{formatDate(selectedContact.created_at)}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Trạng thái:</span>{' '}
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedContact.status]?.class}`}>
                {STATUS_CONFIG[selectedContact.status]?.text}
              </span>
            </div>
          </div>

          <div>
            <span className="block font-medium text-slate-600 text-sm mb-1">Nội dung:</span>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-wrap">
              {selectedContact.content}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {selectedContact.status !== 'read' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(selectedContact.id, 'read')}
              >
                Đánh dấu đã đọc
              </Button>
            )}
            {selectedContact.status !== 'replied' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(selectedContact.id, 'replied')}
              >
                Đánh dấu đã phản hồi
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Bang danh sach */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Họ tên</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">SĐT</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Nội dung</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Ngày gửi</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Trạng thái</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">Đang tải...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">Chưa có liên hệ nào</td>
                </tr>
              ) : (
                contacts.map((c) => {
                  const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
                  return (
                    <tr
                      key={c.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                        c.status === 'new' ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleView(c.id)}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">{c.full_name}</td>
                      <td className="px-4 py-3 text-slate-600">{c.email}</td>
                      <td className="px-4 py-3 text-slate-600">{c.phone || '-'}</td>
                      <td className="px-4 py-3 text-slate-500">{truncate(c.content, 50)}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(c.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${st.class}`}>
                          {st.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleView(c.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Xem
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: c.id, name: c.full_name })}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Phan trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <span className="text-sm text-slate-600">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </div>

      {/* Confirm dialog xoa lien he */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa liên hệ"
        message={`Bạn có chắc muốn xóa liên hệ từ "${deleteTarget?.name}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Error dialog */}
      <ConfirmDialog
        open={!!contactError}
        title="Lỗi"
        message={contactError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setContactError('')}
        onCancel={() => setContactError('')}
      />
    </div>
  );
}
