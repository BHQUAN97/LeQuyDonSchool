import { Metadata } from 'next';
import ArticleListLayout from '@/components/public/ArticleListLayout';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'CLB Ngôi nhà mơ ước',
  description: 'Chương trình trải nghiệm dành cho học sinh chuẩn bị vào lớp 1 tại Trường Tiểu học Vân Cốc.',
  path: '/tuyen-sinh/clb-ngoi-nha-mo-uoc',
});

const INTERNAL_API = getInternalApiBase();
const ITEMS_PER_PAGE = 8;

async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=clb-ngoi-nha-mo-uoc&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { data: [], totalPages: 0 };
    const json = await res.json();
    return {
      data: (json.data || []).map((a: any) => ({
        title: a.title,
        description: a.excerpt || a.description || '',
        category: a.category?.name || 'CLB',
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
  { title: 'Ngày hội Ngôi nhà mơ ước lần 1 - 2026', description: 'Chương trình trải nghiệm dành cho phụ huynh và các bé chuẩn bị vào lớp 1.', category: 'CLB', date: '20/04/2026', slug: 'ngoi-nha-mo-uoc-lan-1-2026', thumbnailUrl: '/images/design/hero-admission-2026.png' },
  { title: 'Hoạt động trải nghiệm lớp học cho bé mẫu giáo', description: 'Các bé được tham gia tiết học mẫu và trải nghiệm không khí học tập tại trường.', category: 'CLB', date: '15/03/2026', slug: 'trai-nghiem-lop-hoc-mau-giao', thumbnailUrl: '/images/design/intro-classroom.png' },
  { title: 'Đăng ký tham gia CLB Ngôi nhà mơ ước đợt 2', description: 'Phụ huynh đăng ký trong ngày hội được hưởng ưu đãi học phí đặc biệt.', category: 'CLB', date: '10/05/2026', slug: 'dang-ky-clb-dot-2', thumbnailUrl: '/images/design/admission-2026-list.png' },
  { title: 'Hình ảnh ngày hội Ngôi nhà mơ ước 2025', description: 'Tổng hợp hình ảnh các hoạt động vui chơi và giao lưu tại ngày hội.', category: 'CLB', date: '20/04/2025', slug: 'hinh-anh-ngoi-nha-mo-uoc-2025', thumbnailUrl: '/images/design/testimonial-family.png' },
];

const tabs = [
  { label: 'Thông tin tuyển sinh', href: '/tuyen-sinh/thong-tin' },
  { label: 'CLB Ngôi nhà mơ ước', href: '/tuyen-sinh/clb-ngoi-nha-mo-uoc', active: true },
  { label: 'Q & A', href: '/tuyen-sinh/cau-hoi-thuong-gap' },
];

export default async function CLBNgoiNhaMoUocPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { data, totalPages } = await getArticles(currentPage);

  return (
    <ArticleListLayout
      eyebrow="TUYỂN SINH"
      title="Tuyển sinh CLB Ngôi nhà mơ ước"
      breadcrumbs={[{ label: 'Tuyển sinh', href: '/tuyen-sinh/thong-tin' }, { label: 'CLB Ngôi nhà mơ ước' }]}
      articles={data.length > 0 ? data : placeholderArticles}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/tuyen-sinh/clb-ngoi-nha-mo-uoc"
      tabs={tabs}
    />
  );
}
