import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import ArticleCard from '@/components/public/ArticleCard';
import ArticleSidebar from '@/components/public/ArticleSidebar';
import Pagination from '@/components/public/Pagination';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tin tức sự kiện',
  description:
    'Tin tức và sự kiện mới nhất tại Trường Tiểu học Lê Quý Đôn - Lễ hội, hội thao, ngày hội sách và các hoạt động nổi bật.',
  path: '/tin-tuc/su-kien',
});

const INTERNAL_API = getInternalApiBase();
const ITEMS_PER_PAGE = 8;

/** Fetch bai viet tu API voi phan trang */
async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=su-kien&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { data: [], totalPages: 0 };
    const json = await res.json();
    return {
      data: json.data || [],
      totalPages: json.pagination?.totalPages || 0,
    };
  } catch {
    return { data: [], totalPages: 0 };
  }
}

/** Placeholder khi chua co bai viet tu API */
const placeholderArticles = [
  { title: 'Lễ khai giảng năm học 2025-2026 đầy ấn tượng', description: 'Buổi lễ khai giảng diễn ra trang trọng với sự tham gia của hơn 1000 học sinh và phụ huynh.', category: 'Sự kiện', date: '01/09/2025', slug: 'le-khai-giang-2025-2026' },
  { title: 'Hội thao mùa xuân 2026 - Ngày hội của tình thân', description: 'Hội thao quy tụ học sinh từ lớp 1 đến lớp 5 với nhiều nội dung thi đấu hấp dẫn.', category: 'Sự kiện', date: '15/03/2026', slug: 'hoi-thao-mua-xuan-2026' },
  { title: 'Ngày hội sách Lê Quý Đôn lần thứ 5', description: 'Chương trình khuyến đọc với nhiều hoạt động: trao đổi sách, giao lưu tác giả, vẽ tranh.', category: 'Sự kiện', date: '20/03/2026', slug: 'ngay-hoi-sach-lan-5' },
  { title: 'Lễ tổng kết năm học và trao giải học sinh xuất sắc', description: 'Vinh danh những học sinh có thành tích xuất sắc trong năm học 2024-2025.', category: 'Sự kiện', date: '30/05/2025', slug: 'le-tong-ket-2024-2025' },
];

/** Category tabs — 3 chuyen muc chinh */
const categoryTabs = [
  { label: 'Sự kiện', href: '/tin-tuc/su-kien', active: true },
  { label: 'Ngoại khóa', href: '/tin-tuc/ngoai-khoa', active: false },
  { label: 'Học tập', href: '/tin-tuc/hoc-tap', active: false },
];

export default async function SuKienPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { data: apiArticles, totalPages } = await getArticles(currentPage);
  const articles = apiArticles.length > 0
    ? apiArticles.map((a: any) => ({
        title: a.title,
        description: a.excerpt || a.description || '',
        category: a.category?.name || 'Sự kiện',
        date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
        slug: a.slug,
        coverImage: a.cover_image,
      }))
    : placeholderArticles;
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Tin tức', href: '/tin-tuc/su-kien' },
            { label: 'Sự kiện' },
          ]} />
        </div>
      </div>

      {/* Section title + category tabs */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">TIN TỨC SỰ KIỆN</span>
              <div className="flex gap-0.5">
                <span className="w-6 h-1 bg-green-700 rounded-full" />
                <span className="w-6 h-1 bg-red-600 rounded-full" />
                <span className="w-6 h-1 bg-green-700 rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Tin tức - Sự kiện</h2>
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
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/tin-tuc/su-kien" />
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
