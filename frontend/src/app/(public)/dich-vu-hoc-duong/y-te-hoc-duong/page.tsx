import { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumb from '@/components/public/Breadcrumb';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Y tế học đường',
  description:
    'Dịch vụ Y tế học đường tại Trường Tiểu học Lê Quý Đôn - Phòng y tế đạt chuẩn, khám sức khỏe định kỳ, chăm sóc sức khỏe toàn diện cho học sinh.',
  path: '/dich-vu-hoc-duong/y-te-hoc-duong',
});

/** Cac section noi dung trang Y te hoc duong */
const contentSections = [
  {
    id: 'tam-quan-trong',
    title: 'Tầm quan trọng của y tế học đường',
    content: `Y tế học đường đóng vai trò quan trọng trong việc bảo vệ và nâng cao sức khỏe cho học sinh. Tại Trường Tiểu học Lê Quý Đôn, chúng tôi xây dựng hệ thống y tế toàn diện với đội ngũ nhân viên y tế chuyên nghiệp, phòng y tế đạt chuẩn và quy trình chăm sóc sức khỏe khoa học.

Mục tiêu của chương trình y tế học đường là đảm bảo mọi học sinh được theo dõi sức khỏe thường xuyên, phát hiện sớm các vấn đề sức khỏe và có biện pháp can thiệp kịp thời. Chúng tôi phối hợp chặt chẽ với phụ huynh và các cơ sở y tế uy tín để mang lại sự chăm sóc tốt nhất.`,
    imageLabel: 'Phòng y tế trường học',
  },
  {
    id: 've-sinh-truong-hoc',
    title: 'Vệ sinh trường học',
    content: `Vệ sinh trường học là nền tảng của môi trường học tập lành mạnh. Trường thực hiện phun khử khuẩn toàn bộ khuôn viên định kỳ, đặc biệt trong mùa dịch bệnh. Các phòng học, nhà vệ sinh, khu vực ăn uống được vệ sinh hàng ngày theo quy trình nghiêm ngặt.

Hệ thống nước uống được kiểm tra chất lượng định kỳ, đảm bảo an toàn cho học sinh. Thùng rác được phân loại và thu gom đúng quy định. Nhà trường cũng tổ chức các buổi giáo dục ý thức vệ sinh cá nhân cho học sinh.`,
    imageLabel: 'Vệ sinh trường học',
  },
  {
    id: 'chieu-sang',
    title: 'Chiếu sáng',
    content: `Hệ thống chiếu sáng trong phòng học được thiết kế theo tiêu chuẩn quốc gia về chiếu sáng học đường. Ánh sáng đồng đều, không gây chói mắt, giúp bảo vệ thị lực cho học sinh trong quá trình học tập.

Tất cả các phòng học đều sử dụng đèn LED tiết kiệm năng lượng với cường độ ánh sáng phù hợp. Rèm cửa được lắp đặt để điều chỉnh ánh sáng tự nhiên, tránh tình trạng chói lóa. Nhà trường kiểm tra và bảo trì hệ thống chiếu sáng định kỳ hàng tháng.`,
    imageLabel: 'Hệ thống chiếu sáng phòng học',
  },
  {
    id: 'moi-truong-hoc-tap',
    title: 'Môi trường học tập',
    content: `Môi trường học tập tại Lê Quý Đôn được thiết kế khoa học, đảm bảo các yếu tố: nhiệt độ phù hợp, thông thoáng, yên tĩnh và an toàn. Mỗi phòng học đều có hệ thống điều hòa, quạt thông gió và cách âm hiệu quả.

Bàn ghế được chọn theo tiêu chuẩn ergonomic phù hợp với từng lứa tuổi, giúp học sinh ngồi đúng tư thế, phòng tránh các bệnh về cột sống. Khoảng cách giữa bảng và bàn học đầu tiên tuân thủ quy định tối thiểu 2.5m.`,
    imageLabel: 'Môi trường học tập hiện đại',
  },
  {
    id: 'y-te-hoc-duong',
    title: 'Y tế học đường',
    content: `Phòng y tế trường được trang bị đầy đủ thiết bị và thuốc men cần thiết, hoạt động suốt thời gian học. Nhân viên y tế có chứng chỉ hành nghề, được đào tạo sơ cấp cứu chuyên nghiệp.

Chương trình y tế học đường bao gồm: khám sức khỏe định kỳ 2 lần/năm phối hợp bệnh viện uy tín, theo dõi chiều cao - cân nặng - thị lực hàng quý, kiểm tra răng miệng và tư vấn dinh dưỡng. Hồ sơ sức khỏe điện tử của mỗi học sinh được cập nhật liên tục và chia sẻ với phụ huynh qua ứng dụng.

Ngoài ra, nhà trường phối hợp với các bệnh viện gần nhất để đảm bảo quy trình cấp cứu nhanh chóng khi cần thiết. Toàn bộ học sinh đều có bảo hiểm y tế.`,
    imageLabel: 'Phòng y tế trường',
  },
];

export default function YTeHocDuongPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Dịch vụ học đường', href: '/dich-vu-hoc-duong/thuc-don' },
            { label: 'Y tế học đường' },
          ]} />
        </div>
      </div>

      {/* Section title */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">DICH VU HOC DUONG</span>
            <div className="flex gap-0.5">
              <span className="w-6 h-1 bg-green-700 rounded-full" />
              <span className="w-6 h-1 bg-red-600 rounded-full" />
              <span className="w-6 h-1 bg-green-700 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Y tế học đường</h2>
        </div>
      </section>

      {/* Content sections */}
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-12">
        {contentSections.map((section, index) => (
          <section key={section.id} id={section.id}>
            <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-start`}>
              {/* Image placeholder */}
              <div className="w-full lg:w-2/5 shrink-0">
                <div className="w-full h-64 lg:h-72 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                  {section.imageLabel}
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h3>
                <div className="space-y-3">
                  {section.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-sm text-slate-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
