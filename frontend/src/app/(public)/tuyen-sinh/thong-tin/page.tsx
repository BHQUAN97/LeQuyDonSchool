import { Metadata } from 'next';
import Breadcrumb from '@/components/public/Breadcrumb';
import ArticleCard from '@/components/public/ArticleCard';
import ArticleSidebar from '@/components/public/ArticleSidebar';
import Pagination from '@/components/public/Pagination';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'Thông tin tuyển sinh',
  description:
    'Thông tin tuyển sinh Trường Tiểu học Lê Quý Đôn - Lịch tuyển sinh, hồ sơ nhập học, học phí và quy trình đăng ký năm học 2026-2027.',
  path: '/tuyen-sinh/thong-tin',
});

const INTERNAL_API = getInternalApiBase();
const ITEMS_PER_PAGE = 8;

/** Fetch bai viet tuyen sinh tu API voi phan trang */
async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=tuyen-sinh&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
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
    title: 'Thông báo tuyển sinh lớp 1 năm học 2026-2027',
    description: 'Trường Tiểu học Lê Quý Đôn thông báo tuyển sinh lớp 1 năm học 2026-2027 với chỉ tiêu 150 học sinh.',
    category: 'Tuyển sinh',
    date: '01/03/2026',
    slug: 'tuyen-sinh-lop-1-2026-2027',
  },
  {
    title: 'Lịch thi kiểm tra đầu vào đợt 1',
    description: 'Kiểm tra đầu vào đợt 1 dành cho các bé đăng ký lớp 1 sẽ diễn ra vào ngày 20/04/2026.',
    category: 'Tuyển sinh',
    date: '15/03/2026',
    slug: 'lich-thi-dau-vao-dot-1',
  },
  {
    title: 'Chương trình học bổng Lê Quý Đôn 2026',
    description: 'Trao 20 suất học bổng toàn phần và bán phần cho học sinh xuất sắc năm học 2026-2027.',
    category: 'Tuyển sinh',
    date: '10/02/2026',
    slug: 'hoc-bong-lqd-2026',
  },
  {
    title: 'Tuyển sinh lớp 2-5 bổ sung năm 2026-2027',
    description: 'Nhận hồ sơ tuyển sinh bổ sung các lớp 2, 3, 4, 5 cho năm học mới.',
    category: 'Tuyển sinh',
    date: '01/04/2026',
    slug: 'tuyen-sinh-bo-sung-2026',
  },
];

export default async function ThongTinTuyenSinhPage({
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
        category: a.category?.name || 'Tuyển sinh',
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
            { label: 'Thông tin tuyển sinh' },
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
          <h2 className="text-2xl font-bold text-slate-900">Thông tin tuyển sinh</h2>
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles list */}
          <div className="lg:col-span-2 space-y-5">
            {articles.map((a: any) => (
              <ArticleCard key={a.slug} {...a} variant="list" />
            ))}

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/tuyen-sinh/thong-tin" />
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
