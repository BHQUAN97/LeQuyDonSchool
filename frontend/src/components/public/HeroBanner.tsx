'use client';

import Link from 'next/link';
import Carousel from './Carousel';

/** Du lieu moi slide hero */
interface HeroSlide {
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  cta: { label: string; href: string };
  bgImage?: string;
}

const defaultSlides: HeroSlide[] = [
  {
    title: 'Từ kỳ vọng đến tin yêu',
    highlight: 'Tiểu học Lê Quý Đôn',
    subtitle: 'qua lời Cha Mẹ',
    description:
      'Với Tiểu học Lê Quý Đôn, mỗi ngày đến trường là một hành trình khám phá, sáng tạo và trưởng thành đồng hành cùng con.',
    cta: { label: 'Xem chi tiết', href: '/tong-quan/tam-nhin-su-menh' },
    bgImage: '/images/hero-bg.jpg',
  },
  {
    title: 'Chương trình giáo dục',
    highlight: 'Quốc gia nâng cao',
    subtitle: 'Tiếng Anh tăng cường',
    description:
      'Chương trình Quốc gia nâng cao kết hợp Tiếng Anh tăng cường theo chuẩn PLC Sydney, giúp học sinh tự tin hội nhập quốc tế.',
    cta: { label: 'Tìm hiểu thêm', href: '/chuong-trinh-hoc' },
    bgImage: '/images/hero-bg-2.jpg',
  },
  {
    title: 'Khuôn viên 6000m²',
    highlight: 'hiện đại & xanh mát',
    subtitle: 'tại KĐT Mỹ Đình',
    description:
      'Cơ sở vật chất hiện đại với sân bóng, bể bơi, phòng lab, thư viện — môi trường lý tưởng để các con phát triển toàn diện.',
    cta: { label: 'Khám phá', href: '/tong-quan/co-so-vat-chat' },
    bgImage: '/images/hero-bg-3.jpg',
  },
  {
    title: 'Tuyển sinh năm học',
    highlight: '2025 - 2026',
    subtitle: 'Đăng ký ngay',
    description:
      'Nhà trường bắt đầu nhận hồ sơ tuyển sinh từ lớp 1 đến lớp 5 cho năm học 2025-2026. Ưu đãi đặc biệt cho đăng ký sớm.',
    cta: { label: 'Đăng ký', href: '/tuyen-sinh' },
    bgImage: '/images/hero-bg-4.jpg',
  },
];

export default function HeroBanner() {
  return (
    <Carousel
      total={defaultSlides.length}
      autoInterval={3000}
      showDots={true}
      showArrows={true}
      className="min-h-[360px] sm:min-h-[420px] lg:min-h-[520px] overflow-hidden"
      renderSlide={(index) => {
        const slide = defaultSlides[index];
        return (
          <section className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[520px]">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-800/60 to-green-600/40 z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={
                slide.bgImage
                  ? { backgroundImage: `url('${slide.bgImage}')` }
                  : undefined
              }
            />
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-green-100 to-yellow-300 -z-10" />

            <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 lg:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Text */}
                <div className="text-white">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
                    {slide.title}
                    <br />
                    <span className="text-yellow-300">{slide.highlight}</span>
                    <br />
                    {slide.subtitle}
                  </h1>
                  <p className="text-base lg:text-lg opacity-90 mb-6 drop-shadow">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center px-7 py-3.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg text-sm"
                  >
                    {slide.cta.label}
                  </Link>
                </div>

                {/* Floating card */}
                <div className="hidden lg:flex justify-center">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm transform rotate-1 hover:rotate-0 transition-transform">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center border-2 border-yellow-500">
                        <span className="text-white font-bold text-[10px]">LQD</span>
                      </div>
                      <div>
                        <p className="text-[9px] text-green-700 font-semibold uppercase tracking-wide leading-tight">
                          Hệ thống Trường liên cấp Lê Quý Đôn
                        </p>
                        <p className="text-xs font-bold text-red-600 leading-tight">
                          Trường Tiểu học Lê Quý Đôn
                        </p>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-green-800 mb-1 leading-snug">
                      {slide.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      {slide.highlight} — {slide.subtitle}
                    </p>
                    <div className="flex gap-1 text-2xl">
                      <span className="text-red-500">&#10084;</span>
                      <span className="text-yellow-500">&#10084;</span>
                      <span className="text-yellow-500">&#10084;</span>
                      <span className="text-blue-400">&#10084;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }}
    />
  );
}
