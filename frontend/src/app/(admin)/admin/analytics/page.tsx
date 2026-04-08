'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface DashboardData {
  totalViews: number;
  uniqueVisitors: number;
  mobileViews: number;
  desktopViews: number;
  tabletViews: number;
  botViews: number;
  dailyTrend: { date: string; views: number; uniqueVisitors: number }[];
  topPages: { path: string; views: number; uniqueVisitors: number }[];
}

interface ApiRes {
  success: boolean;
  data: DashboardData;
  message: string;
}

const RANGE_OPTIONS = [
  { label: '7 ngày', days: 7 },
  { label: '30 ngày', days: 30 },
  { label: '90 ngày', days: 90 },
];

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function pct(part: number, total: number): string {
  if (total === 0) return '0';
  return ((part / total) * 100).toFixed(1);
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rangeDays, setRangeDays] = useState(30);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const end = formatDate(new Date());
      const startD = new Date();
      startD.setDate(startD.getDate() - rangeDays);
      const start = formatDate(startD);

      const res = await api<ApiRes>(`/analytics/dashboard?start=${start}&end=${end}`);
      if (res.success) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [rangeDays]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tinh toan device percentages
  const totalNonBot = data
    ? data.mobileViews + data.desktopViews + data.tabletViews
    : 0;

  return (
    <div className="space-y-6">
      {/* Header + Range selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900">Thống kê truy cập</h1>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              onClick={() => setRangeDays(opt.days)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                rangeDays === opt.days
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          Đang tải...
        </div>
      ) : data ? (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Tổng lượt xem" value={data.totalViews.toLocaleString()} />
            <StatCard label="Khách truy cập" value={data.uniqueVisitors.toLocaleString()} />
            <StatCard
              label="Mobile"
              value={`${pct(data.mobileViews, totalNonBot)}%`}
              sub={`${data.mobileViews.toLocaleString()} lượt`}
            />
            <StatCard
              label="Desktop"
              value={`${pct(data.desktopViews, totalNonBot)}%`}
              sub={`${data.desktopViews.toLocaleString()} lượt`}
            />
          </div>

          {/* Device breakdown bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Thiết bị truy cập</h2>
            <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
              {totalNonBot > 0 && (
                <>
                  <div
                    className="bg-blue-500 transition-all"
                    style={{ width: `${pct(data.desktopViews, totalNonBot)}%` }}
                    title={`Desktop: ${pct(data.desktopViews, totalNonBot)}%`}
                  />
                  <div
                    className="bg-green-500 transition-all"
                    style={{ width: `${pct(data.mobileViews, totalNonBot)}%` }}
                    title={`Mobile: ${pct(data.mobileViews, totalNonBot)}%`}
                  />
                  <div
                    className="bg-yellow-500 transition-all"
                    style={{ width: `${pct(data.tabletViews, totalNonBot)}%` }}
                    title={`Tablet: ${pct(data.tabletViews, totalNonBot)}%`}
                  />
                </>
              )}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Desktop {pct(data.desktopViews, totalNonBot)}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Mobile {pct(data.mobileViews, totalNonBot)}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Tablet {pct(data.tabletViews, totalNonBot)}%
              </span>
              {data.botViews > 0 && (
                <span className="text-slate-400">Bot: {data.botViews.toLocaleString()} lượt</span>
              )}
            </div>
          </div>

          {/* Daily trend table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Xu hướng theo ngày</h2>
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-4 font-medium">Ngày</th>
                    <th className="py-2 pr-4 font-medium text-right">Lượt xem</th>
                    <th className="py-2 font-medium text-right">Khách</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dailyTrend.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-400">
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    data.dailyTrend.map((row) => (
                      <tr key={row.date} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-1.5 pr-4 text-slate-700">{row.date}</td>
                        <td className="py-1.5 pr-4 text-right font-medium">{row.views.toLocaleString()}</td>
                        <td className="py-1.5 text-right text-slate-600">{row.uniqueVisitors.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 10 pages */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Top 10 trang được xem nhiều</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-2 pr-4 font-medium">#</th>
                  <th className="py-2 pr-4 font-medium">Trang</th>
                  <th className="py-2 pr-4 font-medium text-right">Lượt xem</th>
                  <th className="py-2 font-medium text-right">Khách</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Chưa có dữ liệu
                    </td>
                  </tr>
                ) : (
                  data.topPages.map((row, i) => (
                    <tr key={row.path} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-1.5 pr-4 text-slate-400">{i + 1}</td>
                      <td className="py-1.5 pr-4 text-slate-700 max-w-xs truncate" title={row.path}>
                        {row.path}
                      </td>
                      <td className="py-1.5 pr-4 text-right font-medium">{row.views.toLocaleString()}</td>
                      <td className="py-1.5 text-right text-slate-600">{row.uniqueVisitors.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}

/** Card hien thi 1 so lieu */
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
