'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Hook theo doi page view — gui fire-and-forget POST moi khi path thay doi.
 * Bo qua /admin/* routes va dedup cung path trong 5 giay.
 */
export function usePageTracking() {
  const pathname = usePathname();
  const lastSent = useRef<{ path: string; time: number }>({ path: '', time: 0 });

  useEffect(() => {
    if (!pathname) return;

    // Bo qua admin routes
    if (pathname.startsWith('/admin')) return;

    // Dedup: khong gui neu cung path trong 5s
    const now = Date.now();
    if (lastSent.current.path === pathname && now - lastSent.current.time < 5000) {
      return;
    }

    lastSent.current = { path: pathname, time: now };

    // Fire-and-forget — khong can await
    fetch(`${API_BASE}/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {
      // Im lang — khong anh huong UX
    });
  }, [pathname]);
}
