'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingButtons() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Desktop: floating buttons ben phai */}
      <div className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
        <a
          href="tel:02462872079"
          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Gọi điện"
        >
          <Phone className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Messenger"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-colors text-xs font-bold"
          aria-label="Zalo"
        >
          Zalo
        </a>
        <a
          href="/tuyen-sinh/thong-tin"
          className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Đăng ký"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </a>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className={cn(
          'fixed right-4 bottom-20 md:bottom-6 z-40 w-10 h-10 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center transition-all',
          showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
        )}
        aria-label="Lên đầu trang"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Mobile: bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 safe-area-bottom">
        <div className="grid grid-cols-4 h-14">
          <a href="tel:02462872079" className="flex items-center justify-center text-red-500">
            <Phone className="w-5 h-5" />
          </a>
          <a href="#" className="flex items-center justify-center text-blue-500">
            <MessageCircle className="w-5 h-5" />
          </a>
          <a href="#" className="flex items-center justify-center text-blue-600 text-xs font-bold">
            Zalo
          </a>
          <a href="/tuyen-sinh/thong-tin" className="flex items-center justify-center text-green-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
