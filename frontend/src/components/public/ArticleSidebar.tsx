import Link from 'next/link';
import Image from 'next/image';

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
const PUBLIC_UPLOADS = process.env.NEXT_PUBLIC_SITE_URL || '';

function imgUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${PUBLIC_UPLOADS}${url}`;
}

/** Fetch tin moi nhat — server component helper */
async function getRecentArticles(limit = 4) {
  try {
    const res = await fetch(
      `${INTERNAL_API}/articles/public?limit=${limit}&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/** Fetch su kien sap dien ra */
async function getUpcomingEvents() {
  try {
    const res = await fetch(`${INTERNAL_API}/events/public?status=upcoming&limit=2`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/** Sidebar chung cho article detail/list — V2 style
 *  Gom: Tin tuc moi nhat, Su kien sap dien ra, 3 San Sang widget
 */
export default async function ArticleSidebar() {
  const [articles, events] = await Promise.all([getRecentArticles(4), getUpcomingEvents()]);

  return (
    <aside className="space-y-6">
      {/* Tin tuc moi nhat */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-base text-gray-900 mb-4">Tin tức mới nhất</h3>
        <div className="space-y-4">
          {articles.length === 0 && (
            <p className="text-sm text-gray-400">Chưa có bài viết nào.</p>
          )}
          {articles.map((a: any, i: number) => {
            const cover = imgUrl(a.thumbnail_url);
            const date = new Date(a.published_at || a.created_at || Date.now()).toLocaleDateString('vi-VN');
            return (
              <Link
                key={a.slug || i}
                href={`/tin-tuc/${a.slug}`}
                className="flex gap-3 group"
              >
                <div className="w-20 h-16 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                  {cover ? (
                    <Image src={cover} alt={a.title} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center text-sm text-gray-400">
                      Ảnh
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors leading-snug">
                    {a.title}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    &#128197; {date}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Su kien sap dien ra */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-base text-gray-900 mb-4">Sự kiện sắp diễn ra</h3>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((e: any) => (
              <div key={e.id} className="bg-green-700 rounded-lg overflow-hidden text-white">
                <div className="p-4">
                  <p className="text-sm uppercase tracking-wider text-green-200 mb-1">
                    {e.category || 'Sự kiện'}
                  </p>
                  <p className="text-sm font-bold leading-snug mb-2">{e.title}</p>
                  <p className="text-sm text-white/70">
                    {new Date(e.event_date || e.start_date).toLocaleDateString('vi-VN')}
                    {e.location && ` • ${e.location}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Chưa có sự kiện nào sắp diễn ra.</p>
        )}
      </div>

      {/* 3 San Sang widget */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-5xl font-black text-green-700 leading-none">3</span>
          <div>
            <p className="text-lg font-bold text-red-600 leading-tight">SẴN SÀNG</p>
            <p className="text-sm text-gray-500">cùng con vào...</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-400 italic">lớp</span>
          <span className="text-3xl font-black text-red-600">1</span>
        </div>
        <div className="mt-3 bg-green-700 rounded-lg p-3 text-white">
          <p className="text-sm font-bold mb-1">Hội thảo 3 SẴN SÀNG cùng con vào lớp 1</p>
          <p className="text-sm opacity-80">
            Trường Tiểu học Lê Quý Đôn
          </p>
        </div>
      </div>
    </aside>
  );
}
