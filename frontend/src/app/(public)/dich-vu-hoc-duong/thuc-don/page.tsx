import { Metadata } from 'next';
import PageBanner from '@/components/public/PageBanner';
import { UtensilsCrossed, Apple, Leaf, Clock } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Thực đơn học đường',
  description:
    'Thực đơn dinh dưỡng hàng tuần tại Trường Tiểu học Lê Quý Đôn - Bữa ăn cân bằng, an toàn vệ sinh thực phẩm, phù hợp lứa tuổi tiểu học.',
  path: '/dich-vu-hoc-duong/thuc-don',
});

const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];

const menuData = [
  {
    day: 'Thứ 2',
    date: '07/04/2026',
    morning: 'Sữa tươi, Bánh mì bơ',
    lunch: 'Cơm trắng, Thịt gà rang gừng, Canh rau cải, Rau muống xào tỏi',
    snack: 'Chè đỗ xanh, Trái cây tươi',
  },
  {
    day: 'Thứ 3',
    date: '08/04/2026',
    morning: 'Phở bò, Sữa chua',
    lunch: 'Cơm trắng, Cá hồi sốt cam, Canh bí đỏ, Đậu phụ nhồi thịt',
    snack: 'Bánh flan, Nước ép cam',
  },
  {
    day: 'Thứ 4',
    date: '09/04/2026',
    morning: 'Bún riêu cua, Sữa tươi',
    lunch: 'Cơm trắng, Sườn xào chua ngọt, Canh chua cá, Rau xào thập cẩm',
    snack: 'Kem trái cây, Bánh quy',
  },
  {
    day: 'Thứ 5',
    date: '10/04/2026',
    morning: 'Cháo gà, Bánh bao',
    lunch: 'Cơm trắng, Bò xào bông cải, Canh mồng tơi, Trứng chiên thịt',
    snack: 'Chè bưởi, Trái cây tươi',
  },
  {
    day: 'Thứ 6',
    date: '11/04/2026',
    morning: 'Mì xào hải sản, Sữa chua',
    lunch: 'Cơm trắng, Tôm rang muối, Canh rau ngót, Gà kho gừng',
    snack: 'Bánh cuốn, Nước ép dưa hấu',
  },
];

const nutrition = [
  { icon: Apple, title: 'Dinh dưỡng cân bằng', desc: 'Thực đơn được chuyên gia dinh dưỡng thiết kế đảm bảo đủ 4 nhóm chất.' },
  { icon: Leaf, title: 'Nguyên liệu sạch', desc: 'Nguồn thực phẩm được kiểm định, rau sạch từ trang trại liên kết.' },
  { icon: Clock, title: '3 bữa/ngày', desc: 'Bữa sáng, bữa trưa và bữa xế đảm bảo năng lượng cho cả ngày học.' },
  { icon: UtensilsCrossed, title: 'Bếp ăn đạt chuẩn', desc: 'Bếp ăn một chiều đạt chuẩn VSATTP, nhân viên có chứng chỉ.' },
];

export default function ThucDonPage() {
  return (
    <div>
      <PageBanner
        title="Thực đơn hàng tuần"
        description="Thực đơn dinh dưỡng được thiết kế khoa học cho học sinh"
        breadcrumbItems={[
          { label: 'Dịch vụ học đường', href: '/dich-vu-hoc-duong/thuc-don' },
          { label: 'Thực đơn' },
        ]}
        bgClass="bg-gradient-to-r from-amber-600 to-orange-500"
      />

      {/* Week selector */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button className="text-sm text-slate-500 hover:text-green-700">← Tuần trước</button>
          <p className="text-sm font-semibold text-slate-900">Tuần 07/04 - 11/04/2026</p>
          <button className="text-sm text-slate-500 hover:text-green-700">Tuần sau →</button>
        </div>
      </section>

      {/* Menu cards */}
      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {menuData.map((menu) => (
            <div key={menu.day} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between">
                <span className="font-semibold text-sm">{menu.day}</span>
                <span className="text-xs opacity-80">{menu.date}</span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-amber-600 mb-1">🌅 Bữa sáng</p>
                  <p className="text-sm text-slate-700">{menu.morning}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">☀️ Bữa trưa</p>
                  <p className="text-sm text-slate-700">{menu.lunch}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-600 mb-1">🍎 Bữa xế</p>
                  <p className="text-sm text-slate-700">{menu.snack}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition info */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">Tiêu chuẩn dinh dưỡng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {nutrition.map((n) => (
              <div key={n.title} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <n.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-2">{n.title}</h3>
                <p className="text-xs text-slate-600">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
