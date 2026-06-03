'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
      { label: 'Gia đình học sinh Vân Cốc', href: '/tong-quan/gia-dinh-doners' },
      { label: 'Ngôi nhà Vân Cốc', href: '/tong-quan/ngoi-nha-van-coc' },
      { label: 'Sắc màu Vân Cốc', href: '/tong-quan/sac-mau-van-coc' },
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Focus input khi mo search
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Xu ly submit search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Mobile: hamburger trai */}
          <button
            onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false); }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>

          {/* Logo — mobile: giua, desktop: trai */}
          <Link href="/" className="flex items-center shrink-0 lg:mr-auto" aria-label="Trang chủ Trường Tiểu học Vân Cốc">
            <Image
              src="/images/design/logo-header.png"
              alt="Trường Tiểu học Vân Cốc"
              width={280}
              height={54}
              priority
              className="h-11 w-auto sm:h-[54px]"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => item.children && setOpenDropdown(null)}
                onFocus={() => item.children && setOpenDropdown(item.href)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setOpenDropdown(null);
                  }
                }}
              >
                <Link
                  href={item.children ? item.children[0].href : item.href}
                  aria-haspopup={item.children ? 'menu' : undefined}
                  aria-expanded={item.children ? openDropdown === item.href : undefined}
                  className={cn(
                    'flex items-center px-3 xl:px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors border-b-2',
                    isActive(item.href)
                      ? 'text-green-700 border-green-700'
                      : 'text-red-700 hover:text-green-700 border-transparent',
                  )}
                >
                  {item.label}
                </Link>

                {/* Dropdown — nen xanh dam */}
                {item.children && (
                  <div
                    className={cn(
                      'absolute top-full left-0 pt-2 transition-all duration-200 z-50',
                      openDropdown === item.href ? 'opacity-100 visible' : 'opacity-0 invisible',
                    )}
                  >
                    <div className="bg-[#1a5c2e] rounded-lg shadow-xl py-2 min-w-[240px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block px-5 py-3 text-sm transition-colors',
                            isActive(child.href)
                              ? 'text-yellow-300 bg-green-900/50'
                              : 'text-white hover:bg-white/10',
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Search toggle — tron xanh */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="ml-3 w-11 h-11 rounded-full bg-green-700 hover:bg-green-800 flex items-center justify-center text-white transition-colors shadow-sm"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile: search phai */}
          <button
            onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); }}
            className="w-11 h-11 rounded-full bg-green-700 flex items-center justify-center text-white lg:hidden"
            aria-label="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline search dropdown — hien khi click search icon */}
      {searchOpen && (
        <div className="bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-md ml-auto">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Gõ từ khóa tìm kiếm..."
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-green-700 transition-colors"
                aria-label="Tìm"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <button
                    onClick={() => {
                      setOpenDropdown(openDropdown === item.href ? null : item.href);
                    }}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-4 text-sm font-bold uppercase rounded-lg transition-colors',
                      isActive(item.href) ? 'text-green-700 bg-green-50' : 'text-red-700 hover:bg-gray-50',
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown === item.href && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-4 text-sm font-bold uppercase rounded-lg transition-colors',
                      isActive(item.href) ? 'text-green-700 bg-green-50' : 'text-red-700 hover:bg-gray-50',
                    )}
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && openDropdown === item.href && (
                  <div className="ml-4 border-l-2 border-green-300 pl-3 space-y-1 mb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'block px-3 py-2.5 text-sm rounded-lg transition-colors',
                          isActive(child.href)
                            ? 'text-green-700 font-medium bg-green-50'
                            : 'text-gray-600 hover:text-green-700',
                        )}
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
