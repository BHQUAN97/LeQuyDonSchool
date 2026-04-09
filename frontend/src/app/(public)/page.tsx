import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildPageMetadata } from '@/lib/seo-helpers';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UserRound,
  Trophy,
  Globe,
  Building2,
} from 'lucide-react';

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

/* Testimonials */
const testimonials = [
  {
    name: 'Anh Hoàng Hữu Thắng',
    title:
      'Chủ tịch HĐQT Intech Group | Phó Chủ tịch CLB Đầu tư & Khởi nghiệp Việt Nam | PHHS khóa 2021 - 2026',
    content:
      'Tôi thấy vui và hạnh phúc mỗi khi con nói chuyện thể hiện sự đam mê, yêu thích ngôi trường. Mỗi lần đến Trường Tiểu học Lê Quý Đôn để đón con, tôi lại thấy sự vui tươi, hồn nhiên của các con. Tôi tin tưởng vào sự phát triển toàn diện mà nhà trường mang lại cho con trai mình. Điều quý giá nhất là con không chỉ giỏi kiến thức mà còn phát triển cả về kỹ năng sống và nhân cách. Trường thực sự là tổ ấm thứ hai cho các em, để mỗi sáng mẹ không phải mệt công tìm kiếm lý do để con yêu trường, đến trường.',
  },
  {
    name: 'Anh Nguyễn Thanh Bình',
    title:
      'Giám đốc Nhà máy Công ty TNHH Chế biến thực phẩm và bánh kẹo Phạm Nguyên | PHHS niên khoá 2011 - 2016, 2020 - 2025 và 2024 - 2029',
    content:
      'Là một người bố, tôi luôn cảm thấy vô cùng biết ơn khi nhìn thấy những bước đi vững chắc của các con mình trên con đường học vấn. Ba đứa con tôi đều học tại trường Tiểu học Lê Quý Đôn và nơi đây thực sự là một ngôi nhà thứ hai của các con. Tôi thực sự cảm nhận được sự trưởng thành của các con qua từng ngày và đó là điều khiến tôi tự hào nhất.',
  },
];

/* SVG trang tri hinh the thao cho section testimonial */
function SportDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Nguoi chay */}
      <svg className="absolute top-8 right-8 w-16 h-16 text-white/10" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="40" cy="8" r="5" />
        <path d="M28 20l8-4 6 8 10 2-2 4-12-2-6 6 4 14-4 2-6-14-8 4-2-4 8-8z" />
      </svg>
      {/* Nguoi nhay */}
      <svg className="absolute top-1/3 right-16 w-14 h-14 text-white/10" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="32" cy="8" r="5" />
        <path d="M24 18l8 2 8-2 4 6-8 4v10l6 8-4 2-6-8-6 8-4-2 6-8V28l-8-4z" />
      </svg>
      {/* Sach mo */}
      <svg className="absolute bottom-12 right-12 w-20 h-20 text-white/8" viewBox="0 0 64 64" fill="currentColor">
        <path d="M8 12l24 4 24-4v40l-24 4-24-4V12zm24 4v36m-20-34v32l20 3m20-35v32l-20 3" fillOpacity="0" stroke="currentColor" strokeWidth="2" />
      </svg>
      {/* Hoa van ngoi sao */}
      <svg className="absolute top-1/2 right-4 w-12 h-12 text-white/8" viewBox="0 0 64 64" fill="currentColor">
        <path d="M32 4l6 18h18l-14 10 6 18-16-12-16 12 6-18L8 22h18z" />
      </svg>
    </div>
  );
}

export default async function HomePage() {
  const articles = await getLatestArticles();

  /* Tach bai dau tien lam featured, con lai lam grid */
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div>
      {/* ============================================ */}
      {/* HERO BANNER — anh nen full + floating card  */}
      {/* Theo V2: background photo + overlay card    */}
      {/* ============================================ */}
      <section className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[520px] overflow-hidden">
        {/* Background image placeholder — thay bang anh that khi co */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/60 to-green-600/40 z-10" />
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center" />
        {/* Fallback gradient neu chua co anh */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-green-100 to-yellow-300 -z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Trai: text overlay tren nen */}
            <div className="text-white">
              <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
                Từ kỳ vọng đến tin yêu
                <br />
                <span className="text-yellow-300">Tiểu học Lê Quý Đôn</span>
                <br />
                qua lời Cha Mẹ
              </h1>
              <p className="text-base lg:text-lg opacity-90 mb-6 drop-shadow">
                Với Tiểu học Lê Quý Đôn, mỗi ngày đến trường là một hành trình khám phá, sáng tạo
                và trưởng thành đồng hành cùng con.
              </p>
              <Link
                href="/tong-quan/tam-nhin-su-menh"
                className="inline-flex items-center px-7 py-3.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg text-sm"
              >
                Xem chi tiết
              </Link>
            </div>

            {/* Phai: floating white card */}
            <div className="hidden lg:flex justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm transform rotate-1 hover:rotate-0 transition-transform">
                {/* Logo truong */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center border-2 border-yellow-500">
                    <span className="text-white font-bold text-[10px]">LQD</span>
                  </div>
                  <div>
                    <p className="text-[9px] text-green-700 font-semibold uppercase tracking-wide leading-tight">
                      Hệ thống Trường liên cấp Lê Quý Đôn
                    </p>
                    <p className="text-xs font-bold text-red-600 leading-tight">
                      Trường Tiểu học Lê Quý Đôn
                    </p>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-green-800 mb-1 leading-snug">
                  Từ kỳ vọng đến tin yêu
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Tiểu học Lê Quý Đôn qua lời Cha Mẹ
                </p>
                <div className="flex gap-1 text-2xl">
                  <span className="text-red-500">&#10084;</span>
                  <span className="text-yellow-500">&#10084;</span>
                  <span className="text-yellow-500">&#10084;</span>
                  <span className="text-blue-400">&#10084;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            <span className="w-3 h-3 rounded-full bg-white/40" />
            <span className="w-3 h-3 rounded-full bg-white/40" />
            <span className="w-3 h-3 rounded-full bg-white/40" />
            <span className="w-3 h-3 rounded-full bg-white" />
          </div>
        </div>
      </section>

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

        {/* Phai: testimonial nen do + trang tri the thao */}
        <div className="bg-[#c62828] text-white py-10 lg:py-16 px-6 lg:px-10 relative overflow-hidden">
          <SportDecorations />

          <div className="max-w-lg relative z-10">
            {/* Dau ngoac kep lon */}
            <div className="text-7xl text-white/20 font-serif leading-none mb-2">
              &#8220;
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm opacity-80 uppercase tracking-wide">Từ cộng đồng</span>
                <div className="flex gap-0.5">
                  <span className="w-4 h-1 bg-green-400 rounded-full" />
                  <span className="w-4 h-1 bg-red-300 rounded-full" />
                  <span className="w-4 h-1 bg-green-400 rounded-full" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Lê Quý Đôn</h2>
            </div>

            {/* Testimonial card — hien 1, co nav de chuyen */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {/* Avatar placeholder */}
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xs border-2 border-white/30 shrink-0">
                  Ảnh
                </div>
                <div>
                  <p className="font-bold text-base uppercase">{testimonials[0].name}</p>
                  <p className="text-[11px] opacity-70 leading-snug mt-0.5">
                    {testimonials[0].title}
                  </p>
                </div>
              </div>
              <p className="text-sm opacity-90 leading-relaxed italic">
                {testimonials[0].content}
              </p>
            </div>

            {/* Navigation arrows + dots */}
            <div className="flex items-center gap-4">
              <button type="button" aria-label="Testimonial trước" className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button type="button" aria-label="Testimonial tiếp" className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex gap-2 ml-2">
                <span className="w-3 h-3 rounded-full bg-white" />
                <span className="w-3 h-3 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
