import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Ben trai — nen xanh la: logo, social, lien he, links */}
        <div className="bg-[#1a6b30] text-white px-6 py-10 lg:px-10 lg:py-14">
          <div className="max-w-xl ml-auto">
            {/* Logo + social */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-yellow-500 shrink-0">
                <span className="text-red-600 font-bold text-sm">LQĐ</span>
              </div>
              <div>
                <p className="text-[11px] uppercase opacity-80 tracking-wide">
                  Hệ thống Trường liên cấp Lê Quý Đôn
                </p>
                <p className="font-bold text-base">Trường Tiểu học Lê Quý Đôn</p>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
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
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Zalo"
              >
                Zalo
              </a>
            </div>

            {/* 3 cot: Lien he, Tong quan, Chuong trinh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              {/* Lien he */}
              <div>
                <h3 className="font-bold text-base mb-3 text-white">Liên hệ</h3>
                <ul className="space-y-2.5 opacity-90">
                  <li className="flex gap-2">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Số 50 Lưu Hữu Phước, KĐT Mỹ Đình 1, Nam Từ Liêm, Hà Nội</span>
                  </li>
                  <li className="flex gap-2">
                    <Phone className="w-4 h-4 shrink-0" />
                    <a href="tel:02462872079" className="hover:underline">024.6287.2079</a>
                  </li>
                  <li className="flex gap-2">
                    <Mail className="w-4 h-4 shrink-0" />
                    <a href="mailto:c1_admin@lequydonhanoi.edu.vn" className="hover:underline text-xs">
                      c1_admin@lequydonhanoi.edu.vn
                    </a>
                  </li>
                </ul>
              </div>

              {/* Tong quan */}
              <div>
                <h3 className="font-bold text-base mb-3 text-white">Tổng quan</h3>
                <ul className="space-y-2 opacity-90">
                  {[
                    { label: 'Tầm nhìn & Sứ mệnh', href: '/tong-quan/tam-nhin-su-menh' },
                    { label: 'Cột mốc phát triển', href: '/tong-quan/cot-moc-phat-trien' },
                    { label: 'Gia đình Doners', href: '/tong-quan/gia-dinh-doners' },
                    { label: 'Ngôi nhà Lê Quý Đôn', href: '/tong-quan/ngoi-nha-le-quy-don' },
                    { label: 'Sắc màu Lê Quý Đôn', href: '/tong-quan/sac-mau-le-quy-don' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:underline hover:text-yellow-200 transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chuong trinh giao duc */}
              <div>
                <h3 className="font-bold text-base mb-3 text-white">Chương trình giáo dục</h3>
                <ul className="space-y-2 opacity-90">
                  {[
                    { label: 'Giáo dục Quốc gia nâng cao', href: '/chuong-trinh/quoc-gia-nang-cao' },
                    { label: 'Tiếng Anh tăng cường', href: '/chuong-trinh/tieng-anh-tang-cuong' },
                    { label: 'Thể chất & Nghệ thuật', href: '/chuong-trinh/the-chat-nghe-thuat' },
                    { label: 'Kỹ năng sống & Hoạt động', href: '/chuong-trinh/ky-nang-song' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:underline hover:text-yellow-200 transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Ben phai — nen do: anh hoc sinh + emblem */}
        <div className="bg-[#c62828] text-white px-6 py-10 lg:px-10 lg:py-14 relative overflow-hidden">
          <div className="max-w-xl">
            {/* Emblem 20 nam */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-yellow-500/50 flex items-center justify-center">
                  <span className="text-yellow-300 font-bold text-lg">20</span>
                </div>
                <div>
                  <p className="text-yellow-300 font-bold text-sm">NĂM THÀNH LẬP</p>
                  <p className="text-white/80 text-xs">2006 — 2026</p>
                </div>
              </div>
              {/* Decorative emblem */}
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-white/40 text-2xl">🏫</span>
                </div>
              </div>
            </div>

            {/* Placeholder anh hoc sinh — se thay bang anh that */}
            <div className="aspect-[16/10] bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <div className="text-center text-white/50">
                <p className="text-sm">Hình ảnh học sinh</p>
                <p className="text-xs mt-1">Trường Tiểu học Lê Quý Đôn</p>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-500/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-500/30" />
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
