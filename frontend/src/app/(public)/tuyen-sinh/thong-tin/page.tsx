import { Metadata } from 'next';
import ArticleListLayout from '@/components/public/ArticleListLayout';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'Thông tin tuyển sinh',
  description: 'Thông tin tuyển sinh Trường Tiểu học Vân Cốc.',
  path: '/tuyen-sinh/thong-tin',
});

const INTERNAL_API = getInternalApiBase();
const ITEMS_PER_PAGE = 8;

async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=tuyen-sinh&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { data: [], totalPages: 0 };
    const json = await res.json();
    return {
      data: (json.data || []).map((a: any) => ({
        title: a.title,
        description: a.excerpt || a.description || '',
        category: a.category?.name || 'Tuyển sinh',
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
  { title: 'Thông báo tuyển sinh lớp 1 năm học 2026-2027', description: 'Thông tin chỉ tiêu, hồ sơ và thời gian tuyển sinh lớp 1.', category: 'Tuyển sinh', date: '01/03/2026', slug: 'tuyen-sinh-lop-1-2026-2027', thumbnailUrl: '/images/design/admission-2026-list.png' },
  { title: 'Thông báo tuyển sinh năm học 2025-2026', description: 'Thông tin tuyển sinh lưu trữ để phụ huynh tham khảo.', category: 'Tuyển sinh', date: '15/03/2025', slug: 'thong-bao-tuyen-sinh-nam-hoc-2025-2026', thumbnailUrl: '/images/design/admission-2025-list.png' },
  { title: 'Chương trình học bổng Vân Cốc 2026', description: 'Các suất học bổng dành cho học sinh có thành tích nổi bật.', category: 'Tuyển sinh', date: '10/02/2026', slug: 'hoc-bong-van-coc-2026', thumbnailUrl: '/images/design/news-award.png' },
  { title: 'Tuyển sinh lớp 2-5 bổ sung năm 2026-2027', description: 'Nhận hồ sơ tuyển sinh bổ sung các khối lớp khi còn chỉ tiêu.', category: 'Tuyển sinh', date: '01/04/2026', slug: 'tuyen-sinh-bo-sung-2026', thumbnailUrl: '/images/design/hero-admission-2026.png' },
];

const tabs = [
  { label: 'Thông tin tuyển sinh', href: '/tuyen-sinh/thong-tin', active: true },
  { label: 'CLB Ngôi nhà mơ ước', href: '/tuyen-sinh/clb-ngoi-nha-mo-uoc' },
  { label: 'Q & A', href: '/tuyen-sinh/cau-hoi-thuong-gap' },
];

export default async function ThongTinTuyenSinhPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { data, totalPages } = await getArticles(currentPage);

  return (
    <ArticleListLayout
      eyebrow="TUYỂN SINH"
      title="Thông tin tuyển sinh"
      breadcrumbs={[{ label: 'Tuyển sinh', href: '/tuyen-sinh/thong-tin' }, { label: 'Thông tin tuyển sinh' }]}
      articles={data.length > 0 ? data : placeholderArticles}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/tuyen-sinh/thong-tin"
      tabs={tabs}
    />
  );
}
