import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingButtons from '@/components/public/FloatingButtons';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-14 md:pb-0">{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
