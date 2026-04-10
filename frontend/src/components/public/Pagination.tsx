import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Base path without query params, e.g. "/tin-tuc/su-kien" */
  basePath: string;
}

/** Phan trang dong cho cac trang listing cong khai */
export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Tao danh sach so trang hien thi (toi da 5 trang xung quanh currentPage)
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  function pageHref(page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  }

  return (
    <div className="flex justify-center items-center gap-2 pt-6 pb-8">
      {/* Prev */}
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200 flex items-center justify-center"
          aria-label="Trang trước"
        >
          &laquo;
        </Link>
      )}

      {/* Page numbers */}
      {pages[0] > 1 && (
        <>
          <Link
            href={pageHref(1)}
            className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200 flex items-center justify-center"
          >
            1
          </Link>
          {pages[0] > 2 && <span className="text-slate-400 px-1">...</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center ${
            p === currentPage
              ? 'bg-green-700 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {p}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-slate-400 px-1">...</span>
          )}
          <Link
            href={pageHref(totalPages)}
            className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200 flex items-center justify-center"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200 flex items-center justify-center"
          aria-label="Trang sau"
        >
          &raquo;
        </Link>
      )}
    </div>
  );
}
