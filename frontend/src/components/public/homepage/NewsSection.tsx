'use client';

import Link from 'next/link';
import Image from 'next/image';
import ArticleGridCarousel from '../ArticleGridCarousel';

const PUBLIC_UPLOADS = process.env.NEXT_PUBLIC_SITE_URL || '';

/** URL day du cho anh */
function imageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${PUBLIC_UPLOADS}${url}`;
}

interface ArticleItem {
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  thumbnail_url?: string | null;
  published_at?: string;
  created_at?: string;
  category?: { name: string };
  [key: string]: unknown;
}

interface Props {
  variant: string;
  articles?: ArticleItem[];
}

/* ==========================================
 * Variant: featured-grid (default)
 * Featured article + Event sidebar + grid carousel
 * — copy tu page.tsx hien tai
 * ========================================== */
function NewsFeaturedGrid({ articles = [] }: { articles: ArticleItem[] }) {
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Tin tuc
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
              <span className="w-5 h-1 bg-green-600 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Moi cap nhat</h2>
        </div>
        <Link
          href="/tin-tuc/su-kien"
          className="text-sm text-gray-500 hover:text-[var(--hp-primary,#15803d)] transition-colors font-medium"
        >
          Xem tat ca &rarr;
        </Link>
      </div>

      {/* Row 1: Featured article (trai) + Event banner (phai) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Featured article — 3 cot */}
        <div className="lg:col-span-3">
          {featuredArticle ? (
            <Link
              href={`/tin-tuc/${featuredArticle.slug}`}
              className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                <div className="h-56 sm:h-full bg-gray-100 relative overflow-hidden">
                  {imageUrl(featuredArticle.thumbnail_url) ? (
                    <Image
                      src={imageUrl(featuredArticle.thumbnail_url)!}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center text-gray-400 text-sm">
                      Hinh anh
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[var(--hp-primary,#15803d)] transition-colors leading-snug">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                    {featuredArticle.excerpt ||
                      featuredArticle.description ||
                      'Mo ta bai viet se hien thi o day...'}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                <div className="h-56 sm:h-full bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="text-4xl mb-2">&#128240;</p>
                    <p className="text-sm font-bold text-green-800 uppercase">Thu ngo</p>
                    <p className="text-xs text-red-600 mt-1">
                      V/v dam bao an toan thuc pham tai Nha truong
                    </p>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                    Thu ngo V/v Dam bao an toan thuc pham tai Nha truong
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                    Truoc su quan tam va lo lang ve an toan thuc pham thoi gian gan day, Thay
                    Viet thay mat Ban Lanh dao Nha truong thong tin toi CMHS ve nguon thuc pham
                    va cong tac kiem soat chat luong thuc...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event banner — 2 cot */}
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden h-full text-white relative" style={{ background: 'linear-gradient(to bottom right, var(--hp-primary, #15803d), color-mix(in srgb, var(--hp-primary, #15803d) 80%, black))' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl font-black text-white/20">20</div>
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-between h-full relative z-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-green-200 mb-3">
                  Chao don 20 nam thanh lap
                </p>
                <h3 className="text-lg lg:text-xl font-bold mb-3 leading-snug">
                  He thong Truong lien cap Le Quy Don
                </h3>
                <div className="w-full h-40 lg:h-48 rounded-lg bg-white/10 flex items-center justify-center mb-4 overflow-hidden relative">
                  <div className="text-center">
                    <p className="text-5xl font-black text-white/30 mb-1">20</p>
                    <p className="text-sm font-bold text-yellow-300 uppercase tracking-wider">
                      From Building
                    </p>
                    <p className="text-sm font-bold text-yellow-300 uppercase tracking-wider">
                      to Blooming
                    </p>
                    <p className="text-[10px] text-white/60 mt-2 italic">
                      Dung xay ngan hoa
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">
                  &#128197; 04/08/2025 08:00 &nbsp;&bull;&nbsp; Truong Tieu hoc Le Quy Don
                </p>
                <p className="text-sm text-white/90 leading-relaxed">
                  Chao don Ky niem 20 nam thanh lap He thong Truong Lien cap Le Quy Don
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Carousel bai viet */}
      <ArticleGridCarousel
        articles={gridArticles}
        perPage={3}
        autoInterval={5000}
        uploadsBase={PUBLIC_UPLOADS}
      />
    </section>
  );
}

/* ==========================================
 * Variant: grid-only
 * Grid 3 cot don gian, perPage=6
 * ========================================== */
function NewsGridOnly({ articles = [] }: { articles: ArticleItem[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Tin tuc
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
              <span className="w-5 h-1 bg-green-600 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Moi cap nhat</h2>
        </div>
        <Link
          href="/tin-tuc/su-kien"
          className="text-sm text-gray-500 hover:text-[var(--hp-primary,#15803d)] transition-colors font-medium"
        >
          Xem tat ca &rarr;
        </Link>
      </div>

      {/* Grid carousel — 6 bai moi trang */}
      <ArticleGridCarousel
        articles={articles}
        perPage={6}
        autoInterval={5000}
        uploadsBase={PUBLIC_UPLOADS}
      />
    </section>
  );
}

/* ==========================================
 * Variant: list
 * Danh sach doc — image trai, text phai
 * ========================================== */
function NewsList({ articles = [] }: { articles: ArticleItem[] }) {
  const displayArticles = articles.slice(0, 5);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Tin tuc
            </span>
            <div className="flex gap-0.5">
              <span className="w-5 h-1 bg-green-600 rounded-full" />
              <span className="w-5 h-1 bg-red-500 rounded-full" />
              <span className="w-5 h-1 bg-green-600 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Moi cap nhat</h2>
        </div>
        <Link
          href="/tin-tuc/su-kien"
          className="text-sm text-gray-500 hover:text-[var(--hp-primary,#15803d)] transition-colors font-medium"
        >
          Xem tat ca &rarr;
        </Link>
      </div>

      {/* Danh sach bai viet dang ngang */}
      <div className="flex flex-col gap-5">
        {displayArticles.map((item, i) => {
          const title = item.title || `Bai viet ${i + 1}`;
          const desc = item.excerpt || item.description || '';
          const date = new Date(
            item.published_at || item.created_at || Date.now(),
          ).toLocaleDateString('vi-VN');
          const category = item.category?.name || 'Tin tuc';
          const slug = item.slug || `bai-viet-${i}`;
          const cover = imageUrl(item.thumbnail_url);

          return (
            <Link
              key={slug}
              href={`/tin-tuc/${slug}`}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow block"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 h-full">
                {/* Anh ben trai */}
                <div className="h-48 sm:h-full bg-gray-100 relative overflow-hidden">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center text-gray-400 text-sm group-hover:scale-105 transition-transform">
                      Hinh anh
                    </div>
                  )}
                </div>

                {/* Noi dung ben phai */}
                <div className="sm:col-span-2 p-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-[var(--hp-primary,#15803d)] bg-green-50 px-2 py-0.5 rounded">
                      {category}
                    </span>
                    <span className="text-xs text-gray-400">{date}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[var(--hp-primary,#15803d)] transition-colors leading-snug line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Xem them */}
      {articles.length > 5 && (
        <div className="text-center mt-8">
          <Link
            href="/tin-tuc/su-kien"
            className="inline-flex items-center px-6 py-3 bg-[var(--hp-primary,#2E7D32)] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-colors"
          >
            Xem them bai viet
          </Link>
        </div>
      )}
    </section>
  );
}

/* ==========================================
 * NewsSection — router cho 3 variants
 * ========================================== */
export default function NewsSection({ variant, articles = [] }: Props) {
  switch (variant) {
    case 'grid-only':
      return <NewsGridOnly articles={articles} />;
    case 'list':
      return <NewsList articles={articles} />;
    case 'featured-grid':
    default:
      return <NewsFeaturedGrid articles={articles} />;
  }
}
