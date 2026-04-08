'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Menus page — redirect sang /admin/navigation vi backend dung chung module.
 */
export default function MenusPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/navigation');
  }, [router]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <p className="text-slate-500">Đang chuyển hướng đến trang quản lý menu...</p>
    </div>
  );
}
