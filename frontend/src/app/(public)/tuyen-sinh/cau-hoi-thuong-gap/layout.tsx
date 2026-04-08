import { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Câu hỏi thường gặp',
  description:
    'Giải đáp các câu hỏi thường gặp về tuyển sinh, học phí, chương trình học và dịch vụ tại Trường Tiểu học Lê Quý Đôn.',
  path: '/tuyen-sinh/cau-hoi-thuong-gap',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
