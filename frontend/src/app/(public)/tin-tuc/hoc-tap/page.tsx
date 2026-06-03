import { Metadata } from 'next';
import ArticleListLayout from '@/components/public/ArticleListLayout';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hoạt động học tập',
  description: 'Hoạt động học tập, thành tích học sinh và phương pháp giảng dạy tại Trường Tiểu học Vân Cốc.',
  path: '/tin-tuc/hoc-tap',
});

const INTERNAL_API = getInternalApiBase();
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
        thumbnailUrl: a.thumbnail_url,
      })),
      totalPages: json.pagination?.totalPages || 0,
    };
  } catch {
    return { data: [], totalPages: 0 };
  }
}

const placeholderArticles = [
  { title: 'Học sinh lớp 5 đạt giải Nhất Olympic Toán cấp Quận', description: 'Em Nguyễn Minh Anh xuất sắc giành giải Nhất Olympic Toán cấp Quận.', category: 'Học tập', date: '10/03/2026', slug: 'giai-nhat-olympic-toan', thumbnailUrl: '/images/design/news-award.png' },
  { title: 'Kết quả kỳ thi Cambridge Flyers đạt tỷ lệ 95%', description: 'Học sinh lớp 5 đạt chứng chỉ Cambridge Flyers với kết quả tích cực.', category: 'Học tập', date: '05/01/2026', slug: 'ket-qua-cambridge-flyers', thumbnailUrl: '/images/design/intro-classroom.png' },
  { title: 'Dự án STEM Thành phố thông minh của lớp 4A', description: 'Lớp 4A hoàn thành dự án STEM mô hình thành phố thông minh.', category: 'Học tập', date: '20/02/2026', slug: 'du-an-stem-thanh-pho', thumbnailUrl: '/images/design/intro-safety-training.png' },
];

const tabs = [
  { label: 'Sự kiện', href: '/tin-tuc/su-kien' },
  { label: 'Ngoại khóa', href: '/tin-tuc/ngoai-khoa' },
  { label: 'Học tập', href: '/tin-tuc/hoc-tap', active: true },
];

export default async function HocTapPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { data, totalPages } = await getArticles(currentPage);

  return (
    <ArticleListLayout
      eyebrow="TIN TỨC"
      title="Hoạt động học tập"
      breadcrumbs={[{ label: 'Tin tức', href: '/tin-tuc/su-kien' }, { label: 'Học tập' }]}
      articles={data.length > 0 ? data : placeholderArticles}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/tin-tuc/hoc-tap"
      tabs={tabs}
    />
  );
}
