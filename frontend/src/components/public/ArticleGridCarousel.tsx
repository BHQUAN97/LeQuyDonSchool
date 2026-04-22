'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArticleItem {
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  thumbnail_url?: string | null;
  published_at?: string;
  created_at?: string;
  category?: { name: string };
}

interface Props {
  articles: ArticleItem[];
  /** So bai viet moi trang (desktop) */
  perPage?: number;
  /** Auto-slide interval (ms). 0 = tat */
  autoInterval?: number;
  /** Base URL cho anh upload */
  uploadsBase?: string;
}

function imageUrl(url: string | null | undefined, base: string): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${base}${url}`;
}

/**
 * Carousel hien thi grid bai viet, auto-next, co arrows va dots.
 */
export default function ArticleGridCarousel({
  articles,
  perPage = 3,
  autoInterval = 5000,
  uploadsBase = '',
}: Props) {
  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shouldAutoPlay = totalPages > 1 && autoInterval > 0;

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-play
  useEffect(() => {
    if (!shouldAutoPlay) return;
    timerRef.current = setInterval(goNext, autoInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [shouldAutoPlay, autoInterval, goNext]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (shouldAutoPlay) {
      timerRef.current = setInterval(goNext, autoInterval);
    }
  }, [shouldAutoPlay, autoInterval, goNext]);

  const handleNext = () => { goNext(); resetTimer(); };
  const handlePrev = () => { goPrev(); resetTimer(); };
  const handleDot = (i: number) => { setCurrent(i); resetTimer(); };

  // Lay bai viet cho trang hien tai
  const pageArticles = articles.slice(current * perPage, current * perPage + perPage);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Grid bai viet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pageArticles.map((item, i) => {
          const title = item.title || `Bài viết ${i + 1}`;
          const desc = item.excerpt || item.description || '';
          const date = new Date(
            item.published_at || item.created_at || Date.now(),
          ).toLocaleDateString('vi-VN');
          const category = item.category?.name || 'Tin tức';
          const slug = item.slug || `bai-viet-${i}`;
          const cover = imageUrl(item.thumbnail_url, uploadsBase);

          return (
            <Link
              key={slug}
              href={`/tin-tuc/${slug}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group block"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                {cover ? (
                  <Image
                    src={cover}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    Hình ảnh
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{desc}</p>
                <p className="text-sm text-gray-400">
                  {date} &nbsp;&bull;&nbsp; {category}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Arrows */}
      {totalPages > 1 && (
        <div
          className={`absolute inset-0 flex items-center justify-between pointer-events-none z-10 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Trang trước"
            className="pointer-events-auto -ml-4 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Trang tiếp"
            className="pointer-events-auto -mr-4 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDot(i)}
              aria-label={`Trang ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                i === current ? 'bg-gray-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
