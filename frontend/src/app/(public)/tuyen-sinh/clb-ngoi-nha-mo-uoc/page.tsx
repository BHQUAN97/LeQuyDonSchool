import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import ArticleCard from '@/components/public/ArticleCard';
import ArticleSidebar from '@/components/public/ArticleSidebar';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'CLB Ngôi nhà mơ ước',
  description:
    'CLB Ngôi nhà mơ ước - Chương trình trải nghiệm dành cho học sinh mới tại Trường Tiểu học Lê Quý Đôn. Hoạt động vui chơi, học tập và kết bạn.',
  path: '/tuyen-sinh/clb-ngoi-nha-mo-uoc',
});

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';

/** Fetch bai viet CLB tu API */
async function getArticles() {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=clb-ngoi-nha-mo-uoc&limit=12&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/** Placeholder khi chua co bai viet tu API */
const placeholderArticles = [
  {
    title: 'Ngày hội "Ngôi nhà mơ ước" lần 1 - 2026',
    description: 'Chương trình trải nghiệm dành cho phụ huynh và các bé chuẩn bị vào lớp 1, tham quan trường và giao lưu giáo viên.',
    category: 'CLB',
    date: '20/04/2026',
    slug: 'ngoi-nha-mo-uoc-lan-1-2026',
  },
  {
    title: 'Hoạt động trải nghiệm lớp học cho bé mẫu giáo',
    description: 'Các bé được tham gia tiết học mẫu, trải nghiệm không khí học tập thực tế tại trường.',
    category: 'CLB',
    date: '15/03/2026',
    slug: 'trai-nghiem-lop-hoc-mau-giao',
  },
  {
    title: 'Đăng ký tham gia CLB Ngôi nhà mơ ước đợt 2',
    description: 'Phụ huynh đăng ký trong ngày hội được hưởng ưu đãi học phí đặc biệt cho năm học 2026-2027.',
    category: 'CLB',
    date: '10/05/2026',
    slug: 'dang-ky-clb-dot-2',
  },
  {
    title: 'Hình ảnh ngày hội Ngôi nhà mơ ước 2025',
    description: 'Tổng hợp hình ảnh các hoạt động vui chơi, giao lưu tại ngày hội năm 2025.',
    category: 'CLB',
    date: '20/04/2025',
    slug: 'hinh-anh-ngoi-nha-mo-uoc-2025',
  },
];

export default async function CLBNgoiNhaMoUocPage() {
  const apiArticles = await getArticles();
  const articles = apiArticles.length > 0
    ? apiArticles.map((a: any) => ({
        title: a.title,
        description: a.excerpt || a.description || '',
        category: a.category?.name || 'CLB',
        date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
        slug: a.slug,
      }))
    : placeholderArticles;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Tuyển sinh', href: '/tuyen-sinh/thong-tin' },
            { label: 'CLB Ngôi nhà mơ ước' },
          ]} />
        </div>
      </div>

      {/* Section title */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">TIN TỨC SỰ KIỆN</span>
            <div className="flex gap-0.5">
              <span className="w-6 h-1 bg-green-700 rounded-full" />
              <span className="w-6 h-1 bg-red-600 rounded-full" />
              <span className="w-6 h-1 bg-green-700 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Tuyển sinh CLB Ngôi nhà mơ ước</h2>
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles list */}
          <div className="lg:col-span-2 space-y-5">
            {articles.map((a: any) => (
              <ArticleCard key={a.slug} {...a} variant="list" />
            ))}

            {/* Pagination */}
            <div className="flex justify-center gap-2 pt-6 pb-8">
              <button className="w-9 h-9 rounded-lg bg-green-700 text-white text-sm font-medium">1</button>
              <button className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200">2</button>
              <button className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200">3</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ArticleSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
