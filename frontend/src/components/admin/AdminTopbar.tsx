'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, LogOut, User, KeyRound, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Map pathname to breadcrumb labels
const breadcrumbMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/articles': 'Bài đăng',
  '/admin/categories': 'Danh mục',
  '/admin/pages': 'Trang',
  '/admin/homepage': 'Trang chủ',
  '/admin/navigation': 'Menu & URL',
  '/admin/admissions': 'Tuyển sinh',
  '/admin/menus': 'Thực đơn',
  '/admin/events': 'Sự kiện',
  '/admin/contacts': 'Liên hệ',
  '/admin/media': 'Media',
  '/admin/users': 'Người dùng',
  '/admin/settings': 'Cài đặt',
  '/admin/logs': 'Nhật ký',
  '/admin/analytics': 'Thống kê',
};

interface Props {
  onMenuClick: () => void;
}

export default function AdminTopbar({ onMenuClick }: Props) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Tao breadcrumb tu pathname
  const pageTitle = breadcrumbMap[pathname] || pathname.split('/').pop() || 'Dashboard';

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AD';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-white border-b border-slate-200">
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-1 text-sm text-slate-500">
          <span>Admin</span>
          <span>/</span>
          <span className="text-slate-900 font-medium">{pageTitle}</span>
        </nav>
      </div>

      {/* Right: avatar dropdown */}
      <div className="flex items-center gap-3">
        {/* Link xem website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Xem website <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar_url || undefined} />
                <AvatarFallback className="bg-green-700 text-white text-sm">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm text-slate-700 max-w-[120px] truncate">
                {user?.full_name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm text-slate-500">
              {user?.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
              <User className="w-4 h-4 mr-2" /> Thông tin tài khoản
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/admin/profile?tab=password')}>
              <KeyRound className="w-4 h-4 mr-2" /> Đổi mật khẩu
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
