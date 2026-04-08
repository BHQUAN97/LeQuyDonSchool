'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'hidden';
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Page[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_LABEL: Record<string, { text: string; class: string }> = {
  draft: { text: 'Nháp', class: 'bg-yellow-100 text-yellow-800' },
  published: { text: 'Đã xuất bản', class: 'bg-green-100 text-green-800' },
  hidden: { text: 'Ẩn', class: 'bg-slate-100 text-slate-600' },
};

export default function PagesAdminPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'hidden',
    seoTitle: '',
    seoDescription: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await api<ApiResponse>(`/pages?${params}`);
      if (res.success) {
        setPages(res.data);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error('Loi tai danh sach trang:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  /** Mo form tao moi */
  const handleCreate = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', status: 'draft', seoTitle: '', seoDescription: '' });
    setShowForm(true);
  };

  /** Mo form chinh sua */
  const handleEdit = async (id: string) => {
    try {
      const res = await api<{ success: boolean; data: Page }>(`/pages/${id}`);
      if (res.success) {
        setEditingId(id);
        setFormData({
          title: res.data.title,
          content: res.data.content,
          status: res.data.status,
          seoTitle: res.data.seo_title || '',
          seoDescription: res.data.seo_description || '',
        });
        setShowForm(true);
      }
    } catch (err) {
      console.error('Loi tai chi tiet trang:', err);
    }
  };

  /** Luu form (tao/cap nhat) */
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await api(`/pages/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await api('/pages', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowForm(false);
      fetchPages();
    } catch (err: any) {
      alert(err.message || 'Loi khi luu');
    } finally {
      setSaving(false);
    }
  };

  /** Xoa trang */
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xoa trang "${title}"?`)) return;
    try {
      await api(`/pages/${id}`, { method: 'DELETE' });
      fetchPages();
    } catch (err: any) {
      alert(err.message || 'Loi khi xoa');
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý trang</h1>
        <Button onClick={handleCreate}>Tạo trang mới</Button>
      </div>

      {/* Thanh search */}
      <div className="flex gap-3">
        <Input
          placeholder="Tìm kiếm theo tiêu đề, slug..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm"
        />
      </div>

      {/* Form tao/sua */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {editingId ? 'Chỉnh sửa trang' : 'Tạo trang mới'}
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề trang"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Nhập nội dung trang (HTML)"
              rows={10}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Nháp</option>
                <option value="published">Xuất bản</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
              <Input
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Tiêu đề SEO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
              <Input
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Mô tả SEO"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
          </div>
        </div>
      )}

      {/* Bang danh sach */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Slug/URL</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Cập nhật lúc</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">Đang tải...</td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">Chưa có trang nào</td>
                </tr>
              ) : (
                pages.map((p) => {
                  const st = STATUS_LABEL[p.status] || STATUS_LABEL.draft;
                  return (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">/{p.slug}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${st.class}`}>
                          {st.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(p.updated_at)}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(p.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
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
    </div>
  );
}
