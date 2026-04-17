import { Metadata } from 'next';
import Breadcrumb from '@/components/public/Breadcrumb';
import ArticleCard from '@/components/public/ArticleCard';
import ArticleSidebar from '@/components/public/ArticleSidebar';
import Pagination from '@/components/public/Pagination';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'Thực đơn học đường',
  description:
    'Thực đơn dinh dưỡng hàng tuần tại Trường Tiểu học Lê Quý Đôn - Bữa ăn cân bằng, an toàn vệ sinh thực phẩm, phù hợp lứa tuổi tiểu học.',
  path: '/dich-vu-hoc-duong/thuc-don',
});

const INTERNAL_API = getInternalApiBase();
const ITEMS_PER_PAGE = 8;

/** Fetch bai viet thuc don tu API voi phan trang */
async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=thuc-don&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
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
  {
    title: 'Thực đơn tuần 07/04 - 11/04/2026',
    description: 'Thực đơn dinh dưỡng được chuyên gia thiết kế đảm bảo đủ 4 nhóm chất cho học sinh.',
    category: 'Thực đơn',
    date: '07/04/2026',
    slug: 'thuc-don-tuan-07-04-2026',
  },
  {
    title: 'Thực đơn tuần 31/03 - 04/04/2026',
    description: 'Bữa ăn cân bằng với nguồn thực phẩm sạch, rau từ trang trại liên kết.',
    category: 'Thực đơn',
    date: '31/03/2026',
    slug: 'thuc-don-tuan-31-03-2026',
  },
  {
    title: 'Thực đơn tuần 24/03 - 28/03/2026',
    description: 'Menu đa dạng với 3 bữa/ngày: sáng, trưa và xế đảm bảo năng lượng cho cả ngày học.',
    category: 'Thực đơn',
    date: '24/03/2026',
    slug: 'thuc-don-tuan-24-03-2026',
  },
  {
    title: 'Thực đơn tuần 17/03 - 21/03/2026',
    description: 'Bếp ăn một chiều đạt chuẩn VSATTP, nhân viên có chứng chỉ chuyên môn.',
    category: 'Thực đơn',
    date: '17/03/2026',
    slug: 'thuc-don-tuan-17-03-2026',
  },
];

export default async function ThucDonPage({
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
        category: a.category?.name || 'Thực đơn',
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
            { label: 'Tin tức', href: '/tin-tuc/su-kien' },
            { label: 'Thực đơn' },
          ]} />
        </div>
      </div>

      {/* Section title */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">TIN TỨC SỰ KIỆN</span>
            <div className="flex gap-0.5">
              <span className="w-6 h-1 bg-green-700 rounded-full" />
              <span className="w-6 h-1 bg-red-600 rounded-full" />
              <span className="w-6 h-1 bg-green-700 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Thực đơn</h2>
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles list */}
          <div className="lg:col-span-2 space-y-5">
            {articles.map((a: any) => (
              <ArticleCard key={a.slug} {...a} variant="list" />
            ))}

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/dich-vu-hoc-duong/thuc-don" />
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
