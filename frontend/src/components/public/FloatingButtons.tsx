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

  /* Nut sidebar — mau sac theo thiet ke goc */
  const sideButtons = [
    {
      href: 'tel:02462872079',
      icon: <Phone className="w-5 h-5" />,
      label: 'Gọi điện',
      bg: 'bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    },
    {
      href: 'https://m.me/TieuHocLeQuyDon',
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Messenger',
      bg: 'bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    },
    {
      href: 'https://zalo.me',
      icon: <span className="text-xs font-bold">Zalo</span>,
      label: 'Zalo',
      bg: 'bg-gradient-to-b from-red-400 to-red-500 hover:from-red-500 hover:to-red-600',
    },
    {
      href: '/tuyen-sinh/thong-tin',
      icon: <FileText className="w-5 h-5" />,
      label: 'Đăng ký',
      bg: 'bg-gradient-to-b from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    },
  ];

  return (
    <>
      {/* Desktop: floating sidebar ben phai — rounded pill */}
      <div className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5 bg-white/10 backdrop-blur-sm rounded-full p-1.5 shadow-xl">
        {sideButtons.map((btn) => (
          <a
            key={btn.label}
            href={btn.href}
            className={cn(
              'w-11 h-11 rounded-full text-white flex items-center justify-center shadow-md transition-all',
              btn.bg,
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
          'fixed right-4 bottom-20 md:bottom-6 z-40 w-10 h-10 rounded-full bg-gray-800 text-white shadow-lg flex items-center justify-center transition-all',
          showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
        )}
        aria-label="Lên đầu trang"
      >
        <ArrowUp className="w-4 h-4" />
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
