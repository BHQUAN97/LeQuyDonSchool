'use client';

import StatCard from '@/components/admin/StatCard';
import { Eye, FileText, Mail, GraduationCap } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Lượt truy cập hôm nay" value={0} icon={Eye} trend="Chưa có dữ liệu" />
        <StatCard label="Tổng bài viết" value={0} icon={FileText} trend="Chưa có dữ liệu" />
        <StatCard label="Liên hệ mới" value={0} icon={Mail} trend="Chưa có dữ liệu" />
        <StatCard label="Đăng ký tuyển sinh" value={0} icon={GraduationCap} trend="Chưa có dữ liệu" />
      </div>

      {/* Widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-medium text-slate-700 mb-4">Lượt truy cập 7 ngày qua</h3>
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Chưa có dữ liệu thống kê
          </div>
        </div>

        {/* Recent contacts placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Liên hệ mới nhất</h3>
            <span className="text-xs text-green-700 cursor-pointer hover:underline">Xem tất cả</span>
          </div>
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Chưa có liên hệ nào
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent articles placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Bài viết mới nhất</h3>
            <span className="text-xs text-green-700 cursor-pointer hover:underline">Xem tất cả</span>
          </div>
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Chưa có bài viết nào
          </div>
        </div>

        {/* Recent admissions placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Đăng ký tuyển sinh mới</h3>
            <span className="text-xs text-green-700 cursor-pointer hover:underline">Xem tất cả</span>
          </div>
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Chưa có đăng ký nào
          </div>
        </div>
      </div>
    </div>
  );
}
