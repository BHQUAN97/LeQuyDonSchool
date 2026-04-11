'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, FileText, FolderTree, File, Home, Link2,
  GraduationCap, UtensilsCrossed, Calendar, Mail, ImageIcon,
  Users, Settings, ScrollText, BarChart3, ChevronLeft, BookOpen,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: string[];
  divider?: boolean;
}

const menuItems: (MenuItem | { divider: true })[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', roles: ['super_admin', 'editor'] },
  { label: 'Bài đăng', icon: FileText, href: '/admin/articles', roles: ['super_admin', 'editor'] },
  { label: 'Danh mục', icon: FolderTree, href: '/admin/categories', roles: ['super_admin', 'editor'] },
  { label: 'Trang', icon: File, href: '/admin/pages', roles: ['super_admin', 'editor'] },
  { label: 'Trang chủ', icon: Home, href: '/admin/homepage', roles: ['super_admin'] },
  { label: 'Menu & URL', icon: Link2, href: '/admin/navigation', roles: ['super_admin'] },
  { label: 'Tuyển sinh', icon: GraduationCap, href: '/admin/admissions', roles: ['super_admin', 'editor'] },
  { label: 'Thực đơn', icon: UtensilsCrossed, href: '/admin/menus', roles: ['super_admin', 'editor'] },
  { label: 'Sự kiện', icon: Calendar, href: '/admin/events', roles: ['super_admin', 'editor'] },
  { label: 'Liên hệ', icon: Mail, href: '/admin/contacts', roles: ['super_admin', 'editor'] },
  { label: 'Media', icon: ImageIcon, href: '/admin/media', roles: ['super_admin', 'editor'] },
  { label: 'Hướng dẫn', icon: BookOpen, href: '/admin/guide', roles: ['super_admin', 'editor'] },
  { divider: true },
  { label: 'Người dùng', icon: Users, href: '/admin/users', roles: ['super_admin'] },
  { label: 'Cài đặt', icon: Settings, href: '/admin/settings', roles: ['super_admin'] },
  { label: 'Nhật ký', icon: ScrollText, href: '/admin/logs', roles: ['super_admin'] },
  { label: 'Thống kê', icon: BarChart3, href: '/admin/analytics', roles: ['super_admin'] },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();
  const userRole = user?.role || 'editor';

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-slate-50 border-r border-slate-200 transition-all duration-300 flex flex-col',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
            LQ
          </div>
          {!collapsed && <span className="font-semibold text-sm text-slate-800 truncate">Lê Quý Đôn</span>}
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {menuItems.map((item, i) => {
            if ('divider' in item && item.divider) {
              return <div key={i} className="my-2 border-t border-slate-200" />;
            }

            const menuItem = item as MenuItem;
            // An muc khong co quyen
            if (!menuItem.roles.includes(userRole)) return null;

            const isActive =
              menuItem.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(menuItem.href);

            const Icon = menuItem.icon;

            const linkContent = (
              <Link
                href={menuItem.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-green-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  collapsed && 'justify-center px-0',
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{menuItem.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={menuItem.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{menuItem.label}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={menuItem.href}>{linkContent}</div>;
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center h-12 border-t border-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </aside>
    </TooltipProvider>
  );
}
