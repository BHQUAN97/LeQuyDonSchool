import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo + social */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-green-800 font-bold text-sm">LQĐ</span>
              </div>
              <div>
                <p className="text-xs uppercase opacity-80">Hệ thống Trường liên cấp Lê Quý Đôn</p>
                <p className="font-bold">Trường Tiểu học Lê Quý Đôn</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">Kết nối với chúng tôi</p>
            <div className="flex gap-3">
              {['Facebook', 'YouTube', 'Zalo'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-sm font-medium"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Lien he */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex gap-2">
                <span className="shrink-0">📍</span>
                <span>Số 50 Lưu Hữu Phước, KĐT Mỹ Đình 1, P. Từ Liêm, TP. Hà Nội</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">📞</span>
                <span>024 .6287.2079</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">✉️</span>
                <span>c1_admin@lequydonhanoi.edu.vn</span>
              </li>
            </ul>
          </div>

          {/* Tong quan */}
          <div>
            <h3 className="font-bold text-lg mb-4">Tổng quan</h3>
            <ul className="space-y-2 text-sm opacity-90">
              {[
                { label: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
                { label: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
                { label: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
                { label: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
                { label: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chuong trinh giao duc */}
          <div>
            <h3 className="font-bold text-lg mb-4">Chương trình giáo dục</h3>
            <ul className="space-y-2 text-sm opacity-90">
              {[
                { label: 'Giáo dục Quốc gia nâng cao', href: '/chuong-trinh/quoc-gia-nang-cao' },
                { label: 'Giáo dục Tiếng Anh tăng cường', href: '/chuong-trinh/tieng-anh-tang-cuong' },
                { label: 'Giáo dục Thể chất & Nghệ thuật', href: '/chuong-trinh/the-chat-nghe-thuat' },
                { label: 'Giáo dục Kỹ năng sống & Hoạt động trải nghiệm', href: '/chuong-trinh/ky-nang-song' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
