import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: `${BRAND.schoolName} - Ha Noi`,
    template: `%s | ${BRAND.schoolName}`,
  },
  description:
    `${BRAND.schoolName} - he thong giao duc lien cap tai Ha Noi. Chuong trinh Quoc gia nang cao, tieng Anh tang cuong, phat trien toan dien cho hoc sinh.`,
  metadataBase: new URL(BRAND.siteUrl),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: BRAND.schoolName,
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
