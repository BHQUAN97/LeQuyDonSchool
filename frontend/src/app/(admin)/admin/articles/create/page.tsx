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

const ARTICLE_TEMPLATES: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl?: string;
}> = {
  admission: {
    title: 'Thông báo tuyển sinh năm học mới',
    excerpt: 'Thông tin tuyển sinh, thời gian đăng ký, hồ sơ cần chuẩn bị và biểu mẫu ghi danh trực tuyến.',
    thumbnailUrl: '/images/design/admission-2026-list.png',
    content: `
<h2>Thông báo tuyển sinh</h2>
<p>Trường Tiểu học Vân Cốc thông báo kế hoạch tuyển sinh năm học mới. Phụ huynh vui lòng theo dõi các mốc thời gian, chuẩn bị hồ sơ và đăng ký thông tin ban đầu qua biểu mẫu trực tuyến.</p>
<h3>Đối tượng tuyển sinh</h3>
<ul><li>Học sinh đủ độ tuổi theo quy định.</li><li>Ưu tiên hồ sơ hoàn thành đầy đủ và đúng thời hạn.</li></ul>
<h3>Hồ sơ cần chuẩn bị</h3>
<ul><li>Đơn đăng ký nhập học.</li><li>Bản sao giấy khai sinh.</li><li>Giấy xác nhận cư trú hoặc giấy tờ liên quan.</li></ul>
<h3>Đăng ký trực tuyến</h3>
<p>Dùng nút nhúng Google Form trên thanh công cụ editor để thêm biểu mẫu ghi danh chính thức.</p>
`,
  },
  menu: {
    title: 'Thực đơn tuần mới',
    excerpt: 'Thực đơn bán trú trong tuần dành cho học sinh Trường Tiểu học Vân Cốc.',
    thumbnailUrl: '/images/design/menu-week-06-10.png',
    content: `
<h2>Thực đơn tuần</h2>
<p>Nhà trường cập nhật thực đơn bán trú trong tuần. Phụ huynh có thể xem chi tiết khẩu phần theo từng ngày trong ảnh thực đơn đính kèm.</p>
<p><em>Chọn ảnh đại diện là poster thực đơn để trang danh sách và trang chi tiết hiển thị đúng mẫu.</em></p>
`,
  },
  service: {
    title: 'Y tế học đường',
    excerpt: 'Thông tin về công tác chăm sóc sức khỏe, vệ sinh trường học và môi trường học tập an toàn cho học sinh.',
    thumbnailUrl: '/images/design/intro-healthcare.png',
    content: `
<div class="lqd-split">
  <div>
    <h2>Tầm quan trọng của y tế học đường</h2>
    <p>Nhà trường luôn đặt công tác chăm sóc và bảo vệ sức khỏe học sinh lên hàng đầu, giúp học sinh có nền tảng thể chất khỏe mạnh để học tập và vui chơi mỗi ngày.</p>
  </div>
  <img src="/images/design/intro-healthcare.png" alt="Y tế học đường" />
</div>
<div class="lqd-split lqd-reverse">
  <img src="/images/design/intro-campus-sanitizing.png" alt="Vệ sinh trường học" />
  <div>
    <h2>Vệ sinh trường học</h2>
    <p>Môi trường học tập được duy trì sạch sẽ, an toàn và thân thiện thông qua các hoạt động vệ sinh, khử khuẩn và kiểm soát an toàn định kỳ.</p>
  </div>
</div>
<div class="lqd-gallery">
  <figure><img src="/images/design/intro-medical-check.png" alt="Khám sức khỏe" /><figcaption>Khám sức khỏe định kỳ cho học sinh.</figcaption></figure>
  <figure><img src="/images/design/intro-safety-training.png" alt="An toàn học đường" /><figcaption>Tổ chức chương trình giáo dục an toàn học đường.</figcaption></figure>
  <figure><img src="/images/design/intro-lunch.png" alt="Bán trú" /><figcaption>Kiểm soát vệ sinh và dinh dưỡng bán trú.</figcaption></figure>
</div>
`,
  },
  news: {
    title: 'Tin tức - sự kiện mới',
    excerpt: 'Cập nhật hoạt động mới nhất của Trường Tiểu học Vân Cốc.',
    thumbnailUrl: '/images/design/news-doi-khoi.png',
    content: `
<h2>Tin tức - sự kiện</h2>
<p>Cập nhật thông tin nổi bật về hoạt động của nhà trường. Nội dung bài viết nên nêu rõ thời gian, địa điểm, đối tượng tham gia và điểm nhấn chính của sự kiện.</p>
<h3>Nội dung chính</h3>
<p>Trình bày diễn biến hoạt động, kết quả đạt được và ý nghĩa đối với học sinh, phụ huynh hoặc cộng đồng nhà trường.</p>
<h3>Hình ảnh hoạt động</h3>
<p>Dùng nút chèn hình ảnh trên thanh công cụ để thêm ảnh thực tế của sự kiện.</p>
`,
  },
  learning: {
    title: 'Hoạt động học tập mới',
    excerpt: 'Thông tin về hoạt động học tập, thành tích học sinh hoặc phương pháp giảng dạy nổi bật.',
    thumbnailUrl: '/images/design/intro-classroom.png',
    content: `
<h2>Hoạt động học tập</h2>
<p>Giới thiệu hoạt động học tập, dự án, tiết học hoặc thành tích nổi bật của học sinh.</p>
<h3>Mục tiêu hoạt động</h3>
<ul><li>Phát triển năng lực học sinh.</li><li>Tăng cường trải nghiệm thực hành.</li><li>Khuyến khích tinh thần chủ động và sáng tạo.</li></ul>
<h3>Kết quả nổi bật</h3>
<p>Nêu kết quả, sản phẩm học tập hoặc phản hồi từ học sinh và giáo viên.</p>
`,
  },
  extracurricular: {
    title: 'Hoạt động ngoại khóa mới',
    excerpt: 'Thông tin về hoạt động trải nghiệm, câu lạc bộ hoặc chương trình ngoại khóa của học sinh.',
    thumbnailUrl: '/images/design/intro-safety-training.png',
    content: `
<h2>Hoạt động ngoại khóa</h2>
<p>Giới thiệu hoạt động trải nghiệm, câu lạc bộ hoặc chương trình ngoại khóa dành cho học sinh.</p>
<h3>Thông tin chương trình</h3>
<ul><li>Thời gian:</li><li>Địa điểm:</li><li>Đối tượng tham gia:</li></ul>
<h3>Ý nghĩa hoạt động</h3>
<p>Nêu kỹ năng, trải nghiệm hoặc giá trị học sinh nhận được sau hoạt động.</p>
`,
  },
  program: {
    title: 'Giới thiệu chương trình giáo dục',
    excerpt: 'Thông tin về chương trình giáo dục, phương pháp học tập và hoạt động phát triển năng lực học sinh.',
    thumbnailUrl: '/images/design/intro-classroom.png',
    content: `
<div class="lqd-split">
  <div>
    <h2>Tổng quan chương trình</h2>
    <p>Giới thiệu định hướng giáo dục, mục tiêu phát triển học sinh và các điểm nổi bật của chương trình.</p>
  </div>
  <img src="/images/design/intro-classroom.png" alt="Chương trình giáo dục" />
</div>
<div class="lqd-split lqd-reverse">
  <img src="/images/design/intro-safety-training.png" alt="Hoạt động trải nghiệm" />
  <div>
    <h2>Hoạt động trải nghiệm</h2>
    <p>Mô tả cách học sinh được tham gia thực hành, dự án và hoạt động phát triển kỹ năng.</p>
  </div>
</div>
`,
  },
  document: {
    title: 'Thư ngỏ gửi phụ huynh học sinh',
    excerpt: 'Thông tin chính thức từ nhà trường kèm tài liệu PDF, Word hoặc Excel để phụ huynh theo dõi.',
    thumbnailUrl: '/images/design/news-letter-cover.png',
    content: `
<p><strong>Kính gửi Quý Cha mẹ học sinh,</strong></p>
<p>Nhà trường trân trọng gửi tới Quý phụ huynh thông tin chính thức về nội dung cần thông báo. Bài viết có thể trình bày tóm tắt phía trên, sau đó nhúng file PDF hoặc đính kèm Word/Excel để phụ huynh mở và tải xuống.</p>
<h3>Tài liệu đính kèm</h3>
<p>Dùng nút "Chèn tài liệu PDF/Word/Excel" trên thanh công cụ editor để chọn file từ Media. Với PDF, website sẽ hiển thị trực tiếp như mẫu thư ngỏ. Với Word/Excel, website hiển thị thẻ mở/tải xuống.</p>
`,
  },
};

export default function CreateArticlePage() {
  const router = useRouter();
  const [initialCategorySlug, setInitialCategorySlug] = useState('');
  const [templateType, setTemplateType] = useState('');
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
  const [templateApplied, setTemplateApplied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setInitialCategorySlug(params.get('category') || '');
    setTemplateType(params.get('type') || '');
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    api<CategoriesPayload>('/categories')
      .then((data) => {
        // API co the tra ve { success, data } hoac array truc tiep
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setCategories(list);
        if (initialCategorySlug && !categoryId) {
          const cat = list.find((item) => item.slug === initialCategorySlug);
          if (cat) setCategoryId(cat.id);
        }
      })
      .catch(() => {});
  }, [categoryId, initialCategorySlug]);

  useEffect(() => {
    if (templateApplied || !templateType) return;
    const template = ARTICLE_TEMPLATES[templateType];
    if (!template) return;

    setTitle(template.title);
    setExcerpt(template.excerpt);
    setContent(template.content);
    setThumbnailUrl(template.thumbnailUrl || '');
    setTemplateApplied(true);
  }, [templateApplied, templateType]);

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

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-700">Chọn mẫu đăng nhanh</div>
        <div className="flex flex-wrap gap-2">
          <a href="/admin/articles/create?category=su-kien&type=news" className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200">Tin tức - sự kiện</a>
          <a href="/admin/articles/create?category=hoc-tap&type=learning" className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200">Học tập</a>
          <a href="/admin/articles/create?category=ngoai-khoa&type=extracurricular" className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200">Ngoại khóa</a>
          <a href="/admin/articles/create?category=tuyen-sinh&type=admission" className="rounded-full bg-green-50 px-3 py-1.5 text-sm text-green-700 hover:bg-green-100">Tuyển sinh</a>
          <a href="/admin/articles/create?category=thuc-don&type=menu" className="rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-100">Thực đơn</a>
          <a href="/admin/articles/create?category=su-kien&type=document" className="rounded-full bg-rose-50 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100">Thư ngỏ / tài liệu</a>
          <a href="/admin/articles/create?type=program" className="rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100">Chương trình</a>
          <a href="/admin/articles/create?type=service" className="rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100">Dịch vụ học đường</a>
        </div>
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
