import { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-helpers';
import HomepageRenderer from '@/components/public/homepage/HomepageRenderer';
import { DEFAULT_HOMEPAGE_CONFIG } from '@/types/homepage';

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';

/** Fetch homepage config tu Settings API */
async function getHomepageConfig() {
  try {
    const res = await fetch(`${INTERNAL_API}/settings/homepage`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

/** Fetch bai viet moi nhat tu API (server-side) */
async function getLatestArticles() {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?limit=10&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/** Fetch preview config bang token */
async function getPreviewConfig(token: string) {
  try {
    const res = await fetch(`${INTERNAL_API}/settings/homepage/preview/${token}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

// Fallback khi API chua co data
const DEFAULT_CONFIG = DEFAULT_HOMEPAGE_CONFIG;

export const metadata: Metadata = buildPageMetadata({
  title: 'Trường Tiểu học Lê Quý Đôn - Hà Nội',
  description:
    'Trường Tiểu học Lê Quý Đôn - Hệ thống giáo dục liên cấp hàng đầu tại Nam Từ Liêm, Hà Nội. Chương trình Quốc gia nâng cao, Tiếng Anh tăng cường, hợp tác PLC Sydney.',
  path: '/',
  type: 'website',
});

interface PageProps {
  searchParams: Promise<{ preview?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isPreview = !!params.preview;

  // Fetch config va articles song song
  const [config, articles] = await Promise.all([
    isPreview && params.preview
      ? getPreviewConfig(params.preview)
      : getHomepageConfig(),
    getLatestArticles(),
  ]);

  // Dung config tu API, fallback ve default
  const homepageConfig = config || DEFAULT_CONFIG;

  return (
    <HomepageRenderer
      config={homepageConfig}
      articles={articles}
      isPreview={isPreview}
    />
  );
}
