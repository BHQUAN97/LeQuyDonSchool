'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageBanner from '@/components/public/PageBanner';
import ArticleCard from '@/components/public/ArticleCard';
import { Search, Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface SearchResult {
  id: string;
  type: 'article' | 'page' | 'event' | 'admission';
  title: string;
  description: string | null;
  slug: string;
  thumbnail_url: string | null;
  category: string;
  date: string;
}

/** Map type sang URL cho tung loai ket qua */
function getResultHref(r: SearchResult): string {
  switch (r.type) {
    case 'article': return `/tin-tuc/${r.slug}`;
    case 'page': return `/trang/${r.slug}`;
    case 'event': return `/su-kien`;
    case 'admission': return `/tuyen-sinh/${r.slug}`;
    default: return `/tin-tuc/${r.slug}`;
  }
}

const LIMIT = 12;

export default function TimKiemPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    }>
      <TimKiemContent />
    </Suspense>
  );
}

function TimKiemContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(!!initialQ);
  const [searchError, setSearchError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Abort controller cho request search — cancel request cu khi co request moi,
  // tranh race condition (response cu toi sau ghi de response moi).
  const abortRef = useRef<AbortController | null>(null);

  // Goi API tim kiem
  const doSearch = useCallback(async (q: string, p: number) => {
    if (!q || q.trim().length < 2) return;
    // Cancel request cu (neu co) truoc khi bat dau request moi
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setHasSearched(true);
    setSearchError(null);
    try {
      const params = new URLSearchParams({
        q: q.trim(),
        page: String(p),
        limit: String(LIMIT),
      });
      const res = await fetch(`${API_BASE}/search?${params}`, { signal: controller.signal });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.page);
      } else {
        setSearchError(data.message || 'Không thể thực hiện tìm kiếm');
        setResults([]);
        setTotal(0);
      }
    } catch (err) {
      // AbortError khong phai loi — chi la request cu bi cancel
      if ((err as Error).name === 'AbortError') return;
      console.error('Loi tim kiem:', err);
      setSearchError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
      setResults([]);
      setTotal(0);
    } finally {
      // Chi reset loading neu day la request moi nhat
      if (abortRef.current === controller) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  }, []);

  // Tim kiem khi load trang voi ?q= tu URL
  useEffect(() => {
    if (initialQ && initialQ.trim().length >= 2) {
      doSearch(initialQ, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search — 300ms sau khi ngung go phim
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        setSearchTerm(query.trim());
        doSearch(query.trim(), 1);
        // Cap nhat URL khong reload trang
        window.history.replaceState({}, '', `/tim-kiem?q=${encodeURIComponent(query.trim())}`);
      }, 300);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Submit form (enter hoac click nut)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchTerm(query.trim());
      doSearch(query.trim(), 1);
      window.history.replaceState({}, '', `/tim-kiem?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Click quick suggestion
  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setSearchTerm(term);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doSearch(term, 1);
    window.history.replaceState({}, '', `/tim-kiem?q=${encodeURIComponent(term)}`);
  };

  // Chuyen trang phan trang
  const goToPage = (p: number) => {
    doSearch(searchTerm, p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              placeholder="Nhập từ khóa tìm kiếm (tối thiểu 2 ký tự)..."
              className="w-full pl-12 pr-24 py-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || query.trim().length < 2}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tìm kiếm'}
            </button>
          </div>
        </form>

        {/* Quick suggestions — chi hien khi chua search */}
        {!hasSearched && (
          <div className="max-w-2xl mx-auto mt-4">
            <p className="text-sm text-slate-400 mb-2">Tìm kiếm phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              {['Tuyển sinh', 'Học phí', 'Lịch học', 'Thực đơn', 'Ngoại khóa'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Loading state */}
      {loading && hasSearched && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            <span className="ml-3 text-sm text-slate-500">Đang tìm kiếm...</span>
          </div>
        </section>
      )}

      {/* Error state */}
      {searchError && !loading && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {searchError}
          </div>
        </section>
      )}

      {/* Results */}
      {hasSearched && !loading && !searchError && (
        <section className="max-w-7xl mx-auto px-4 pb-12 lg:pb-16">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Tìm thấy <span className="font-medium text-slate-900">{total}</span> kết quả
              cho &ldquo;<span className="font-medium text-slate-900">{searchTerm}</span>&rdquo;
            </p>
          </div>

          {results.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {results.map((r) => (
                  <ArticleCard
                    key={`${r.type}-${r.id}`}
                    title={r.title}
                    description={r.description || ''}
                    category={r.category}
                    date={r.date}
                    slug={r.slug}
                    href={getResultHref(r)}
                  />
                ))}
              </div>

              {/* Phan trang */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce<number[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push(-idx);
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p) =>
                      p < 0 ? (
                        <span key={`dots-${p}`} className="px-2 text-slate-400">...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`w-10 h-10 text-sm rounded-lg transition-colors ${
                            p === page
                              ? 'bg-green-700 text-white'
                              : 'border border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}

          {/* Khong co ket qua */}
          {results.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-sm text-slate-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </section>
      )}

      {/* Empty state — chua tim kiem */}
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
