// Chay: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-contacts-settings-nav.ts
// Hoac them vao package.json scripts:
//   "seed:contacts-settings-nav": "ts-node -r tsconfig-paths/register src/database/seeds/seed-contacts-settings-nav.ts"

import { AppDataSource } from '../data-source';
import { Contact, ContactStatus } from '../../modules/contacts/entities/contact.entity';
import { Setting } from '../../modules/settings/entities/setting.entity';
import { MenuItem, MenuTarget } from '../../modules/navigation/entities/menu-item.entity';
import { generateUlid } from '../../common/utils/ulid';

// ═══════════════════════════════════════════════════════════════
// CONTACTS — 25 yeu cau lien he tu phu huynh
// ═══════════════════════════════════════════════════════════════

interface ContactSeed {
  full_name: string;
  email: string;
  phone: string | null;
  content: string;
  status: ContactStatus;
}

const contactsData: ContactSeed[] = [
  // ── NEW (8 records) ──────────────────────────────────────────
  {
    full_name: 'Nguyễn Thị Lan Anh',
    email: 'lananh.nguyen@gmail.com',
    phone: '0912345678',
    content:
      'Kính gửi Ban giám hiệu, tôi muốn hỏi về quy trình đăng ký nhập học lớp 1 cho năm học 2026-2027. Cháu nhà tôi đủ tuổi và tôi mong được biết thủ tục cũng như hồ sơ cần chuẩn bị. Xin nhà trường tư vấn thêm về lịch tiếp nhận hồ sơ.',
    status: ContactStatus.NEW,
  },
  {
    full_name: 'Trần Văn Hùng',
    email: 'vanhung.tran83@yahoo.com',
    phone: '0356789012',
    content:
      'Chào nhà trường, tôi là phụ huynh đang tìm hiểu về chương trình học bán trú tại trường. Bé nhà tôi sẽ vào lớp 2 và tôi muốn biết thực đơn bữa trưa được xây dựng như thế nào, có đảm bảo dinh dưỡng không. Ngoài ra, nhà trường có hỗ trợ cho trẻ dị ứng thực phẩm không ạ?',
    status: ContactStatus.NEW,
  },
  {
    full_name: 'Phạm Minh Châu',
    email: 'minhchau.pham@gmail.com',
    phone: null,
    content:
      'Kính gửi thầy cô, tôi muốn đặt lịch gặp giáo viên chủ nhiệm lớp 3A để trao đổi về tình hình học tập của con tôi. Thời gian thuận tiện nhất với tôi là chiều thứ Ba hoặc thứ Năm hàng tuần. Mong nhà trường sắp xếp giúp.',
    status: ContactStatus.NEW,
  },
  {
    full_name: 'Lê Thị Thu Hà',
    email: 'thuha.le.hn@gmail.com',
    phone: '0978234561',
    content:
      'Xin hỏi nhà trường về lịch học của chương trình Tiếng Anh tăng cường. Con tôi đang học lớp 4 và tôi muốn biết số tiết học mỗi tuần, giáo viên có phải là người bản ngữ không. Học phí của chương trình này có tính thêm không ạ?',
    status: ContactStatus.NEW,
  },
  {
    full_name: 'Hoàng Quốc Tuấn',
    email: 'quoctuan.hoang@gmail.com',
    phone: '0343210987',
    content:
      'Chào nhà trường, tôi muốn hỏi về lịch xe đưa đón học sinh ở khu vực Cầu Giấy. Cháu nhà tôi học lớp 2 và mỗi sáng tôi bận đi làm sớm nên rất cần dịch vụ này. Học phí xe bus trường là bao nhiêu một tháng ạ?',
    status: ContactStatus.NEW,
  },
  {
    full_name: 'Vũ Thị Bích Ngọc',
    email: 'bichngoc.vu@gmail.com',
    phone: null,
    content:
      'Kính gửi nhà trường, tôi muốn hỏi về chương trình trại hè hè 2026 của trường. Con tôi năm nay học lớp 5 và rất thích tham gia các hoạt động ngoại khóa. Nhờ trường cho biết thời gian đăng ký, địa điểm và chi phí của chương trình.',
    status: ContactStatus.NEW,
  },
  {
    full_name: 'Đặng Thị Phương Linh',
    email: 'phuonglinh.dang@yahoo.com',
    phone: '0901234567',
    content:
      'Thưa quý nhà trường, tôi có con chuẩn bị vào lớp 1 và muốn biết thêm về chương trình định hướng kỹ năng sống tại trường. Cụ thể chương trình dạy gì, do ai phụ trách và được tích hợp vào giờ học như thế nào? Tôi rất quan tâm đến việc phát triển kỹ năng cho con.',
    status: ContactStatus.NEW,
  },
  {
    full_name: 'Ngô Thanh Bình',
    email: 'thanhbinh.ngo@gmail.com',
    phone: '0376543210',
    content:
      'Kính gửi Ban giám hiệu, tôi muốn hỏi về lịch khám sức khỏe định kỳ của học sinh. Năm ngoái con tôi đã khám vào tháng 10 nhưng tôi không nhận được kết quả đầy đủ. Nhờ trường hướng dẫn cách tra cứu hoặc nhận phiếu khám sức khỏe của con ạ.',
    status: ContactStatus.NEW,
  },

  // ── READ (10 records) ─────────────────────────────────────────
  {
    full_name: 'Bùi Thị Hồng Nhung',
    email: 'hongnhung.bui@gmail.com',
    phone: '0912876543',
    content:
      'Tôi muốn hỏi về quy trình mua đồng phục học sinh cho năm học mới. Cháu nhà tôi sẽ học lớp 3 từ tháng 9. Nhờ trường cho biết thời điểm mở bán, bảng giá và địa điểm nhận đồng phục để tôi chuẩn bị. Không biết có cần đăng ký trước không ạ?',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Trịnh Quang Vinh',
    email: 'quangvinh.trinh@gmail.com',
    phone: null,
    content:
      'Chào nhà trường, con tôi đang học lớp 1B và tôi muốn hỏi về chương trình STEM & Robotics mà trường đang triển khai. Cụ thể các em học những gì, có cần mua thiết bị riêng không và thời gian học bố trí vào lúc nào trong tuần?',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Phan Thị Lan',
    email: 'thilan.phan@yahoo.com',
    phone: '0358901234',
    content:
      'Kính gửi nhà trường, tôi là mẹ của học sinh lớp 4C. Gần đây con tôi hay kêu đau bụng vào giờ ăn trưa tại trường. Tôi muốn hỏi nhà trường có phòng y tế thường trực không và khi học sinh không khỏe thì nhà trường xử lý như thế nào? Xin thông tin thêm về y tế học đường.',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Nguyễn Hữu Thắng',
    email: 'huuthang.nguyen@gmail.com',
    phone: '0943210987',
    content:
      'Thưa thầy cô, tôi muốn hỏi về chính sách miễn giảm học phí cho gia đình có hoàn cảnh khó khăn. Gia đình tôi đang gặp một số khó khăn về kinh tế và tôi mong nhà trường có thể hỗ trợ cho con tôi tiếp tục học tập. Nhờ trường cho biết điều kiện và hồ sơ cần chuẩn bị.',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Lương Thị Mỹ Duyên',
    email: 'myduyen.luong@gmail.com',
    phone: null,
    content:
      'Xin hỏi về lịch học bán trú từ thứ Hai đến thứ Sáu. Tôi mới chuyển con từ trường khác sang và chưa rõ giờ đón chiều là mấy giờ, có thay đổi theo mùa không. Ngoài ra nhà trường có tổ chức trông trẻ ngoài giờ (trước 7h30 và sau 17h) không ạ?',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Đỗ Việt Anh',
    email: 'vietanh.do@gmail.com',
    phone: '0967890123',
    content:
      'Kính gửi Ban giám hiệu, con tôi học lớp 5 và sắp thi chuyển cấp lên THCS. Tôi muốn hỏi nhà trường có tổ chức ôn thi hoặc lớp bồi dưỡng cho học sinh lớp 5 không. Lịch ôn thi như thế nào và học phí ra sao? Rất mong được tư vấn sớm.',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Cao Thị Thu Trang',
    email: 'thutrang.cao@yahoo.com',
    phone: '0312345678',
    content:
      'Thưa nhà trường, tôi muốn hỏi về các câu lạc bộ năng khiếu của trường như múa, vẽ, âm nhạc. Con gái tôi rất thích hoạt động nghệ thuật và tôi mong tìm cho cháu một sân chơi phù hợp ngay tại trường. Nhờ trường cho biết lịch sinh hoạt và điều kiện tham gia.',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Phùng Văn Khải',
    email: 'vankhai.phung@gmail.com',
    phone: null,
    content:
      'Chào nhà trường, tôi muốn phản ánh rằng cổng trường vào giờ tan học khá đông và việc đón con gặp khó khăn do thiếu biển hiệu phân luồng. Tôi mong nhà trường xem xét bổ sung bảo vệ hỗ trợ phân luồng hoặc có sơ đồ hướng dẫn cho phụ huynh. Ý kiến này mang tính xây dựng, mong được tiếp thu.',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Nguyễn Thị Hải Yến',
    email: 'haiyen.nt@gmail.com',
    phone: '0923456789',
    content:
      'Kính gửi nhà trường, tôi muốn hỏi về thời gian đăng ký nhập học lớp 1 cho con tôi sinh tháng 8/2020. Các giấy tờ cần thiết gồm những gì và quy trình nộp hồ sơ trực tuyến hay trực tiếp? Nhờ nhà trường hồi âm sớm để tôi chuẩn bị kịp.',
    status: ContactStatus.READ,
  },
  {
    full_name: 'Tô Minh Khoa',
    email: 'minhkhoa.to@yahoo.com',
    phone: '0384567890',
    content:
      'Xin hỏi nhà trường về chương trình giáo dục thể chất. Con tôi học lớp 3 và gần đây có biểu hiện không thích giờ thể dục. Tôi muốn biết chương trình thể chất của trường như thế nào, có bao gồm bơi lội không, và làm sao để khuyến khích con tham gia tích cực hơn.',
    status: ContactStatus.READ,
  },

  // ── REPLIED (7 records) ───────────────────────────────────────
  {
    full_name: 'Đinh Thị Thanh Thảo',
    email: 'thanhthao.dinh@gmail.com',
    phone: '0956789012',
    content:
      'Cảm ơn nhà trường đã tư vấn nhiệt tình về chương trình nhập học. Tôi đã nộp đủ hồ sơ và muốn xác nhận lại ngày kiểm tra đầu vào cho con. Theo thông báo là ngày 15/7 nhưng tôi chưa nhận được giấy mời chính thức. Nhờ trường kiểm tra và thông báo lại cho tôi.',
    status: ContactStatus.REPLIED,
  },
  {
    full_name: 'Hà Ngọc Sơn',
    email: 'ngocson.ha@gmail.com',
    phone: null,
    content:
      'Kính gửi nhà trường, tôi đã nhận được phản hồi về chương trình xe đưa đón khu vực Hoàng Mai. Tuy nhiên tôi còn muốn hỏi thêm về quy định đón muộn — nếu tôi đến đón sau 17h30 thì thủ tục như thế nào và có phát sinh chi phí không? Mong nhà trường giải đáp.',
    status: ContactStatus.REPLIED,
  },
  {
    full_name: 'Vương Thị Kim Oanh',
    email: 'kimoanh.vuong@yahoo.com',
    phone: '0908765432',
    content:
      'Thưa nhà trường, trước đây tôi có hỏi về lịch họp phụ huynh đầu năm và đã được trả lời. Nay tôi muốn hỏi thêm về hình thức họp — họp trực tiếp hay qua ứng dụng online? Nếu tôi không thể đến trực tiếp thì có hình thức nào để theo dõi nội dung cuộc họp không ạ?',
    status: ContactStatus.REPLIED,
  },
  {
    full_name: 'Lý Thành Đạt',
    email: 'thanhdtat.ly@gmail.com',
    phone: '0369012345',
    content:
      'Chào nhà trường, tôi đã nhận được thông tin về chương trình bán trú và rất hài lòng với thực đơn. Tôi xin hỏi thêm liệu nhà trường có cho phép phụ huynh tham quan bếp ăn một lần để kiểm tra điều kiện vệ sinh không? Đây là quyền lợi hợp pháp của phụ huynh mà tôi muốn thực hiện.',
    status: ContactStatus.REPLIED,
  },
  {
    full_name: 'Quách Thị Ngân',
    email: 'thinggan.quach@gmail.com',
    phone: null,
    content:
      'Kính gửi nhà trường, tôi đã nhận phản hồi về câu lạc bộ tiếng Anh. Tuy nhiên tôi còn băn khoăn về giáo trình sử dụng — trường dùng giáo trình nào, có theo chuẩn Cambridge không? Con tôi đang học Cambridge Starters bên ngoài và tôi muốn đảm bảo không bị trùng lặp.',
    status: ContactStatus.REPLIED,
  },
  {
    full_name: 'Trương Văn Phúc',
    email: 'vanphuc.truong@gmail.com',
    phone: '0935678901',
    content:
      'Thưa nhà trường, tôi đã nhận được giải thích về sự cố mất đồ của con tôi trong buổi thể dục. Tôi chấp nhận cách giải quyết của nhà trường và cảm ơn cô giáo chủ nhiệm đã nhiệt tình hỗ trợ. Tôi chỉ muốn đề xuất thêm tủ khóa cá nhân cho học sinh trong giờ thể dục để tránh tình trạng tương tự.',
    status: ContactStatus.REPLIED,
  },
  {
    full_name: 'Mạc Thị Bảo Châu',
    email: 'baochau.mac@yahoo.com',
    phone: '0347890123',
    content:
      'Chào nhà trường, sau khi được tư vấn về chương trình STEM tôi đã đăng ký cho con tham gia. Tuy nhiên tôi muốn hỏi thêm về lịch thi giữa kỳ của chương trình — có phải thi riêng hay tích hợp với điểm tổng kết học kỳ? Và kết quả có được ghi vào học bạ không ạ?',
    status: ContactStatus.REPLIED,
  },
];

// ═══════════════════════════════════════════════════════════════
// SETTINGS — 15 cau hinh website
// ═══════════════════════════════════════════════════════════════

interface SettingSeed {
  key: string;
  value: string;
  group: string;
}

const settingsData: SettingSeed[] = [
  // ── general (3) ──────────────────────────────────────────────
  {
    key: 'site_name',
    value: 'Trường Tiểu học Lê Quý Đôn',
    group: 'general',
  },
  {
    key: 'site_description',
    value: 'Trường Tiểu học Lê Quý Đôn Hà Nội — ngôi trường tiểu học tiên tiến, nơi ươm mầm tương lai cho thế hệ trẻ Việt Nam.',
    group: 'general',
  },
  {
    key: 'site_logo',
    value: '/images/logo.png',
    group: 'general',
  },

  // ── contact (4) ──────────────────────────────────────────────
  {
    key: 'contact_email',
    value: 'info@lequydonhanoi.edu.vn',
    group: 'contact',
  },
  {
    key: 'contact_phone',
    value: '024-3456-7890',
    group: 'contact',
  },
  {
    key: 'contact_address',
    value: 'Phố Lê Quý Đôn, Phường Trung Phụng, Quận Đống Đa, Hà Nội',
    group: 'contact',
  },
  {
    key: 'contact_hotline',
    value: '0912-345-678',
    group: 'contact',
  },

  // ── social (3) ───────────────────────────────────────────────
  {
    key: 'facebook_url',
    value: 'https://www.facebook.com/lequydonhanoi',
    group: 'social',
  },
  {
    key: 'youtube_url',
    value: 'https://www.youtube.com/@lequydonhanoi',
    group: 'social',
  },
  {
    key: 'zalo_phone',
    value: '0912345678',
    group: 'social',
  },

  // ── seo (2) ──────────────────────────────────────────────────
  {
    key: 'seo_default_title',
    value: 'Trường Tiểu học Lê Quý Đôn Hà Nội — Ngôi trường tiên tiến, nhân văn',
    group: 'seo',
  },
  {
    key: 'seo_default_description',
    value: 'Trường Tiểu học Lê Quý Đôn Hà Nội cung cấp chương trình giáo dục tiên tiến, toàn diện với các chương trình Tiếng Anh tăng cường, STEM, kỹ năng sống cho học sinh tiểu học.',
    group: 'seo',
  },

  // ── system (3) ───────────────────────────────────────────────
  {
    key: 'google_analytics_id',
    value: 'G-XXXXXXXXXX',
    group: 'system',
  },
  {
    key: 'maintenance_mode',
    value: 'false',
    group: 'system',
  },
  {
    key: 'admission_open',
    value: 'true',
    group: 'system',
  },
];

// ═══════════════════════════════════════════════════════════════
// NAVIGATION — 6 muc cha + 16 muc con = 22 items tong cong
// ═══════════════════════════════════════════════════════════════

interface NavParentSeed {
  label: string;
  url: string;
  target: MenuTarget;
  display_order: number;
  is_visible: boolean;
  children: NavChildSeed[];
}

interface NavChildSeed {
  label: string;
  url: string;
  target: MenuTarget;
  display_order: number;
  is_visible: boolean;
}

const navigationData: NavParentSeed[] = [
  {
    label: 'Trang chủ',
    url: '/',
    target: MenuTarget.SELF,
    display_order: 1,
    is_visible: true,
    children: [],
  },
  {
    label: 'Tổng quan',
    url: '/tong-quan',
    target: MenuTarget.SELF,
    display_order: 2,
    is_visible: true,
    children: [
      {
        label: 'Tầm nhìn & Sứ mệnh',
        url: '/tong-quan/tam-nhin-su-menh',
        target: MenuTarget.SELF,
        display_order: 1,
        is_visible: true,
      },
      {
        label: 'Cột mốc phát triển',
        url: '/tong-quan/cot-moc-phat-trien',
        target: MenuTarget.SELF,
        display_order: 2,
        is_visible: true,
      },
      {
        label: 'Ngôi nhà Lê Quý Đôn',
        url: '/tong-quan/ngoi-nha-le-quy-don',
        target: MenuTarget.SELF,
        display_order: 3,
        is_visible: true,
      },
      {
        label: 'Sắc màu Lê Quý Đôn',
        url: '/tong-quan/sac-mau-le-quy-don',
        target: MenuTarget.SELF,
        display_order: 4,
        is_visible: true,
      },
      {
        label: 'Gia đình Đôners',
        url: '/tong-quan/gia-dinh-doners',
        target: MenuTarget.SELF,
        display_order: 5,
        is_visible: true,
      },
    ],
  },
  {
    label: 'Chương trình',
    url: '/chuong-trinh',
    target: MenuTarget.SELF,
    display_order: 3,
    is_visible: true,
    children: [
      {
        label: 'Tiếng Anh tăng cường',
        url: '/chuong-trinh/tieng-anh-tang-cuong',
        target: MenuTarget.SELF,
        display_order: 1,
        is_visible: true,
      },
      {
        label: 'Chương trình quốc gia nâng cao',
        url: '/chuong-trinh/quoc-gia-nang-cao',
        target: MenuTarget.SELF,
        display_order: 2,
        is_visible: true,
      },
      {
        label: 'Kỹ năng sống',
        url: '/chuong-trinh/ky-nang-song',
        target: MenuTarget.SELF,
        display_order: 3,
        is_visible: true,
      },
      {
        label: 'Thể chất & Nghệ thuật',
        url: '/chuong-trinh/the-chat-nghe-thuat',
        target: MenuTarget.SELF,
        display_order: 4,
        is_visible: true,
      },
      {
        label: 'STEM & Robotics',
        url: '/chuong-trinh/stem-va-robotics',
        target: MenuTarget.SELF,
        display_order: 5,
        is_visible: true,
      },
    ],
  },
  {
    label: 'Tin tức',
    url: '/tin-tuc',
    target: MenuTarget.SELF,
    display_order: 4,
    is_visible: true,
    children: [
      {
        label: 'Tin nổi bật',
        url: '/danh-muc/noi-bat',
        target: MenuTarget.SELF,
        display_order: 1,
        is_visible: true,
      },
      {
        label: 'Sự kiện',
        url: '/su-kien',
        target: MenuTarget.SELF,
        display_order: 2,
        is_visible: true,
      },
      {
        label: 'Hoạt động ngoại khóa',
        url: '/danh-muc/hoat-dong',
        target: MenuTarget.SELF,
        display_order: 3,
        is_visible: true,
      },
    ],
  },
  {
    label: 'Tuyển sinh',
    url: '/tuyen-sinh',
    target: MenuTarget.SELF,
    display_order: 5,
    is_visible: true,
    children: [
      {
        label: 'Thông tin tuyển sinh',
        url: '/tuyen-sinh-2026',
        target: MenuTarget.SELF,
        display_order: 1,
        is_visible: true,
      },
      {
        label: 'Học phí',
        url: '/tuyen-sinh/hoc-phi',
        target: MenuTarget.SELF,
        display_order: 2,
        is_visible: true,
      },
      {
        label: 'Đăng ký online',
        url: '/tuyen-sinh/dang-ky',
        target: MenuTarget.SELF,
        display_order: 3,
        is_visible: true,
      },
    ],
  },
  {
    label: 'Liên hệ',
    url: '/lien-he',
    target: MenuTarget.SELF,
    display_order: 6,
    is_visible: true,
    children: [],
  },
];

// ═══════════════════════════════════════════════════════════════
// SEED RUNNER
// ═══════════════════════════════════════════════════════════════

async function seedContacts(
  contactRepo: import('typeorm').Repository<Contact>,
): Promise<void> {
  console.log('\n[Contacts] Bat dau seed...');
  let inserted = 0;
  let skipped = 0;

  for (const data of contactsData) {
    // Kiem tra trung lap theo email + full_name
    const existing = await contactRepo.findOne({
      where: { email: data.email, full_name: data.full_name },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const contact = contactRepo.create({
      id: generateUlid(),
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      content: data.content,
      status: data.status,
      deleted_at: null,
    });

    await contactRepo.save(contact);
    inserted++;
  }

  console.log(`[Contacts] Xong: ${inserted} inserted, ${skipped} skipped (tong ${contactsData.length})`);
}

async function seedSettings(
  settingRepo: import('typeorm').Repository<Setting>,
): Promise<void> {
  console.log('\n[Settings] Bat dau seed...');
  let inserted = 0;
  let skipped = 0;

  for (const data of settingsData) {
    // Kiem tra trung lap theo key (unique)
    const existing = await settingRepo.findOne({ where: { key: data.key } });

    if (existing) {
      skipped++;
      continue;
    }

    const setting = settingRepo.create({
      id: generateUlid(),
      key: data.key,
      value: data.value,
      group: data.group,
    });

    await settingRepo.save(setting);
    inserted++;
  }

  console.log(`[Settings] Xong: ${inserted} inserted, ${skipped} skipped (tong ${settingsData.length})`);
}

async function seedNavigation(
  menuRepo: import('typeorm').Repository<MenuItem>,
): Promise<void> {
  console.log('\n[Navigation] Bat dau seed...');

  // Kiem tra so luong hien tai — neu da co du lieu thi bo qua
  const existingCount = await menuRepo.count();
  if (existingCount > 0) {
    console.log(`[Navigation] Da co ${existingCount} menu items — bo qua de tranh trung lap.`);
    return;
  }

  let parentInserted = 0;
  let childInserted = 0;

  for (const parentData of navigationData) {
    // Tao muc cha truoc de lay id
    const parent = menuRepo.create({
      id: generateUlid(),
      label: parentData.label,
      url: parentData.url,
      target: parentData.target,
      parent_id: null,
      display_order: parentData.display_order,
      is_visible: parentData.is_visible,
      deleted_at: null,
    });

    const savedParent = await menuRepo.save(parent);
    parentInserted++;

    // Tao cac muc con voi parent_id la id cua muc cha vua luu
    for (const childData of parentData.children) {
      const child = menuRepo.create({
        id: generateUlid(),
        label: childData.label,
        url: childData.url,
        target: childData.target,
        parent_id: savedParent.id,
        display_order: childData.display_order,
        is_visible: childData.is_visible,
        deleted_at: null,
      });

      await menuRepo.save(child);
      childInserted++;
    }
  }

  console.log(
    `[Navigation] Xong: ${parentInserted} parents + ${childInserted} children = ${parentInserted + childInserted} items tong cong.`,
  );
}

async function seed(): Promise<void> {
  console.log('=== SEED: contacts + settings + navigation ===');
  console.log('Khoi tao ket noi database...');

  await AppDataSource.initialize();
  console.log('Ket noi OK.');

  try {
    const contactRepo = AppDataSource.getRepository(Contact);
    const settingRepo = AppDataSource.getRepository(Setting);
    const menuRepo = AppDataSource.getRepository(MenuItem);

    await seedContacts(contactRepo);
    await seedSettings(settingRepo);
    await seedNavigation(menuRepo);

    console.log('\n=== SEED HOAN THANH ===');
  } finally {
    await AppDataSource.destroy();
    console.log('Dong ket noi database.');
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
