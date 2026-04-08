import PageBanner from '@/components/public/PageBanner';

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
      <PageBanner
        title="Gia đình Doners"
        description="Đội ngũ giáo viên và nhân viên tận tâm của Trường Tiểu học Lê Quý Đôn"
        breadcrumbItems={[
          { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
          { label: 'Gia đình Doners' },
        ]}
      />

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-green-700">{s.number}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ban Giam Hieu */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Ban Giám hiệu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((l) => (
            <div key={l.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                Ảnh chân dung
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold text-slate-900">{l.name}</h3>
                <p className="text-sm text-green-700 font-medium mt-1">{l.role}</p>
                <p className="text-xs text-slate-500 mt-2">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Doi ngu giao vien */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Đội ngũ Giáo viên tiêu biểu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                  {t.name.charAt(t.name.length - 1)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{t.name}</h3>
                  <p className="text-xs text-green-700 font-medium">{t.subject}</p>
                  <p className="text-xs text-slate-500 mt-1">{t.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
