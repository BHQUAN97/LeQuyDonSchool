import { Metadata } from 'next';
import PageBanner from '@/components/public/PageBanner';
import { Eye, Target, Heart, Star, Users, BookOpen } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tầm nhìn & Sứ mệnh',
  description:
    'Tầm nhìn và sứ mệnh của Trường Tiểu học Lê Quý Đôn - Phát triển toàn diện trí tuệ, thể chất, tinh thần và nhân cách cho mỗi học sinh.',
  path: '/tong-quan/tam-nhin-su-menh',
});

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
      <PageBanner
        title="Tầm nhìn & Sứ mệnh"
        description="Định hướng phát triển của Hệ thống Giáo dục Lê Quý Đôn"
        breadcrumbItems={[
          { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
          { label: 'Tầm nhìn & Sứ mệnh' },
        ]}
      />

      {/* Vision & Mission cards */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visionItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 text-center">
          <p className="text-2xl lg:text-3xl font-bold italic max-w-3xl mx-auto leading-relaxed">
            &ldquo;Mỗi học sinh là một cá thể đặc biệt, xứng đáng được yêu thương và phát triển toàn diện&rdquo;
          </p>
          <p className="text-sm opacity-80 mt-4">— Triết lý giáo dục Lê Quý Đôn</p>
        </div>
      </section>

      {/* Core values grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8 text-center">
          Giá trị cốt lõi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreValues.map((v) => (
            <div key={v.title} className="text-center p-6">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
