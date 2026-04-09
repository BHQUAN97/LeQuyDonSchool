import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageBanner from '@/components/public/PageBanner';
import ArticleCard from '@/components/public/ArticleCard';
import SafeHtml from '@/components/public/SafeHtml';
import { Calendar, User, Tag, Share2 } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
const PUBLIC_UPLOADS = process.env.NEXT_PUBLIC_SITE_URL || '';
const API_URL = INTERNAL_API;

/**
 * generateMetadata — lay title/description tu API cho bai viet.
 * Fallback ve placeholder neu API chua san sang.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/articles/slug/${slug}`, {
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
    // API chua san sang — dung fallback
  }

  return buildPageMetadata({
    title: 'Bài viết',
    description: 'Đọc tin tức và bài viết mới nhất tại Trường Tiểu học Lê Quý Đôn.',
    path: `/tin-tuc/${slug}`,
    type: 'article',
  });
}

/** Lay bai viet theo slug tu API */
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

/** Lay bai viet lien quan */
async function getRelatedArticles() {
  try {
    const res = await fetch(`${INTERNAL_API}/articles/public?limit=3&sort=published_at&order=DESC`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((a: any) => ({
      title: a.title,
      description: a.excerpt || a.description || '',
      category: a.category?.name || 'Tin tức',
      date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
      slug: a.slug,
    }));
  } catch {
    return [];
  }
}

/** Placeholder khi API chua co du lieu */
const fallbackArticle = {
  title: 'Bài viết',
  category: 'Tin tức',
  date: '',
  author: '',
  content: '<p>Nội dung bài viết đang được cập nhật.</p>',
  thumbnail_url: null,
};

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiArticle = await getArticle(slug);
  const article = apiArticle ? {
    title: apiArticle.title,
    category: apiArticle.category?.name || 'Tin tức',
    date: new Date(apiArticle.published_at || apiArticle.created_at).toLocaleDateString('vi-VN'),
    author: apiArticle.author?.full_name || 'Ban Truyền thông',
    content: apiArticle.content || '',
    thumbnail_url: apiArticle.thumbnail_url,
  } : fallbackArticle;
  const relatedArticles = await getRelatedArticles();
  return (
    <div>
      <PageBanner
        title={article.title}
        breadcrumbItems={[
          { label: 'Tin tức', href: '/tin-tuc/su-kien' },
          { label: article.category, href: '/tin-tuc/su-kien' },
          { label: 'Chi tiết bài viết' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <article className="lg:col-span-2">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {article.category}
              </span>
            </div>

            {/* Featured image */}
            <div className="h-56 lg:h-80 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-8 overflow-hidden relative">
              {article.thumbnail_url ? (
                <Image
                  src={article.thumbnail_url.startsWith('http') ? article.thumbnail_url : `${PUBLIC_UPLOADS}${article.thumbnail_url}`}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              ) : (
                'Hình ảnh bài viết'
              )}
            </div>

            {/* Content */}
            <SafeHtml
              html={article.content}
              className="prose prose-slate prose-sm max-w-none
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4"
            />

            {/* Share */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-200">
              <Share2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">Chia sẻ:</span>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md">Facebook</button>
              <button className="px-3 py-1.5 bg-sky-500 text-white text-xs rounded-md">Zalo</button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <h3 className="font-bold text-slate-900 mb-4">Bài viết liên quan</h3>
              <div className="space-y-4">
                {relatedArticles.map((a: any) => (
                  <Link key={a.slug} href={`/tin-tuc/${a.slug}`} className="block group">
                    <div className="flex gap-3">
                      <div className="w-20 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-[10px] flex-shrink-0">
                        Ảnh
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                          {a.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">{a.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="mt-8">
                <h3 className="font-bold text-slate-900 mb-4">Danh mục</h3>
                <div className="space-y-2">
                  {['Sự kiện', 'Ngoại khóa', 'Học tập', 'Tuyển sinh'].map((cat) => (
                    <Link
                      key={cat}
                      href={`/tin-tuc/su-kien`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600"
                    >
                      <span>{cat}</span>
                      <span className="text-xs text-slate-400">12</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related articles full-width */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Tin tức khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedArticles.map((a: any) => (
              <ArticleCard key={a.slug} {...a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
