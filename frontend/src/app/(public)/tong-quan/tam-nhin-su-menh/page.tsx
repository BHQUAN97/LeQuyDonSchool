import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { Eye, Target, Heart, Star, Users, BookOpen } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tầm nhìn & Sứ mệnh',
  description:
    'Tầm nhìn và sứ mệnh của Trường Tiểu học Lê Quý Đôn - Phát triển toàn diện trí tuệ, thể chất, tinh thần và nhân cách cho mỗi học sinh.',
  path: '/tong-quan/tam-nhin-su-menh',
});

const tongQuanPages = [
  { title: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
  { title: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
  { title: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
  { title: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
  { title: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
];

const currentPage = '/tong-quan/tam-nhin-su-menh';

const visionItems = [
  {
    icon: Eye,
    title: 'Tầm nhìn',
    content:
      'Trở thành hệ thống giáo dục hàng đầu Việt Nam, nơi mỗi học sinh được phát triển toàn diện về trí tuệ, thể chất, tinh thần và nhân cách, sẵn sàng hội nhập quốc tế.',
  },
  {
    icon: Target,
    title: 'Sứ mệnh',
    content:
      'Cung cấp môi trường giáo dục chất lượng cao, kết hợp chương trình quốc gia với phương pháp giáo dục hiện đại, giúp học sinh phát huy tối đa tiềm năng cá nhân.',
  },
  {
    icon: Heart,
    title: 'Giá trị cốt lõi',
    content:
      'Yêu thương - Trách nhiệm - Sáng tạo - Hội nhập. Bốn giá trị cốt lõi định hướng mọi hoạt động giáo dục tại Lê Quý Đôn.',
  },
];

const coreValues = [
  { icon: Star, title: 'Chất lượng', desc: 'Không ngừng nâng cao chất lượng giảng dạy và học tập' },
  { icon: Users, title: 'Cộng đồng', desc: 'Xây dựng cộng đồng giáo dục gắn kết và hỗ trợ' },
  { icon: BookOpen, title: 'Đổi mới', desc: 'Tiên phong trong áp dụng phương pháp giáo dục hiện đại' },
  { icon: Heart, title: 'Nhân văn', desc: 'Lấy học sinh làm trung tâm, tôn trọng cá tính' },
];

export default function TamNhinSuMenhPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
            { label: 'Tầm nhìn & Sứ mệnh' },
          ]} />
        </div>
      </div>

      {/* Section title */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">TỔNG QUAN</span>
            <div className="flex gap-0.5">
              <span className="w-6 h-1 bg-green-700 rounded-full" />
              <span className="w-6 h-1 bg-red-600 rounded-full" />
              <span className="w-6 h-1 bg-green-700 rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Tầm nhìn & Sứ mệnh</h1>
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Tam nhin section */}
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">Tầm Nhìn</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Trở thành hệ thống giáo dục hàng đầu Việt Nam, nơi mỗi học sinh được phát triển toàn diện về trí tuệ, thể chất, tinh thần và nhân cách, sẵn sàng hội nhập quốc tế.
              </p>
              {/* Image placeholder — toan canh truong */}
              <div className="bg-green-50 rounded-xl h-64 lg:h-80 flex items-center justify-center text-green-600 text-sm">
                Hình ảnh toàn cảnh khuôn viên trường
              </div>
            </div>

            {/* Su menh section */}
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">Sứ Mệnh</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Cung cấp môi trường giáo dục chất lượng cao, kết hợp chương trình quốc gia với phương pháp giáo dục hiện đại, giúp học sinh phát huy tối đa tiềm năng cá nhân.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl h-48 flex items-center justify-center text-green-600 text-sm">
                  Hình ảnh hoạt động giảng dạy
                </div>
                <div className="bg-green-50 rounded-xl h-48 flex items-center justify-center text-green-600 text-sm">
                  Hình ảnh học sinh học tập
                </div>
              </div>
            </div>

            {/* Gia tri cot loi */}
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">Giá trị cốt lõi</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Yêu thương - Trách nhiệm - Sáng tạo - Hội nhập. Bốn giá trị cốt lõi định hướng mọi hoạt động giáo dục tại Lê Quý Đôn.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coreValues.map((v) => (
                  <div key={v.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                      <v.icon className="w-5 h-5 text-green-700" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="bg-green-800 text-white rounded-xl p-8 text-center">
              <p className="text-xl lg:text-2xl font-bold italic max-w-2xl mx-auto leading-relaxed">
                &ldquo;Mỗi học sinh là một cá thể đặc biệt, xứng đáng được yêu thương và phát triển toàn diện&rdquo;
              </p>
              <p className="text-sm opacity-80 mt-4">— Triết lý giáo dục Lê Quý Đôn</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Tổng quan</h3>
              <nav className="space-y-1">
                {tongQuanPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      page.href === currentPage
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {page.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
