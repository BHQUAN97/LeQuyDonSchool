import Link from 'next/link';
import PageBanner from '@/components/public/PageBanner';
import { Calendar, FileText, Users, Phone } from 'lucide-react';

const announcements = [
  {
    id: 1,
    title: 'Thông báo tuyển sinh lớp 1 năm học 2026-2027',
    date: '01/03/2026',
    status: 'Đang mở',
    desc: 'Trường Tiểu học Lê Quý Đôn thông báo tuyển sinh lớp 1 năm học 2026-2027 với chỉ tiêu 150 học sinh.',
    slug: 'tuyen-sinh-lop-1-2026-2027',
  },
  {
    id: 2,
    title: 'Lịch thi kiểm tra đầu vào đợt 1',
    date: '15/03/2026',
    status: 'Sắp diễn ra',
    desc: 'Kiểm tra đầu vào đợt 1 dành cho các bé đăng ký lớp 1 sẽ diễn ra vào ngày 20/04/2026.',
    slug: 'lich-thi-dau-vao-dot-1',
  },
  {
    id: 3,
    title: 'Chương trình học bổng Lê Quý Đôn 2026',
    date: '10/02/2026',
    status: 'Đang mở',
    desc: 'Trao 20 suất học bổng toàn phần và bán phần cho học sinh xuất sắc năm học 2026-2027.',
    slug: 'hoc-bong-lqd-2026',
  },
  {
    id: 4,
    title: 'Tuyển sinh lớp 2-5 bổ sung năm 2026-2027',
    date: '01/04/2026',
    status: 'Đang mở',
    desc: 'Nhận hồ sơ tuyển sinh bổ sung các lớp 2, 3, 4, 5 cho năm học mới.',
    slug: 'tuyen-sinh-bo-sung-2026',
  },
];

const timeline = [
  { date: '01/03 - 30/04', step: 'Nhận hồ sơ đăng ký' },
  { date: '20/04', step: 'Kiểm tra đầu vào đợt 1' },
  { date: '15/05', step: 'Kiểm tra đầu vào đợt 2' },
  { date: '01/06', step: 'Công bố kết quả' },
  { date: '15/06 - 30/06', step: 'Nhập học & Nộp hồ sơ' },
  { date: '01/09', step: 'Khai giảng năm học mới' },
];

export default function ThongTinTuyenSinhPage() {
  return (
    <div>
      <PageBanner
        title="Thông tin tuyển sinh"
        description="Cập nhật thông tin tuyển sinh mới nhất của Trường Tiểu học Lê Quý Đôn"
        breadcrumbItems={[
          { label: 'Tuyển sinh', href: '/tuyen-sinh/thong-tin' },
          { label: 'Thông tin tuyển sinh' },
        ]}
        bgClass="bg-gradient-to-r from-red-600 to-red-500"
      />

      {/* Quick links */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: FileText, label: 'Tải hồ sơ', href: '#' },
              { icon: Calendar, label: 'Lịch tuyển sinh', href: '#timeline' },
              { icon: Users, label: 'Tham quan trường', href: '/lien-he' },
              { icon: Phone, label: 'Hotline tư vấn', href: 'tel:02412345678' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2.5 bg-red-50 rounded-lg text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Thông báo tuyển sinh</h2>
        <div className="space-y-4">
          {announcements.map((a) => (
            <Link key={a.id} href={`/tin-tuc/${a.slug}`} className="block group">
              <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      a.status === 'Đang mở'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {a.status}
                  </span>
                  <span className="text-xs text-slate-400">{a.date}</span>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors mb-1">
                  {a.title}
                </h3>
                <p className="text-sm text-slate-500">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Lịch trình tuyển sinh 2026-2027</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeline.map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs text-red-600 font-medium">{t.date}</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{t.step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
