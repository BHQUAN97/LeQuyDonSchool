import { Metadata } from 'next';
import PageBanner from '@/components/public/PageBanner';
import { MapPin, Ruler, TreePine, BookOpen, Dumbbell, Music } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ngôi nhà Lê Quý Đôn',
  description:
    'Khám phá khuôn viên 6000m² của Trường Tiểu học Lê Quý Đôn tại Nam Từ Liêm, Hà Nội - Cơ sở vật chất hiện đại, không gian xanh an toàn.',
  path: '/tong-quan/ngoi-nha-le-quy-don',
});

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
      <PageBanner
        title="Ngôi nhà Lê Quý Đôn"
        description="Khuôn viên 6000m² hiện đại tại tọa độ lý tưởng quận Nam Từ Liêm, Hà Nội"
        breadcrumbItems={[
          { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
          { label: 'Ngôi nhà Lê Quý Đôn' },
        ]}
      />

      {/* Highlight stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-green-700">6,000m²</p>
              <p className="text-sm text-slate-500 mt-1">Diện tích khuôn viên</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">30+</p>
              <p className="text-sm text-slate-500 mt-1">Phòng học</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">3</p>
              <p className="text-sm text-slate-500 mt-1">Cơ sở</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">100%</p>
              <p className="text-sm text-slate-500 mt-1">Điều hòa & Wifi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus photos grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Hình ảnh khuôn viên</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {campusPhotos.map((label, i) => (
            <div
              key={i}
              className={`bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm ${
                i === 0 ? 'col-span-2 row-span-2 h-64 lg:h-80' : 'h-36 lg:h-44'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Cơ sở vật chất</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
