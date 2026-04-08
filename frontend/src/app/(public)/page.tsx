import { Metadata } from 'next';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Trường Tiểu học Lê Quý Đôn - Hà Nội',
  description:
    'Trường Tiểu học Lê Quý Đôn - Hệ thống giáo dục liên cấp hàng đầu tại Nam Từ Liêm, Hà Nội. Chương trình Quốc gia nâng cao, Tiếng Anh tăng cường, hợp tác PLC Sydney.',
  path: '/',
  type: 'website',
});

/* Banner slide data (placeholder — se lay tu API sau) */
const banners = [
  {
    title: 'Thông báo Tuyển sinh năm học 2026 - 2027',
    description: 'Thông tin tuyển sinh năm học 2026 - 2027',
    cta: 'Xem chi tiết',
    href: '/tuyen-sinh/thong-tin',
  },
];

/* Features "Chi co tai Le Quy Don" */
const features = [
  { title: 'Hệ thống giáo dục từ Mầm non đến THPT', icon: '🎓' },
  { title: 'Nhân sự đặc sắc', icon: '👨‍🏫' },
  { title: 'Tiên phong & Ảnh hưởng', icon: '🏆' },
  { title: 'Hợp tác toàn diện cùng PLC Sydney', icon: '🌏' },
  { title: 'Khuôn viên 6000m² tại tọa độ lý tưởng', icon: '🏫' },
];

/* Testimonial placeholder */
const testimonials = [
  {
    name: 'Anh Hoàng Hữu Thắng',
    title: 'Chủ tịch HĐQT Intech Group | Phó Chủ tịch CĐLH | Đầu tư & Khởi nghiệp Việt Nam',
    content:
      'Trường Tiểu học Lê Quý Đôn luôn hướng tới phát triển toàn diện cho học sinh, từ kiến thức đến kỹ năng sống...',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-500 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-2xl lg:text-4xl font-bold mb-4">{banners[0].title}</h1>
              <p className="text-lg opacity-90 mb-6">{banners[0].description}</p>
              <Link
                href={banners[0].href}
                className="inline-flex items-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                {banners[0].cta}
              </Link>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-80 h-60 bg-white/10 rounded-2xl flex items-center justify-center text-white/50 text-lg">
                Banner Image
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            <span className="w-3 h-3 rounded-full bg-white" />
            <span className="w-3 h-3 rounded-full bg-white/40" />
            <span className="w-3 h-3 rounded-full bg-white/40" />
            <span className="w-3 h-3 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* Tin tuc moi cap nhat */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-green-700 font-medium">Tin tức 🇻🇳</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Mới cập nhật</h2>
          </div>
          <Link href="/tin-tuc/su-kien" className="text-sm text-slate-500 hover:text-green-700 transition-colors">
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                Hình ảnh bài viết
              </div>
              <div className="p-4">
                <p className="text-xs text-green-700 font-medium mb-2">Tin tức • 03/04/2026</p>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2">
                  Tiêu đề bài viết mẫu số {i}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Mô tả ngắn của bài viết sẽ hiển thị ở đây...
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chi co tai Le Quy Don */}
      <section className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: feature cards */}
            <div>
              <p className="text-sm opacity-80 mb-2">Chỉ có tại 🇻🇳</p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-8">Trường Tiểu học Lê Quý Đôn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 hover:bg-white/20 transition-colors"
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-sm font-medium">{f.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: description */}
            <div>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                  🎓
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Hệ thống giáo dục từ Mầm non đến THPT</h3>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                Hệ thống Giáo dục Lê Quý Đôn cung cấp lộ trình học liên thông từ Mầm non,
                Tiểu học đến THCS và THPT với ba cơ sở riêng biệt tại quận Nam Từ Liêm, Hà Nội.
                Các trường trong hệ thống đều được đầu tư bài bản về cơ sở vật chất,
                chương trình đào tạo hiện đại và đội ngũ giáo viên chất lượng cao.
              </p>
              <Link
                href="/tong-quan/tam-nhin-su-menh"
                className="inline-flex items-center px-5 py-2.5 border border-white rounded-lg text-sm hover:bg-white hover:text-green-800 transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Year banner */}
      <section className="bg-green-600 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-6xl lg:text-8xl font-bold text-white/20">2025-2026</p>
        </div>
      </section>

      {/* Tu cong dong - Testimonials */}
      <section className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: image placeholder */}
            <div className="hidden lg:block">
              <div className="h-80 bg-white/10 rounded-2xl flex items-center justify-center text-white/50">
                Hình ảnh cộng đồng
              </div>
            </div>

            {/* Right: testimonial */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-4xl">&ldquo;</span>
                <div>
                  <p className="text-sm opacity-80">Từ cộng đồng 🇻🇳</p>
                  <h2 className="text-2xl font-bold">Lê Quý Đôn</h2>
                </div>
              </div>

              {testimonials.map((t) => (
                <div key={t.name} className="mb-6">
                  <p className="font-bold text-lg mb-1">{t.name}</p>
                  <p className="text-xs opacity-80 mb-4">{t.title}</p>
                  <p className="text-sm opacity-90 leading-relaxed">{t.content}</p>
                </div>
              ))}

              {/* Navigation dots */}
              <div className="flex gap-2 mt-6">
                <span className="w-3 h-3 rounded-full bg-white" />
                <span className="w-3 h-3 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
