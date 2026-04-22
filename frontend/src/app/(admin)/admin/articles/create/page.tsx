'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import RichTextEditor from '@/components/admin/RichTextEditorDynamic';
import { generateSlug } from '@/lib/slug';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImagePicker from '@/components/admin/ImagePicker';
import type { ApiResponse } from '@/types';

interface Category {
  id: string;
  name: string;
  slug: string;
}

// API /categories may return either a bare array or a wrapped response
type CategoriesPayload = Category[] | { data?: Category[] };

export default function CreateArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [createError, setCreateError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [publishedAt, setPublishedAt] = useState('');

  // Danh sach danh muc
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    api<CategoriesPayload>('/categories')
      .then((data) => {
        // API co the tra ve { success, data } hoac array truc tiep
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  // Tu dong tao slug tu title
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManual]);

  /** Luu bai viet */
  const handleSave = async (saveStatus: string) => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
    if (!content.trim()) newErrors.content = 'Vui lòng nhập nội dung';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      const body: Record<string, string> = {
        title: title.trim(),
        content,
        status: saveStatus,
      };
      if (slug) body.slug = slug;
      if (excerpt) body.excerpt = excerpt;
      if (categoryId) body.categoryId = categoryId;
      if (thumbnailUrl) body.thumbnailUrl = thumbnailUrl;
      if (seoTitle) body.seoTitle = seoTitle;
      if (seoDescription) body.seoDescription = seoDescription;
      if (publishedAt) body.publishedAt = publishedAt;

      await api<ApiResponse<unknown>>('/articles', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      toast.success(saveStatus === 'published' ? 'Đã đăng bài viết' : 'Đã lưu nháp');
      router.push('/admin/articles');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tạo bài viết';
      setCreateError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Tạo bài viết</h1>
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
          {/* Title */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((prev) => ({ ...prev, title: '' })); }}
                placeholder="Nhập tiêu đề bài viết..."
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
              {slugManual && (
                <button
                  onClick={() => {
                    setSlugManual(false);
                    setSlug(generateSlug(title));
                  }}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  Tự động tạo lại từ tiêu đề
                </button>
              )}
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
                onChange={(e) => { if (e.target.value.length <= 300) setExcerpt(e.target.value); }}
                placeholder="Mô tả ngắn về bài viết..."
                rows={3}
                maxLength={300}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-y"
              />
              <p className={`text-sm mt-1 ${excerpt.length >= 280 ? 'text-orange-500' : 'text-slate-400'}`}>{excerpt.length}/300</p>
            </div>
          </div>
        </div>

        {/* Right — Sidebar (1/3) */}
        <div className="space-y-4">
          {/* Category & Date */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
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
            <ImagePicker
              value={thumbnailUrl}
              onChange={setThumbnailUrl}
              label="Ảnh đại diện"
              placeholder="Nhập URL hoặc chọn từ kho..."
            />
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">SEO</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => { if (e.target.value.length <= 60) setSeoTitle(e.target.value); }}
                placeholder="Tiêu đề SEO"
                maxLength={60}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <p className={`text-sm mt-1 ${seoTitle.length >= 50 ? 'text-orange-500' : 'text-slate-400'}`}>{seoTitle.length}/60</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => { if (e.target.value.length <= 160) setSeoDescription(e.target.value); }}
                placeholder="Mô tả SEO"
                rows={3}
                maxLength={160}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-y"
              />
              <p className={`text-sm mt-1 ${seoDescription.length >= 140 ? 'text-orange-500' : 'text-slate-400'}`}>{seoDescription.length}/160</p>
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

      {/* Error dialog */}
      <ConfirmDialog
        open={!!createError}
        title="Lỗi"
        message={createError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setCreateError('')}
        onCancel={() => setCreateError('')}
      />
    </div>
  );
}
