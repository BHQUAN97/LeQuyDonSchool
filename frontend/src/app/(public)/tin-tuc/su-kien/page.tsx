import { Metadata } from 'next';
import ArticleListLayout from '@/components/public/ArticleListLayout';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tin tức sự kiện',
  description: 'Tin tức và sự kiện mới nhất tại Trường Tiểu học Vân Cốc.',
  path: '/tin-tuc/su-kien',
});

const INTERNAL_API = getInternalApiBase();
const ITEMS_PER_PAGE = 8;

async function getArticles(page: number) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?category=su-kien&limit=${ITEMS_PER_PAGE}&page=${page}&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { data: [], totalPages: 0 };
    const json = await res.json();
    return {
      data: (json.data || []).map((a: any) => ({
        title: a.title,
        description: a.excerpt || a.description || '',
        category: a.category?.name || 'Sự kiện',
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
  { title: 'Lễ khai giảng năm học 2025-2026 đầy ấn tượng', description: 'Buổi lễ khai giảng diễn ra trang trọng với sự tham gia của học sinh và phụ huynh.', category: 'Sự kiện', date: '01/09/2025', slug: 'le-khai-giang-2025-2026', thumbnailUrl: '/images/design/news-doi-khoi.png' },
  { title: 'Hội thao mùa xuân 2026', description: 'Hội thao quy tụ học sinh từ lớp 1 đến lớp 5 với nhiều nội dung thi đấu hấp dẫn.', category: 'Sự kiện', date: '15/03/2026', slug: 'hoi-thao-mua-xuan-2026', thumbnailUrl: '/images/design/news-award.png' },
  { title: 'Ngày hội sách Vân Cốc lần thứ 5', description: 'Chương trình khuyến đọc với nhiều hoạt động trao đổi sách và giao lưu.', category: 'Sự kiện', date: '20/03/2026', slug: 'ngay-hoi-sach-lan-5', thumbnailUrl: '/images/design/news-food-safety.png' },
  { title: 'Lễ tổng kết năm học và trao giải học sinh xuất sắc', description: 'Vinh danh học sinh có thành tích nổi bật trong năm học.', category: 'Sự kiện', date: '30/05/2025', slug: 'le-tong-ket-2024-2025', thumbnailUrl: '/images/design/news-health-check.png' },
];

const tabs = [
  { label: 'Sự kiện', href: '/tin-tuc/su-kien', active: true },
  { label: 'Ngoại khóa', href: '/tin-tuc/ngoai-khoa' },
  { label: 'Học tập', href: '/tin-tuc/hoc-tap' },
];

export default async function SuKienPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { data, totalPages } = await getArticles(currentPage);

  return (
    <ArticleListLayout
      eyebrow="TIN TỨC"
      title="Tin tức - Sự kiện"
      breadcrumbs={[{ label: 'Tin tức', href: '/tin-tuc/su-kien' }, { label: 'Sự kiện' }]}
      articles={data.length > 0 ? data : placeholderArticles}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/tin-tuc/su-kien"
      tabs={tabs}
    />
  );
}
