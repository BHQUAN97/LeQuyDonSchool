'use client';

import { usePageTracking } from '@/hooks/usePageTracking';

/**
 * Client component wrapper — goi usePageTracking hook.
 * Render nothing, chi dung de track page views trong server component layout.
 */
export default function PageTracker() {
  usePageTracking();
  return null;
}
