import { Metadata } from 'next';
import PageBanner from '@/components/public/PageBanner';
import ArticleCard from '@/components/public/ArticleCard';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hoạt động học tập',
  description:
    'Hoạt động học tập tại Trường Tiểu học Lê Quý Đôn - Thành tích học sinh, cuộc thi học thuật, dự án nghiên cứu và phương pháp giảng dạy sáng tạo.',
  path: '/tin-tuc/hoc-tap',
});

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';

async function getArticles() {
  try {
    const res = await fetch(`${INTERNAL_API}/articles/public?limit=12&sort=published_at&order=DESC`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((a: any) => ({
      title: a.title,
      description: a.excerpt || a.description || '',
      category: a.category?.name || 'Học tập',
      date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
      slug: a.slug,
    }));
  } catch {
    return [];
  }
}

const placeholderArticles = [
  { title: 'Học sinh lớp 5 đạt giải Nhất Olympic Toán cấp Quận', description: 'Em Nguyễn Minh Anh xuất sắc giành giải Nhất Olympic Toán cấp Quận Nam Từ Liêm.', category: 'Học tập', date: '10/03/2026', slug: 'giai-nhat-olympic-toan' },
  { title: 'Kết quả kỳ thi Cambridge Flyers đạt tỷ lệ 95%', description: '95% học sinh lớp 5 đạt chứng chỉ Cambridge Flyers trong kỳ thi tháng 12/2025.', category: 'Học tập', date: '05/01/2026', slug: 'ket-qua-cambridge-flyers' },
  { title: 'Dự án STEM "Thành phố thông minh" của lớp 4A', description: 'Lớp 4A hoàn thành dự án STEM mô hình thành phố thông minh với hệ thống đèn tự động.', category: 'Học tập', date: '20/02/2026', slug: 'du-an-stem-thanh-pho' },
];

export default async function HocTapPage() {
  const apiArticles = await getArticles();
  const articles = apiArticles.length > 0 ? apiArticles : placeholderArticles;
  return (
    <div>
      <PageBanner
        title="Hoạt động học tập"
        description="Thành tích và hoạt động học tập nổi bật của học sinh"
        breadcrumbItems={[
          { label: 'Tin tức', href: '/tin-tuc/su-kien' },
          { label: 'Học tập' },
        ]}
        bgClass="bg-gradient-to-r from-emerald-700 to-green-600"
      />

      {/* Articles grid */}
      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a: any) => (
            <ArticleCard key={a.slug} {...a} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-10">
          <button className="w-9 h-9 rounded-lg bg-green-700 text-white text-sm font-medium">1</button>
          <button className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200">2</button>
        </div>
      </section>
    </div>
  );
}
