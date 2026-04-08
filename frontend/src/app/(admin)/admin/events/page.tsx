export default function PlaceholderPage() {
  const name = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <h1 className="text-xl font-bold text-slate-900 mb-2 capitalize">{name || 'Module'}</h1>
      <p className="text-slate-500">Trang này đang được phát triển</p>
    </div>
  );
}
