'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImagePicker from '@/components/admin/ImagePicker';

// ─── TYPES ─────────────────────────────────────────────────

interface AdmissionPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_visible: boolean;
}

interface Registration {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  grade: string;
  is_club_member: boolean;
  status: 'new' | 'contacted' | 'completed';
  note: string | null;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── CONSTANTS ─────────────────────────────────────────────

const POST_STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft: { label: 'Nháp', className: 'bg-yellow-100 text-yellow-800' },
  published: { label: 'Đã đăng', className: 'bg-green-100 text-green-800' },
};

const REG_STATUS_BADGE: Record<string, { label: string; className: string }> = {
  new: { label: 'Mới', className: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Đã liên hệ', className: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Hoàn tất', className: 'bg-green-100 text-green-800' },
};

const TABS = [
  { key: 'posts', label: 'Bài đăng' },
  { key: 'faq', label: 'Q&A' },
  { key: 'registrations', label: 'Đăng ký' },
];

const EMPTY_POST_FORM = {
  title: '',
  content: '',
  slug: '',
  thumbnailUrl: '',
  status: 'draft' as 'draft' | 'published',
};

const EMPTY_FAQ_FORM = {
  question: '',
  answer: '',
  displayOrder: 0,
  isVisible: true,
};

export default function AdmissionsPage() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Tuyển sinh</h1>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-green-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'posts' && <PostsTab />}
      {activeTab === 'faq' && <FaqTab />}
      {activeTab === 'registrations' && <RegistrationsTab />}
    </div>
  );
}

// ─── TAB: BÀI ĐĂNG ────────────────────────────────────────

function PostsTab() {
  const [posts, setPosts] = useState<AdmissionPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Confirm dialog va error
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [postError, setPostError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_POST_FORM);
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search) params.set('search', search);

      const res = await api<{ success: boolean; data: AdmissionPost[]; pagination: Pagination }>(
        `/admissions/posts?${params.toString()}`,
      );
      if (res.success) {
        setPosts(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Loi khi tai bai dang tuyen sinh:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleAdd = () => {
    setForm(EMPTY_POST_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await api<{ success: boolean; data: AdmissionPost }>(`/admissions/posts/${id}`);
      const post = res.data;
      setForm({
        title: post.title,
        content: post.content,
        slug: post.slug,
        thumbnailUrl: post.thumbnail_url || '',
        status: post.status,
      });
      setEditingId(id);
      setShowForm(true);
    } catch (err: any) {
      setPostError(err.message || 'Lỗi khi tải bài đăng');
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      setPostError('Vui lòng nhập tiêu đề và nội dung');
      return;
    }
    setSaving(true);
    try {
      const body: any = {
        title: form.title,
        content: form.content,
        status: form.status,
      };
      if (form.slug) body.slug = form.slug;
      if (form.thumbnailUrl) body.thumbnailUrl = form.thumbnailUrl;

      if (editingId) {
        await api(`/admissions/posts/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/admissions/posts', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      fetchPosts();
    } catch (err: any) {
      setPostError(err.message || 'Không thể lưu bài đăng');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api(`/admissions/posts/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchPosts();
    } catch (err: any) {
      setDeleteTarget(null);
      setPostError(err.message || 'Không thể xóa bài đăng');
    }
  };

  return (
    <>
      {/* Header + Search */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm tiêu đề..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          className="ml-3 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors whitespace-nowrap"
        >
          + Thêm bài đăng
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Chỉnh sửa bài đăng' : 'Thêm bài đăng mới'}
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (tự tạo nếu để trống)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung *</label>
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <ImagePicker
                value={form.thumbnailUrl}
                onChange={(url) => setForm({ ...form, thumbnailUrl: url })}
                label="Ảnh đại diện"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="draft">Nháp</option>
                  <option value="published">Đã đăng</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-50">
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Không có bài đăng nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tiêu đề</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Ngày đăng</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1">{post.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${POST_STATUS_BADGE[post.status]?.className || ''}`}>
                        {POST_STATUS_BADGE[post.status]?.label || post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(post.id)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Sửa</button>
                        <button onClick={() => setDeleteTarget({ id: post.id, title: post.title })} className="text-sm text-red-600 hover:text-red-800 font-medium">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <span className="text-sm text-slate-500">Hiển thị {posts.length} / {pagination.total} bài đăng</span>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50">Trước</button>
              <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50">Sau</button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm dialog xoa bai dang */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa bài đăng"
        message={`Bạn có chắc muốn xóa bài đăng "${deleteTarget?.title}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Error dialog */}
      <ConfirmDialog
        open={!!postError}
        title="Lỗi"
        message={postError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setPostError('')}
        onCancel={() => setPostError('')}
      />
    </>
  );
}

// ─── TAB: FAQ ──────────────────────────────────────────────

function FaqTab() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirm dialog va error
  const [deleteFaqId, setDeleteFaqId] = useState<string | null>(null);
  const [faqError, setFaqError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FAQ_FORM);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Faq[]>('/admissions/faq/all');
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Loi khi tai FAQ:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const handleAdd = () => {
    setForm(EMPTY_FAQ_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (faq: Faq) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      displayOrder: faq.display_order,
      isVisible: faq.is_visible,
    });
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.question || !form.answer) {
      setFaqError('Vui lòng nhập câu hỏi và câu trả lời');
      return;
    }
    setSaving(true);
    try {
      const body = {
        question: form.question,
        answer: form.answer,
        displayOrder: form.displayOrder,
        isVisible: form.isVisible,
      };

      if (editingId) {
        await api(`/admissions/faq/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/admissions/faq', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      fetchFaqs();
    } catch (err: any) {
      setFaqError(err.message || 'Không thể lưu FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteFaqId) return;
    try {
      await api(`/admissions/faq/${deleteFaqId}`, { method: 'DELETE' });
      setDeleteFaqId(null);
      fetchFaqs();
    } catch (err: any) {
      setDeleteFaqId(null);
      setFaqError(err.message || 'Không thể xóa FAQ');
    }
  };

  /** Toggle an/hien nhanh */
  const handleToggleVisible = async (faq: Faq) => {
    try {
      await api(`/admissions/faq/${faq.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isVisible: !faq.is_visible }),
      });
      fetchFaqs();
    } catch (err: any) {
      setFaqError(err.message || 'Không thể cập nhật');
    }
  };

  return (
    <>
      <div className="flex items-center justify-end">
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors"
        >
          + Thêm Q&A
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Chỉnh sửa Q&A' : 'Thêm Q&A mới'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Câu hỏi *</label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trả lời *</label>
                <textarea
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isVisible}
                      onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
                    />
                    <span className="text-sm text-slate-700">Hiển thị</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-50">
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải...</div>
        ) : faqs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Chưa có câu hỏi nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Câu hỏi</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Trả lời</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-600 w-20">Thứ tự</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-600 w-24">Hiển thị</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">
                      <div className="line-clamp-2">{faq.question}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-sm">
                      <div className="line-clamp-2">{faq.answer}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">{faq.display_order}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleVisible(faq)}
                        className={`inline-block w-10 h-5 rounded-full transition-colors relative ${
                          faq.is_visible ? 'bg-green-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            faq.is_visible ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(faq)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Sửa</button>
                        <button onClick={() => setDeleteFaqId(faq.id)} className="text-sm text-red-600 hover:text-red-800 font-medium">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm dialog xoa FAQ */}
      <ConfirmDialog
        open={!!deleteFaqId}
        title="Xóa câu hỏi"
        message="Bạn có chắc muốn xóa câu hỏi này? Thao tác này không thể hoàn tác."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteFaqId(null)}
      />

      {/* Error dialog */}
      <ConfirmDialog
        open={!!faqError}
        title="Lỗi"
        message={faqError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setFaqError('')}
        onCancel={() => setFaqError('')}
      />
    </>
  );
}

// ─── TAB: ĐĂNG KÝ TUYỂN SINH ──────────────────────────────

function RegistrationsTab() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await api<{ success: boolean; data: Registration[]; pagination: Pagination }>(
        `/admissions/registrations?${params.toString()}`,
      );
      if (res.success) {
        setRegistrations(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Loi khi tai danh sach dang ky:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [regError, setRegError] = useState('');

  /** Cap nhat trang thai dang ky */
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api(`/admissions/registrations/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchRegistrations();
    } catch (err: any) {
      setRegError(err.message || 'Không thể cập nhật trạng thái');
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Tìm họ tên, SĐT, email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="contacted">Đã liên hệ</option>
          <option value="completed">Hoàn tất</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải...</div>
        ) : registrations.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Không có đăng ký nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Họ tên</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Lớp</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">SĐT</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Ngày ĐK</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {reg.full_name}
                      {reg.is_club_member && (
                        <span className="ml-1 text-xs text-orange-600 font-normal">(CLB)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{reg.grade}</td>
                    <td className="px-4 py-3 text-slate-600">{reg.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{reg.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(reg.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${REG_STATUS_BADGE[reg.status]?.className || ''}`}>
                        {REG_STATUS_BADGE[reg.status]?.label || reg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={reg.status}
                        onChange={(e) => handleUpdateStatus(reg.id, e.target.value)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                      >
                        <option value="new">Mới</option>
                        <option value="contacted">Đã liên hệ</option>
                        <option value="completed">Hoàn tất</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <span className="text-sm text-slate-500">Hiển thị {registrations.length} / {pagination.total} đăng ký</span>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50">Trước</button>
              <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50">Sau</button>
            </div>
          </div>
        )}
      </div>

      {/* Error dialog */}
      <ConfirmDialog
        open={!!regError}
        title="Lỗi"
        message={regError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setRegError('')}
        onCancel={() => setRegError('')}
      />
    </>
  );
}
