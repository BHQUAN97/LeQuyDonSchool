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
}: ArticleCardProps) {
  return (
    <Link href={href || `/tin-tuc/${slug}`} className="group">
      <article className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
          {imageLabel}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-green-700 font-medium mb-2">
            {category} • {date}
          </p>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-auto">{description}</p>
        </div>
      </article>
    </Link>
  );
}
