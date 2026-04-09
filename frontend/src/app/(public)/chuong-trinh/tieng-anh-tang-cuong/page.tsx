import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { GraduationCap, Globe, Mic, Award } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tiếng Anh tăng cường',
  description:
    'Chương trình Tiếng Anh tăng cường với giáo viên bản ngữ từ Anh, Úc, Mỹ tại Trường Tiểu học Lê Quý Đôn. Phát triển 4 kỹ năng nghe - nói - đọc - viết.',
  path: '/chuong-trinh/tieng-anh-tang-cuong',
});

const allPrograms = [
  { title: 'Giáo dục Quốc gia nâng cao', href: '/chuong-trinh/quoc-gia-nang-cao' },
  { title: 'Giáo dục tiếng Anh tăng cường', href: '/chuong-trinh/tieng-anh-tang-cuong' },
  { title: 'Giáo dục Thể chất & Nghệ thuật', href: '/chuong-trinh/the-chat-nghe-thuat' },
  { title: 'Chương trình phát triển kỹ năng sống', href: '/chuong-trinh/ky-nang-song' },
];

const currentProgram = '/chuong-trinh/tieng-anh-tang-cuong';
const otherPrograms = allPrograms.filter((p) => p.href !== currentProgram);

const levels = [
  { grade: 'Lớp 1-2', level: 'Starters', hours: '6 tiết/tuần', goal: 'Làm quen, nghe-nói cơ bản' },
  { grade: 'Lớp 3', level: 'Movers', hours: '8 tiết/tuần', goal: 'Đọc-viết, giao tiếp đơn giản' },
  { grade: 'Lớp 4', level: 'Movers+', hours: '8 tiết/tuần', goal: 'Tự tin giao tiếp, đọc hiểu' },
  { grade: 'Lớp 5', level: 'Flyers', hours: '10 tiết/tuần', goal: 'Thuyết trình, viết luận ngắn' },
];

export default function TiengAnhTangCuongPage() {
  return (
    <div>
      {/* Hero banner */}
      <section className="relative h-72 lg:h-96 bg-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-sm">
          Ảnh lớp học tiếng Anh
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div>
            <p className="text-white/80 text-sm tracking-widest uppercase mb-2">Chương trình Giáo dục</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Giáo dục tiếng Anh tăng cường</h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb
          items={[
            { label: 'Chương trình Giáo dục', href: '/chuong-trinh/quoc-gia-nang-cao' },
            { label: 'Tiếng Anh tăng cường' },
          ]}
        />
      </div>

      {/* Section title + content */}
      <section className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">Chương trình Giáo dục</p>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">Giáo dục tiếng Anh tăng cường</h2>

        {/* Intro */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Chương trình Tiếng Anh tăng cường</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Chương trình Tiếng Anh tăng cường tại Lê Quý Đôn được thiết kế với mục tiêu giúp học sinh làm chủ
          tiếng Anh như ngôn ngữ thứ hai. Đội ngũ giáo viên bản ngữ đến từ Anh, Úc, Mỹ trực tiếp giảng dạy,
          kết hợp giáo trình quốc tế Cambridge và Oxford.
        </p>
        <p className="text-slate-600 leading-relaxed mb-8">
          Học sinh được chia nhóm nhỏ 15-18 em để tối ưu hóa tương tác và thực hành. Chương trình phát triển
          đồng đều 4 kỹ năng: Nghe - Nói - Đọc - Viết, chuẩn bị cho các kỳ thi chứng chỉ quốc tế Cambridge.
        </p>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-10">
          Hình ảnh giáo viên bản ngữ và học sinh
        </div>

        {/* Diem noi bat */}
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Điểm nổi bật chương trình</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: Globe, title: 'Giáo viên bản ngữ', desc: 'Đội ngũ giáo viên nước ngoài đến từ Anh, Úc, Mỹ trực tiếp giảng dạy.' },
            { icon: Mic, title: 'Giao tiếp thực tế', desc: '4 tiết/tuần luyện kỹ năng nghe-nói với giáo viên bản ngữ.' },
            { icon: Award, title: 'Chứng chỉ quốc tế', desc: 'Chuẩn bị cho Cambridge Starters, Movers, Flyers.' },
            { icon: Globe, title: 'E-Learning', desc: 'Nền tảng học trực tuyến hỗ trợ ôn luyện mọi lúc mọi nơi.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-3">
              <f.icon className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{f.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Blue accent — Lo trinh hoc */}
        <div className="bg-blue-700 text-white rounded-xl p-6 mb-10">
          <h3 className="text-lg font-bold mb-4">Lộ trình học theo khối lớp</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-500">
                  <th className="px-3 py-2 text-left font-medium text-blue-100">Khối</th>
                  <th className="px-3 py-2 text-left font-medium text-blue-100">Trình độ</th>
                  <th className="px-3 py-2 text-left font-medium text-blue-100">Số tiết</th>
                  <th className="px-3 py-2 text-left font-medium text-blue-100">Mục tiêu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-600">
                {levels.map((l) => (
                  <tr key={l.grade}>
                    <td className="px-3 py-2 font-medium">{l.grade}</td>
                    <td className="px-3 py-2 text-blue-200 font-medium">{l.level}</td>
                    <td className="px-3 py-2 text-blue-100">{l.hours}</td>
                    <td className="px-3 py-2 text-blue-100">{l.goal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-10">
          Hình ảnh hoạt động ngoại khóa tiếng Anh
        </div>

        {/* Phuong phap */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Phương pháp giảng dạy</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          Phương pháp Communicative Language Teaching (CLT) được áp dụng xuyên suốt, kết hợp với các hoạt
          động sáng tạo như kịch nghệ, hội thi hùng biện, và dự án nhóm bằng tiếng Anh.
        </p>
        <p className="text-slate-600 leading-relaxed mb-6">
          Học sinh được tiếp xúc với tiếng Anh trong môi trường tự nhiên, giúp phát triển khả năng sử dụng
          ngôn ngữ một cách tự tin và linh hoạt.
        </p>
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
