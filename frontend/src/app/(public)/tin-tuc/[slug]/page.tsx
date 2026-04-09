import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/public/Breadcrumb';
import ArticleSidebar from '@/components/public/ArticleSidebar';
import SafeHtml from '@/components/public/SafeHtml';
import { Calendar, Tag } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
const PUBLIC_UPLOADS = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${INTERNAL_API}/articles/slug/${slug}`, {
      next: { revalidate: 600 },
    });
    if (res.ok) {
      const json = await res.json();
      const item = json.data || json;
      return buildPageMetadata({
        title: item.title || 'Bài viết',
        description: item.description || item.excerpt || `Đọc bài viết ${item.title} tại Trường Tiểu học Lê Quý Đôn.`,
        path: `/tin-tuc/${slug}`,
        ogImage: item.thumbnail_url || undefined,
        type: 'article',
        publishedTime: item.publishedAt || item.published_at || undefined,
      });
    }
  } catch {
    // API chua san sang
  }
  return buildPageMetadata({
    title: 'Bài viết',
    description: 'Đọc tin tức và bài viết mới nhất tại Trường Tiểu học Lê Quý Đôn.',
    path: `/tin-tuc/${slug}`,
    type: 'article',
  });
}

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${INTERNAL_API}/articles/slug/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch {
    return null;
  }
}

async function getRelatedArticles() {
  try {
    const res = await fetch(`${INTERNAL_API}/articles/public?limit=3&sort=published_at&order=DESC`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function imgUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${PUBLIC_UPLOADS}${url}`;
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiArticle = await getArticle(slug);

  const article = apiArticle
    ? {
        title: apiArticle.title,
        category: apiArticle.category?.name || 'Tin tức',
        categorySlug: apiArticle.category?.slug || 'su-kien',
        date: new Date(apiArticle.published_at || apiArticle.created_at).toLocaleDateString('vi-VN'),
        author: apiArticle.author?.full_name || 'Ban Truyền thông',
        content: apiArticle.content || '',
        thumbnail_url: apiArticle.thumbnail_url,
      }
    : {
        title: 'Bài viết',
        category: 'Tin tức',
        categorySlug: 'su-kien',
        date: '',
        author: '',
        content: '<p>Nội dung bài viết đang được cập nhật.</p>',
        thumbnail_url: null,
      };

  const relatedArticles = await getRelatedArticles();

  return (
    <div>
      {/* Breadcrumb — V2 style: nen trang, khong co banner xanh */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Tin tức', href: '/tin-tuc/su-kien' },
              { label: article.category, href: `/tin-tuc/${article.categorySlug}` },
              { label: article.title },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content — 2/3 */}
          <article className="lg:col-span-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-snug">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                <Tag className="w-3 h-3" />
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
            </div>

            {/* Featured image */}
            {article.thumbnail_url && (
              <div className="h-56 lg:h-80 bg-gray-100 rounded-xl mb-8 overflow-hidden relative">
                <Image
                  src={imgUrl(article.thumbnail_url)!}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
            )}

            {/* Content — V2 style */}
            <SafeHtml
              html={article.content}
              className="prose prose-gray prose-sm lg:prose-base max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-red-700
                prose-h3:text-base prose-h3:text-green-800
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-green-700 prose-a:underline
                prose-img:rounded-lg"
            />

            {/* Share buttons — V2: icon buttons Facebook, Zalo, LinkedIn, Pinterest */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                &#8592; Chia sẻ với mọi người
              </span>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs hover:bg-blue-700" aria-label="Facebook">f</a>
                <a href="#" className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600" aria-label="Zalo">Z</a>
                <a href="#" className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs hover:bg-blue-800" aria-label="LinkedIn">in</a>
                <a href="#" className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700" aria-label="Pinterest">P</a>
              </div>
            </div>
          </article>

          {/* Sidebar — 1/3 — V2 style */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ArticleSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Tin tuc lien quan — full width, V2 style */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Tin tức liên quan
              <span className="w-12 h-0.5 bg-green-600" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedArticles.map((a: any) => {
                const cover = imgUrl(a.thumbnail_url);
                const date = new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN');
                return (
                  <Link
                    key={a.slug}
                    href={`/tin-tuc/${a.slug}`}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group block"
                  >
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      {cover ? (
                        <Image src={cover} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="33vw" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center text-gray-400 text-sm">
                          Hình ảnh
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] text-gray-400 mb-1">
                        {a.category?.name || 'Tin tức'} • {date}
                      </p>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{a.excerpt || a.description || ''}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
