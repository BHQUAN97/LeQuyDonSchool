'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  UserRound,
  Trophy,
  Globe,
  Building2,
  ChevronDown,
} from 'lucide-react';

interface Props {
  variant: string;
}

/* Du lieu features — giong page.tsx hien tai */
const features = [
  {
    id: 'he-thong',
    title: 'He thong giao duc tu Mam non den THPT',
    icon: GraduationCap,
    description:
      'He thong Giao duc Le Quy Don cung cap lo trinh hoc lien thong tu Mam non, Tieu hoc den THCS va THPT voi ba co so rieng biet tai quan Nam Tu Liem, Ha Noi. Cac truong trong he thong deu duoc dau tu bai ban ve co so vat chat, chuong trinh dao tao hien dai va doi ngu giao vien chat luong cao. He thong chu trong phat trien toan dien Duc — Tri — The — My, giup hoc sinh phat huy toi da nang luc ca nhan o tung cap hoc va san sang hoi nhap quoc te.',
  },
  {
    id: 'nhan-su',
    title: 'Nhan su dac sac',
    icon: UserRound,
    description:
      'Doi ngu giao vien duoc tuyen chon ky luong, giau kinh nghiem va tam huyet voi nghe. Moi thay co khong chi la nguoi truyen dat kien thuc ma con la nguoi ban dong hanh cung hoc sinh tren hanh trinh phat trien.',
  },
  {
    id: 'tien-phong',
    title: 'Tien phong & Anh huong',
    icon: Trophy,
    description:
      'Truong luon di dau trong viec ap dung cac phuong phap giao duc tien tien, tao anh huong tich cuc den cong dong giao duc.',
  },
  {
    id: 'plc',
    title: 'Hop tac toan dien cung PLC Sydney',
    icon: Globe,
    description:
      'Chuong trinh hop tac toan dien voi PLC Sydney (Uc) mang den cho hoc sinh co hoi trai nghiem giao duc quoc te ngay tai Viet Nam.',
  },
  {
    id: 'khuon-vien',
    title: 'Khuon vien 6000m2 tai toa do ly tuong',
    icon: Building2,
    description:
      'Khuon vien rong 6000m2 nam tai vi tri dac dia o KDT My Dinh, duoc thiet ke hien dai voi day du tien ich phuc vu hoc tap va hoat dong ngoai khoa.',
  },
];

/* ==========================================
 * Variant: two-column (default)
 * Dark green bg, trai: feature cards, phai: mo ta chi tiet + CTA
 * — copy tu page.tsx hien tai
 * ========================================== */
function FeaturesTwoColumn() {
  return (
    <section className="bg-[#1a6b30] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Trai: title + feature cards */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm opacity-80 uppercase tracking-wide">Chi co tai</span>
                <div className="flex gap-0.5">
                  <span className="w-4 h-1 bg-green-300 rounded-full" />
                  <span className="w-4 h-1 bg-red-400 rounded-full" />
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold">Truong Tieu hoc Le Quy Don</h2>
            </div>

            {/* Feature cards — 2 cot, icon outline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.id}
                    className="bg-white rounded-xl p-5 flex flex-col gap-3 hover:shadow-lg transition-all cursor-pointer group border border-white/20"
                  >
                    <p className="text-sm font-bold text-gray-800 uppercase leading-snug">
                      {f.title}
                    </p>
                    <Icon className="w-8 h-8 text-green-700 stroke-[1.5]" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phai: mo ta chi tiet + nut do */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <GraduationCap className="w-8 h-8 text-white stroke-[1.5]" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">{features[0].title}</h3>
            <p className="text-sm opacity-90 leading-relaxed mb-6">{features[0].description}</p>
            <div>
              <Link
                href="/tong-quan/tam-nhin-su-menh"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-lg"
              >
                Xem chi tiet
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative icon */}
        <div className="flex justify-center mt-10">
          <svg
            className="w-20 h-20 text-white/15"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <rect x="35" y="20" width="30" height="8" rx="1" />
            <rect x="42" y="12" width="16" height="10" rx="1" />
            <rect x="30" y="28" width="40" height="35" rx="1" />
            <rect x="10" y="45" width="20" height="18" rx="1" />
            <rect x="70" y="45" width="20" height="18" rx="1" />
            <rect x="44" y="40" width="12" height="23" rx="1" fillOpacity="0.5" />
            <rect x="5" y="63" width="90" height="5" rx="1" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
 * Variant: cards-grid
 * White bg, 3-column grid feature cards voi green accent border top
 * ========================================== */
function FeaturesCardsGrid() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Chi co tai
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Truong Tieu hoc Le Quy Don
          </h2>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Green accent border top */}
                <div className="h-1 bg-green-600" />
                <div className="p-6">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                    <Icon className="w-6 h-6 text-green-700 stroke-[1.5]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/tong-quan/tam-nhin-su-menh"
            className="inline-flex items-center px-6 py-3 bg-green-700 text-white rounded-lg text-sm font-bold hover:bg-green-800 transition-colors"
          >
            Tim hieu them
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
 * Variant: accordion
 * White bg, vertical accordion — click to expand
 * ========================================== */
function FeaturesAccordion() {
  const [openId, setOpenId] = useState<string | null>(features[0].id);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Chi co tai
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Truong Tieu hoc Le Quy Don
          </h2>
        </div>

        {/* Accordion items */}
        <div className="flex flex-col gap-3">
          {features.map((f) => {
            const Icon = f.icon;
            const isOpen = openId === f.id;

            return (
              <div
                key={f.id}
                className="border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(f.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-green-700 stroke-[1.5]" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 uppercase leading-snug">
                      {f.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Noi dung mo rong */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="pl-14">
                      <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/tong-quan/tam-nhin-su-menh"
            className="inline-flex items-center px-6 py-3 bg-green-700 text-white rounded-lg text-sm font-bold hover:bg-green-800 transition-colors"
          >
            Tim hieu them
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
 * FeaturesSection — router cho 3 variants
 * ========================================== */
export default function FeaturesSection({ variant }: Props) {
  switch (variant) {
    case 'cards-grid':
      return <FeaturesCardsGrid />;
    case 'accordion':
      return <FeaturesAccordion />;
    case 'two-column':
    default:
      return <FeaturesTwoColumn />;
  }
}
