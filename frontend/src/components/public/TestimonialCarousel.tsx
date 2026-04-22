'use client';

import Carousel from './Carousel';

interface Testimonial {
  name: string;
  title: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Anh Hoàng Hữu Thắng',
    title:
      'Chủ tịch HĐQT Intech Group | Phó Chủ tịch CLB Đầu tư & Khởi nghiệp Việt Nam | PHHS khóa 2021 - 2026',
    content:
      'Tôi thấy vui và hạnh phúc mỗi khi con nói chuyện thể hiện sự đam mê, yêu thích ngôi trường. Mỗi lần đến Trường Tiểu học Lê Quý Đôn để đón con, tôi lại thấy sự vui tươi, hồn nhiên của các con. Tôi tin tưởng vào sự phát triển toàn diện mà nhà trường mang lại cho con trai mình. Điều quý giá nhất là con không chỉ giỏi kiến thức mà còn phát triển cả về kỹ năng sống và nhân cách. Trường thực sự là tổ ấm thứ hai cho các em, để mỗi sáng mẹ không phải mệt công tìm kiếm lý do để con yêu trường, đến trường.',
  },
  {
    name: 'Anh Nguyễn Thanh Bình',
    title:
      'Giám đốc Nhà máy Công ty TNHH Chế biến thực phẩm và bánh kẹo Phạm Nguyên | PHHS niên khoá 2011 - 2016, 2020 - 2025 và 2024 - 2029',
    content:
      'Là một người bố, tôi luôn cảm thấy vô cùng biết ơn khi nhìn thấy những bước đi vững chắc của các con mình trên con đường học vấn. Ba đứa con tôi đều học tại trường Tiểu học Lê Quý Đôn và nơi đây thực sự là một ngôi nhà thứ hai của các con. Tôi thực sự cảm nhận được sự trưởng thành của các con qua từng ngày và đó là điều khiến tôi tự hào nhất.',
  },
  {
    name: 'Chị Trần Thị Minh Hà',
    title:
      'Phó Giám đốc Ngân hàng TMCP Ngoại thương Việt Nam | PHHS niên khoá 2022 - 2027',
    content:
      'Con gái tôi từ một bé nhút nhát, ít nói đã trở nên tự tin, mạnh dạn sau 2 năm học tại Lê Quý Đôn. Cháu rất thích các hoạt động ngoại khóa, đặc biệt là CLB Tiếng Anh và Robotics. Tôi đánh giá cao phương pháp giáo dục lấy học sinh làm trung tâm của nhà trường — các thầy cô luôn lắng nghe và tôn trọng cá tính riêng của từng em.',
  },
  {
    name: 'Anh Lê Văn Đức',
    title:
      'CEO Công ty CP Công nghệ DTS | PHHS niên khoá 2023 - 2028',
    content:
      'Điều tôi ấn tượng nhất ở Lê Quý Đôn là sự minh bạch trong giao tiếp giữa nhà trường và phụ huynh. Mọi thông tin về học tập, sức khỏe, bữa ăn của con đều được cập nhật kịp thời qua ứng dụng. Con trai tôi rất yêu trường và luôn háo hức mỗi sáng thức dậy đi học. Đó là thước đo chính xác nhất cho chất lượng giáo dục.',
  },
];

/* SVG trang tri hinh the thao */
function SportDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute top-8 right-8 w-16 h-16 text-white/10" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="40" cy="8" r="5" />
        <path d="M28 20l8-4 6 8 10 2-2 4-12-2-6 6 4 14-4 2-6-14-8 4-2-4 8-8z" />
      </svg>
      <svg className="absolute top-1/3 right-16 w-14 h-14 text-white/10" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="32" cy="8" r="5" />
        <path d="M24 18l8 2 8-2 4 6-8 4v10l6 8-4 2-6-8-6 8-4-2 6-8V28l-8-4z" />
      </svg>
      <svg className="absolute bottom-12 right-12 w-20 h-20 text-white/8" viewBox="0 0 64 64" fill="currentColor">
        <path d="M8 12l24 4 24-4v40l-24 4-24-4V12zm24 4v36m-20-34v32l20 3m20-35v32l-20 3" fillOpacity="0" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute top-1/2 right-4 w-12 h-12 text-white/8" viewBox="0 0 64 64" fill="currentColor">
        <path d="M32 4l6 18h18l-14 10 6 18-16-12-16 12 6-18L8 22h18z" />
      </svg>
    </div>
  );
}

export default function TestimonialCarousel() {
  return (
    <div className="bg-[#c62828] text-white py-10 lg:py-16 px-6 lg:px-10 relative overflow-hidden">
      <SportDecorations />

      <div className="max-w-lg relative z-10">
        {/* Dau ngoac kep */}
        <div className="text-7xl text-white/20 font-serif leading-none mb-2">&#8220;</div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm opacity-80 uppercase tracking-wide">Từ cộng đồng</span>
            <div className="flex gap-0.5">
              <span className="w-4 h-1 bg-green-400 rounded-full" />
              <span className="w-4 h-1 bg-red-300 rounded-full" />
              <span className="w-4 h-1 bg-green-400 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Lê Quý Đôn</h2>
        </div>

        {/* Carousel cho testimonials */}
        <Carousel
          total={testimonials.length}
          autoInterval={5000}
          showDots={true}
          showArrows={true}
          dotsPosition="bottom-right"
          arrowStyle="circle"
          dotActiveClass="bg-white"
          dotInactiveClass="bg-white/40"
          className="min-h-[200px]"
          renderSlide={(index) => {
            const t = testimonials[index];
            return (
              <div className="pb-16">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-sm border-2 border-white/30 shrink-0 font-bold">
                    {t.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-base uppercase">{t.name}</p>
                    <p className="text-sm opacity-70 leading-snug mt-0.5">{t.title}</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 leading-relaxed italic">{t.content}</p>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
