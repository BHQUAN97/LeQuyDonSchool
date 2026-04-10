export interface HomepageBlock {
  id: string;
  label: string;
  visible: boolean;
  variant: string;
  order: number;
}

export interface HomepageTheme {
  primaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  logoUrl: string | null;
  spacing: 'compact' | 'normal' | 'spacious';
}

export interface HomepageConfig {
  blocks: HomepageBlock[];
  theme: HomepageTheme;
}

export const VALID_BLOCK_VARIANTS: Record<string, string[]> = {
  hero: ['full-width', 'with-sidebar', 'minimal'],
  news: ['featured-grid', 'grid-only', 'list'],
  features: ['two-column', 'cards-grid', 'accordion'],
  testimonial: ['year-banner', 'simple-carousel', 'cards'],
};

export const VALID_FONTS = ['system', 'Inter', 'Roboto', 'Montserrat', 'Playfair', 'Open Sans', 'Lora'];

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  blocks: [
    { id: 'hero', label: 'Banner chính', visible: true, variant: 'full-width', order: 0 },
    { id: 'news', label: 'Tin tức mới cập nhật', visible: true, variant: 'featured-grid', order: 1 },
    { id: 'features', label: 'Chỉ có tại Lê Quý Đôn', visible: true, variant: 'two-column', order: 2 },
    { id: 'testimonial', label: 'Cảm nhận từ cộng đồng', visible: true, variant: 'year-banner', order: 3 },
  ],
  theme: {
    primaryColor: '#2E7D32',
    accentColor: '#D32F2F',
    headingFont: 'system',
    bodyFont: 'system',
    logoUrl: null,
    spacing: 'normal',
  },
};
