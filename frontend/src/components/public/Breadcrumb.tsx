import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Light variant cho banner co nen mau */
  variant?: 'default' | 'light';
}

export default function Breadcrumb({ items, variant = 'default' }: BreadcrumbProps) {
  const isLight = variant === 'light';
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 text-sm ${isLight ? 'text-white/70' : 'text-slate-500'}`}
    >
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link
            href="/"
            className={`transition-colors ${isLight ? 'hover:text-white' : 'hover:text-green-700'}`}
          >
            Trang chủ
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight
              className={`w-3.5 h-3.5 ${isLight ? 'text-white/40' : 'text-slate-400'}`}
            />
            {item.href ? (
              <Link
                href={item.href}
                className={`transition-colors ${isLight ? 'hover:text-white' : 'hover:text-green-700'}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={`font-medium ${isLight ? 'text-white' : 'text-slate-700'}`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
