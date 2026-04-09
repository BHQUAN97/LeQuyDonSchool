import { Metadata } from 'next';
import PageBanner from '@/components/public/PageBanner';
import ArticleCard from '@/components/public/ArticleCard';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tin tức sự kiện',
  description:
    'Tin tức và sự kiện mới nhất tại Trường Tiểu học Lê Quý Đôn - Lễ hội, hội thao, ngày hội sách và các hoạt động nổi bật.',
  path: '/tin-tuc/su-kien',
});

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';

/** Fetch bai viet tu API */
async function getArticles() {
  try {
    const res = await fetch(`${INTERNAL_API}/articles/public?limit=12&sort=published_at&order=DESC`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/** Placeholder khi chua co bai viet tu API */
const placeholderArticles = [
  { title: 'Lễ khai giảng năm học 2025-2026 đầy ấn tượng', description: 'Buổi lễ khai giảng diễn ra trang trọng với sự tham gia của hơn 1000 học sinh và phụ huynh.', category: 'Sự kiện', date: '01/09/2025', slug: 'le-khai-giang-2025-2026' },
  { title: 'Hội thao mùa xuân 2026 - Ngày hội của tình thân', description: 'Hội thao quy tụ học sinh từ lớp 1 đến lớp 5 với nhiều nội dung thi đấu hấp dẫn.', category: 'Sự kiện', date: '15/03/2026', slug: 'hoi-thao-mua-xuan-2026' },
  { title: 'Ngày hội sách Lê Quý Đôn lần thứ 5', description: 'Chương trình khuyến đọc với nhiều hoạt động: trao đổi sách, giao lưu tác giả, vẽ tranh.', category: 'Sự kiện', date: '20/03/2026', slug: 'ngay-hoi-sach-lan-5' },
  { title: 'Lễ tổng kết năm học và trao giải học sinh xuất sắc', description: 'Vinh danh những học sinh có thành tích xuất sắc trong năm học 2024-2025.', category: 'Sự kiện', date: '30/05/2025', slug: 'le-tong-ket-2024-2025' },
  { title: 'Đêm nhạc "Sắc màu tuổi thơ" chào mừng 20/11', description: 'Chương trình văn nghệ đặc sắc do chính học sinh biểu diễn nhân Ngày Nhà giáo Việt Nam.', category: 'Sự kiện', date: '20/11/2025', slug: 'dem-nhac-sac-mau-tuoi-tho' },
  { title: 'Hội chợ Xuân 2026 - Gây quỹ từ thiện', description: 'Học sinh tự tay làm sản phẩm, bán hàng tại hội chợ, gây quỹ ủng hộ trẻ em vùng cao.', category: 'Sự kiện', date: '25/01/2026', slug: 'hoi-cho-xuan-2026' },
];

const categories = ['Tất cả', 'Sự kiện', 'Thông báo', 'Khen thưởng'];

export default async function SuKienPage() {
  const apiArticles = await getArticles();
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
      <PageBanner
        title="Tin tức & Sự kiện"
        description="Cập nhật những tin tức và sự kiện mới nhất tại Lê Quý Đôn"
        breadcrumbItems={[
          { label: 'Tin tức', href: '/tin-tuc/su-kien' },
          { label: 'Sự kiện' },
        ]}
      />

      {/* Filter */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  i === 0 ? 'bg-green-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

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
          <button className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200">3</button>
        </div>
      </section>
    </div>
  );
}
