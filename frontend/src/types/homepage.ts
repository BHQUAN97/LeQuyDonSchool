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

export const VALID_BLOCK_VARIANTS: Record<string, { value: string; label: string }[]> = {
  hero: [
    { value: 'full-width', label: 'Toàn chiều rộng' },
    { value: 'with-sidebar', label: 'Có sidebar' },
    { value: 'minimal', label: 'Tối giản' },
  ],
  news: [
    { value: 'featured-grid', label: 'Nổi bật + Grid' },
    { value: 'grid-only', label: 'Chỉ Grid' },
    { value: 'list', label: 'Danh sách' },
  ],
  features: [
    { value: 'two-column', label: '2 cột' },
    { value: 'cards-grid', label: 'Grid thẻ' },
    { value: 'accordion', label: 'Accordion' },
  ],
  testimonial: [
    { value: 'year-banner', label: 'Banner năm học' },
    { value: 'simple-carousel', label: 'Carousel đơn giản' },
    { value: 'cards', label: 'Thẻ đánh giá' },
  ],
};

export const FONT_OPTIONS = [
  { value: 'system', label: 'Mặc định hệ thống' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair', label: 'Playfair Display' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lora', label: 'Lora' },
];

export const SPACING_OPTIONS = [
  { value: 'compact', label: 'Nhỏ gọn' },
  { value: 'normal', label: 'Bình thường' },
  { value: 'spacious', label: 'Rộng rãi' },
];

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

// Icon mapping cho tung block
export const BLOCK_ICONS: Record<string, string> = {
  hero: '🖼️',
  news: '📰',
  features: '⭐',
  testimonial: '💬',
};
