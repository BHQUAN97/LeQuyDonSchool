import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Gia đình Doners',
  description:
    'Đội ngũ lãnh đạo, giáo viên và nhân viên tận tâm tại Trường Tiểu học Lê Quý Đôn - Gia đình Doners luôn đồng hành cùng học sinh.',
  path: '/tong-quan/gia-dinh-doners',
});

const tongQuanPages = [
  { title: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
  { title: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
  { title: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
  { title: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
  { title: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
];

const currentPage = '/tong-quan/gia-dinh-doners';

const leaders = [
  { name: 'Nguyễn Văn A', role: 'Hiệu trưởng', desc: 'Thạc sĩ Quản lý Giáo dục, 20 năm kinh nghiệm' },
  { name: 'Trần Thị B', role: 'Phó Hiệu trưởng', desc: 'Tiến sĩ Giáo dục học, chuyên gia chương trình' },
  { name: 'Lê Văn C', role: 'Phó Hiệu trưởng', desc: 'Thạc sĩ Quản trị, phụ trách cơ sở vật chất' },
];

const teachers = [
  { name: 'Phạm Thị D', subject: 'Giáo viên chủ nhiệm', exp: '15 năm kinh nghiệm' },
  { name: 'Hoàng Văn E', subject: 'Giáo viên Tiếng Anh', exp: 'IELTS 8.0, 10 năm giảng dạy' },
  { name: 'Ngô Thị F', subject: 'Giáo viên Toán', exp: 'Giáo viên giỏi cấp Thành phố' },
  { name: 'Đỗ Văn G', subject: 'Giáo viên Thể dục', exp: 'HLV cấp quốc gia' },
  { name: 'Vũ Thị H', subject: 'Giáo viên Âm nhạc', exp: 'Cử nhân Nhạc viện Hà Nội' },
  { name: 'Bùi Văn I', subject: 'Giáo viên Mỹ thuật', exp: 'Họa sĩ, 12 năm giảng dạy' },
];

const stats = [
  { number: '120+', label: 'Giáo viên & Nhân viên' },
  { number: '85%', label: 'Trình độ Thạc sĩ trở lên' },
  { number: '15+', label: 'Năm kinh nghiệm TB' },
  { number: '100%', label: 'Yêu nghề & Tận tâm' },
];

export default function GiaDinhDonersPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
            { label: 'Gia đình Doners' },
          ]} />
        </div>
      </div>

      {/* Section title */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">TỔNG QUAN</span>
            <div className="flex gap-0.5">
              <span className="w-6 h-1 bg-green-700 rounded-full" />
              <span className="w-6 h-1 bg-red-600 rounded-full" />
              <span className="w-6 h-1 bg-green-700 rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Gia đình Doners</h1>
        </div>

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Content */}
          <div className="lg:col-span-2 space-y-10">
            <p className="text-gray-700 leading-relaxed">
              Đội ngũ giáo viên và nhân viên tận tâm của Trường Tiểu học Lê Quý Đôn — những người luôn đồng hành cùng học sinh trên hành trình trưởng thành.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-green-50 rounded-xl p-5 text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-green-700">{s.number}</p>
                  <p className="text-sm text-gray-700 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Ban Giam Hieu */}
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">Ban Giám hiệu</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {leaders.map((l) => (
                  <div key={l.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 bg-green-50 flex items-center justify-center text-green-600 text-sm">
                      Ảnh chân dung
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-slate-900">{l.name}</h3>
                      <p className="text-sm text-green-700 font-medium mt-1">{l.role}</p>
                      <p className="text-xs text-gray-700 mt-2">{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doi ngu giao vien */}
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">Đội ngũ Giáo viên tiêu biểu</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teachers.map((t) => (
                  <div key={t.name} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                      {t.name.charAt(t.name.length - 1)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{t.name}</h3>
                      <p className="text-xs text-green-700 font-medium">{t.subject}</p>
                      <p className="text-xs text-gray-700 mt-1">{t.exp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Tổng quan</h3>
              <nav className="space-y-1">
                {tongQuanPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      page.href === currentPage
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {page.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
