import { Metadata } from 'next';
import ArticleListLayout from '@/components/public/ArticleListLayout';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hoạt động ngoại khóa',
  description: 'Hoạt động ngoại khóa, câu lạc bộ và chương trình trải nghiệm tại Trường Tiểu học Vân Cốc.',
  path: '/tin-tuc/ngoai-khoa',
});

const INTERNAL_API = getInternalApiBase();
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
        thumbnailUrl: a.thumbnail_url,
      })),
      totalPages: json.pagination?.totalPages || 0,
    };
  } catch {
    return { data: [], totalPages: 0 };
  }
}

const placeholderArticles = [
  { title: 'Chuyến dã ngoại tại Vườn quốc gia Ba Vì', description: 'Học sinh lớp 4-5 có chuyến trải nghiệm thiên nhiên đầy ý nghĩa.', category: 'Ngoại khóa', date: '05/03/2026', slug: 'da-ngoai-ba-vi-2026', thumbnailUrl: '/images/design/intro-safety-training.png' },
  { title: 'CLB Robotics giành giải Nhất cuộc thi STEM', description: 'Đội tuyển Robotics đạt giải Nhất cuộc thi STEM cấp Thành phố.', category: 'Ngoại khóa', date: '28/02/2026', slug: 'clb-robotics-giai-nhat', thumbnailUrl: '/images/design/news-award.png' },
  { title: 'Chương trình trao đổi học sinh với PLC Sydney', description: 'Học sinh tham gia chương trình trao đổi và mở rộng trải nghiệm quốc tế.', category: 'Ngoại khóa', date: '15/01/2026', slug: 'trao-doi-plc-sydney', thumbnailUrl: '/images/design/hero-admission-2026.png' },
];

const tabs = [
  { label: 'Sự kiện', href: '/tin-tuc/su-kien' },
  { label: 'Ngoại khóa', href: '/tin-tuc/ngoai-khoa', active: true },
  { label: 'Học tập', href: '/tin-tuc/hoc-tap' },
];

export default async function NgoaiKhoaPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { data, totalPages } = await getArticles(currentPage);

  return (
    <ArticleListLayout
      eyebrow="TIN TỨC"
      title="Hoạt động ngoại khóa"
      breadcrumbs={[{ label: 'Tin tức', href: '/tin-tuc/su-kien' }, { label: 'Ngoại khóa' }]}
      articles={data.length > 0 ? data : placeholderArticles}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/tin-tuc/ngoai-khoa"
      tabs={tabs}
    />
  );
}
