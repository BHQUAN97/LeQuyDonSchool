'use client';

import Link from 'next/link';
import HeroBanner from '../HeroBanner';
import Carousel from '../Carousel';

interface Props {
  variant: string;
}

/* ==========================================
 * Variant: with-sidebar
 * Carousel ben trai (3/4), sidebar thong tin truong ben phai
 * ========================================== */
function HeroWithSidebar() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4">
      {/* Carousel — 3 cot */}
      <div className="lg:col-span-3">
        <HeroBanner />
      </div>

      {/* Sidebar — 1 cot */}
      <div className="bg-gradient-to-b from-green-700 to-green-900 text-white p-6 lg:p-8 flex flex-col justify-between">
        {/* Logo + ten truong */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border-2 border-yellow-400 shrink-0">
              <span className="text-white font-bold text-sm">LQD</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-green-200">
                He thong Truong lien cap
              </p>
              <p className="text-sm font-bold leading-tight">
                Truong Tieu hoc Le Quy Don
              </p>
            </div>
          </div>

          {/* Thong bao */}
          <div className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-300 mb-2">
              Thong bao
            </p>
            <p className="text-sm leading-relaxed opacity-90">
              Tuyen sinh nam hoc 2025–2026 da bat dau. Dang ky som de nhan uu dai dac biet.
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-green-200 mb-3">
            Truy cap nhanh
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Tuyen sinh', href: '/tuyen-sinh' },
              { label: 'Chuong trinh hoc', href: '/chuong-trinh-hoc' },
              { label: 'Lien he', href: '/lien-he' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2.5 transition-colors border border-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
 * Variant: minimal
 * Static hero — centered text, no carousel
 * ========================================== */
function HeroMinimal() {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-green-700/70 z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-green-100 to-yellow-300 -z-10" />

      {/* Content — centered */}
      <div className="relative z-20 text-center text-white px-4 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-green-200 mb-3">
          He thong Truong lien cap
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
          Truong Tieu hoc{' '}
          <span className="text-yellow-300">Le Quy Don</span>
        </h1>
        <p className="text-base lg:text-lg opacity-90 mb-8 drop-shadow max-w-xl mx-auto">
          Tu ky vong den tin yeu — moi ngay den truong la mot hanh trinh kham pha, sang tao va truong thanh.
        </p>
        <Link
          href="/tuyen-sinh"
          className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg text-sm"
        >
          Tim hieu ngay
        </Link>
      </div>
    </section>
  );
}

/* ==========================================
 * HeroSection — router cho 3 variants
 * ========================================== */
export default function HeroSection({ variant }: Props) {
  switch (variant) {
    case 'with-sidebar':
      return <HeroWithSidebar />;
    case 'minimal':
      return <HeroMinimal />;
    case 'full-width':
    default:
      return <HeroBanner />;
  }
}
