'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

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

  /** Xoa bai viet */
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa bài viết "${title}"?`)) return;
    try {
      await api(`/articles/${id}`, { method: 'DELETE' });
      fetchArticles();
    } catch (err: any) {
      alert(err.message || 'Không thể xóa bài viết');
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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải...</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Không có bài viết nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
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
                        <img
                          src={article.thumbnail_url}
                          alt=""
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                          N/A
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1">{article.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">/{article.slug}</div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
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
                          onClick={() => handleDelete(article.id, article.title)}
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
    </div>
  );
}
