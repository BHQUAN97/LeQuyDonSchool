'use client';

import TestimonialCarousel from '../TestimonialCarousel';
import Carousel from '../Carousel';
import Image from 'next/image';

interface Props {
  variant: string;
}

/* Du lieu testimonials — giong TestimonialCarousel.tsx */
const testimonials = [
  {
    name: 'Anh Hoàng Hữu Thắng',
    title:
      'Chủ tịch HĐQT Intech Group | Phó Chủ tịch CLB Đầu tư & Khởi nghiệp Việt Nam | PHHS khóa 2021 - 2026',
    content:
      'Tôi thấy vui và hạnh phúc mỗi khi con nói chuyện thể hiện sự đam mê, yêu thích ngôi trường. Mỗi lần đến Trường Tiểu học Vân Cốc để đón con, tôi lại thấy sự vui tươi, hồn nhiên của các con. Tôi tin tưởng vào sự phát triển toàn diện mà nhà trường mang lại cho con trai mình.',
  },
  {
    name: 'Anh Nguyễn Thanh Bình',
    title:
      'Giám đốc Nhà máy Công ty TNHH Chế biến thực phẩm và bánh kẹo Phạm Nguyên | PHHS niên khóa 2011 - 2016, 2020 - 2025 và 2024 - 2029',
    content:
      'Là một người bố, tôi luôn cảm thấy vô cùng biết ơn khi nhìn thấy những bước đi vững chắc của các con mình trên con đường học vấn. Ba đứa con tôi đều học tại trường Tiểu học Vân Cốc và nơi đây thực sự là một ngôi nhà thứ hai của các con.',
  },
  {
    name: 'Chị Trần Thị Minh Hà',
    title:
      'Phó Giám đốc Ngân hàng TMCP Ngoại thương Việt Nam | PHHS niên khóa 2022 - 2027',
    content:
      'Con gái tôi từ một bé nhút nhát, ít nói đã trở nên tự tin, mạnh dạn sau 2 năm học tại Vân Cốc. Cháu rất thích các hoạt động ngoại khóa, đặc biệt là CLB Tiếng Anh và Robotics.',
  },
  {
    name: 'Anh Lê Văn Đức',
    title:
      'CEO Công ty CP Công nghệ DTS | PHHS niên khóa 2023 - 2028',
    content:
      'Điều tôi ấn tượng nhất ở Vân Cốc là sự minh bạch trong giao tiếp giữa nhà trường và phụ huynh. Mọi thông tin về học tập, sức khỏe, bữa ăn của con đều được cập nhật kịp thời qua ứng dụng.',
  },
];

/* ==========================================
 * Variant: year-banner (default)
 * Year banner trai (gold), testimonial carousel phai (do)
 * — copy tu page.tsx hien tai
 * ========================================== */
function TestimonialYearBanner() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      {/* Trai: year banner */}
      <div className="bg-gradient-to-br from-[#c8a97e] to-[#b8956a] py-10 lg:py-16 px-6 lg:px-10 flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10">
          <p className="text-6xl lg:text-8xl xl:text-9xl font-black text-white/25 tracking-tighter leading-none">
            2025-2026
          </p>
          <div className="mt-6 w-80 h-64 mx-auto rounded-2xl overflow-hidden relative shadow-2xl">
            <Image
              src="/images/design/testimonial-family.png"
              alt="Phụ huynh và học sinh Vân Cốc"
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>
        </div>
        {/* Emblem goc trai tren */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--hp-primary, #15803d) 80%, transparent)' }}>
            <span className="text-white font-bold text-sm">VC</span>
          </div>
        </div>
      </div>

      {/* Phai: testimonial carousel */}
      <TestimonialCarousel />
    </section>
  );
}

/* ==========================================
 * Variant: simple-carousel
 * Full-width, white bg, centered carousel — large quotes
 * ========================================== */
function TestimonialSimpleCarousel() {
  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Từ cộng đồng
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Vân Cốc</h2>
        </div>

        {/* Carousel */}
        <Carousel
          total={testimonials.length}
          autoInterval={5000}
          showDots={true}
          showArrows={true}
          arrowStyle="circle"
          dotActiveClass="bg-[var(--hp-primary,#15803d)]"
          dotInactiveClass="bg-gray-300"
          className="min-h-[280px]"
          renderSlide={(index) => {
            const t = testimonials[index];
            return (
              <div className="text-center pb-16">
                {/* Large quote icon */}
                <div className="text-6xl text-green-200 font-serif leading-none mb-4">
                  &#8220;
                </div>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed italic mb-8 max-w-2xl mx-auto">
                  {t.content}
                </p>
                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-[var(--hp-primary,#15803d)] font-bold text-sm border-2 border-green-200">
                    {t.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-sm text-gray-500 leading-snug max-w-xs">{t.title}</p>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}

/* ==========================================
 * Variant: cards
 * Grid 2 cot — tat ca testimonial hien cung luc
 * ========================================== */
function TestimonialCards() {
  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Từ cộng đồng
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Vân Cốc</h2>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Quote */}
              <div className="text-4xl text-green-200 font-serif leading-none mb-3">
                &#8220;
              </div>
              <p className="text-sm text-gray-700 leading-relaxed italic mb-6 line-clamp-5">
                {t.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[var(--hp-primary,#15803d)] font-bold text-sm shrink-0">
                  {t.name.split(' ').pop()?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-sm text-gray-500 leading-snug">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
 * TestimonialSection — router cho 3 variants
 * ========================================== */
export default function TestimonialSection({ variant }: Props) {
  switch (variant) {
    case 'simple-carousel':
      return <TestimonialSimpleCarousel />;
    case 'cards':
      return <TestimonialCards />;
    case 'year-banner':
    default:
      return <TestimonialYearBanner />;
  }
}
