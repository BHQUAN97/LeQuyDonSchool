import { Metadata } from 'next';
import PageBanner from '@/components/public/PageBanner';
import ArticleCard from '@/components/public/ArticleCard';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hoạt động ngoại khóa',
  description:
    'Hoạt động ngoại khóa phong phú tại Trường Tiểu học Lê Quý Đôn - Dã ngoại, tham quan, câu lạc bộ và các chương trình trải nghiệm thực tế.',
  path: '/tin-tuc/ngoai-khoa',
});

const articles = [
  { title: 'Chuyến dã ngoại tại Vườn quốc gia Ba Vì', description: 'Học sinh lớp 4-5 có chuyến trải nghiệm thiên nhiên đầy ý nghĩa tại Ba Vì.', category: 'Ngoại khóa', date: '05/03/2026', slug: 'da-ngoai-ba-vi-2026' },
  { title: 'CLB Robotics giành giải Nhất cuộc thi STEM', description: 'Đội tuyển Robotics đạt giải Nhất cuộc thi STEM cấp Thành phố lần thứ 3 liên tiếp.', category: 'Ngoại khóa', date: '28/02/2026', slug: 'clb-robotics-giai-nhat' },
  { title: 'Chương trình trao đổi học sinh với PLC Sydney', description: '20 học sinh tham gia chương trình trao đổi 2 tuần tại PLC Sydney, Australia.', category: 'Ngoại khóa', date: '15/01/2026', slug: 'trao-doi-plc-sydney' },
  { title: 'Trại hè tiếng Anh "English Summer Camp 2025"', description: 'Trại hè tiếng Anh kéo dài 1 tuần với nhiều hoạt động sáng tạo cùng giáo viên bản ngữ.', category: 'Ngoại khóa', date: '01/07/2025', slug: 'trai-he-tieng-anh-2025' },
  { title: 'Ngày hội "Em yêu khoa học" lần thứ 3', description: 'Học sinh trưng bày các dự án khoa học sáng tạo với hơn 50 sản phẩm ấn tượng.', category: 'Ngoại khóa', date: '20/12/2025', slug: 'ngay-hoi-khoa-hoc-lan-3' },
  { title: 'Hoạt động tình nguyện tại Trung tâm bảo trợ', description: 'Học sinh lớp 5 tham gia hoạt động tình nguyện, trao quà tại Trung tâm bảo trợ xã hội.', category: 'Ngoại khóa', date: '10/12/2025', slug: 'tinh-nguyen-bao-tro' },
];

export default function NgoaiKhoaPage() {
  return (
    <div>
      <PageBanner
        title="Hoạt động ngoại khóa"
        description="Những trải nghiệm bổ ích ngoài giờ học chính khóa"
        breadcrumbItems={[
          { label: 'Tin tức', href: '/tin-tuc/su-kien' },
          { label: 'Ngoại khóa' },
        ]}
        bgClass="bg-gradient-to-r from-purple-700 to-indigo-600"
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
