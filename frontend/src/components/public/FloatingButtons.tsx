'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingButtons() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Nut sidebar — V2: nut vuong bo goc, mau do tuong phan */
  const sideButtons = [
    {
      href: 'tel:02462872079',
      icon: <Phone className="w-5 h-5" />,
      label: 'Gọi điện',
      bg: 'bg-red-600 hover:bg-red-700',
    },
    {
      href: 'https://m.me/TieuHocLeQuyDon',
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Messenger',
      bg: 'bg-green-600 hover:bg-green-700',
    },
    {
      href: 'https://zalo.me',
      icon: <span className="text-[10px] font-extrabold tracking-tight">Zalo</span>,
      label: 'Zalo',
      bg: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      href: '/tuyen-sinh/thong-tin',
      icon: <FileText className="w-5 h-5" />,
      label: 'Đăng ký',
      bg: 'bg-red-600 hover:bg-red-700',
    },
  ];

  return (
    <>
      {/* Desktop: floating sidebar ben phai — V2 style vuong goc */}
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-0">
        {sideButtons.map((btn) => (
          <a
            key={btn.label}
            href={btn.href}
            className={cn(
              'w-12 h-12 text-white flex items-center justify-center shadow-md transition-all',
              btn.bg,
              'first:rounded-tl-lg last:rounded-bl-lg',
            )}
            aria-label={btn.label}
            target={btn.href.startsWith('http') ? '_blank' : undefined}
            rel={btn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {btn.icon}
          </a>
        ))}
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className={cn(
          'fixed right-4 bottom-20 md:bottom-6 z-40 w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 shadow-lg flex items-center justify-center transition-all hover:bg-gray-50',
          showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
        )}
        aria-label="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Mobile: bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="grid grid-cols-4 h-14">
          {sideButtons.map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:text-green-700 transition-colors"
              target={btn.href.startsWith('http') ? '_blank' : undefined}
              rel={btn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className="text-red-600">{btn.icon}</span>
              <span className="text-[10px]">{btn.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
