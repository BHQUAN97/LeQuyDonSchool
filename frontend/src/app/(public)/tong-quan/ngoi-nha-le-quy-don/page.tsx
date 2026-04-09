import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { MapPin, Ruler, TreePine, BookOpen, Dumbbell, Music } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ngôi nhà Lê Quý Đôn',
  description:
    'Khám phá khuôn viên 6000m² của Trường Tiểu học Lê Quý Đôn tại Nam Từ Liêm, Hà Nội - Cơ sở vật chất hiện đại, không gian xanh an toàn.',
  path: '/tong-quan/ngoi-nha-le-quy-don',
});

const tongQuanPages = [
  { title: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
  { title: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
  { title: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
  { title: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
  { title: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
];

const currentPage = '/tong-quan/ngoi-nha-le-quy-don';

const facilities = [
  { icon: BookOpen, title: 'Phòng học thông minh', desc: '30 phòng học tiêu chuẩn quốc tế, trang bị bảng tương tác, máy chiếu và điều hòa.' },
  { icon: Dumbbell, title: 'Khu thể thao', desc: 'Sân bóng đá mini, sân bóng rổ, phòng gym và hồ bơi bốn mùa.' },
  { icon: Music, title: 'Phòng nghệ thuật', desc: 'Phòng âm nhạc, phòng mỹ thuật, sân khấu biểu diễn 300 chỗ ngồi.' },
  { icon: TreePine, title: 'Không gian xanh', desc: 'Vườn sinh thái, sân chơi an toàn, khu vực đọc sách ngoài trời.' },
  { icon: MapPin, title: 'Thư viện', desc: 'Thư viện hiện đại với hơn 10,000 đầu sách, khu vực đọc yên tĩnh và phòng đa phương tiện.' },
  { icon: Ruler, title: 'Phòng thí nghiệm', desc: 'Phòng STEM, phòng tin học với 60 máy tính, phòng thí nghiệm khoa học.' },
];

const campusPhotos = [
  'Toàn cảnh khuôn viên',
  'Sân trường chính',
  'Khu hiệu bộ',
  'Phòng học thông minh',
  'Thư viện',
  'Sân thể thao',
  'Vườn sinh thái',
  'Căng tin',
];

export default function NgoiNhaLQDPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
            { label: 'Ngôi nhà Lê Quý Đôn' },
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
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Ngôi nhà Lê Quý Đôn</h1>
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Content */}
          <div className="lg:col-span-2 space-y-10">
            <p className="text-gray-700 leading-relaxed">
              Khuôn viên 6000m² hiện đại tại tọa độ lý tưởng quận Nam Từ Liêm, Hà Nội — nơi mỗi ngày đến trường là một ngày vui.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-700">6,000m²</p>
                <p className="text-xs text-gray-700 mt-1">Diện tích khuôn viên</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-700">30+</p>
                <p className="text-xs text-gray-700 mt-1">Phòng học</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-700">3</p>
                <p className="text-xs text-gray-700 mt-1">Cơ sở</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-700">100%</p>
                <p className="text-xs text-gray-700 mt-1">Điều hòa & Wifi</p>
              </div>
            </div>

            {/* Campus photos */}
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">Hình ảnh khuôn viên</h2>
              <div className="grid grid-cols-2 gap-3">
                {campusPhotos.map((label, i) => (
                  <div
                    key={i}
                    className={`bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-sm ${
                      i === 0 ? 'col-span-2 h-48 lg:h-64' : 'h-32 lg:h-40'
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">Cơ sở vật chất</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facilities.map((f) => (
                  <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                      <f.icon className="w-5 h-5 text-green-700" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{f.desc}</p>
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
