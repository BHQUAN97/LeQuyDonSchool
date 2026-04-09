'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { generateSlug } from '@/lib/slug';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: 'draft' | 'published' | 'hidden';
  view_count: number;
  category_id: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Article;
  message: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

/**
 * Format datetime cho input datetime-local.
 */
function formatDatetimeLocal(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(true); // Mac dinh manual khi edit

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('draft');
  const [categoryId, setCategoryId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');

  // Danh sach danh muc
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    api<Category[]>('/categories')
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any)?.data || [];
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  // Tai du lieu bai viet
  useEffect(() => {
    async function fetchArticle() {
      try {
        const article = await api<Article>(`/articles/${id}`);
        setTitle(article.title);
        setSlug(article.slug);
        setContent(article.content);
        setExcerpt(article.excerpt || '');
        setStatus(article.status);
        setCategoryId(article.category_id || '');
        setThumbnailUrl(article.thumbnail_url || '');
        setSeoTitle(article.seo_title || '');
        setSeoDescription(article.seo_description || '');
        setPublishedAt(formatDatetimeLocal(article.published_at));
        setOriginalTitle(article.title);
      } catch (err: any) {
        alert(err.message || 'Không thể tải bài viết');
        router.push('/admin/articles');
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, router]);

  /** Cap nhat bai viet */
  const handleSave = async (saveStatus?: string) => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề');
      return;
    }
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung');
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, any> = {
        title: title.trim(),
        content,
        slug,
        excerpt: excerpt || undefined,
        categoryId: categoryId || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        publishedAt: publishedAt || undefined,
      };
      if (saveStatus) body.status = saveStatus;
      else body.status = status;

      await api<ApiResponse>(`/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      router.push('/admin/articles');
    } catch (err: any) {
      alert(err.message || 'Không thể cập nhật bài viết');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Sửa bài viết</h1>
        <button
          onClick={() => router.push('/admin/articles')}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Quay lại
        </button>
      </div>

      {/* Form layout: 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — Content (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManual(true);
                }}
                placeholder="tu-dong-tao-tu-tieu-de"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <button
                onClick={() => {
                  setSlugManual(false);
                  setSlug(generateSlug(title));
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Tự động tạo lại từ tiêu đề
              </button>
            </div>

            {/* Content — Rich text editor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Nhập nội dung bài viết..."
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tóm tắt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Mô tả ngắn về bài viết..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-y"
              />
            </div>
          </div>
        </div>

        {/* Right — Sidebar (1/3) */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Published date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày đăng</label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL hình ảnh</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Preview"
                  className="mt-2 w-full h-32 rounded-lg object-cover border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">SEO</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Tiêu đề SEO"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Mô tả SEO"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-y"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Đang lưu...' : 'Lưu nháp'}
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Đang lưu...' : 'Đăng bài'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
