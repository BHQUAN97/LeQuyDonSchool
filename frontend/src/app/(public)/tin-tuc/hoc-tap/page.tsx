import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import ArticleCard from '@/components/public/ArticleCard';
import ArticleSidebar from '@/components/public/ArticleSidebar';
import Pagination from '@/components/public/Pagination';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hoạt động học tập',
  description:
    'Hoạt động học tập tại Trường Tiểu học Lê Quý Đôn - Thành tích học sinh, cuộc thi học thuật, dự án nghiên cứu và phương pháp giảng dạy sáng tạo.',
  path: '/tin-tuc/hoc-tap',
});

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
const ITEMS_PER_PAGE = 8;

async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=hoc-tap&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { data: [], totalPages: 0 };
    const json = await res.json();
    return {
      data: (json.data || []).map((a: any) => ({
        title: a.title,
        description: a.excerpt || a.description || '',
        category: a.category?.name || 'Học tập',
        date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
        slug: a.slug,
      })),
      totalPages: json.pagination?.totalPages || 0,
    };
  } catch {
    return { data: [], totalPages: 0 };
  }
}

const placeholderArticles = [
  { title: 'Học sinh lớp 5 đạt giải Nhất Olympic Toán cấp Quận', description: 'Em Nguyễn Minh Anh xuất sắc giành giải Nhất Olympic Toán cấp Quận Nam Từ Liêm.', category: 'Học tập', date: '10/03/2026', slug: 'giai-nhat-olympic-toan' },
  { title: 'Kết quả kỳ thi Cambridge Flyers đạt tỷ lệ 95%', description: '95% học sinh lớp 5 đạt chứng chỉ Cambridge Flyers trong kỳ thi tháng 12/2025.', category: 'Học tập', date: '05/01/2026', slug: 'ket-qua-cambridge-flyers' },
  { title: 'Dự án STEM "Thành phố thông minh" của lớp 4A', description: 'Lớp 4A hoàn thành dự án STEM mô hình thành phố thông minh với hệ thống đèn tự động.', category: 'Học tập', date: '20/02/2026', slug: 'du-an-stem-thanh-pho' },
];

/** Category tabs — 3 chuyen muc chinh */
const categoryTabs = [
  { label: 'Sự kiện', href: '/tin-tuc/su-kien', active: false },
  { label: 'Ngoại khóa', href: '/tin-tuc/ngoai-khoa', active: false },
  { label: 'Học tập', href: '/tin-tuc/hoc-tap', active: true },
];

export default async function HocTapPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { data: apiArticles, totalPages } = await getArticles(currentPage);
  const articles = apiArticles.length > 0 ? apiArticles : placeholderArticles;
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Tin tức', href: '/tin-tuc/su-kien' },
            { label: 'Học tập' },
          ]} />
        </div>
      </div>

      {/* Section title + category tabs */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">TIN TỨC SỰ KIỆN</span>
              <div className="flex gap-0.5">
                <span className="w-6 h-1 bg-green-700 rounded-full" />
                <span className="w-6 h-1 bg-red-600 rounded-full" />
                <span className="w-6 h-1 bg-green-700 rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Hoạt động học tập</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categoryTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  tab.active
                    ? 'bg-green-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles list */}
          <div className="lg:col-span-2 space-y-5">
            {articles.map((a: any) => (
              <ArticleCard key={a.slug} {...a} variant="list" />
            ))}

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/tin-tuc/hoc-tap" />
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
