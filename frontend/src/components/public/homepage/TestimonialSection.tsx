'use client';

import TestimonialCarousel from '../TestimonialCarousel';
import Carousel from '../Carousel';

interface Props {
  variant: string;
}

/* Du lieu testimonials — giong TestimonialCarousel.tsx */
const testimonials = [
  {
    name: 'Anh Hoang Huu Thang',
    title:
      'Chu tich HDQT Intech Group | Pho Chu tich CLB Dau tu & Khoi nghiep Viet Nam | PHHS khoa 2021 - 2026',
    content:
      'Toi thay vui va hanh phuc moi khi con noi chuyen the hien su dam me, yeu thich ngoi truong. Moi lan den Truong Tieu hoc Le Quy Don de don con, toi lai thay su vui tuoi, hon nhien cua cac con. Toi tin tuong vao su phat trien toan dien ma nha truong mang lai cho con trai minh.',
  },
  {
    name: 'Anh Nguyen Thanh Binh',
    title:
      'Giam doc Nha may Cong ty TNHH Che bien thuc pham va banh keo Pham Nguyen | PHHS nien khoa 2011 - 2016, 2020 - 2025 va 2024 - 2029',
    content:
      'La mot nguoi bo, toi luon cam thay vo cung biet on khi nhin thay nhung buoc di vung chac cua cac con minh tren con duong hoc van. Ba dua con toi deu hoc tai truong Tieu hoc Le Quy Don va noi day thuc su la mot ngoi nha thu hai cua cac con.',
  },
  {
    name: 'Chi Tran Thi Minh Ha',
    title:
      'Pho Giam doc Ngan hang TMCP Ngoai thuong Viet Nam | PHHS nien khoa 2022 - 2027',
    content:
      'Con gai toi tu mot be nhut nhat, it noi da tro nen tu tin, manh dan sau 2 nam hoc tai Le Quy Don. Chau rat thich cac hoat dong ngoai khoa, dac biet la CLB Tieng Anh va Robotics.',
  },
  {
    name: 'Anh Le Van Duc',
    title:
      'CEO Cong ty CP Cong nghe DTS | PHHS nien khoa 2023 - 2028',
    content:
      'Dieu toi an tuong nhat o Le Quy Don la su minh bach trong giao tiep giua nha truong va phu huynh. Moi thong tin ve hoc tap, suc khoe, bua an cua con deu duoc cap nhat kip thoi qua ung dung.',
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
          {/* Anh gia dinh */}
          <div className="mt-6 w-72 h-56 mx-auto bg-white/15 rounded-2xl flex items-center justify-center text-white/40 text-sm overflow-hidden relative">
            <div className="text-center">
              <p className="text-3xl mb-2">&#128106;</p>
              <p className="text-xs">Anh gia dinh hoc sinh</p>
            </div>
          </div>
        </div>
        {/* Emblem goc trai tren */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-700/80 flex items-center justify-center">
            <span className="text-white font-bold text-[7px]">LQD</span>
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
              Tu cong dong
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Le Quy Don</h2>
        </div>

        {/* Carousel */}
        <Carousel
          total={testimonials.length}
          autoInterval={5000}
          showDots={true}
          showArrows={true}
          arrowStyle="circle"
          dotActiveClass="bg-green-700"
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
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm border-2 border-green-200">
                    {t.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 leading-snug max-w-xs">{t.title}</p>
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
              Tu cong dong
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Le Quy Don</h2>
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
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                  {t.name.split(' ').pop()?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-[11px] text-gray-500 leading-snug">{t.title}</p>
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
