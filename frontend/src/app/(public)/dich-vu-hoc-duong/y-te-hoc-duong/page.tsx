import PageBanner from '@/components/public/PageBanner';
import { Heart, Stethoscope, Shield, Activity, Eye, Smile } from 'lucide-react';

const services = [
  {
    icon: Stethoscope,
    title: 'Phòng y tế thường trực',
    desc: 'Nhân viên y tế có mặt suốt thời gian học, sẵn sàng xử lý các tình huống sức khỏe.',
  },
  {
    icon: Shield,
    title: 'Khám sức khỏe định kỳ',
    desc: 'Tổ chức khám sức khỏe toàn diện 2 lần/năm phối hợp bệnh viện uy tín.',
  },
  {
    icon: Activity,
    title: 'Theo dõi thể chất',
    desc: 'Đo chiều cao, cân nặng, thị lực hàng quý. Cập nhật hồ sơ sức khỏe điện tử.',
  },
  {
    icon: Eye,
    title: 'Chăm sóc thị lực',
    desc: 'Kiểm tra thị lực định kỳ, tư vấn phòng ngừa cận thị cho học sinh.',
  },
  {
    icon: Smile,
    title: 'Nha khoa học đường',
    desc: 'Khám răng miệng, hướng dẫn vệ sinh răng, phát hiện sớm các vấn đề nha khoa.',
  },
  {
    icon: Heart,
    title: 'Tâm lý học đường',
    desc: 'Tư vấn tâm lý, hỗ trợ học sinh vượt qua khó khăn cảm xúc và hòa nhập.',
  },
];

const protocols = [
  'Phun khử khuẩn toàn trường định kỳ',
  'Đo thân nhiệt hàng ngày (khi có dịch)',
  'Tủ thuốc đầy đủ, kiểm tra hạn sử dụng hàng tháng',
  'Quy trình xử lý tai nạn thương tích chuẩn',
  'Phối hợp cấp cứu với Bệnh viện gần nhất',
  'Bảo hiểm y tế cho toàn bộ học sinh',
];

export default function YTeHocDuongPage() {
  return (
    <div>
      <PageBanner
        title="Y tế học đường"
        description="Chăm sóc sức khỏe toàn diện, đảm bảo môi trường an toàn cho học sinh"
        breadcrumbItems={[
          { label: 'Dịch vụ học đường', href: '/dich-vu-hoc-duong/thuc-don' },
          { label: 'Y tế học đường' },
        ]}
        bgClass="bg-gradient-to-r from-cyan-700 to-teal-600"
      />

      {/* Services grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Dịch vụ y tế</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Health image */}
      <section className="bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold mb-6">Quy trình đảm bảo an toàn</h2>
              <ul className="space-y-3">
                {protocols.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-300 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-sm opacity-90">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-72 h-52 bg-white/10 rounded-2xl flex items-center justify-center text-white/50 text-sm">
                Hình ảnh phòng y tế
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="bg-slate-50 rounded-xl p-6 lg:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Liên hệ phòng Y tế</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Điện thoại</p>
              <p className="font-medium text-slate-900">024 1234 5678 (ext. 102)</p>
            </div>
            <div>
              <p className="text-slate-500">Email</p>
              <p className="font-medium text-slate-900">yte@lequydon.edu.vn</p>
            </div>
            <div>
              <p className="text-slate-500">Giờ làm việc</p>
              <p className="font-medium text-slate-900">7:00 - 17:00 (Thứ 2 - Thứ 6)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
