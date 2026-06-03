'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: 'draft' | 'published' | 'hidden';
  view_count: number;
  published_at: string | null;
  created_at: string;
}

interface ArticlesResponse {
  success: boolean;
  data: Article[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

type CategoriesPayload = Category[] | { data?: Category[] };

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft: { label: 'Nháp', className: 'bg-yellow-100 text-yellow-800' },
  published: { label: 'Đã đăng', className: 'bg-green-100 text-green-800' },
  hidden: { label: 'Ẩn', className: 'bg-gray-100 text-gray-600' },
};

export default function MenusPage() {
  const [categoryId, setCategoryId] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    api<CategoriesPayload>('/categories')
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? [];
        const menuCategory = list.find((cat) => cat.slug === 'thuc-don');
        setCategoryId(menuCategory?.id || '');
      })
      .catch(() => {
        setCategoryId('');
      });
  }, []);

  const fetchMenus = useCallback(async () => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        categoryId,
        sort: 'published_at',
        order: 'DESC',
      });
      const res = await api<ArticlesResponse>(`/articles?${params.toString()}`);
      if (res.success) setArticles(res.data);
    } catch (err) {
      console.error('Loi khi tai thuc don:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api(`/articles/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchMenus();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể xóa thực đơn';
      setDeleteTarget(null);
      setDeleteError(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thực đơn</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý các bài thực đơn hiển thị tại /dich-vu-hoc-duong/thuc-don.
          </p>
        </div>
        <Link
          href="/admin/articles/create?category=thuc-don&type=menu"
          className="inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          + Đăng thực đơn mới
        </Link>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Đăng thực đơn bằng bài viết category <strong>Thực đơn</strong>. Chọn ảnh đại diện là ảnh poster thực đơn để trang chi tiết hiển thị dạng contain đúng mẫu.
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải...</div>
        ) : !categoryId ? (
          <div className="p-8 text-center text-slate-500">Chưa có danh mục thuc-don. Vui lòng tạo danh mục trước.</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Chưa có thực đơn nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="w-20 px-4 py-3 text-left font-medium text-slate-600">Ảnh</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tiêu đề</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Ngày đăng</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Lượt xem</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => {
                  const badge = STATUS_BADGE[article.status] || STATUS_BADGE.draft;
                  return (
                    <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        {article.thumbnail_url ? (
                          <Image
                            src={article.thumbnail_url}
                            alt={article.title}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded bg-slate-100 object-contain"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">N/A</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 line-clamp-1">{article.title}</div>
                        <div className="mt-0.5 text-sm text-slate-400">/{article.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {article.published_at ? new Date(article.published_at).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{article.view_count.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/tin-tuc/${article.slug}`} target="_blank" className="text-sm font-medium text-green-700 hover:text-green-900">
                            Xem
                          </Link>
                          <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Sửa
                          </Link>
                          <button onClick={() => setDeleteTarget({ id: article.id, title: article.title })} className="text-sm font-medium text-red-600 hover:text-red-800">
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa thực đơn"
        message={`Bạn có chắc muốn xóa "${deleteTarget?.title}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

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
