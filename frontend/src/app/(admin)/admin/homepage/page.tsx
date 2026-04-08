'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Article, Event, PaginatedResponse } from '@/types';

/**
 * Trang quan ly trang chu — hien thi preview noi dung trang chu (bai viet moi, su kien).
 * Cau hinh trang chu nam trong Settings > Chung.
 */
export default function HomepageAdminPage() {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHomepageData = useCallback(async () => {
    setLoading(true);
    try {
      const [articlesRes, eventsRes] = await Promise.allSettled([
        api<PaginatedResponse<Article>>('/articles?page=1&limit=6&status=published'),
        api<PaginatedResponse<Event>>('/events?page=1&limit=4&status=upcoming'),
      ]);

      if (articlesRes.status === 'fulfilled' && articlesRes.value.success) {
        setRecentArticles(articlesRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.success) {
        setUpcomingEvents(eventsRes.value.data);
      }
    } catch (err) {
      console.error('Loi tai du lieu trang chu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý trang chủ</h1>
        <a
          href="/admin/settings"
          className="text-sm text-green-700 hover:underline"
        >
          Cài đặt chung
        </a>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        Trang chủ hiển thị tự động dựa trên nội dung: bài viết mới nhất, sự kiện sắp tới, và cấu hình trong Cài đặt. Bạn có thể quản lý nội dung qua các module tương ứng.
      </div>

      {/* Preview noi dung trang chu */}
      <div className="space-y-6">
        {/* Bai viet moi nhat */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Bài viết hiển thị trên trang chủ</h3>
            <a href="/admin/articles" className="text-xs text-green-700 hover:underline">
              Quản lý bài viết
            </a>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentArticles.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">Chưa có bài viết đã đăng nào</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex gap-3 items-start">
                  {article.thumbnail_url ? (
                    <img
                      src={article.thumbnail_url}
                      alt=""
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-300 text-xs">
                      N/A
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{article.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(article.created_at).toLocaleDateString('vi-VN')}
                      {' · '}
                      {article.view_count} lượt xem
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Su kien sap toi */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Sự kiện sắp diễn ra</h3>
            <a href="/admin/events" className="text-xs text-green-700 hover:underline">
              Quản lý sự kiện
            </a>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-200 rounded" />
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">Chưa có sự kiện sắp diễn ra</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-400">
                      {event.location || 'Chưa có địa điểm'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-medium text-green-700">
                      {new Date(event.start_date).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(event.start_date).toLocaleTimeString('vi-VN', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
