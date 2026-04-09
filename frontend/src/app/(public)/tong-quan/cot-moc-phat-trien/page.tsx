import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Cột mốc phát triển',
  description:
    'Hành trình phát triển của Trường Tiểu học Lê Quý Đôn qua các cột mốc quan trọng từ ngày thành lập đến nay.',
  path: '/tong-quan/cot-moc-phat-trien',
});

const tongQuanPages = [
  { title: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
  { title: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
  { title: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
  { title: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
  { title: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
];

const currentPage = '/tong-quan/cot-moc-phat-trien';

const milestones = [
  { year: '2005', title: 'Thành lập trường', desc: 'Trường Tiểu học Lê Quý Đôn chính thức được thành lập tại quận Nam Từ Liêm, Hà Nội.' },
  { year: '2008', title: 'Mở rộng cơ sở', desc: 'Khánh thành khu hiệu bộ mới với diện tích mở rộng lên 3000m², đáp ứng nhu cầu học sinh ngày càng tăng.' },
  { year: '2012', title: 'Hợp tác quốc tế', desc: 'Ký kết hợp tác chiến lược với PLC Sydney (Australia), mở ra chương trình trao đổi giáo dục quốc tế.' },
  { year: '2015', title: 'Khuôn viên 6000m²', desc: 'Hoàn thành mở rộng khuôn viên trường lên 6000m² với đầy đủ tiện nghi hiện đại.' },
  { year: '2018', title: 'Hệ thống liên cấp', desc: 'Phát triển thành Hệ thống Giáo dục Lê Quý Đôn với các cấp từ Mầm non đến THPT.' },
  { year: '2020', title: 'Chuyển đổi số', desc: 'Triển khai hệ thống giáo dục số, học trực tuyến và quản lý thông minh trên toàn hệ thống.' },
  { year: '2023', title: 'Chứng nhận chất lượng', desc: 'Đạt chứng nhận kiểm định chất lượng giáo dục cấp quốc gia với xếp hạng xuất sắc.' },
  { year: '2025', title: 'Tầm nhìn mới', desc: 'Khởi động chiến lược phát triển giai đoạn 2025-2030 với mục tiêu trở thành trường tiểu học hàng đầu Việt Nam.' },
];

export default function CotMocPhatTrienPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
            { label: 'Cột mốc phát triển' },
          ]} />
        </div>
      </div>

      {/* Section title */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">TỔNG QUAN</span>
            <div className="flex gap-0.5">
              <span className="w-6 h-1 bg-green-700 rounded-full" />
              <span className="w-6 h-1 bg-red-600 rounded-full" />
              <span className="w-6 h-1 bg-green-700 rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Cột mốc phát triển</h1>
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Content */}
          <div className="lg:col-span-2">
            <p className="text-gray-700 leading-relaxed mb-8">
              Hành trình xây dựng và phát triển của Hệ thống Giáo dục Lê Quý Đôn qua các cột mốc quan trọng từ ngày thành lập đến nay.
            </p>

            {/* Image placeholder */}
            <div className="bg-green-50 rounded-xl h-48 lg:h-64 flex items-center justify-center text-green-600 text-sm mb-10">
              Hình ảnh lịch sử trường qua các thời kỳ
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200" />

              <div className="space-y-8">
                {milestones.map((m) => (
                  <div key={m.year} className="relative flex items-start gap-6 pl-10">
                    {/* Dot */}
                    <div className="absolute left-2.5 top-1 w-3.5 h-3.5 bg-green-600 rounded-full border-4 border-green-100 z-10" />

                    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex-1">
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                        {m.year}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">{m.title}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Tổng quan</h3>
              <nav className="space-y-1">
                {tongQuanPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      page.href === currentPage
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {page.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
