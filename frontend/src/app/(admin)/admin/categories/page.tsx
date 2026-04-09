'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Category, PaginatedResponse, ApiResponse } from '@/types';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import { generateSlug } from '@/lib/slug';

interface CategoryForm {
  name: string;
  slug: string;
  parentId: string;
  description: string;
  displayOrder: number;
}

const emptyForm: CategoryForm = {
  name: '',
  slug: '',
  parentId: '',
  description: '',
  displayOrder: 0,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Lay danh sach danh muc phan trang
  const fetchCategories = useCallback(async (page = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', sort: 'display_order', order: 'ASC' });
      if (searchQuery) params.set('search', searchQuery);
      const res = await api<PaginatedResponse<Category>>(`/categories?${params}`);
      if (res.success) {
        setCategories(res.data);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      console.error('Loi tai danh muc:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lay tat ca danh muc (cho dropdown chon danh muc cha)
  const fetchAllCategories = useCallback(async () => {
    try {
      const res = await api<ApiResponse<Category[]>>('/categories?tree=true');
      if (res.success) {
        setAllCategories(flattenTree(res.data));
      }
    } catch {
      // Khong lam gi
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch khi search thay doi
  useEffect(() => {
    fetchCategories(1, search);
  }, [fetchCategories, search]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Flatten tree de hien thi trong dropdown
  function flattenTree(cats: Category[], level = 0): (Category & { _level: number })[] {
    const result: (Category & { _level: number })[] = [];
    for (const cat of cats) {
      result.push({ ...cat, _level: level });
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenTree(cat.children, level + 1));
      }
    }
    return result;
  }

  // Tim ten danh muc cha theo ID
  function getParentName(parentId: string | null): string {
    if (!parentId) return '—';
    const parent = allCategories.find((c) => c.id === parentId);
    return parent ? parent.name : '—';
  }

  // Mo form tao moi
  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSlugManual(false);
    setError('');
    setShowForm(true);
  }

  // Mo form sua
  function openEditForm(cat: Category) {
    setForm({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parent_id || '',
      description: cat.description || '',
      displayOrder: cat.display_order,
    });
    setEditingId(cat.id);
    setSlugManual(true);
    setError('');
    setShowForm(true);
  }

  // Dong form
  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  // Thay doi ten → tu dong tao slug
  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : generateSlug(name),
    }));
  }

  // Luu (tao moi hoac cap nhat)
  async function handleSave() {
    if (!form.name.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const body: any = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim() || undefined,
        displayOrder: form.displayOrder,
      };
      if (form.parentId) body.parentId = form.parentId;

      if (editingId) {
        await api(`/categories/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/categories', { method: 'POST', body: JSON.stringify(body) });
      }

      closeForm();
      fetchCategories(pagination.page, search);
      fetchAllCategories();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  }

  // Xoa danh muc
  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api(`/categories/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchCategories(pagination.page, search);
      fetchAllCategories();
    } catch (err: any) {
      alert(err.message || 'Không thể xóa danh mục');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm danh mục..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </h2>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ten danh muc */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Tin tức"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
                placeholder="tu-dong-tao-tu-ten"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-slate-500"
              />
            </div>

            {/* Danh muc cha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục cha</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm((prev) => ({ ...prev, parentId: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="">— Không có (gốc) —</option>
                {allCategories
                  .filter((c) => c.id !== editingId)
                  .map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {'—'.repeat(c._level || 0)} {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Thu tu hien thi */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thứ tự</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                min={0}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            {/* Mo ta */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Mô tả ngắn về danh mục..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo danh mục'}
            </button>
            <button
              onClick={closeForm}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Tên
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                  Danh mục cha
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">
                  Số bài viết
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Thứ tự
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                    Chưa có danh mục nào
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900">{cat.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500 font-mono">{cat.slug}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-500">{getParentName(cat.parent_id)}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-sm text-slate-500">0</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-slate-700">{cat.display_order}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          cat.status === 'active'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {cat.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditForm(cat)}
                          className="p-1.5 text-slate-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">
              Hiển thị {categories.length} / {pagination.total} danh mục
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchCategories(pagination.page - 1, search)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm text-slate-700 font-medium">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchCategories(pagination.page + 1, search)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-slate-600 mb-6">
              Bạn có chắc muốn xóa danh mục này? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
