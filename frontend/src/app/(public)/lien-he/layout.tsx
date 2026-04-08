import { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Liên hệ',
  description:
    'Liên hệ Trường Tiểu học Lê Quý Đôn - Khu đô thị Mỹ Đình - Mễ Trì, Nam Từ Liêm, Hà Nội. Điện thoại, email và bản đồ chỉ đường.',
  path: '/lien-he',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
