import { Metadata } from 'next';
import Link from 'next/link';
import PageBanner from '@/components/public/PageBanner';
import ArticleCard from '@/components/public/ArticleCard';
import SafeHtml from '@/components/public/SafeHtml';
import { Calendar, User, Tag, Share2 } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * generateMetadata — lay title/description tu API cho bai viet.
 * Fallback ve placeholder neu API chua san sang.
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/articles/${params.slug}`, {
      next: { revalidate: 600 },
    });
    if (res.ok) {
      const json = await res.json();
      const item = json.data || json;
      return buildPageMetadata({
        title: item.title || 'Bài viết',
        description: item.description || item.excerpt || `Đọc bài viết ${item.title} tại Trường Tiểu học Lê Quý Đôn.`,
        path: `/tin-tuc/${params.slug}`,
        ogImage: item.coverImage || item.cover_image || undefined,
        type: 'article',
        publishedTime: item.publishedAt || item.published_at || undefined,
      });
    }
  } catch {
    // API chua san sang — dung fallback
  }

  return buildPageMetadata({
    title: 'Bài viết',
    description: 'Đọc tin tức và bài viết mới nhất tại Trường Tiểu học Lê Quý Đôn.',
    path: `/tin-tuc/${params.slug}`,
    type: 'article',
  });
}

/* Placeholder data — se lay tu API theo slug */
const article = {
  title: 'Lễ khai giảng năm học 2025-2026 đầy ấn tượng',
  category: 'Sự kiện',
  date: '01/09/2025',
  author: 'Ban Truyền thông',
  content: `
    <p>Sáng ngày 01/09/2025, Trường Tiểu học Lê Quý Đôn đã long trọng tổ chức Lễ khai giảng năm học 2025-2026 với sự tham gia của hơn 1000 học sinh, phụ huynh và toàn thể cán bộ giáo viên.</p>

    <h2>Không khí lễ hội trang trọng</h2>
    <p>Buổi lễ diễn ra trong không khí vui tươi, phấn khởi. Sân trường được trang hoàng rực rỡ với cờ hoa, băng rôn chào mừng năm học mới. Các em học sinh trong bộ đồng phục mới, gương mặt rạng rỡ háo hức bước vào năm học mới.</p>

    <h2>Phát biểu khai giảng</h2>
    <p>Trong bài phát biểu, Hiệu trưởng nhà trường đã gửi lời chào mừng tới toàn thể học sinh, đặc biệt là các em học sinh lớp 1 lần đầu tiên bước vào ngôi trường mới. Thầy cũng chia sẻ về những mục tiêu và định hướng phát triển trong năm học mới.</p>

    <h2>Chương trình văn nghệ đặc sắc</h2>
    <p>Buổi lễ còn có phần biểu diễn văn nghệ do chính các em học sinh thể hiện với nhiều tiết mục đa dạng: hát, múa, kịch ngắn... Tất cả đều để lại ấn tượng sâu sắc trong lòng phụ huynh và khách mời.</p>

    <p>Với tinh thần mới, năng lượng mới, toàn thể thầy cô và học sinh Trường Tiểu học Lê Quý Đôn sẵn sàng bước vào năm học 2025-2026 với quyết tâm đạt nhiều thành tích xuất sắc hơn nữa.</p>
  `,
};

const relatedArticles = [
  { title: 'Hội thao mùa xuân 2026', description: 'Hội thao quy tụ học sinh với nhiều nội dung thi đấu hấp dẫn.', category: 'Sự kiện', date: '15/03/2026', slug: 'hoi-thao-mua-xuan-2026' },
  { title: 'Ngày hội sách lần thứ 5', description: 'Chương trình khuyến đọc với nhiều hoạt động sáng tạo.', category: 'Sự kiện', date: '20/03/2026', slug: 'ngay-hoi-sach-lan-5' },
  { title: 'Đêm nhạc "Sắc màu tuổi thơ"', description: 'Chương trình văn nghệ đặc sắc nhân Ngày Nhà giáo.', category: 'Sự kiện', date: '20/11/2025', slug: 'dem-nhac-sac-mau-tuoi-tho' },
];

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <PageBanner
        title={article.title}
        breadcrumbItems={[
          { label: 'Tin tức', href: '/tin-tuc/su-kien' },
          { label: article.category, href: '/tin-tuc/su-kien' },
          { label: 'Chi tiết bài viết' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <article className="lg:col-span-2">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {article.category}
              </span>
            </div>

            {/* Featured image */}
            <div className="h-56 lg:h-80 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-8">
              Hình ảnh bài viết
            </div>

            {/* Content */}
            <SafeHtml
              html={article.content}
              className="prose prose-slate prose-sm max-w-none
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4"
            />

            {/* Share */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-200">
              <Share2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">Chia sẻ:</span>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md">Facebook</button>
              <button className="px-3 py-1.5 bg-sky-500 text-white text-xs rounded-md">Zalo</button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <h3 className="font-bold text-slate-900 mb-4">Bài viết liên quan</h3>
              <div className="space-y-4">
                {relatedArticles.map((a) => (
                  <Link key={a.slug} href={`/tin-tuc/${a.slug}`} className="block group">
                    <div className="flex gap-3">
                      <div className="w-20 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-[10px] flex-shrink-0">
                        Ảnh
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                          {a.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">{a.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="mt-8">
                <h3 className="font-bold text-slate-900 mb-4">Danh mục</h3>
                <div className="space-y-2">
                  {['Sự kiện', 'Ngoại khóa', 'Học tập', 'Tuyển sinh'].map((cat) => (
                    <Link
                      key={cat}
                      href={`/tin-tuc/su-kien`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600"
                    >
                      <span>{cat}</span>
                      <span className="text-xs text-slate-400">12</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related articles full-width */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Tin tức khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.slug} {...a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
