import Link from 'next/link';
import Image from 'next/image';

interface ArticleCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
  slug: string;
  imageLabel?: string;
  thumbnailUrl?: string | null;
  thumbnail_url?: string | null;
  coverImage?: string | null;
  imageFit?: 'cover' | 'contain';
  /** Override URL — dung cho search results voi cac loai khac nhau */
  href?: string;
  /** Layout variant: 'card' (default, vertical) hoac 'list' (horizontal) */
  variant?: 'card' | 'list';
}

const PUBLIC_UPLOADS = process.env.NEXT_PUBLIC_SITE_URL || '';

function imageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${PUBLIC_UPLOADS}${url}`;
}

function fallbackImage(category: string, title: string): string {
  const value = `${category} ${title}`.toLowerCase();

  if (value.includes('thực đơn') || value.includes('thuc don')) {
    return '/images/design/menu-week-06-10.png';
  }
  if (value.includes('thư ngỏ') || value.includes('thu ngo') || value.includes('tài liệu') || value.includes('tai lieu') || value.includes('công văn') || value.includes('cong van')) {
    return '/images/design/news-letter-cover.png';
  }
  if (value.includes('tuyển sinh') || value.includes('tuyen sinh') || value.includes('clb')) {
    return '/images/design/admission-2026-list.png';
  }
  if (value.includes('ngoại khóa') || value.includes('ngoai khoa') || value.includes('robotics')) {
    return '/images/design/intro-safety-training.png';
  }
  if (value.includes('học tập') || value.includes('hoc tap') || value.includes('stem')) {
    return '/images/design/intro-classroom.png';
  }
  if (value.includes('y tế') || value.includes('y te') || value.includes('dịch vụ') || value.includes('dich vu')) {
    return '/images/design/intro-healthcare.png';
  }
  if (value.includes('khai giảng') || value.includes('khai giang') || value.includes('sự kiện') || value.includes('su kien')) {
    return '/images/design/news-doi-khoi.png';
  }

  return '/images/design/news-award.png';
}

function ArticleImage({
  src,
  alt,
  label,
  fit,
  className,
  sizes,
}: {
  src: string | null;
  alt: string;
  label: string;
  fit: 'cover' | 'contain';
  className: string;
  sizes: string;
}) {
  return (
    <div className={`${className} bg-slate-100 flex items-center justify-center text-slate-400 text-sm shrink-0 relative overflow-hidden`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={fit === 'contain' ? 'object-contain p-1' : 'object-cover group-hover:scale-105 transition-transform duration-300'}
          sizes={sizes}
        />
      ) : (
        label
      )}
    </div>
  );
}

/** Card bai viet dung chung cho cac trang tin tuc / su kien / ngoai khoa / hoc tap */
export default function ArticleCard({
  title,
  description,
  category,
  date,
  slug,
  imageLabel = 'Hình ảnh bài viết',
  thumbnailUrl,
  thumbnail_url,
  coverImage,
  imageFit = 'cover',
  href,
  variant = 'card',
}: ArticleCardProps) {
  const cover = imageUrl(thumbnailUrl || thumbnail_url || coverImage || fallbackImage(category, title));

  if (variant === 'list') {
    return (
      <Link href={href || `/tin-tuc/${slug}`} className="group">
        <article className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
          <ArticleImage
            src={cover}
            alt={title}
            label={imageLabel}
            fit={imageFit}
            className="w-full sm:w-64 h-48 sm:h-40"
            sizes="(max-width: 640px) 100vw, 256px"
          />
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
        <ArticleImage
          src={cover}
          alt={title}
          label={imageLabel}
          fit={imageFit}
          className="h-44"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
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
