import PageBanner from '@/components/public/PageBanner';
import { Dumbbell, Music, Palette, Trophy, Heart, Sparkles } from 'lucide-react';

const sports = [
  { title: 'Bóng đá', desc: 'Sân bóng mini tiêu chuẩn, huấn luyện viên chuyên nghiệp' },
  { title: 'Bóng rổ', desc: 'Sân bóng rổ trong nhà, thi đấu giải liên trường' },
  { title: 'Bơi lội', desc: 'Hồ bơi bốn mùa, dạy bơi an toàn từ lớp 1' },
  { title: 'Võ thuật', desc: 'Taekwondo & Karate, rèn luyện ý chí và kỷ luật' },
  { title: 'Cờ vua', desc: 'Phát triển tư duy chiến lược, thi đấu các giải' },
  { title: 'Thể dục nhịp điệu', desc: 'Rèn luyện sự dẻo dai và nhịp nhàng' },
];

const arts = [
  { title: 'Âm nhạc', desc: 'Học nhạc cụ (piano, guitar, trống), hát hợp xướng' },
  { title: 'Mỹ thuật', desc: 'Vẽ sáng tạo, thủ công mỹ nghệ, điêu khắc' },
  { title: 'Múa', desc: 'Múa dân gian, múa hiện đại, vũ đạo sáng tạo' },
  { title: 'Kịch nghệ', desc: 'Diễn kịch, kể chuyện, phát triển tự tin' },
];

export default function TheChatNgheThucPage() {
  return (
    <div>
      <PageBanner
        title="Giáo dục Thể chất & Nghệ thuật"
        description="Phát triển toàn diện thể chất và nuôi dưỡng tâm hồn nghệ thuật"
        breadcrumbItems={[
          { label: 'Chương trình', href: '/chuong-trinh/quoc-gia-nang-cao' },
          { label: 'Thể chất & Nghệ thuật' },
        ]}
        bgClass="bg-gradient-to-r from-orange-600 to-red-500"
      />

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <Dumbbell className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">6+</p>
              <p className="text-xs text-slate-500">Môn thể thao</p>
            </div>
            <div>
              <Music className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">4+</p>
              <p className="text-xs text-slate-500">Bộ môn nghệ thuật</p>
            </div>
            <div>
              <Trophy className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">50+</p>
              <p className="text-xs text-slate-500">Giải thưởng/năm</p>
            </div>
            <div>
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500">HS tham gia CLB</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex items-center gap-3 mb-8">
          <Dumbbell className="w-6 h-6 text-green-700" />
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Chương trình Thể chất</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sports.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Arts */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-8">
            <Palette className="w-6 h-6 text-red-600" />
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Chương trình Nghệ thuật</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {arts.map((a) => (
              <div key={a.title} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex">
                <div className="w-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                  Hình ảnh
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-2">{a.title}</h3>
                  <p className="text-sm text-slate-600">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Khoảnh khắc ấn tượng</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {['Hội thao', 'Biểu diễn', 'Giải bơi', 'Triển lãm'].map((label) => (
            <div key={label} className="h-40 lg:h-52 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
              {label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
