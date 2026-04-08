import { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tìm kiếm',
  description:
    'Tìm kiếm thông tin tại Trường Tiểu học Lê Quý Đôn - Bài viết, tin tức, chương trình học và thông tin tuyển sinh.',
  path: '/tim-kiem',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
