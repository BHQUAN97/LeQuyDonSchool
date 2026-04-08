'use client';

import { useState } from 'react';
import PageBanner from '@/components/public/PageBanner';
import { ChevronDown } from 'lucide-react';

const faqCategories = [
  { id: 'tuyen-sinh', label: 'Tuyển sinh' },
  { id: 'hoc-phi', label: 'Học phí' },
  { id: 'chuong-trinh', label: 'Chương trình' },
  { id: 'khac', label: 'Khác' },
];

const faqs = [
  {
    category: 'tuyen-sinh',
    question: 'Điều kiện tuyển sinh lớp 1 là gì?',
    answer:
      'Trẻ đủ 6 tuổi (tính theo năm) tại thời điểm nhập học. Phụ huynh nộp hồ sơ gồm: đơn xin nhập học, giấy khai sinh (bản sao), sổ hộ khẩu (bản sao), giấy khám sức khỏe. Trẻ tham gia buổi kiểm tra đánh giá sự sẵn sàng.',
  },
  {
    category: 'tuyen-sinh',
    question: 'Trường có nhận tuyển sinh giữa năm học không?',
    answer:
      'Có, trường nhận hồ sơ tuyển sinh bổ sung từ lớp 2 đến lớp 5 khi còn chỉ tiêu. Học sinh cần tham gia kiểm tra đánh giá năng lực trước khi nhập học.',
  },
  {
    category: 'tuyen-sinh',
    question: 'Thời gian đăng ký tuyển sinh là khi nào?',
    answer:
      'Thời gian nhận hồ sơ tuyển sinh lớp 1 thường bắt đầu từ tháng 3 hàng năm. Tuyển sinh bổ sung các lớp khác nhận hồ sơ quanh năm.',
  },
  {
    category: 'hoc-phi',
    question: 'Học phí một năm là bao nhiêu?',
    answer:
      'Học phí được công bố chi tiết trong buổi tư vấn tuyển sinh. Học phí bao gồm: học phí chính khóa, phí bán trú, phí Tiếng Anh tăng cường, và các hoạt động ngoại khóa. Phụ huynh vui lòng liên hệ phòng tuyển sinh để nhận bảng học phí chi tiết.',
  },
  {
    category: 'hoc-phi',
    question: 'Trường có chính sách học bổng không?',
    answer:
      'Có, trường có chương trình học bổng hàng năm gồm: Học bổng toàn phần cho học sinh xuất sắc, Học bổng bán phần (50%) theo kết quả đầu vào, Ưu đãi anh chị em ruột cùng theo học.',
  },
  {
    category: 'chuong-trinh',
    question: 'Chương trình học có gì khác biệt?',
    answer:
      'Trường áp dụng chương trình giáo dục quốc gia nâng cao, kết hợp Tiếng Anh tăng cường với giáo viên bản ngữ, giáo dục thể chất & nghệ thuật, và phát triển kỹ năng sống. Học sinh học 2 buổi/ngày với sĩ số nhỏ (tối đa 35 em/lớp).',
  },
  {
    category: 'chuong-trinh',
    question: 'Thời gian học trong ngày như thế nào?',
    answer:
      'Học sinh học từ 7:30 đến 16:30 (bán trú). Buổi sáng: các môn học chính. Buổi chiều: các môn năng khiếu, thể chất, ngoại khóa. Bữa trưa và giờ nghỉ trưa từ 11:30 đến 13:30.',
  },
  {
    category: 'khac',
    question: 'Trường có xe đưa đón không?',
    answer:
      'Có, trường tổ chức xe đưa đón học sinh theo các tuyến cố định trong nội thành Hà Nội. Phí xe bus tính riêng theo khoảng cách. Phụ huynh đăng ký khi nhập học.',
  },
  {
    category: 'khac',
    question: 'Làm thế nào để theo dõi tình hình học tập của con?',
    answer:
      'Phụ huynh theo dõi qua: Ứng dụng điện tử (nhận thông báo, xem điểm, xem ảnh); Sổ liên lạc điện tử hàng tuần; Họp phụ huynh 4 lần/năm; Trao đổi trực tiếp với giáo viên qua email/điện thoại.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 lg:p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900 text-sm pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 lg:px-5 lg:pb-5">
          <p className="text-sm text-slate-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function CauHoiThuongGapPage() {
  const [activeCategory, setActiveCategory] = useState('tuyen-sinh');
  const filteredFaqs = faqs.filter((f) => f.category === activeCategory);

  return (
    <div>
      <PageBanner
        title="Câu hỏi thường gặp"
        description="Giải đáp những thắc mắc phổ biến của phụ huynh"
        breadcrumbItems={[
          { label: 'Tuyển sinh', href: '/tuyen-sinh/thong-tin' },
          { label: 'Câu hỏi thường gặp' },
        ]}
      />

      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category sidebar */}
          <div className="lg:col-span-1">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-green-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ list */}
          <div className="lg:col-span-3 space-y-3">
            {filteredFaqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold mb-3">Chưa tìm thấy câu trả lời?</h2>
          <p className="text-sm opacity-90 mb-6">Liên hệ với chúng tôi để được tư vấn trực tiếp</p>
          <a
            href="/lien-he"
            className="inline-flex px-6 py-3 bg-white text-green-800 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            Liên hệ ngay
          </a>
        </div>
      </section>
    </div>
  );
}
