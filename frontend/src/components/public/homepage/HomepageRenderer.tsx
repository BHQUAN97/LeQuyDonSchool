'use client';

import ThemeProvider from './ThemeProvider';
import HeroSection from './HeroSection';
import NewsSection from './NewsSection';
import FeaturesSection from './FeaturesSection';
import TestimonialSection from './TestimonialSection';

interface HomepageBlock {
  id: string;
  label: string;
  visible: boolean;
  variant: string;
  order: number;
}

interface HomepageTheme {
  primaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  logoUrl: string | null;
  spacing: 'compact' | 'normal' | 'spacious';
}

interface HomepageConfig {
  blocks: HomepageBlock[];
  theme: HomepageTheme;
}

interface Props {
  config: HomepageConfig;
  articles?: any[];
  isPreview?: boolean;
}

const SECTION_MAP: Record<string, React.ComponentType<any>> = {
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
      {visibleBlocks.map((block) => {
        const Section = SECTION_MAP[block.id];
        if (!Section) return null;
        return <Section key={block.id} variant={block.variant} articles={articles} />;
      })}
    </ThemeProvider>
  );
}
