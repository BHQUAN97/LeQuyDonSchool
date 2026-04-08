import PageBanner from '@/components/public/PageBanner';
import { Home, Heart, Users, Calendar, Star, Gift } from 'lucide-react';

const activities = [
  {
    icon: Home,
    title: 'Tham quan trường',
    desc: 'Các bé và phụ huynh được tham quan toàn bộ cơ sở vật chất, phòng học, sân chơi.',
  },
  {
    icon: Users,
    title: 'Gặp gỡ giáo viên',
    desc: 'Phụ huynh được giao lưu trực tiếp với đội ngũ giáo viên chủ nhiệm và giáo viên bộ môn.',
  },
  {
    icon: Star,
    title: 'Trải nghiệm lớp học',
    desc: 'Các bé được tham gia một tiết học mẫu, trải nghiệm không khí học tập thực tế.',
  },
  {
    icon: Gift,
    title: 'Hoạt động vui chơi',
    desc: 'Tổ chức các trò chơi sáng tạo, hoạt động nhóm giúp các bé tự tin và hào hứng.',
  },
  {
    icon: Heart,
    title: 'Tư vấn tuyển sinh',
    desc: 'Đội ngũ tư vấn giải đáp mọi thắc mắc về chương trình, học phí, chính sách.',
  },
  {
    icon: Calendar,
    title: 'Đăng ký ưu đãi',
    desc: 'Phụ huynh đăng ký trong ngày hội được hưởng ưu đãi học phí đặc biệt.',
  },
];

const upcomingEvents = [
  { date: '20/04/2026', time: '8:00 - 11:30', title: 'Ngày hội "Ngôi nhà mơ ước" lần 1', slots: '50 gia đình' },
  { date: '18/05/2026', time: '8:00 - 11:30', title: 'Ngày hội "Ngôi nhà mơ ước" lần 2', slots: '50 gia đình' },
  { date: '15/06/2026', time: '8:00 - 11:30', title: 'Ngày hội "Ngôi nhà mơ ước" lần 3', slots: '50 gia đình' },
];

export default function CLBNgoiNhaMoUocPage() {
  return (
    <div>
      <PageBanner
        title="CLB Ngôi nhà mơ ước"
        description="Chương trình trải nghiệm dành cho phụ huynh và các bé chuẩn bị vào lớp 1"
        breadcrumbItems={[
          { label: 'Tuyển sinh', href: '/tuyen-sinh/thong-tin' },
          { label: 'CLB Ngôi nhà mơ ước' },
        ]}
        bgClass="bg-gradient-to-r from-pink-600 to-rose-500"
      />

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">
            Hãy đến và cảm nhận!
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            CLB &ldquo;Ngôi nhà mơ ước&rdquo; là chương trình đặc biệt giúp phụ huynh và các bé
            trải nghiệm thực tế môi trường học tập tại Trường Tiểu học Lê Quý Đôn
            trước khi đưa ra quyết định. Tham gia miễn phí, đăng ký trước để đảm bảo chỗ.
          </p>
        </div>

        {/* Activities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((a) => (
            <div key={a.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center mb-3">
                <a.icon className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">{a.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Lịch tổ chức sắp tới</h2>
          <div className="space-y-4">
            {upcomingEvents.map((e, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-600 text-white rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold leading-none">{e.date.split('/')[0]}</span>
                    <span className="text-[10px] opacity-80">{`Th${e.date.split('/')[1]}`}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{e.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {e.time} • Còn {e.slots}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors self-start sm:self-center">
                  Đăng ký
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Hình ảnh các kỳ trước</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {['Tham quan sân trường', 'Lớp học trải nghiệm', 'Hoạt động nhóm', 'Trao quà'].map((label) => (
            <div key={label} className="h-36 lg:h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
              {label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
