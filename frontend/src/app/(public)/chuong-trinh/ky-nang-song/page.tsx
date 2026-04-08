import PageBanner from '@/components/public/PageBanner';
import { Shield, MessageCircle, Lightbulb, HandHeart, Brain, Leaf } from 'lucide-react';

const skills = [
  {
    icon: MessageCircle,
    title: 'Kỹ năng giao tiếp',
    desc: 'Luyện tập thuyết trình, làm việc nhóm, lắng nghe tích cực và giải quyết xung đột.',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: Brain,
    title: 'Tư duy phản biện',
    desc: 'Phát triển khả năng phân tích, đánh giá và đưa ra quyết định sáng suốt.',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    icon: Shield,
    title: 'Kỹ năng an toàn',
    desc: 'Phòng chống tai nạn, xử lý tình huống khẩn cấp, an toàn giao thông.',
    color: 'bg-red-50 text-red-700',
  },
  {
    icon: HandHeart,
    title: 'Kỹ năng cảm xúc',
    desc: 'Nhận biết và quản lý cảm xúc, xây dựng sự đồng cảm và lòng tốt.',
    color: 'bg-pink-50 text-pink-700',
  },
  {
    icon: Lightbulb,
    title: 'Sáng tạo & Khởi nghiệp',
    desc: 'Khơi gợi tinh thần sáng tạo, tư duy khởi nghiệp qua các dự án nhỏ.',
    color: 'bg-yellow-50 text-yellow-700',
  },
  {
    icon: Leaf,
    title: 'Ý thức môi trường',
    desc: 'Giáo dục bảo vệ môi trường, phân loại rác, sống xanh bền vững.',
    color: 'bg-green-50 text-green-700',
  },
];

const activities = [
  'Trại hè kỹ năng sống hàng năm',
  'Tham quan thực tế tại nông trại, nhà máy',
  'Chương trình "Em tập làm người lớn"',
  'Hoạt động tình nguyện cộng đồng',
  'Workshop với chuyên gia tâm lý',
  'Cuộc thi "Nhà lãnh đạo nhí"',
];

export default function KyNangSongPage() {
  return (
    <div>
      <PageBanner
        title="Phát triển kỹ năng sống"
        description="Trang bị hành trang cuộc sống, giúp học sinh tự tin và bản lĩnh"
        breadcrumbItems={[
          { label: 'Chương trình', href: '/chuong-trinh/quoc-gia-nang-cao' },
          { label: 'Kỹ năng sống' },
        ]}
        bgClass="bg-gradient-to-r from-teal-700 to-green-600"
      />

      {/* Skills grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Các nhóm kỹ năng</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Phương pháp giảng dạy</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Trải nghiệm', desc: 'Học sinh tham gia hoạt động thực tế, tình huống giả lập.' },
              { step: '02', title: 'Phản hồi', desc: 'Chia sẻ cảm nhận, thảo luận nhóm về bài học rút ra.' },
              { step: '03', title: 'Ứng dụng', desc: 'Áp dụng kỹ năng vào cuộc sống hàng ngày, đánh giá tiến bộ.' },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-xl border border-slate-200 p-6">
                <span className="text-3xl font-bold text-green-200">{s.step}</span>
                <h3 className="font-semibold text-slate-900 mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities list */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Hoạt động tiêu biểu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activities.map((a) => (
            <div key={a} className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-3">
              <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0" />
              <span className="text-sm text-slate-700">{a}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
