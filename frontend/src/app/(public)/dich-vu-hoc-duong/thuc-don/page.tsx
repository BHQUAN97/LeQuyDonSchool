import { Metadata } from 'next';
import ArticleListLayout from '@/components/public/ArticleListLayout';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'Thực đơn',
  description: 'Thực đơn bán trú hàng tuần của Trường Tiểu học Vân Cốc.',
  path: '/dich-vu-hoc-duong/thuc-don',
});

const INTERNAL_API = getInternalApiBase();
const ITEMS_PER_PAGE = 8;

async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=thuc-don&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { data: [], totalPages: 0 };
    const json = await res.json();
    return {
      data: (json.data || []).map((a: any) => ({
        title: a.title,
        description: a.excerpt || a.description || '',
        category: a.category?.name || 'Thực đơn',
        date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
        slug: a.slug,
        thumbnailUrl: a.thumbnail_url,
      })),
      totalPages: json.pagination?.totalPages || 0,
    };
  } catch {
    return { data: [], totalPages: 0 };
  }
}

const placeholderArticles = [
  { title: 'Thực đơn tuần 07/04 - 11/04/2026', description: 'Thực đơn bán trú theo tuần dành cho học sinh.', category: 'Thực đơn', date: '07/04/2026', slug: 'thuc-don-tuan-07-04-2026', thumbnailUrl: '/images/design/menu-week-06-10.png' },
  { title: 'Thực đơn tuần 31/03 - 04/04/2026', description: 'Cập nhật khẩu phần ăn bán trú trong tuần.', category: 'Thực đơn', date: '31/03/2026', slug: 'thuc-don-tuan-31-03-2026', thumbnailUrl: '/images/design/menu-week-30-03.png' },
  { title: 'Thực đơn CLB Ngôi nhà mơ ước 04/04/2026', description: 'Thực đơn dành cho chương trình CLB Ngôi nhà mơ ước.', category: 'Thực đơn', date: '04/04/2026', slug: 'thuc-don-clb-04-04-2026', thumbnailUrl: '/images/design/menu-clb-04-04.png' },
  { title: 'Thực đơn CLB Ngôi nhà mơ ước 11/04/2026', description: 'Thực đơn dành cho học sinh tham gia hoạt động trải nghiệm.', category: 'Thực đơn', date: '11/04/2026', slug: 'thuc-don-clb-11-04-2026', thumbnailUrl: '/images/design/menu-clb-11-04.png' },
];

const tabs = [
  { label: 'Thực đơn', href: '/dich-vu-hoc-duong/thuc-don', active: true },
  { label: 'Y tế học đường', href: '/dich-vu-hoc-duong/y-te-hoc-duong' },
];

export default async function ThucDonPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { data, totalPages } = await getArticles(currentPage);

  return (
    <ArticleListLayout
      eyebrow="DỊCH VỤ HỌC ĐƯỜNG"
      title="Thực đơn"
      breadcrumbs={[{ label: 'Dịch vụ học đường', href: '/dich-vu-hoc-duong/thuc-don' }, { label: 'Thực đơn' }]}
      articles={data.length > 0 ? data : placeholderArticles}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/dich-vu-hoc-duong/thuc-don"
      tabs={tabs}
      withSidebar={false}
      grid
      imageFit="contain"
    />
  );
}
