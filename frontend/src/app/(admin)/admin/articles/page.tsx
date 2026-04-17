'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: 'draft' | 'published' | 'hidden';
  view_count: number;
  category_id: string | null;
  published_at: string | null;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ArticlesResponse {
  success: boolean;
  data: Article[];
  pagination: Pagination;
}

const STATUS_TABS = [
  { label: 'Tất cả', value: '' },
  { label: 'Nháp', value: 'draft' },
  { label: 'Đã đăng', value: 'published' },
  { label: 'Ẩn', value: 'hidden' },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft: { label: 'Nháp', className: 'bg-yellow-100 text-yellow-800' },
  published: { label: 'Đã đăng', className: 'bg-green-100 text-green-800' },
  hidden: { label: 'Ẩn', className: 'bg-gray-100 text-gray-600' },
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await api<ArticlesResponse>(`/articles?${params.toString()}`);
      if (res.success) {
        setArticles(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Loi khi tai danh sach bai viet:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // State cho confirm dialog xoa bai viet
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteError, setDeleteError] = useState('');

  /** Xoa bai viet sau khi xac nhan */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api(`/articles/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchArticles();
    } catch (err: any) {
      setDeleteTarget(null);
      setDeleteError(err.message || 'Không thể xóa bài viết');
    }
  };

  /** Debounce search */
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Bài viết</h1>
        <Link
          href="/admin/articles/create"
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors"
        >
          + Tạo bài viết
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        {/* Status tabs */}
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

        {/* Search */}
        <input
          type="text"
          placeholder="Tìm kiếm tiêu đề..."
          aria-label="Tìm kiếm bài viết theo tiêu đề"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
                <div className="w-12 h-12 rounded bg-slate-200 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-full" />
                <div className="h-4 w-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Không có bài viết nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-12">Ảnh</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tiêu đề</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Lượt xem</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Ngày tạo</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50">
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      {article.thumbnail_url ? (
                        <Image
                          src={article.thumbnail_url}
                          alt={article.title}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
                          N/A
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1">{article.title}</div>
                      <div className="text-sm text-slate-400 mt-0.5">/{article.slug}</div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${
                          STATUS_BADGE[article.status]?.className || ''
                        }`}
                      >
                        {STATUS_BADGE[article.status]?.label || article.status}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="px-4 py-3 text-slate-600">{article.view_count.toLocaleString()}</td>

                    {/* Date */}
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(article.created_at).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: article.id, title: article.title })}
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
              Hiển thị {articles.length} / {pagination.total} bài viết
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
      {/* Confirm dialog xoa bai viet */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa bài viết"
        message={`Bạn có chắc muốn xóa bài viết "${deleteTarget?.title}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Error dialog */}
      <ConfirmDialog
        open={!!deleteError}
        title="Lỗi"
        message={deleteError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setDeleteError('')}
        onCancel={() => setDeleteError('')}
      />
    </div>
  );
}
