import Link from 'next/link';
import ArticleCard from './ArticleCard';
import ArticleSidebar from './ArticleSidebar';
import PageBanner from './PageBanner';
import Pagination from './Pagination';

interface ArticleListItem {
  title: string;
  description: string;
  category: string;
  date: string;
  slug: string;
  thumbnailUrl?: string | null;
  thumbnail_url?: string | null;
  href?: string;
}

interface TabItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ArticleListLayoutProps {
  eyebrow: string;
  title: string;
  breadcrumbs: BreadcrumbItem[];
  articles: ArticleListItem[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  tabs?: TabItem[];
  withSidebar?: boolean;
  grid?: boolean;
  imageFit?: 'cover' | 'contain';
}

export default function ArticleListLayout({
  eyebrow,
  title,
  breadcrumbs,
  articles,
  currentPage,
  totalPages,
  basePath,
  tabs = [],
  withSidebar = true,
  grid = false,
  imageFit = 'cover',
}: ArticleListLayoutProps) {
  return (
    <div>
      <PageBanner title={title} breadcrumbItems={breadcrumbs} />

      <section className="max-w-7xl mx-auto px-4 pt-8 pb-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">{eyebrow}</span>
              <div className="flex gap-0.5" aria-hidden="true">
                <span className="w-6 h-1 bg-green-700 rounded-full" />
                <span className="w-6 h-1 bg-red-600 rounded-full" />
                <span className="w-6 h-1 bg-green-700 rounded-full" />
              </div>
            </div>
          </div>

          {tabs.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    tab.active
                      ? 'bg-green-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={withSidebar ? 'grid grid-cols-1 lg:grid-cols-3 gap-8' : ''}>
          <div className={withSidebar ? 'lg:col-span-2' : ''}>
            <div className={grid ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-5'}>
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  {...article}
                  variant={grid ? 'card' : 'list'}
                  imageFit={imageFit}
                />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
          </div>

          {withSidebar && (
            <div className="lg:col-span-1">
              <ArticleSidebar />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
