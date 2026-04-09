import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sắc màu Lê Quý Đôn',
  description:
    'Thư viện hình ảnh và khoảnh khắc đáng nhớ tại Trường Tiểu học Lê Quý Đôn - Học tập, ngoại khóa, sự kiện, thể thao và nghệ thuật.',
  path: '/tong-quan/sac-mau-le-quy-don',
});

const tongQuanPages = [
  { title: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
  { title: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
  { title: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
  { title: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
  { title: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
];

const currentPage = '/tong-quan/sac-mau-le-quy-don';

const categories = ['Tất cả', 'Sự kiện', 'Học tập', 'Ngoại khóa', 'Thể thao', 'Nghệ thuật'];

const photos = [
  { label: 'Lễ khai giảng 2025-2026', category: 'Sự kiện', size: 'large' as const },
  { label: 'Giờ học STEM', category: 'Học tập', size: 'normal' as const },
  { label: 'CLB Tiếng Anh', category: 'Ngoại khóa', size: 'normal' as const },
  { label: 'Hội thao mùa xuân', category: 'Thể thao', size: 'normal' as const },
  { label: 'Biểu diễn văn nghệ', category: 'Nghệ thuật', size: 'large' as const },
  { label: 'Tham quan dã ngoại', category: 'Ngoại khóa', size: 'normal' as const },
  { label: 'Giờ thể dục buổi sáng', category: 'Thể thao', size: 'normal' as const },
  { label: 'Phòng thí nghiệm', category: 'Học tập', size: 'normal' as const },
  { label: 'Ngày hội sách', category: 'Sự kiện', size: 'normal' as const },
  { label: 'Lớp vẽ sáng tạo', category: 'Nghệ thuật', size: 'normal' as const },
  { label: 'Cuộc thi Toán học', category: 'Học tập', size: 'normal' as const },
  { label: 'Trại hè 2025', category: 'Ngoại khóa', size: 'large' as const },
];

export default function SacMauLQDPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
            { label: 'Sắc màu Lê Quý Đôn' },
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
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Sắc màu Lê Quý Đôn</h1>
          <p className="text-gray-700 leading-relaxed mt-3">
            Khoảnh khắc đáng nhớ tại ngôi trường thân yêu — học tập, ngoại khóa, sự kiện, thể thao và nghệ thuật.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
          {categories.map((cat, i) => (
            <span
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                i === 0
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Photo gallery */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className={`bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-xs lg:text-sm text-center p-4 cursor-pointer hover:opacity-80 transition-opacity ${
                    photo.size === 'large' ? 'col-span-2 h-44 lg:h-56' : 'h-32 lg:h-44'
                  }`}
                >
                  <div>
                    <p>{photo.label}</p>
                    <p className="text-xs text-green-500 mt-1">{photo.category}</p>
                  </div>
                </div>
              ))}
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
