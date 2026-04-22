export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar skeleton */}
      <div className="hidden lg:block w-60 bg-white border-r border-slate-200 p-4 space-y-3">
        <div className="h-8 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1">
        {/* Topbar skeleton */}
        <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="p-4 lg:p-6 space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
