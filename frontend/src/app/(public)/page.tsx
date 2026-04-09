import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildPageMetadata } from '@/lib/seo-helpers';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
const PUBLIC_UPLOADS = process.env.NEXT_PUBLIC_SITE_URL || '';

/** URL day du cho anh — dung public URL cho <img> */
function imageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${PUBLIC_UPLOADS}${url}`;
}

/** Fetch bai viet moi nhat tu API (server-side) */
async function getLatestArticles() {
  try {
    const res = await fetch(`${INTERNAL_API}/articles/public?limit=4&sort=published_at&order=DESC`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = buildPageMetadata({
  title: 'Trường Tiểu học Lê Quý Đôn - Hà Nội',
  description:
    'Trường Tiểu học Lê Quý Đôn - Hệ thống giáo dục liên cấp hàng đầu tại Nam Từ Liêm, Hà Nội. Chương trình Quốc gia nâng cao, Tiếng Anh tăng cường, hợp tác PLC Sydney.',
  path: '/',
  type: 'website',
});

/* Features "Chi co tai Le Quy Don" — interactive cards */
const features = [
  {
    id: 'he-thong',
    title: 'Hệ thống giáo dục từ Mầm non đến THPT',
    icon: '🎓',
    description:
      'Hệ thống Giáo dục Lê Quý Đôn cung cấp lộ trình học liên thông từ Mầm non, Tiểu học đến THCS và THPT với ba cơ sở riêng biệt tại quận Nam Từ Liêm, Hà Nội. Các trường trong hệ thống đều được đầu tư bài bản về cơ sở vật chất, chương trình đào tạo hiện đại và đội ngũ giáo viên chất lượng cao. Hệ thống chú trọng phát triển toàn diện Đức — Trí — Thể — Mỹ, giúp học sinh phát huy tối đa năng lực cá nhân ở từng cấp học và sẵn sàng hội nhập quốc tế.',
  },
  {
    id: 'nhan-su',
    title: 'Nhân sự đặc sắc',
    icon: '👨‍🏫',
    description:
      'Đội ngũ giáo viên được tuyển chọn kỹ lưỡng, giàu kinh nghiệm và tâm huyết với nghề. Mỗi thầy cô không chỉ là người truyền đạt kiến thức mà còn là người bạn đồng hành cùng học sinh trên hành trình phát triển.',
  },
  {
    id: 'tien-phong',
    title: 'Tiên phong & Ảnh hưởng',
    icon: '🏆',
    description:
      'Trường luôn đi đầu trong việc áp dụng các phương pháp giáo dục tiên tiến, tạo ảnh hưởng tích cực đến cộng đồng giáo dục.',
  },
  {
    id: 'plc',
    title: 'Hợp tác toàn diện cùng PLC Sydney',
    icon: '🌏',
    description:
      'Chương trình hợp tác toàn diện với PLC Sydney (Úc) mang đến cho học sinh cơ hội trải nghiệm giáo dục quốc tế ngay tại Việt Nam.',
  },
  {
    id: 'khuon-vien',
    title: 'Khuôn viên 6000m² tại tọa độ lý tưởng',
    icon: '🏫',
    description:
      'Khuôn viên rộng 6000m² nằm tại vị trí đắc địa ở KĐT Mỹ Đình, được thiết kế hiện đại với đầy đủ tiện ích phục vụ học tập và hoạt động ngoại khóa.',
  },
];

/* Testimonial */
const testimonials = [
  {
    name: 'Anh Hoàng Hữu Thắng',
    title: 'Chủ tịch HĐQT Intech Group | Phó Chủ tịch CLB Đầu tư & Khởi nghiệp Việt Nam | PHHS khóa 2021 - 2026',
    content:
      'Tôi thấy vui và hạnh phúc mỗi khi con nói chuyện thể hiện sự đam mê, yêu thích ngôi trường. Mỗi lần đến Trường Tiểu học Lê Quý Đôn để đón con, tôi lại thấy sự vui tươi, hồn nhiên của các con. Tôi tin tưởng vào sự phát triển toàn diện mà nhà trường mang lại cho con trai mình. Điều quý giá nhất là con không chỉ giỏi kiến thức mà còn phát triển cả về kỹ năng sống và nhân cách. Trường thực sự là tổ ấm thứ hai cho các em, để mỗi sáng mẹ không phải mệt công tìm kiếm lý do để con yêu trường, đến trường.',
  },
];

export default async function HomePage() {
  const articles = await getLatestArticles();
  return (
    <div>
      {/* ============================================ */}
      {/* HERO BANNER — gradient do + typography lon */}
      {/* ============================================ */}
      <section className="relative bg-gradient-to-r from-[#b71c5a] via-[#c2185b] to-[#e91e63] overflow-hidden">
        {/* Huy hieu + 20 nam phia tren trai */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-8 flex items-center gap-3 z-10">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 border border-yellow-500/50 flex items-center justify-center">
            <span className="text-yellow-300 font-bold text-xs">LQĐ</span>
          </div>
          <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center">
            <span className="text-yellow-300/80 font-bold text-2xl lg:text-3xl italic">20</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Trai: text thong bao */}
            <div className="text-white pt-8 lg:pt-0">
              <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">
                Thông báo Tuyển sinh<br />năm học 2026 - 2027
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Thông tin tuyển sinh năm học 2026 - 2027
              </p>
              <Link
                href="/tuyen-sinh/thong-tin"
                className="inline-flex items-center px-7 py-3.5 bg-white text-red-700 font-bold rounded-lg hover:bg-yellow-50 transition-colors shadow-lg text-sm"
              >
                Xem chi tiết
              </Link>
            </div>

            {/* Phai: typography lon TUYEN SINH 2026-2027 */}
            <div className="hidden lg:block relative">
              {/* Decorative elements */}
              <div className="absolute -top-8 right-20 text-white/20 text-4xl">♪</div>
              <div className="absolute top-0 right-0 text-yellow-300/30 text-2xl">✦</div>
              <div className="absolute bottom-4 right-8">
                <svg className="w-12 h-12 text-yellow-300/40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>

              <div className="text-right">
                <p className="text-red-200 text-xl font-bold tracking-widest uppercase mb-2">Thông báo</p>
                <p className="text-white text-5xl xl:text-7xl font-black leading-none tracking-tight">
                  Tuyển sinh
                </p>
                <div className="flex items-baseline justify-end gap-3 mt-2">
                  <span className="text-white/60 text-lg font-medium">NĂM HỌC</span>
                  <span className="text-white text-5xl xl:text-7xl font-black">2026</span>
                  <span className="text-white text-4xl xl:text-5xl font-light">-</span>
                  <span className="text-white text-5xl xl:text-7xl font-black">2027</span>
                </div>
                <p className="text-yellow-300 text-xl lg:text-2xl font-bold mt-3 tracking-wide">
                  Đợt 2: 21/03/2026
                </p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            <span className="w-3 h-3 rounded-full bg-white" />
            <span className="w-3 h-3 rounded-full bg-white/40" />
            <span className="w-3 h-3 rounded-full bg-white/40" />
            <span className="w-3 h-3 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TIN TUC — Moi cap nhat */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Tin tức</span>
              <div className="flex gap-0.5">
                <span className="w-5 h-1 bg-red-500 rounded-full" />
                <span className="w-5 h-1 bg-green-600 rounded-full" />
                <span className="w-5 h-1 bg-red-500 rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Mới cập nhật</h2>
          </div>
          <Link href="/tin-tuc/su-kien" className="text-sm text-gray-500 hover:text-green-700 transition-colors font-medium">
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(articles.length > 0 ? articles : [1, 2, 3, 4]).map((item: any, i: number) => {
            const isReal = typeof item === 'object';
            const title = isReal ? item.title : `Tiêu đề bài viết mẫu số ${item}`;
            const desc = isReal ? (item.excerpt || item.description || '') : 'Mô tả ngắn của bài viết sẽ hiển thị ở đây...';
            const date = isReal ? new Date(item.published_at || item.created_at).toLocaleDateString('vi-VN') : '03/04/2026';
            const category = isReal ? (item.category?.name || 'Tin tức') : 'Tin tức';
            const slug = isReal ? item.slug : `bai-viet-${item}`;
            const cover = isReal ? imageUrl(item.thumbnail_url) : null;

            return (
              <Link key={slug || i} href={`/tin-tuc/${slug}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group block">
                <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                  {cover ? (
                    <Image src={cover} alt={title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                      Hình ảnh
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-green-700 font-medium mb-2">{category} • {date}</p>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================ */}
      {/* THU NGO + 3 SAN SANG */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thu ngo — 2 cot */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <span className="text-green-700 font-bold text-sm">25</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800 uppercase">Thư ngỏ</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Vấn đề bảo an toàn thực phẩm tại nhà trường
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Thư ngỏ Vấn đề bảo an toàn thực phẩm tại Nhà trường — Nhà trường luôn đặt vấn đề an
                toàn thực phẩm lên hàng đầu, đảm bảo mỗi bữa ăn của học sinh đều được kiểm soát
                chặt chẽ từ nguồn gốc nguyên liệu đến quy trình chế biến.
              </p>

              {/* Mini news grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {[
                  { title: 'Trường TH Lê Quý Đôn tổ chức Hội Khỏe Phù Đổng', badge: 'new' },
                  { title: 'Lễ kết nạp Đội TNTP HCM Khoá 4, 5 & Liên đội Trần Quốc Toản', badge: '' },
                  { title: 'Team Tên Trộm 3 Doners – Trại Xuân 2026 "Mùa xuân ơi..."', badge: '' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="h-24 bg-gradient-to-br from-green-50 to-yellow-50 rounded-md mb-2 flex items-center justify-center text-gray-300 text-xs">
                      Ảnh
                    </div>
                    <p className="text-xs font-medium text-gray-700 line-clamp-2">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 San Sang — 1 cot */}
          <div className="flex flex-col gap-4">
            {/* So 3 lon */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6 text-center">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-7xl font-black text-green-700 leading-none">3</span>
                <div className="text-left">
                  <p className="text-xl font-bold text-red-600 leading-tight">SẴN SÀNG</p>
                  <p className="text-xs text-gray-500">cùng con yêu...</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-sm text-gray-400">lớp</span>
                <span className="text-4xl font-black text-red-600">1</span>
              </div>
            </div>

            {/* Info box xanh */}
            <div className="bg-green-700 rounded-xl p-5 text-white flex-1">
              <p className="font-bold text-sm mb-2">Hội thảo 3 SẴN SÀNG cùng 1 năm đầu tiên!</p>
              <p className="text-xs opacity-90 leading-relaxed">
                Hội thảo dành cho PHHS có con chuẩn bị vào lớp 1 tại Trường Tiểu học Lê Quý Đôn.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-300" />
                <span className="text-xs opacity-80">Đăng ký tham gia</span>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">1.536</p>
                  <p className="text-[10px] text-gray-500">Học sinh</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700">150+</p>
                  <p className="text-[10px] text-gray-500">Giáo viên</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">20</p>
                  <p className="text-[10px] text-gray-500">Năm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHI CO TAI — Le Quy Don (interactive cards) */}
      {/* ============================================ */}
      <section className="bg-[#1a6b30] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm opacity-80 uppercase tracking-wide">Chỉ có tại</span>
              <div className="flex gap-0.5">
                <span className="w-4 h-1 bg-red-400 rounded-full" />
                <span className="w-4 h-1 bg-yellow-300 rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">Trường Tiểu học Lê Quý Đôn</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Trai: feature cards — white bg, horizontal layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-xl p-4 flex items-center justify-between gap-3 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <p className="text-sm font-bold text-gray-800 uppercase leading-snug">
                    {f.title}
                  </p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl text-green-700 shrink-0">
                    {f.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Phai: mo ta chi tiet feature dau tien (default) */}
            <div>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl border border-white/20">
                  🎓
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{features[0].title}</h3>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                {features[0].description}
              </p>
              <Link
                href="/tong-quan/tam-nhin-su-menh"
                className="inline-flex items-center px-5 py-2.5 border-2 border-white rounded-lg text-sm font-medium hover:bg-white hover:text-green-800 transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>

          {/* Ngoi truong icon */}
          <div className="flex justify-center mt-10">
            <div className="text-white/20 text-5xl">🏛️</div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* YEAR BANNER — 2025-2026 + anh gia dinh */}
      {/* ============================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        {/* Trai: year banner nen xanh nhat/be */}
        <div className="bg-gradient-to-r from-[#c8a97e] to-[#d4b896] py-10 lg:py-16 px-6 lg:px-10 flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <p className="text-6xl lg:text-8xl xl:text-9xl font-black text-white/30 tracking-tighter leading-none">
              2025-2026
            </p>
            {/* Anh gia dinh placeholder */}
            <div className="mt-6 w-64 h-48 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-white/50 text-sm">
              Ảnh gia đình
            </div>
          </div>
          {/* Emblem o goc */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white/40 font-bold text-xs">LQĐ</span>
          </div>
        </div>

        {/* Phai: testimonial nen do */}
        <div className="bg-[#c62828] text-white py-10 lg:py-16 px-6 lg:px-10 relative">
          <div className="max-w-lg">
            {/* Dau ngoac kep lon */}
            <div className="text-6xl text-white/30 font-serif leading-none mb-4">&ldquo;</div>

            <div className="flex items-center gap-2 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm opacity-80 uppercase tracking-wide">Từ cộng đồng</span>
                  <div className="flex gap-0.5">
                    <span className="w-4 h-1 bg-yellow-300 rounded-full" />
                    <span className="w-4 h-1 bg-green-400 rounded-full" />
                    <span className="w-4 h-1 bg-yellow-300 rounded-full" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Lê Quý Đôn</h2>
              </div>
            </div>

            {testimonials.map((t) => (
              <div key={t.name} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xs">
                    Ảnh
                  </div>
                  <div>
                    <p className="font-bold text-base">{t.name}</p>
                    <p className="text-[11px] opacity-80 leading-snug">{t.title}</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 leading-relaxed italic">{t.content}</p>
              </div>
            ))}

            {/* Navigation arrows + dots */}
            <div className="flex items-center gap-4 mt-6">
              <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex gap-2 ml-2">
                <span className="w-3 h-3 rounded-full bg-white" />
                <span className="w-3 h-3 rounded-full bg-white/40" />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-6 right-6">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-white/30 text-2xl">📖</span>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 text-white/10">
            <svg className="w-20 h-20" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 5 L60 40 L95 40 L67 60 L77 95 L50 73 L23 95 L33 60 L5 40 L40 40 Z" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
