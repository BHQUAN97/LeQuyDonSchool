'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Login page khong can layout
  const isLoginPage = pathname === '/admin/login';

  // Redirect neu chua dang nhap
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [user, loading, isLoginPage, router]);

  // Dong mobile menu khi chuyen trang
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Login page: render truc tiep, khong co layout
  if (isLoginPage) return <>{children}</>;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Chua dang nhap — se redirect
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-60">
          <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className={cn('transition-all duration-300', sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60')}>
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
