import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      {/* Footer chinh — full-width nen xanh la */}
      <div className="bg-[#1a6b30] text-white px-6 py-10 lg:px-10 lg:py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Col 1: Logo + Social */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-yellow-500 shrink-0">
                <span className="text-red-600 font-bold text-sm">LQĐ</span>
              </div>
              <div>
                <p className="text-[11px] uppercase opacity-80 tracking-wide leading-tight">
                  Hệ thống Trường liên cấp Lê Quý Đôn
                </p>
                <p className="font-bold text-base leading-tight">Trường Tiểu học Lê Quý Đôn</p>
              </div>
            </div>

            <p className="text-sm opacity-80 mb-3 italic">Kết nối với chúng tôi</p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/TieuHocLeQuyDon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors font-bold text-sm"
                aria-label="Zalo"
              >
                Z
              </a>
            </div>
          </div>

          {/* Col 2: Lien he */}
          <div>
            <h3 className="font-bold text-base mb-4 uppercase tracking-wide">Liên hệ</h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Số 50 Lưu Hữu Phước, KĐT Mỹ Đình 1, P. Từ Liêm, TP. Hà Nội</span>
              </li>
              <li className="flex gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:02462872079" className="hover:underline">024 .6287.2079</a>
              </li>
              <li className="flex gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:c1_admin@lequydonhanoi.edu.vn" className="hover:underline break-all">
                  c1_admin@lequydonhanoi.edu.vn
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Tong quan */}
          <div>
            <h3 className="font-bold text-base mb-4 uppercase tracking-wide">Tổng quan</h3>
            <ul className="space-y-2 text-sm opacity-90">
              {[
                { label: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
                { label: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
                { label: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
                { label: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
                { label: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
                { label: 'Tài liệu nội bộ', href: '/tai-lieu-noi-bo' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline hover:text-yellow-200 transition-colors">
                    • {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Chuong trinh giao duc */}
          <div>
            <h3 className="font-bold text-base mb-4 uppercase tracking-wide">Chương trình giáo dục</h3>
            <ul className="space-y-2 text-sm opacity-90">
              {[
                { label: 'Giáo dục Quốc gia nâng cao', href: '/chuong-trinh/quoc-gia-nang-cao' },
                { label: 'Giáo dục tiếng Anh tăng cường', href: '/chuong-trinh/tieng-anh-tang-cuong' },
                { label: 'Giáo dục Thể chất & Nghệ thuật', href: '/chuong-trinh/the-chat-nghe-thuat' },
                { label: 'Giáo dục Kỹ năng sống & Hoạt động trải nghiệm', href: '/chuong-trinh/ky-nang-song' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline hover:text-yellow-200 transition-colors">
                    • {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-[#145524] text-white/70 text-center text-xs py-3 px-4">
        © {new Date().getFullYear()} Trường Tiểu học Lê Quý Đôn. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
}
