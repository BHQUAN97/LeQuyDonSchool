'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: SubItem[];
}

const navigation: NavItem[] = [
  {
    label: 'Tổng quan',
    href: '/tong-quan',
    children: [
      { label: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
      { label: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
      { label: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
      { label: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
      { label: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
    ],
  },
  {
    label: 'Chương trình',
    href: '/chuong-trinh',
    children: [
      { label: 'Giáo dục Quốc gia nâng cao', href: '/chuong-trinh/quoc-gia-nang-cao' },
      { label: 'Giáo dục Tiếng Anh tăng cường', href: '/chuong-trinh/tieng-anh-tang-cuong' },
      { label: 'Giáo dục Thể chất & Nghệ thuật', href: '/chuong-trinh/the-chat-nghe-thuat' },
      { label: 'Chương trình phát triển kỹ năng sống', href: '/chuong-trinh/ky-nang-song' },
    ],
  },
  {
    label: 'Dịch vụ học đường',
    href: '/dich-vu-hoc-duong',
    children: [
      { label: 'Thực đơn', href: '/dich-vu-hoc-duong/thuc-don' },
      { label: 'Y tế học đường', href: '/dich-vu-hoc-duong/y-te-hoc-duong' },
    ],
  },
  {
    label: 'Tuyển sinh',
    href: '/tuyen-sinh',
    children: [
      { label: 'Thông tin tuyển sinh', href: '/tuyen-sinh/thong-tin' },
      { label: 'Tuyển sinh CLB Ngôi nhà mơ ước', href: '/tuyen-sinh/clb-ngoi-nha-mo-uoc' },
      { label: 'Q & A', href: '/tuyen-sinh/cau-hoi-thuong-gap' },
    ],
  },
  {
    label: 'Tin tức',
    href: '/tin-tuc',
    children: [
      { label: 'Tin tức - Sự kiện', href: '/tin-tuc/su-kien' },
      { label: 'Hoạt động ngoại khóa', href: '/tin-tuc/ngoai-khoa' },
      { label: 'Hoạt động học tập', href: '/tin-tuc/hoc-tap' },
    ],
  },
  { label: 'Liên hệ', href: '/lien-he' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-xs lg:text-sm">LQĐ</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] text-green-700 font-medium uppercase leading-tight">
                Hệ thống Trường liên cấp Lê Quý Đôn
              </p>
              <p className="text-sm lg:text-base font-bold text-red-600 leading-tight">
                Trường Tiểu học Lê Quý Đôn
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                    pathname.startsWith(item.href)
                      ? 'text-green-700'
                      : 'text-slate-700 hover:text-green-700',
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-green-800 rounded-lg shadow-lg py-2 min-w-[220px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-white hover:bg-green-700 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Search icon */}
            <button className="ml-2 w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white hover:bg-green-800 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile: hamburger + search */}
          <div className="flex items-center gap-2 lg:hidden">
            <button className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white">
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.href}>
                <button
                  onClick={() => {
                    if (item.children) {
                      setOpenDropdown(openDropdown === item.href ? null : item.href);
                    } else {
                      setMobileOpen(false);
                    }
                  }}
                  className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  {item.children ? (
                    <>
                      {item.label}
                      <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown === item.href && 'rotate-180')} />
                    </>
                  ) : (
                    <Link href={item.href} onClick={() => setMobileOpen(false)} className="w-full text-left">
                      {item.label}
                    </Link>
                  )}
                </button>

                {item.children && openDropdown === item.href && (
                  <div className="ml-4 border-l-2 border-green-200 pl-3 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2.5 text-sm text-slate-600 hover:text-green-700 rounded-lg"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
