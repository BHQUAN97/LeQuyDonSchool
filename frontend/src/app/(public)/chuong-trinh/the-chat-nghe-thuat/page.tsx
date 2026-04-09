import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import { GraduationCap, Dumbbell, Music, Palette } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Thể chất & Nghệ thuật',
  description:
    'Chương trình Thể chất và Nghệ thuật tại Trường Tiểu học Lê Quý Đôn - Bóng đá, bơi lội, âm nhạc, mỹ thuật và nhiều bộ môn phát triển toàn diện.',
  path: '/chuong-trinh/the-chat-nghe-thuat',
});

const allPrograms = [
  { title: 'Giáo dục Quốc gia nâng cao', href: '/chuong-trinh/quoc-gia-nang-cao' },
  { title: 'Giáo dục tiếng Anh tăng cường', href: '/chuong-trinh/tieng-anh-tang-cuong' },
  { title: 'Giáo dục Thể chất & Nghệ thuật', href: '/chuong-trinh/the-chat-nghe-thuat' },
  { title: 'Chương trình phát triển kỹ năng sống', href: '/chuong-trinh/ky-nang-song' },
];

const currentProgram = '/chuong-trinh/the-chat-nghe-thuat';
const otherPrograms = allPrograms.filter((p) => p.href !== currentProgram);

export default function TheChatNgheThucPage() {
  return (
    <div>
      {/* Hero banner */}
      <section className="relative h-72 lg:h-96 bg-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-sm">
          Ảnh hoạt động thể chất nghệ thuật
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div>
            <p className="text-white/80 text-sm tracking-widest uppercase mb-2">Chương trình Giáo dục</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Giáo dục Thể chất & Nghệ thuật</h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb
          items={[
            { label: 'Chương trình Giáo dục', href: '/chuong-trinh/quoc-gia-nang-cao' },
            { label: 'Thể chất & Nghệ thuật' },
          ]}
        />
      </div>

      {/* Section title + content */}
      <section className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">Chương trình Giáo dục</p>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">Giáo dục Thể chất & Nghệ thuật</h2>

        {/* Intro */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Phát triển toàn diện thể chất và nghệ thuật</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Chương trình Thể chất & Nghệ thuật tại Lê Quý Đôn được xây dựng nhằm phát triển toàn diện sức khỏe
          thể chất và nuôi dưỡng tâm hồn nghệ thuật cho học sinh. Với hơn 6 môn thể thao và 4 bộ môn nghệ
          thuật, mỗi em đều tìm được niềm đam mê riêng.
        </p>
        <p className="text-slate-600 leading-relaxed mb-8">
          100% học sinh tham gia ít nhất 1 câu lạc bộ thể thao hoặc nghệ thuật. Hàng năm, nhà trường đạt
          hơn 50 giải thưởng các cấp trong lĩnh vực thể dục thể thao và nghệ thuật.
        </p>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-10">
          Hình ảnh hoạt động thể thao
        </div>

        {/* Chuong trinh The chat */}
        <div className="flex items-center gap-3 mb-4">
          <Dumbbell className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Chương trình Thể chất</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Các môn thể thao được giảng dạy bởi huấn luyện viên chuyên nghiệp, với cơ sở vật chất hiện đại:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[
            { title: 'Bóng đá', desc: 'Sân bóng mini tiêu chuẩn, huấn luyện viên chuyên nghiệp' },
            { title: 'Bóng rổ', desc: 'Sân bóng rổ trong nhà, thi đấu giải liên trường' },
            { title: 'Bơi lội', desc: 'Hồ bơi bốn mùa, dạy bơi an toàn từ lớp 1' },
            { title: 'Võ thuật', desc: 'Taekwondo & Karate, rèn luyện ý chí và kỷ luật' },
            { title: 'Cờ vua', desc: 'Phát triển tư duy chiến lược, thi đấu các giải' },
            { title: 'Thể dục nhịp điệu', desc: 'Rèn luyện sự dẻo dai và nhịp nhàng' },
          ].map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-slate-900 mb-2">{s.title}</h4>
              <p className="text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Blue accent — thanh tich the thao */}
        <div className="bg-blue-700 text-white rounded-xl p-6 mb-10">
          <h3 className="text-lg font-bold mb-3">Thành tích thể thao</h3>
          <p className="text-sm text-blue-100 leading-relaxed">
            Đội bóng đá nhà trường liên tục nằm trong Top 3 giải bóng đá tiểu học Quận. Đội bơi lội đạt
            nhiều huy chương vàng tại các giải thi đấu cấp Thành phố. Đội Taekwondo và Karate thường xuyên
            giành giải tại các cuộc thi quốc gia dành cho lứa tuổi tiểu học.
          </p>
        </div>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-10">
          Hình ảnh biểu diễn nghệ thuật
        </div>

        {/* Chuong trinh Am nhac */}
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Chương trình Âm nhạc</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Học sinh được học nhạc cụ (piano, guitar, trống), hát hợp xướng và múa. Chương trình âm nhạc giúp
          phát triển cảm xúc, tính sáng tạo và sự tự tin khi biểu diễn trước đám đông.
        </p>

        {/* Chuong trinh My thuat */}
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-green-700 flex-shrink-0" />
          <h3 className="text-xl font-bold text-green-700">Chương trình Mỹ thuật</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Chương trình Mỹ thuật bao gồm vẽ sáng tạo, thủ công mỹ nghệ, điêu khắc và thiết kế. Học sinh
          được tự do thể hiện ý tưởng sáng tạo qua nhiều chất liệu và kỹ thuật khác nhau. Các tác phẩm
          xuất sắc được trưng bày tại triển lãm hàng năm của nhà trường.
        </p>

        {/* Image placeholder */}
        <div className="h-48 sm:h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-6">
          Hình ảnh triển lãm mỹ thuật
        </div>
      </section>

      {/* Chuong trinh khac */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Chương trình khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherPrograms.map((p) => (
              <Link key={p.href} href={p.href} className="group block">
                <div className="relative h-48 bg-slate-200 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-sm">
                    Ảnh chương trình
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm group-hover:underline">{p.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
