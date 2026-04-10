import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildPageMetadata } from '@/lib/seo-helpers';
import {
  GraduationCap,
  UserRound,
  Trophy,
  Globe,
  Building2,
} from 'lucide-react';
import HeroBanner from '@/components/public/HeroBanner';
import TestimonialCarousel from '@/components/public/TestimonialCarousel';

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
    const res = await fetch(
      `${INTERNAL_API}/articles/public?limit=4&sort=published_at&order=DESC`,
      { next: { revalidate: 300 } },
    );
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

/* Features "Chi co tai Le Quy Don" — dung Lucide icons thay emoji */
const features = [
  {
    id: 'he-thong',
    title: 'Hệ thống giáo dục từ Mầm non đến THPT',
    icon: GraduationCap,
    description:
      'Hệ thống Giáo dục Lê Quý Đôn cung cấp lộ trình học liên thông từ Mầm non, Tiểu học đến THCS và THPT với ba cơ sở riêng biệt tại quận Nam Từ Liêm, Hà Nội. Các trường trong hệ thống đều được đầu tư bài bản về cơ sở vật chất, chương trình đào tạo hiện đại và đội ngũ giáo viên chất lượng cao. Hệ thống chú trọng phát triển toàn diện Đức — Trí — Thể — Mỹ, giúp học sinh phát huy tối đa năng lực cá nhân ở từng cấp học và sẵn sàng hội nhập quốc tế.',
  },
  {
    id: 'nhan-su',
    title: 'Nhân sự đặc sắc',
    icon: UserRound,
    description:
      'Đội ngũ giáo viên được tuyển chọn kỹ lưỡng, giàu kinh nghiệm và tâm huyết với nghề. Mỗi thầy cô không chỉ là người truyền đạt kiến thức mà còn là người bạn đồng hành cùng học sinh trên hành trình phát triển.',
  },
  {
    id: 'tien-phong',
    title: 'Tiên phong & Ảnh hưởng',
    icon: Trophy,
    description:
      'Trường luôn đi đầu trong việc áp dụng các phương pháp giáo dục tiên tiến, tạo ảnh hưởng tích cực đến cộng đồng giáo dục.',
  },
  {
    id: 'plc',
    title: 'Hợp tác toàn diện cùng PLC Sydney',
    icon: Globe,
    description:
      'Chương trình hợp tác toàn diện với PLC Sydney (Úc) mang đến cho học sinh cơ hội trải nghiệm giáo dục quốc tế ngay tại Việt Nam.',
  },
  {
    id: 'khuon-vien',
    title: 'Khuôn viên 6000m² tại tọa độ lý tưởng',
    icon: Building2,
    description:
      'Khuôn viên rộng 6000m² nằm tại vị trí đắc địa ở KĐT Mỹ Đình, được thiết kế hiện đại với đầy đủ tiện ích phục vụ học tập và hoạt động ngoại khóa.',
  },
];



export default async function HomePage() {
  const articles = await getLatestArticles();

  /* Tach bai dau tien lam featured, con lai lam grid */
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div>
      {/* ============================================ */}
      {/* HERO BANNER — carousel auto-next 3s          */}
      {/* ============================================ */}
      <HeroBanner />

      {/* ============================================ */}
      {/* TIN TUC — Moi cap nhat (V2 layout)          */}
      {/* Featured article + Event sidebar + grid      */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Tin tức
              </span>
              <div className="flex gap-0.5">
                <span className="w-5 h-1 bg-green-600 rounded-full" />
                <span className="w-5 h-1 bg-red-500 rounded-full" />
                <span className="w-5 h-1 bg-green-600 rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Mới cập nhật</h2>
          </div>
          <Link
            href="/tin-tuc/su-kien"
            className="text-sm text-gray-500 hover:text-green-700 transition-colors font-medium"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        {/* Row 1: Featured article (trai) + Event banner (phai) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
          {/* Featured article — 3 cot */}
          <div className="lg:col-span-3">
            {featuredArticle ? (
              <Link
                href={`/tin-tuc/${featuredArticle.slug}`}
                className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                  <div className="h-56 sm:h-full bg-gray-100 relative overflow-hidden">
                    {imageUrl(featuredArticle.thumbnail_url) ? (
                      <Image
                        src={imageUrl(featuredArticle.thumbnail_url)!}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center text-gray-400 text-sm">
                        Hình ảnh
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors leading-snug">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                      {featuredArticle.excerpt ||
                        featuredArticle.description ||
                        'Mô tả bài viết sẽ hiển thị ở đây...'}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              /* Placeholder khi chua co du lieu */
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                  <div className="h-56 sm:h-full bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
                    <div className="text-center p-6">
                      <p className="text-4xl mb-2">&#128240;</p>
                      <p className="text-sm font-bold text-green-800 uppercase">Thư ngỏ</p>
                      <p className="text-xs text-red-600 mt-1">
                        V/v đảm bảo an toàn thực phẩm tại Nhà trường
                      </p>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                      Thư ngỏ V/v Đảm bảo an toàn thực phẩm tại Nhà trường
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                      Trước sự quan tâm và lo lắng về an toàn thực phẩm thời gian gần đây, Thầy
                      Viết thay mặt Ban Lãnh đạo Nhà trường thông tin tới CMHS về nguồn thực phẩm
                      và công tác kiểm soát chất lượng thực...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Event banner — 2 cot — nen xanh */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl overflow-hidden h-full text-white relative">
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-6xl font-black text-white/20">20</div>
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-between h-full relative z-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-200 mb-3">
                    Chào đón 20 năm thành lập
                  </p>
                  <h3 className="text-lg lg:text-xl font-bold mb-3 leading-snug">
                    Hệ thống Trường liên cấp Lê Quý Đôn
                  </h3>
                  <div className="w-full h-40 lg:h-48 rounded-lg bg-white/10 flex items-center justify-center mb-4 overflow-hidden relative">
                    <div className="text-center">
                      <p className="text-5xl font-black text-white/30 mb-1">20</p>
                      <p className="text-sm font-bold text-yellow-300 uppercase tracking-wider">
                        From Building
                      </p>
                      <p className="text-sm font-bold text-yellow-300 uppercase tracking-wider">
                        to Blooming
                      </p>
                      <p className="text-[10px] text-white/60 mt-2 italic">
                        Dựng xây ngàn hoa
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/70 mb-1">
                    &#128197; 04/08/2025 08:00 &nbsp;&bull;&nbsp; Trường Tiểu học Lê Quý Đôn
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Chào đón Kỷ niệm 20 năm thành lập Hệ thống Trường Liên cấp Lê Quý Đôn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Grid 3 bai viet + dots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(gridArticles.length > 0
            ? gridArticles.slice(0, 3)
            : [
                {
                  slug: 'truong-th-le-quy-don-kiem-chung-nguon-thit',
                  title: 'Trường TH Lê Quý Đôn chủ động kiểm chứng nguồn thịt...',
                  excerpt:
                    'BGH và đại diện Phụ huynh Trường Tiểu học Lê Quý Đôn làm việc, kiểm chứng với nhà cung',
                  thumbnail_url: null,
                  published_at: '2026-03-20',
                  category: { name: 'Tin tức' },
                },
                {
                  slug: 'le-ket-nap-doi-khoi-3',
                  title: 'Lễ kết nạp Đội Khối 3: Dấu mốc đáng nhớ của học sinh L...',
                  excerpt:
                    'Học sinh Khối 3 Trường Lê Quý Đôn tham gia lễ kết nạp Đội tại Quảng trường Ba Đình, chính',
                  thumbnail_url: null,
                  published_at: '2026-03-15',
                  category: { name: 'Sự kiện' },
                },
                {
                  slug: 'thanh-tich-thang-3-doners',
                  title: 'Thành Tích Tháng 3 | Doners Xuất Sắc Giành 1.536 Giải Cá...',
                  excerpt:
                    'Tháng 3/2026, Doners đã ghi dấu ấn nổi bật với tổng cộng 1.536 giải thưởng cấp Thành phố',
                  thumbnail_url: null,
                  published_at: '2026-03-10',
                  category: { name: 'Thành tích' },
                },
              ]
          ).map((item: any, i: number) => {
            const title = item.title || `Tiêu đề bài viết ${i + 1}`;
            const desc = item.excerpt || item.description || '';
            const date = new Date(
              item.published_at || item.created_at || Date.now(),
            ).toLocaleDateString('vi-VN');
            const category = item.category?.name || 'Tin tức';
            const slug = item.slug || `bai-viet-${i}`;
            const cover = imageUrl(item.thumbnail_url);

            return (
              <Link
                key={slug}
                href={`/tin-tuc/${slug}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group block"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                      Hình ảnh
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{desc}</p>
                  <p className="text-[11px] text-gray-400">
                    {date} &nbsp;&bull;&nbsp; {category}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="w-3 h-3 rounded-full bg-gray-800" />
          <span className="w-3 h-3 rounded-full bg-gray-300" />
        </div>
      </section>

      {/* ============================================ */}
      {/* CHI CO TAI — Le Quy Don (V2: outline icons) */}
      {/* ============================================ */}
      <section className="bg-[#1a6b30] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Trai: title + feature cards */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm opacity-80 uppercase tracking-wide">Chỉ có tại</span>
                  <div className="flex gap-0.5">
                    <span className="w-4 h-1 bg-green-300 rounded-full" />
                    <span className="w-4 h-1 bg-red-400 rounded-full" />
                  </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold">Trường Tiểu học Lê Quý Đôn</h2>
              </div>

              {/* Feature cards — 2 cot, icon outline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.id}
                      className="bg-white rounded-xl p-5 flex flex-col gap-3 hover:shadow-lg transition-all cursor-pointer group border border-white/20"
                    >
                      <p className="text-sm font-bold text-gray-800 uppercase leading-snug">
                        {f.title}
                      </p>
                      <Icon className="w-8 h-8 text-green-700 stroke-[1.5]" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phai: mo ta chi tiet + nut do */}
            <div className="flex flex-col justify-center">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <GraduationCap className="w-8 h-8 text-white stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{features[0].title}</h3>
              <p className="text-sm opacity-90 leading-relaxed mb-6">{features[0].description}</p>
              <div>
                <Link
                  href="/tong-quan/tam-nhin-su-menh"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-lg"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>

          {/* Ngoi truong decorative icon */}
          <div className="flex justify-center mt-10">
            <svg
              className="w-20 h-20 text-white/15"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <rect x="35" y="20" width="30" height="8" rx="1" />
              <rect x="42" y="12" width="16" height="10" rx="1" />
              <rect x="30" y="28" width="40" height="35" rx="1" />
              <rect x="10" y="45" width="20" height="18" rx="1" />
              <rect x="70" y="45" width="20" height="18" rx="1" />
              <rect x="44" y="40" width="12" height="23" rx="1" fillOpacity="0.5" />
              <rect x="5" y="63" width="90" height="5" rx="1" />
            </svg>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* YEAR BANNER + TESTIMONIAL (V2 style)        */}
      {/* ============================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        {/* Trai: year banner + anh gia dinh */}
        <div className="bg-gradient-to-br from-[#c8a97e] to-[#b8956a] py-10 lg:py-16 px-6 lg:px-10 flex items-center justify-center relative overflow-hidden">
          <div className="text-center relative z-10">
            <p className="text-6xl lg:text-8xl xl:text-9xl font-black text-white/25 tracking-tighter leading-none">
              2025-2026
            </p>
            {/* Anh gia dinh */}
            <div className="mt-6 w-72 h-56 mx-auto bg-white/15 rounded-2xl flex items-center justify-center text-white/40 text-sm overflow-hidden relative">
              <div className="text-center">
                <p className="text-3xl mb-2">&#128106;</p>
                <p className="text-xs">Ảnh gia đình học sinh</p>
              </div>
            </div>
          </div>
          {/* Emblem goc trai tren */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-700/80 flex items-center justify-center">
              <span className="text-white font-bold text-[7px]">LQD</span>
            </div>
          </div>
        </div>

        {/* Phai: testimonial carousel auto-next */}
        <TestimonialCarousel />
      </section>
    </div>
  );
}
