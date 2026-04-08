import PageBanner from '@/components/public/PageBanner';
import { Globe, BookOpen, Mic, Award, Users, Video } from 'lucide-react';

const features = [
  { icon: Globe, title: 'Giáo viên bản ngữ', desc: 'Đội ngũ giáo viên nước ngoài đến từ Anh, Úc, Mỹ trực tiếp giảng dạy.' },
  { icon: BookOpen, title: 'Giáo trình quốc tế', desc: 'Sử dụng giáo trình Cambridge, Oxford kết hợp tài liệu tự biên soạn.' },
  { icon: Mic, title: 'Giao tiếp thực tế', desc: '4 tiết/tuần luyện kỹ năng nghe-nói với giáo viên bản ngữ.' },
  { icon: Video, title: 'E-Learning', desc: 'Nền tảng học trực tuyến hỗ trợ ôn luyện mọi lúc mọi nơi.' },
  { icon: Award, title: 'Chứng chỉ quốc tế', desc: 'Chuẩn bị cho các kỳ thi Cambridge Starters, Movers, Flyers.' },
  { icon: Users, title: 'Lớp nhỏ', desc: 'Chia nhóm 15-18 học sinh để tối ưu hóa tương tác và thực hành.' },
];

const levels = [
  { grade: 'Lớp 1-2', level: 'Starters', hours: '6 tiết/tuần', goal: 'Làm quen, nghe-nói cơ bản' },
  { grade: 'Lớp 3', level: 'Movers', hours: '8 tiết/tuần', goal: 'Đọc-viết, giao tiếp đơn giản' },
  { grade: 'Lớp 4', level: 'Movers+', hours: '8 tiết/tuần', goal: 'Tự tin giao tiếp, đọc hiểu' },
  { grade: 'Lớp 5', level: 'Flyers', hours: '10 tiết/tuần', goal: 'Thuyết trình, viết luận ngắn' },
];

export default function TiengAnhTangCuongPage() {
  return (
    <div>
      <PageBanner
        title="Giáo dục Tiếng Anh tăng cường"
        description="Chương trình Tiếng Anh tăng cường với giáo viên bản ngữ và giáo trình quốc tế"
        breadcrumbItems={[
          { label: 'Chương trình', href: '/chuong-trinh/quoc-gia-nang-cao' },
          { label: 'Tiếng Anh tăng cường' },
        ]}
        bgClass="bg-gradient-to-r from-blue-700 to-blue-600"
      />

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Điểm nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels table */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Lộ trình học theo khối lớp</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
              <thead>
                <tr className="bg-blue-700 text-white text-sm">
                  <th className="px-4 py-3 text-left font-medium">Khối</th>
                  <th className="px-4 py-3 text-left font-medium">Trình độ</th>
                  <th className="px-4 py-3 text-left font-medium">Số tiết</th>
                  <th className="px-4 py-3 text-left font-medium">Mục tiêu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {levels.map((l) => (
                  <tr key={l.grade} className="text-sm hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{l.grade}</td>
                    <td className="px-4 py-3 text-blue-700 font-medium">{l.level}</td>
                    <td className="px-4 py-3 text-slate-600">{l.hours}</td>
                    <td className="px-4 py-3 text-slate-600">{l.goal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-xl lg:text-2xl font-bold mb-3">Đăng ký tìm hiểu chương trình</h2>
          <p className="text-sm opacity-90 mb-6 max-w-xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn chi tiết về chương trình Tiếng Anh tăng cường
          </p>
          <a
            href="/lien-he"
            className="inline-flex px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            Liên hệ tư vấn
          </a>
        </div>
      </section>
    </div>
  );
}
