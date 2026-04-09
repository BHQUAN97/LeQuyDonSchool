import { Metadata } from 'next';
import Breadcrumb from '@/components/public/Breadcrumb';
import AccordionFAQ from './AccordionFAQ';
import { buildPageMetadata } from '@/lib/seo-helpers';

export const metadata: Metadata = buildPageMetadata({
  title: 'Câu hỏi thường gặp - Tuyển sinh',
  description:
    'Giải đáp các câu hỏi thường gặp về tuyển sinh Trường Tiểu học Lê Quý Đôn: đối tượng, thời gian, hồ sơ, quy trình tuyển sinh.',
  path: '/tuyen-sinh/cau-hoi-thuong-gap',
});

const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://localhost:4000/api';

/** Danh sach FAQ mac dinh — fallback khi API chua co du lieu */
const DEFAULT_FAQS = [
  {
    question: 'Đối tượng tuyển sinh?',
    answer:
      'Trường tuyển sinh học sinh từ lớp 1 đến lớp 5. Đối với lớp 1, trẻ cần đủ 6 tuổi tính theo năm tại thời điểm nhập học. Đối với các lớp 2-5, trường nhận tuyển sinh bổ sung khi còn chỉ tiêu.',
  },
  {
    question: 'Thời gian tuyển sinh?',
    answer:
      'Thời gian nhận hồ sơ tuyển sinh lớp 1 thường bắt đầu từ tháng 3 hàng năm. Tuyển sinh bổ sung các lớp khác nhận hồ sơ quanh năm khi còn chỉ tiêu.',
  },
  {
    question: 'Hồ sơ tuyển sinh gồm những gì?',
    answer:
      'Hồ sơ tuyển sinh bao gồm: Đơn xin nhập học (theo mẫu của trường), giấy khai sinh (bản sao công chứng), sổ hộ khẩu (bản sao), giấy khám sức khỏe, học bạ (đối với lớp 2-5), và 4 ảnh thẻ 3x4.',
  },
  {
    question: 'Quy trình tuyển sinh?',
    answer:
      'Quy trình gồm 4 bước: (1) Phụ huynh nộp hồ sơ trực tiếp hoặc online, (2) Nhà trường xét duyệt hồ sơ, (3) Học sinh tham gia buổi đánh giá sự sẵn sàng, (4) Nhận kết quả và hoàn tất thủ tục nhập học.',
  },
  {
    question: 'Thời gian học?',
    answer:
      'Học sinh học từ 7:30 đến 16:30 hàng ngày (bán trú). Buổi sáng học các môn chính khóa, buổi chiều học các môn năng khiếu, thể chất và ngoại khóa. Bữa trưa và giờ nghỉ trưa từ 11:30 đến 13:30.',
  },
  {
    question: 'Con chuyển trường từ trường khác đến thì thủ tục như thế nào?',
    answer:
      'Phụ huynh cần chuẩn bị: Đơn xin chuyển trường, học bạ gốc có xác nhận của trường cũ, giấy giới thiệu chuyển trường, giấy khai sinh (bản sao), và sổ hộ khẩu (bản sao). Học sinh sẽ tham gia kiểm tra đánh giá năng lực trước khi nhập học.',
  },
  {
    question: 'Sau khi đăng ký ghi danh, bao lâu thì tôi nhận được email xác nhận từ Nhà trường?',
    answer:
      'Sau khi nhận được hồ sơ đăng ký, Nhà trường sẽ gửi email xác nhận trong vòng 2-3 ngày làm việc. Nếu sau 3 ngày chưa nhận được phản hồi, phụ huynh vui lòng liên hệ phòng tuyển sinh qua hotline hoặc email.',
  },
  {
    question: 'Tôi cần tư vấn chi tiết thì có thể liên hệ như thế nào?',
    answer:
      'Phụ huynh có thể liên hệ qua: Hotline tuyển sinh, Email phòng tuyển sinh, hoặc đến trực tiếp Văn phòng tuyển sinh tại trường trong giờ hành chính (8:00 - 17:00, thứ Hai đến thứ Sáu). Ngoài ra, phụ huynh có thể đặt lịch hẹn tư vấn trực tuyến trên website.',
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

/** Lay danh sach FAQ tu API, fallback ve du lieu mac dinh */
async function getFAQs(): Promise<FAQItem[]> {
  try {
    const res = await fetch(`${INTERNAL_API}/admissions/faqs/public`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

export default async function CauHoiThuongGapPage() {
  const faqs = await getFAQs();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Q&A' }]} />
        </div>
      </div>

      {/* Section title voi flag bars */}
      <section className="max-w-7xl mx-auto px-4 pt-8 lg:pt-12">
        <div className="mb-8">
          {/* Flag bars — xanh/do/xanh */}
          <div className="flex items-center gap-1 mb-3">
            <span className="w-8 h-1 bg-green-700 rounded-full" />
            <span className="w-4 h-1 bg-red-600 rounded-full" />
            <span className="w-8 h-1 bg-green-700 rounded-full" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            TUYỂN SINH
          </h1>
          <p className="text-base text-slate-600">
            Q&A - Câu hỏi thường gặp về Tuyển sinh
          </p>
        </div>

        {/* Accordion FAQ */}
        <AccordionFAQ faqs={faqs} />
      </section>

      {/* Spacing bottom — them padding cho mobile nav bar */}
      <div className="h-20 md:h-16" />
    </div>
  );
}
