import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-green-700 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy trang</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
