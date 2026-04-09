import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { GraduationCap, Shield, MessageCircle, Brain, Lightbulb, Leaf, HandHeart } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Kỹ năng sống',
  description:
    'Chương trình Kỹ năng sống tại Trường Tiểu học Lê Quý Đôn - Rèn luyện tự tin, giao tiếp, tư duy sáng tạo và kỹ năng xã hội cho học sinh.',
  path: '/chuong-trinh/ky-nang-song',
});

const allPrograms = [
  { title: 'Giáo dục Quốc gia nâng cao', href: '/chuong-trinh/quoc-gia-nang-cao' },
  { title: 'Giáo dục tiếng Anh tăng cường', href: '/chuong-trinh/tieng-anh-tang-cuong' },
  { title: 'Giáo dục Thể chất & Nghệ thuật', href: '/chuong-trinh/the-chat-nghe-thuat' },
  { title: 'Chương trình phát triển kỹ năng sống', href: '/chuong-trinh/ky-nang-song' },
];

const currentProgram = '/chuong-trinh/ky-nang-song';
const otherPrograms = allPrograms.filter((p) => p.href !== currentProgram);

const skills = [
  { icon: MessageCircle, title: 'Kỹ năng giao tiếp', desc: 'Thuyết trình, làm việc nhóm, lắng nghe tích cực và giải quyết xung đột.' },
  { icon: Brain, title: 'Tư duy phản biện', desc: 'Phân tích, đánh giá và đưa ra quyết định sáng suốt.' },
  { icon: Shield, title: 'Kỹ năng an toàn', desc: 'Phòng chống tai nạn, xử lý tình huống khẩn cấp, an toàn giao thông.' },
  { icon: HandHeart, title: 'Kỹ năng cảm xúc', desc: 'Nhận biết và quản lý cảm xúc, xây dựng sự đồng cảm.' },
  { icon: Lightbulb, title: 'Sáng tạo & Khởi nghiệp', desc: 'Tinh thần sáng tạo, tư duy khởi nghiệp qua dự án nhỏ.' },
  { icon: Leaf, title: 'Ý thức môi trường', desc: 'Bảo vệ môi trường, phân loại rác, sống xanh bền vững.' },
];

export default function KyNangSongPage() {
  return (
    <div>
      {/* Hero banner */}
      <section className="relative h-72 lg:h-96 bg-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-sm">
          Ảnh hoạt động kỹ năng sống
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div>
            <p className="text-white/80 text-sm tracking-widest uppercase mb-2">Chương trình Giáo dục</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Chương trình phát triển kỹ năng sống</h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb
          items={[
            { label: 'Chương trình Giáo dục', href: '/chuong-trinh/quoc-gia-nang-cao' },
            { label: 'Kỹ năng sống' },
          ]}
        />
      </div>

      {/* Section title + content */}
      <section className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">Chương trình Giáo dục</p>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">Phát triển kỹ năng sống</h2>

        {/* Intro */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Trang bị hành trang cuộc sống</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Chương trình phát triển kỹ năng sống tại Lê Quý Đôn giúp học sinh hình thành những kỹ năng thiết
          yếu cho cuộc sống: giao tiếp, tư duy phản biện, quản lý cảm xúc, làm việc nhóm và ý thức trách
          nhiệm với cộng đồng.
        </p>
        <p className="text-slate-600 leading-relaxed mb-8">
          Thông qua các hoạt động trải nghiệm thực tế, tình huống giả lập và dự án nhóm, học sinh được rèn
          luyện sự tự tin, bản lĩnh và khả năng thích ứng với mọi hoàn cảnh.
        </p>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-10">
          Hình ảnh hoạt động kỹ năng sống
        </div>

        {/* Cac nhom ky nang */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Các nhóm kỹ năng</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {skills.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-3 hover:shadow-md transition-shadow">
              <s.icon className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{s.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Blue accent — phuong phap giang day */}
        <div className="bg-blue-700 text-white rounded-xl p-6 mb-10">
          <h3 className="text-lg font-bold mb-4">Phương pháp giảng dạy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Trải nghiệm', desc: 'Tham gia hoạt động thực tế, tình huống giả lập.' },
              { step: '02', title: 'Phản hồi', desc: 'Chia sẻ cảm nhận, thảo luận nhóm về bài học rút ra.' },
              { step: '03', title: 'Ứng dụng', desc: 'Áp dụng kỹ năng vào cuộc sống, đánh giá tiến bộ.' },
            ].map((s) => (
              <div key={s.step}>
                <span className="text-2xl font-bold text-blue-300">{s.step}</span>
                <h4 className="font-semibold mt-2 mb-1">{s.title}</h4>
                <p className="text-sm text-blue-100">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-10">
          Hình ảnh trại hè kỹ năng sống
        </div>

        {/* Hoat dong tieu bieu */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Hoạt động tiêu biểu</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            'Trại hè kỹ năng sống hàng năm',
            'Tham quan thực tế tại nông trại, nhà máy',
            'Chương trình "Em tập làm người lớn"',
            'Hoạt động tình nguyện cộng đồng',
            'Workshop với chuyên gia tâm lý',
            'Cuộc thi "Nhà lãnh đạo nhí"',
          ].map((a) => (
            <div key={a} className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-3">
              <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0" />
              <span className="text-sm text-slate-700">{a}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Chuong trinh khac */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Chương trình khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherPrograms.map((p) => (
              <Link key={p.href} href={p.href} className="group block">
                <div className="relative h-48 bg-slate-200 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-sm">
                    Ảnh chương trình
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm group-hover:underline">{p.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
