import { Metadata } from 'next';
import PageBanner from '@/components/public/PageBanner';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sắc màu Lê Quý Đôn',
  description:
    'Thư viện hình ảnh và khoảnh khắc đáng nhớ tại Trường Tiểu học Lê Quý Đôn - Học tập, ngoại khóa, sự kiện, thể thao và nghệ thuật.',
  path: '/tong-quan/sac-mau-le-quy-don',
});

const photos = [
  { label: 'Lễ khai giảng 2025-2026', category: 'Sự kiện', size: 'large' },
  { label: 'Giờ học STEM', category: 'Học tập', size: 'normal' },
  { label: 'CLB Tiếng Anh', category: 'Ngoại khóa', size: 'normal' },
  { label: 'Hội thao mùa xuân', category: 'Thể thao', size: 'normal' },
  { label: 'Biểu diễn văn nghệ', category: 'Nghệ thuật', size: 'large' },
  { label: 'Tham quan dã ngoại', category: 'Ngoại khóa', size: 'normal' },
  { label: 'Giờ thể dục buổi sáng', category: 'Thể thao', size: 'normal' },
  { label: 'Phòng thí nghiệm', category: 'Học tập', size: 'normal' },
  { label: 'Ngày hội sách', category: 'Sự kiện', size: 'normal' },
  { label: 'Lớp vẽ sáng tạo', category: 'Nghệ thuật', size: 'normal' },
  { label: 'Cuộc thi Toán học', category: 'Học tập', size: 'normal' },
  { label: 'Trại hè 2025', category: 'Ngoại khóa', size: 'large' },
];

export default function SacMauLQDPage() {
  return (
    <div>
      <PageBanner
        title="Sắc màu Lê Quý Đôn"
        description="Khoảnh khắc đáng nhớ tại ngôi trường thân yêu"
        breadcrumbItems={[
          { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
          { label: 'Sắc màu Lê Quý Đôn' },
        ]}
      />

      {/* Category label */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            <span className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-green-700 text-white">
              Tất cả
            </span>
          </div>
        </div>
      </section>

      {/* Photo gallery grid */}
      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs lg:text-sm text-center p-4 cursor-pointer hover:opacity-80 transition-opacity ${
                photo.size === 'large' ? 'col-span-2 h-48 lg:h-64' : 'h-36 lg:h-48'
              }`}
            >
              <div>
                <p>{photo.label}</p>
                <p className="text-xs text-slate-300 mt-1">{photo.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tat ca anh da hien thi */}
      </section>
    </div>
  );
}
