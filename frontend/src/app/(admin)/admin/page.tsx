'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';
import { Eye, FileText, Mail, GraduationCap } from 'lucide-react';
import { api } from '@/lib/api';
import type { Article, Contact, AdmissionRegistration, PaginatedResponse } from '@/types';

interface DashboardData {
  totalArticles: number;
  newContacts: number;
  newRegistrations: number;
  recentArticles: Article[];
  recentContacts: Contact[];
  recentRegistrations: AdmissionRegistration[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalArticles: 0,
    newContacts: 0,
    newRegistrations: 0,
    recentArticles: [],
    recentContacts: [],
    recentRegistrations: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      // Goi song song 3 API de lay thong ke tong quan
      const [articlesRes, contactsRes, registrationsRes] = await Promise.allSettled([
        api<PaginatedResponse<Article>>('/articles?page=1&limit=5'),
        api<PaginatedResponse<Contact>>('/contacts?page=1&limit=5'),
        api<PaginatedResponse<AdmissionRegistration>>('/admissions/registrations?page=1&limit=5'),
      ]);

      const newData: DashboardData = {
        totalArticles: 0,
        newContacts: 0,
        newRegistrations: 0,
        recentArticles: [],
        recentContacts: [],
        recentRegistrations: [],
      };

      if (articlesRes.status === 'fulfilled' && articlesRes.value.success) {
        newData.totalArticles = articlesRes.value.pagination.total;
        newData.recentArticles = articlesRes.value.data;
      }
      if (contactsRes.status === 'fulfilled' && contactsRes.value.success) {
        newData.newContacts = contactsRes.value.pagination.total;
        newData.recentContacts = contactsRes.value.data;
      }
      if (registrationsRes.status === 'fulfilled' && registrationsRes.value.success) {
        newData.newRegistrations = registrationsRes.value.pagination.total;
        newData.recentRegistrations = registrationsRes.value.data;
      }

      setData(newData);
    } catch (err) {
      console.error('Loi tai dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-slate-200 rounded w-1/3" />
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard label="Lượt truy cập hôm nay" value="—" icon={Eye} trend="Chưa tích hợp analytics" />
            <StatCard label="Tổng bài viết" value={data.totalArticles} icon={FileText} />
            <StatCard label="Liên hệ mới" value={data.newContacts} icon={Mail} />
            <StatCard label="Đăng ký tuyển sinh" value={data.newRegistrations} icon={GraduationCap} />
          </>
        )}
      </div>

      {/* Widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-medium text-slate-700 mb-4">Lượt truy cập 7 ngày qua</h3>
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Chưa tích hợp Google Analytics
          </div>
        </div>

        {/* Recent contacts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Liên hệ mới nhất</h3>
            <Link href="/admin/contacts" className="text-xs text-green-700 hover:underline">
              Xem tất cả
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : data.recentContacts.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Chưa có liên hệ nào
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentContacts.map((c) => (
                <div key={c.id} className="flex items-start justify-between text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{c.full_name}</p>
                    <p className="text-slate-500 text-xs truncate">{c.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                    {new Date(c.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent articles */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Bài viết mới nhất</h3>
            <Link href="/admin/articles" className="text-xs text-green-700 hover:underline">
              Xem tất cả
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded w-3/4" />
              ))}
            </div>
          ) : data.recentArticles.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Chưa có bài viết nào
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentArticles.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400">
                      {a.status === 'published' ? 'Đã đăng' : a.status === 'draft' ? 'Nháp' : 'Ẩn'}
                      {' · '}
                      {a.view_count} lượt xem
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                    {new Date(a.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent admissions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Đăng ký tuyển sinh mới</h3>
            <Link href="/admin/admissions" className="text-xs text-green-700 hover:underline">
              Xem tất cả
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : data.recentRegistrations.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Chưa có đăng ký nào
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentRegistrations.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{r.full_name}</p>
                    <p className="text-xs text-slate-400">Lớp {r.grade} · {r.phone}</p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    r.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    r.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {r.status === 'new' ? 'Mới' : r.status === 'contacted' ? 'Đã liên hệ' : 'Hoàn tất'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
