'use client';

import ThemeProvider from './ThemeProvider';
import HeroSection from './HeroSection';
import NewsSection from './NewsSection';
import FeaturesSection from './FeaturesSection';
import TestimonialSection from './TestimonialSection';
import type { HomepageConfig } from '@/types/homepage';

interface SectionProps {
  variant: string;
  articles?: { title: string; slug: string; [key: string]: unknown }[];
}

interface Props {
  config: HomepageConfig;
  articles?: { title: string; slug: string; [key: string]: unknown }[];
  isPreview?: boolean;
}

const SECTION_MAP: Record<string, React.ComponentType<SectionProps>> = {
  hero: HeroSection,
  news: NewsSection,
  features: FeaturesSection,
  testimonial: TestimonialSection,
};

export default function HomepageRenderer({ config, articles = [], isPreview = false }: Props) {
  const visibleBlocks = config.blocks
    .filter((b) => b.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <ThemeProvider theme={config.theme}>
      {isPreview && (
        <div className="bg-yellow-400 text-yellow-900 text-center py-2 text-sm font-semibold sticky top-0 z-50">
          Dang xem truoc — Chua duoc luu
        </div>
      )}
      {visibleBlocks.map((block, idx) => {
        const Section = SECTION_MAP[block.id];
        if (!Section) return null;
        return (
          <div
            key={block.id}
            style={idx > 0 ? { paddingTop: 'var(--hp-spacing, 4rem)' } : undefined}
          >
            <Section variant={block.variant} articles={articles} />
          </div>
        );
      })}
    </ThemeProvider>
  );
}
