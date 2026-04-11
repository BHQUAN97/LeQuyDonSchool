'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { User, PaginatedResponse } from '@/types';
import Image from 'next/image';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface UserForm {
  fullName: string;
  email: string;
  password: string;
  role: 'super_admin' | 'editor';
  phone: string;
  status: 'active' | 'inactive';
}

const EMPTY_FORM: UserForm = {
  fullName: '',
  email: '',
  password: '',
  role: 'editor',
  phone: '',
  status: 'active',
};

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  super_admin: { label: 'Super Admin', className: 'bg-purple-100 text-purple-800' },
  editor: { label: 'Biên tập viên', className: 'bg-blue-100 text-blue-800' },
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800' },
  inactive: { label: 'Khóa', className: 'bg-red-100 text-red-600' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /** Tai danh sach users */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search) params.set('search', search);

      const res = await api<PaginatedResponse<User>>(`/users?${params}`);
      if (res.success) {
        setUsers(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Loi tai danh sach users:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /** Mo form tao moi */
  const handleAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  /** Mo form chinh sua */
  const handleEdit = (user: User) => {
    setForm({
      fullName: user.full_name,
      email: user.email,
      password: '', // Khong hien password cu
      role: user.role,
      phone: user.phone || '',
      status: user.status,
    });
    setEditingId(user.id);
    setFormError('');
    setShowForm(true);
  };

  /** Luu user (tao moi hoac cap nhat) */
  const handleSave = async () => {
    if (!form.fullName || !form.email) {
      setFormError('Vui lòng nhập họ tên và email');
      return;
    }
    if (!editingId && !form.password) {
      setFormError('Vui lòng nhập mật khẩu');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (editingId) {
        // Cap nhat — chi gui cac field thay doi
        const body: Record<string, string> = {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          status: form.status,
        };
        if (form.phone) body.phone = form.phone;
        await api(`/users/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        // Tao moi — can password
        const body: Record<string, string> = {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
        };
        if (form.phone) body.phone = form.phone;
        await api('/users', { method: 'POST', body: JSON.stringify(body) });
      }

      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  // State cho confirm dialog xoa user
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  /** Xoa user sau khi xac nhan */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api(`/users/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      setDeleteTarget(null);
      setErrorMsg(err.message || 'Không thể xóa tài khoản');
    }
  };

  /** Toggle trang thai active/inactive */
  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await api(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể cập nhật trạng thái');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý tài khoản</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors"
        >
          + Thêm tài khoản
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
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
              {editingId ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
            </h2>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Tối thiểu 8 ký tự, gồm chữ hoa, thường và số"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="editor">Biên tập viên</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                {editingId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Khóa</option>
                    </select>
                  </div>
                )}
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
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Chưa có tài khoản nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Họ tên</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">SĐT</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Vai trò</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Đăng nhập cuối</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <Image src={user.avatar_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-slate-900">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3 text-slate-600">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[user.role]?.className || ''}`}>
                        {ROLE_BADGE[user.role]?.label || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${STATUS_BADGE[user.status]?.className || ''}`}
                      >
                        {STATUS_BADGE[user.status]?.label || user.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString('vi-VN', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: user.id, name: user.full_name })}
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
              Hiển thị {users.length} / {pagination.total} tài khoản
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
              >
                Trước
              </button>
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

      {/* Confirm dialog xoa tai khoan */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa tài khoản"
        message={`Bạn có chắc muốn xóa tài khoản "${deleteTarget?.name}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Error dialog */}
      <ConfirmDialog
        open={!!errorMsg}
        title="Lỗi"
        message={errorMsg}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setErrorMsg('')}
        onCancel={() => setErrorMsg('')}
      />
    </div>
  );
}
