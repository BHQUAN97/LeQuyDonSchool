import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import ArticleCard from '@/components/public/ArticleCard';
import ArticleSidebar from '@/components/public/ArticleSidebar';
import Pagination from '@/components/public/Pagination';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hoạt động ngoại khóa',
  description:
    'Hoạt động ngoại khóa phong phú tại Trường Tiểu học Lê Quý Đôn - Dã ngoại, tham quan, câu lạc bộ và các chương trình trải nghiệm thực tế.',
  path: '/tin-tuc/ngoai-khoa',
});

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
const ITEMS_PER_PAGE = 8;

async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=ngoai-khoa&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { data: [], totalPages: 0 };
    const json = await res.json();
    return {
      data: (json.data || []).map((a: any) => ({
        title: a.title,
        description: a.excerpt || a.description || '',
        category: a.category?.name || 'Ngoại khóa',
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
  { title: 'Chuyến dã ngoại tại Vườn quốc gia Ba Vì', description: 'Học sinh lớp 4-5 có chuyến trải nghiệm thiên nhiên đầy ý nghĩa tại Ba Vì.', category: 'Ngoại khóa', date: '05/03/2026', slug: 'da-ngoai-ba-vi-2026' },
  { title: 'CLB Robotics giành giải Nhất cuộc thi STEM', description: 'Đội tuyển Robotics đạt giải Nhất cuộc thi STEM cấp Thành phố lần thứ 3 liên tiếp.', category: 'Ngoại khóa', date: '28/02/2026', slug: 'clb-robotics-giai-nhat' },
  { title: 'Chương trình trao đổi học sinh với PLC Sydney', description: '20 học sinh tham gia chương trình trao đổi 2 tuần tại PLC Sydney, Australia.', category: 'Ngoại khóa', date: '15/01/2026', slug: 'trao-doi-plc-sydney' },
];

/** Category tabs — 3 chuyen muc chinh */
const categoryTabs = [
  { label: 'Sự kiện', href: '/tin-tuc/su-kien', active: false },
  { label: 'Ngoại khóa', href: '/tin-tuc/ngoai-khoa', active: true },
  { label: 'Học tập', href: '/tin-tuc/hoc-tap', active: false },
];

export default async function NgoaiKhoaPage({
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
            { label: 'Ngoại khóa' },
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
            <h2 className="text-2xl font-bold text-slate-900">Hoạt động ngoại khóa</h2>
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
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/tin-tuc/ngoai-khoa" />
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
