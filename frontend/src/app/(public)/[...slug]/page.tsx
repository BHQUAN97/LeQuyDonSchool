import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/public/Breadcrumb';
import SafeHtml from '@/components/public/SafeHtml';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { getInternalApiBase } from '@/lib/ssr-api';

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo_title: string | null;
  seo_description: string | null;
}

/** Fetch trang tu API theo nested slug */
async function getPage(slugPath: string): Promise<PageData | null> {
  try {
    const res = await fetch(
      `${getInternalApiBase()}/pages/by-path?path=${encodeURIComponent(slugPath)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

/** Tao breadcrumb items tu slug segments */
function buildBreadcrumbs(slug: string, title: string) {
  const segments = slug.split('/');
  const items: { label: string; href?: string }[] = [];

  // Them cac segment trung gian (neu co)
  const SLUG_LABELS: Record<string, string> = {
    'tong-quan': 'Tổng quan',
    'chuong-trinh': 'Chương trình',
    'dich-vu-hoc-duong': 'Dịch vụ học đường',
    'tuyen-sinh': 'Tuyển sinh',
    'tin-tuc': 'Tin tức',
    'lien-he': 'Liên hệ',
  };

  if (segments.length > 1) {
    const parentSlug = segments[0];
    items.push({
      label: SLUG_LABELS[parentSlug] || parentSlug,
      href: `/${parentSlug}`,
    });
  }

  // Segment cuoi = trang hien tai (khong co link)
  items.push({ label: title });

  return items;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = await getPage(slugPath);

  if (!page) {
    return { title: 'Không tìm thấy trang' };
  }

  return buildPageMetadata({
    title: page.seo_title || page.title,
    description: page.seo_description || '',
    path: `/${slugPath}`,
  });
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = await getPage(slugPath);

  if (!page) {
    notFound();
  }

  const breadcrumbs = buildBreadcrumbs(page.slug, page.title);

  return (
    <>
      {/* Hero banner */}
      <section className="bg-gradient-to-r from-[#1a5276] to-[#2e86c1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={breadcrumbs} variant="light" />
          <div className="pb-8 pt-2">
            <h1 className="text-2xl md:text-3xl font-bold">{page.title}</h1>
          </div>
        </div>
      </section>

      {/* Noi dung trang — sanitize bang DOMPurify de chong XSS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <SafeHtml
          html={page.content}
          className="prose prose-slate prose-lg max-w-none
            prose-headings:text-slate-900 prose-headings:font-bold
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-img:rounded-xl prose-img:shadow-md
            prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-slate-700
            prose-table:border-collapse prose-th:bg-slate-100 prose-th:px-4 prose-th:py-2
            prose-td:border prose-td:border-slate-200 prose-td:px-4 prose-td:py-2"
        />
      </section>
    </>
  );
}
