import Link from 'next/link';

interface ArticleCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
  slug: string;
  imageLabel?: string;
  /** Override URL — dung cho search results voi cac loai khac nhau */
  href?: string;
  /** Layout variant: 'card' (default, vertical) hoac 'list' (horizontal) */
  variant?: 'card' | 'list';
}

/** Card bai viet dung chung cho cac trang tin tuc / su kien / ngoai khoa / hoc tap */
export default function ArticleCard({
  title,
  description,
  category,
  date,
  slug,
  imageLabel = 'Hình ảnh bài viết',
  href,
  variant = 'card',
}: ArticleCardProps) {
  if (variant === 'list') {
    return (
      <Link href={href || `/tin-tuc/${slug}`} className="group">
        <article className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
          <div className="w-full sm:w-64 h-48 sm:h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-sm shrink-0">
            {imageLabel}
          </div>
          <div className="p-4 flex flex-col flex-1 min-w-0">
            <p className="text-sm text-green-700 font-medium mb-2">
              {category} • {date}
            </p>
            <h3 className="text-base font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href || `/tin-tuc/${slug}`} className="group">
      <article className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
          {imageLabel}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-sm text-green-700 font-medium mb-2">
            {category} • {date}
          </p>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mt-auto">{description}</p>
        </div>
      </article>
    </Link>
  );
}
