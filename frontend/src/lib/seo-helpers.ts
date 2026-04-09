import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://demo.remoteterminal.online';
const SITE_NAME = 'Trường Tiểu học Lê Quý Đôn';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface SEOConfig {
  /** Tieu de trang */
  title: string;
  /** Mo ta trang (150-160 ky tu ly tuong) */
  description: string;
  /** Duong dan tuong doi (vd: '/tong-quan/tam-nhin-su-menh') */
  path: string;
  /** URL anh OG (default: og-image.jpg) */
  ogImage?: string;
  /** Loai trang */
  type?: 'website' | 'article';
  /** Thoi gian dang bai (cho article) */
  publishedTime?: string;
}

/**
 * buildPageMetadata — tao Metadata chuan cho moi trang.
 * Dam bao nhat quan: canonical, OG, Twitter card, title suffix.
 */
export function buildPageMetadata(config: SEOConfig): Metadata {
  const { title, description, path, ogImage, type = 'website', publishedTime } = config;

  const url = `${SITE_URL}${path}`;
  const imageUrl = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'vi_VN',
      type,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}
