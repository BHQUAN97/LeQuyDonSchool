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

const articles = [
  { title: 'Học sinh lớp 5 đạt giải Nhất Olympic Toán cấp Quận', description: 'Em Nguyễn Minh Anh xuất sắc giành giải Nhất Olympic Toán cấp Quận Nam Từ Liêm.', category: 'Học tập', date: '10/03/2026', slug: 'giai-nhat-olympic-toan' },
  { title: 'Kết quả kỳ thi Cambridge Flyers đạt tỷ lệ 95%', description: '95% học sinh lớp 5 đạt chứng chỉ Cambridge Flyers trong kỳ thi tháng 12/2025.', category: 'Học tập', date: '05/01/2026', slug: 'ket-qua-cambridge-flyers' },
  { title: 'Dự án STEM "Thành phố thông minh" của lớp 4A', description: 'Lớp 4A hoàn thành dự án STEM mô hình thành phố thông minh với hệ thống đèn tự động.', category: 'Học tập', date: '20/02/2026', slug: 'du-an-stem-thanh-pho' },
  { title: 'Chương trình đọc sách mùa hè - 1000 quyển sách', description: 'Phát động chương trình đọc sách mùa hè với mục tiêu 1000 quyển cho toàn trường.', category: 'Học tập', date: '01/06/2025', slug: 'doc-sach-mua-he' },
  { title: 'Hội thảo phương pháp học tập hiệu quả cho phụ huynh', description: 'Chuyên gia giáo dục chia sẻ phương pháp hỗ trợ con học tập tại nhà hiệu quả.', category: 'Học tập', date: '15/11/2025', slug: 'hoi-thao-phuong-phap' },
  { title: 'Giờ học trải nghiệm "Em tập làm nhà khoa học"', description: 'Học sinh được thực hành thí nghiệm khoa học thú vị trong phòng lab hiện đại.', category: 'Học tập', date: '08/02/2026', slug: 'em-tap-lam-nha-khoa-hoc' },
];

export default function HocTapPage() {
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
          {articles.map((a) => (
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
