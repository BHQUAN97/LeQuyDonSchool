import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: 'Trường Tiểu học Lê Quý Đôn - Hà Nội',
    template: '%s | Trường Tiểu học Lê Quý Đôn',
  },
  description:
    'Trường Tiểu học Lê Quý Đôn - Hệ thống giáo dục liên cấp hàng đầu tại Hà Nội. Chương trình Quốc gia nâng cao, Tiếng Anh tăng cường, phát triển toàn diện cho học sinh.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://lequydonhanoi.edu.vn',
  ),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Trường Tiểu học Lê Quý Đôn',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
