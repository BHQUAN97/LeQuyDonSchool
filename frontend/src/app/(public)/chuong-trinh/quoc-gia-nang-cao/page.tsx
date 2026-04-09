import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { GraduationCap, BookOpen, CheckCircle } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Giáo dục Quốc gia nâng cao',
  description:
    'Chương trình giáo dục Quốc gia nâng cao tại Trường Tiểu học Lê Quý Đôn - Tuân thủ 100% chương trình GDPT 2018, bổ sung kiến thức chuyên sâu.',
  path: '/chuong-trinh/quoc-gia-nang-cao',
});

const allPrograms = [
  { title: 'Giáo dục Quốc gia nâng cao', href: '/chuong-trinh/quoc-gia-nang-cao' },
  { title: 'Giáo dục tiếng Anh tăng cường', href: '/chuong-trinh/tieng-anh-tang-cuong' },
  { title: 'Giáo dục Thể chất & Nghệ thuật', href: '/chuong-trinh/the-chat-nghe-thuat' },
  { title: 'Chương trình phát triển kỹ năng sống', href: '/chuong-trinh/ky-nang-song' },
];

const currentProgram = '/chuong-trinh/quoc-gia-nang-cao';
const otherPrograms = allPrograms.filter((p) => p.href !== currentProgram);

export default function QuocGiaNangCaoPage() {
  return (
    <div>
      {/* Hero banner */}
      <section className="relative h-72 lg:h-96 bg-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-sm">
          Ảnh hoạt động giáo dục
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div>
            <p className="text-white/80 text-sm tracking-widest uppercase mb-2">Chương trình Giáo dục</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Giáo dục Quốc gia nâng cao</h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb
          items={[
            { label: 'Chương trình Giáo dục', href: '/chuong-trinh/quoc-gia-nang-cao' },
            { label: 'Giáo dục Quốc gia nâng cao' },
          ]}
        />
      </div>

      {/* Section title + content */}
      <section className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">Chương trình Giáo dục</p>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">Giáo dục Quốc gia nâng cao</h2>

        {/* Intro */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Chương trình chuẩn Quốc gia nâng cao</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Chương trình Giáo dục Quốc gia nâng cao tại Lê Quý Đôn tuân thủ 100% khung chương trình Giáo dục
          Phổ thông 2018 của Bộ Giáo dục & Đào tạo, đồng thời bổ sung các nội dung nâng cao và mở rộng giúp
          học sinh phát triển toàn diện tư duy, kỹ năng và kiến thức.
        </p>
        <p className="text-slate-600 leading-relaxed mb-8">
          Với sĩ số lớp tối đa 35 học sinh, giáo viên có thể quan tâm sát sao đến từng em, đảm bảo chất
          lượng dạy và học. Thời khóa biểu 2 buổi/ngày được thiết kế khoa học, xen kẽ giữa các tiết học
          chính khóa và hoạt động vui chơi, khám phá.
        </p>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-10">
          Hình ảnh lớp học
        </div>

        {/* Cac mon hoc chinh */}
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Các môn học chính</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Chương trình bao gồm đầy đủ các môn học theo quy định, với nội dung được nâng cao phù hợp năng lực
          học sinh:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[
            { name: 'Toán học', desc: 'Phát triển tư duy logic, giải quyết vấn đề' },
            { name: 'Tiếng Việt', desc: 'Kỹ năng đọc hiểu, viết sáng tạo' },
            { name: 'Khoa học tự nhiên', desc: 'Khám phá thế giới qua thí nghiệm thực hành' },
            { name: 'Lịch sử & Địa lý', desc: 'Hiểu biết về đất nước và thế giới' },
            { name: 'Đạo đức', desc: 'Hình thành nhân cách, giá trị sống' },
            { name: 'Tin học', desc: 'Làm quen công nghệ, tư duy lập trình' },
          ].map((s) => (
            <div key={s.name} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{s.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-10">
          Hình ảnh hoạt động ngoại khóa
        </div>

        {/* Blue accent section — thanh tich */}
        <div className="bg-blue-700 text-white rounded-xl p-6 mb-10">
          <h3 className="text-lg font-bold mb-4">Thành tích nổi bật</h3>
          <ul className="space-y-3">
            {[
              '95% học sinh đạt Hoàn thành tốt trở lên',
              '80+ giải thưởng cấp Quận/Thành phố mỗi năm',
              '100% học sinh lên lớp hàng năm',
              'Top 10 trường tiểu học tư thục tại Hà Nội',
            ].map((a) => (
              <li key={a} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-200 flex-shrink-0" />
                <span className="text-sm">{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nang cao & Mo rong */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Nâng cao & Mở rộng</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          Bên cạnh chương trình chuẩn, nhà trường bổ sung thêm các nội dung nâng cao cho Toán, Tiếng Việt và
          Khoa học, giúp học sinh có nền tảng vững chắc, sẵn sàng cho các kỳ thi và cấp học tiếp theo.
        </p>
        <p className="text-slate-600 leading-relaxed mb-6">
          Phương pháp dạy học tích cực, lấy học sinh làm trung tâm, khuyến khích tư duy phản biện, sáng tạo
          và hợp tác nhóm.
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
