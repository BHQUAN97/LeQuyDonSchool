'use client';

import { useState } from 'react';
import PageBanner from '@/components/public/PageBanner';
import ArticleCard from '@/components/public/ArticleCard';
import { Search } from 'lucide-react';

const mockResults = [
  { title: 'Thông báo tuyển sinh lớp 1 năm học 2026-2027', description: 'Trường Tiểu học Lê Quý Đôn thông báo tuyển sinh lớp 1 năm học 2026-2027.', category: 'Tuyển sinh', date: '01/03/2026', slug: 'tuyen-sinh-lop-1-2026-2027' },
  { title: 'Lễ khai giảng năm học 2025-2026 đầy ấn tượng', description: 'Buổi lễ khai giảng diễn ra trang trọng với sự tham gia của hơn 1000 học sinh.', category: 'Sự kiện', date: '01/09/2025', slug: 'le-khai-giang-2025-2026' },
  { title: 'Chương trình Tiếng Anh tăng cường', description: 'Chương trình Tiếng Anh tăng cường với giáo viên bản ngữ và giáo trình quốc tế.', category: 'Chương trình', date: '15/01/2026', slug: 'chuong-trinh-tieng-anh' },
  { title: 'Học sinh đạt giải Nhất Olympic Toán cấp Quận', description: 'Em Nguyễn Minh Anh xuất sắc giành giải Nhất Olympic Toán cấp Quận.', category: 'Học tập', date: '10/03/2026', slug: 'giai-nhat-olympic-toan' },
];

export default function TimKiemPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
      // Se ket noi API tim kiem sau
    }
  };

  return (
    <div>
      <PageBanner
        title="Tìm kiếm"
        description="Tìm kiếm thông tin trên toàn bộ website"
        breadcrumbItems={[{ label: 'Tìm kiếm' }]}
      />

      {/* Search box */}
      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm..."
              className="w-full pl-12 pr-24 py-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Quick suggestions */}
        {!hasSearched && (
          <div className="max-w-2xl mx-auto mt-4">
            <p className="text-xs text-slate-400 mb-2">Tìm kiếm phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              {['Tuyển sinh', 'Học phí', 'Lịch học', 'Thực đơn', 'Ngoại khóa'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setHasSearched(true);
                  }}
                  className="px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Results */}
      {hasSearched && (
        <section className="max-w-7xl mx-auto px-4 pb-12 lg:pb-16">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Tìm thấy <span className="font-medium text-slate-900">{mockResults.length}</span> kết quả
              cho &ldquo;<span className="font-medium text-slate-900">{query}</span>&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mockResults.map((a) => (
              <ArticleCard key={a.slug} {...a} />
            ))}
          </div>

          {/* No results state (hidden, for future use) */}
          {mockResults.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-sm text-slate-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </section>
      )}

      {/* Empty state when no search */}
      {!hasSearched && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-sm text-slate-400">Nhập từ khóa để bắt đầu tìm kiếm</p>
          </div>
        </section>
      )}
    </div>
  );
}
