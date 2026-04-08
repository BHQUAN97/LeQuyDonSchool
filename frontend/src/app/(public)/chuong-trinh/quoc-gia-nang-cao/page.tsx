import PageBanner from '@/components/public/PageBanner';
import { BookOpen, Award, Users, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const highlights = [
  { icon: BookOpen, title: 'Chương trình chuẩn BGDĐT', desc: 'Tuân thủ 100% chương trình giáo dục phổ thông 2018 của Bộ Giáo dục & Đào tạo.' },
  { icon: TrendingUp, title: 'Nâng cao & Mở rộng', desc: 'Bổ sung nội dung nâng cao cho Toán, Tiếng Việt, Khoa học giúp học sinh phát triển tư duy.' },
  { icon: Users, title: 'Sĩ số nhỏ', desc: 'Tối đa 35 học sinh/lớp, đảm bảo giáo viên quan tâm từng em.' },
  { icon: Clock, title: '2 buổi/ngày', desc: 'Học 2 buổi/ngày với thời khóa biểu khoa học, xen kẽ học và vui chơi.' },
];

const subjects = [
  { name: 'Toán học', desc: 'Phát triển tư duy logic, giải quyết vấn đề' },
  { name: 'Tiếng Việt', desc: 'Kỹ năng đọc hiểu, viết sáng tạo' },
  { name: 'Khoa học tự nhiên', desc: 'Khám phá thế giới qua thí nghiệm thực hành' },
  { name: 'Lịch sử & Địa lý', desc: 'Hiểu biết về đất nước và thế giới' },
  { name: 'Đạo đức', desc: 'Hình thành nhân cách, giá trị sống' },
  { name: 'Tin học', desc: 'Làm quen công nghệ, tư duy lập trình' },
];

const achievements = [
  '95% học sinh đạt Hoàn thành tốt trở lên',
  '80+ giải thưởng cấp Quận/Thành phố mỗi năm',
  '100% học sinh lên lớp hàng năm',
  'Top 10 trường tiểu học tư thục tại Hà Nội',
];

export default function QuocGiaNangCaoPage() {
  return (
    <div>
      <PageBanner
        title="Giáo dục Quốc gia nâng cao"
        description="Chương trình giáo dục quốc gia được nâng cao và mở rộng theo chuẩn quốc tế"
        breadcrumbItems={[
          { label: 'Chương trình', href: '/chuong-trinh/quoc-gia-nang-cao' },
          { label: 'Quốc gia nâng cao' },
        ]}
      />

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((h) => (
            <div key={h.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                <h.icon className="w-5 h-5 text-green-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">{h.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subject list */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Các môn học chính</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <div key={s.name} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{s.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold mb-6">Thành tích nổi bật</h2>
              <ul className="space-y-3">
                {achievements.map((a) => (
                  <li key={a} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-72 h-52 bg-white/10 rounded-2xl flex items-center justify-center text-white/50 text-sm">
                Hình ảnh minh họa
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
