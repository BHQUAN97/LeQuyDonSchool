import PageBanner from '@/components/public/PageBanner';

const milestones = [
  { year: '2005', title: 'Thành lập trường', desc: 'Trường Tiểu học Lê Quý Đôn chính thức được thành lập tại quận Nam Từ Liêm, Hà Nội.' },
  { year: '2008', title: 'Mở rộng cơ sở', desc: 'Khánh thành khu hiệu bộ mới với diện tích mở rộng lên 3000m², đáp ứng nhu cầu học sinh ngày càng tăng.' },
  { year: '2012', title: 'Hợp tác quốc tế', desc: 'Ký kết hợp tác chiến lược với PLC Sydney (Australia), mở ra chương trình trao đổi giáo dục quốc tế.' },
  { year: '2015', title: 'Khuôn viên 6000m²', desc: 'Hoàn thành mở rộng khuôn viên trường lên 6000m² với đầy đủ tiện nghi hiện đại.' },
  { year: '2018', title: 'Hệ thống liên cấp', desc: 'Phát triển thành Hệ thống Giáo dục Lê Quý Đôn với các cấp từ Mầm non đến THPT.' },
  { year: '2020', title: 'Chuyển đổi số', desc: 'Triển khai hệ thống giáo dục số, học trực tuyến và quản lý thông minh trên toàn hệ thống.' },
  { year: '2023', title: 'Chứng nhận chất lượng', desc: 'Đạt chứng nhận kiểm định chất lượng giáo dục cấp quốc gia với xếp hạng xuất sắc.' },
  { year: '2025', title: 'Tầm nhìn mới', desc: 'Khởi động chiến lược phát triển giai đoạn 2025-2030 với mục tiêu trở thành trường tiểu học hàng đầu Việt Nam.' },
];

export default function CotMocPhatTrienPage() {
  return (
    <div>
      <PageBanner
        title="Cột mốc phát triển"
        description="Hành trình xây dựng và phát triển của Hệ thống Giáo dục Lê Quý Đôn"
        breadcrumbItems={[
          { label: 'Tổng quan', href: '/tong-quan/tam-nhin-su-menh' },
          { label: 'Cột mốc phát triển' },
        ]}
      />

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-green-200 -translate-x-1/2" />

          <div className="space-y-8 md:space-y-12">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content card */}
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                  <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                      {m.year}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">{m.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-green-100 z-10" />

                {/* Spacer for alignment */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
