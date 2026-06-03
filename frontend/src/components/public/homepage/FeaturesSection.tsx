'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ChevronDown,
  GraduationCap,
  Globe,
  Trophy,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  variant: string;
}

const features = [
  {
    id: 'he-thong',
    title: 'Hệ thống giáo dục từ Mầm non đến THPT',
    icon: GraduationCap,
    description:
      'Hệ thống Giáo dục Vân Cốc cung cấp lộ trình học liên thông từ Mầm non, Tiểu học đến THCS và THPT với ba cơ sở riêng biệt tại quận Nam Từ Liêm, Hà Nội. Các trường trong hệ thống đều được đầu tư bài bản về cơ sở vật chất, chương trình đào tạo hiện đại và đội ngũ giáo viên chất lượng cao.',
  },
  {
    id: 'nhan-su',
    title: 'Nhân sự đặc sắc',
    icon: UserRound,
    description:
      'Đội ngũ giáo viên được tuyển chọn kỹ lưỡng, giàu kinh nghiệm và tâm huyết với nghề. Mỗi thầy cô không chỉ truyền đạt kiến thức mà còn đồng hành cùng học sinh trên hành trình phát triển.',
  },
  {
    id: 'tien-phong',
    title: 'Tiên phong & Ảnh hưởng',
    icon: Trophy,
    description:
      'Nhà trường luôn đi đầu trong việc áp dụng các phương pháp giáo dục tiên tiến, tạo ảnh hưởng tích cực đến cộng đồng giáo dục và nuôi dưỡng học sinh tự tin hội nhập.',
  },
  {
    id: 'plc',
    title: 'Hợp tác toàn diện cùng PLC Sydney',
    icon: Globe,
    description:
      'Chương trình hợp tác với PLC Sydney (Úc) mang đến cho học sinh cơ hội trải nghiệm giáo dục quốc tế ngay tại Việt Nam, đặc biệt ở tiếng Anh, dự án học tập và kỹ năng toàn cầu.',
  },
  {
    id: 'khuon-vien',
    title: 'Khuôn viên 6000m2 tại tọa độ lý tưởng',
    icon: Building2,
    description:
      'Khuôn viên rộng 6000m2 tại KĐT Mỹ Đình được thiết kế hiện đại với đầy đủ tiện ích phục vụ học tập, thể thao, nghệ thuật và hoạt động ngoại khóa.',
  },
];

function FeatureHeader({ light = false }: { light?: boolean }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className={cn('text-sm uppercase tracking-wide', light ? 'text-white/90' : 'text-gray-800 font-semibold')}>
          Chỉ có tại
        </span>
        <div className="flex gap-0.5">
          <span className="w-5 h-1 bg-green-500 rounded-full" />
          <span className="w-5 h-1 bg-green-500 rounded-full" />
          <span className="w-5 h-1 bg-red-500 rounded-full" />
        </div>
      </div>
      <h2 className={cn('text-2xl lg:text-3xl font-bold', light ? 'text-white' : 'text-gray-900')}>
        Trường Tiểu học Vân Cốc
      </h2>
    </div>
  );
}

function FeaturesTwoColumn() {
  const [selectedId, setSelectedId] = useState(features[0].id);
  const selected = features.find((f) => f.id === selectedId) || features[0];
  const SelectedIcon = selected.icon;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-[var(--hp-primary,#08760e)] text-white">
        <div className="ml-auto max-w-3xl px-4 sm:px-8 lg:pl-10 lg:pr-8 py-14 lg:py-20">
          <FeatureHeader light />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const active = feature.id === selectedId;
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => setSelectedId(feature.id)}
                  className={cn(
                    'min-h-36 rounded-md border p-5 text-left transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/80',
                    active
                      ? 'bg-[var(--hp-primary,#08760e)] border-white text-white'
                      : 'bg-white border-white/20 text-slate-900',
                  )}
                  aria-pressed={active}
                >
                  <span className="block text-sm font-bold uppercase leading-snug">
                    {feature.title}
                  </span>
                  <Icon className={cn('mt-6 w-9 h-9 stroke-[1.5]', active ? 'text-white' : 'text-[var(--hp-primary,#08760e)]')} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-slate-100">
        <div className="mr-auto max-w-3xl h-full px-4 sm:px-8 lg:pl-8 lg:pr-10 py-14 lg:py-20 flex flex-col justify-center">
          <SelectedIcon className="w-16 h-16 text-[var(--hp-primary,#08760e)] stroke-[1.5] mb-8" />
          <h3 className="text-xl lg:text-2xl font-bold mb-4 text-[var(--hp-primary,#08760e)]">
            {selected.title}
          </h3>
          <p className="text-sm lg:text-base text-slate-700 leading-relaxed mb-8 max-w-xl">
            {selected.description}
          </p>
          <Link
            href="/tong-quan/tam-nhin-su-menh"
            className="inline-flex w-fit items-center px-6 py-3 bg-[var(--hp-accent,#e82424)] text-white rounded-md text-sm font-bold hover:opacity-90 transition-colors shadow-lg"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesCardsGrid() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="text-center">
          <FeatureHeader />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-1 bg-[var(--hp-primary,#08760e)]" />
                <div className="p-6">
                  <Icon className="w-10 h-10 text-[var(--hp-primary,#08760e)] stroke-[1.5] mb-4" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 leading-snug">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturesAccordion() {
  const [openId, setOpenId] = useState(features[0].id);

  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
        <div className="text-center">
          <FeatureHeader />
        </div>
        <div className="flex flex-col gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isOpen = openId === feature.id;
            return (
              <div key={feature.id} className="border border-gray-200 rounded-md overflow-hidden transition-shadow hover:shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : feature.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-[var(--hp-primary,#08760e)] stroke-[1.5] shrink-0" />
                    <span className="text-sm font-bold text-gray-900 uppercase leading-snug">{feature.title}</span>
                  </div>
                  <ChevronDown className={cn('w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="pl-10 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

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
