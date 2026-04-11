import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { AdmissionPost, AdmissionPostStatus } from '../../modules/admissions/entities/admission-post.entity';
import { AdmissionFaq } from '../../modules/admissions/entities/admission-faq.entity';
import { AdmissionRegistration, RegistrationStatus } from '../../modules/admissions/entities/admission-registration.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed du lieu mau cho module Tuyển sinh — Trường Tiểu học Lê Quý Đôn.
 * Idempotent — kiem tra ton tai truoc khi insert.
 * Chay: npm run seed:admissions
 */
async function seed() {
  await AppDataSource.initialize();
  console.log('[SEED] Bat dau seed admissions...');

  // Tim admin user lam created_by
  const userRepo = AppDataSource.getRepository(User);
  const admin = await userRepo.findOne({ where: { role: UserRole.SUPER_ADMIN } });
  if (!admin) {
    console.error('[SEED] Khong tim thay Super Admin. Chay "npm run seed:admin" truoc.');
    await AppDataSource.destroy();
    process.exit(1);
  }
  const adminId = admin.id;

  await seedAdmissionPosts(adminId);
  await seedAdmissionFaqs();
  await seedAdmissionRegistrations();

  console.log('[SEED] Hoan tat seed admissions!');
  await AppDataSource.destroy();
}

// ═══════════════════════════════════════════════════
// ADMISSION POSTS
// ═══════════════════════════════════════════════════

interface AdmissionPostData {
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string | null;
  status: AdmissionPostStatus;
  published_at: Date | null;
}

const admissionPostsData: AdmissionPostData[] = [
  {
    title: 'Thông báo tuyển sinh lớp 1 năm học 2025-2026',
    slug: 'thong-bao-tuyen-sinh-lop-1-nam-hoc-2025-2026',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-1/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-02-01'),
    content: `<h2>Thông báo tuyển sinh lớp 1 năm học 2025-2026</h2>
<p>Trường Tiểu học Lê Quý Đôn, Hà Nội trân trọng thông báo kế hoạch tuyển sinh lớp 1 năm học 2025-2026. Nhà trường tiếp tục thực hiện tuyển sinh theo chủ trương của Sở Giáo dục và Đào tạo Hà Nội, đảm bảo minh bạch, công bằng và thuận tiện cho phụ huynh học sinh.</p>
<h3>Đối tượng tuyển sinh</h3>
<ul>
  <li>Trẻ em sinh năm 2019, đủ 6 tuổi tính đến ngày 31/12/2025</li>
  <li>Có hộ khẩu thường trú hoặc tạm trú dài hạn tại địa bàn tuyển sinh</li>
  <li>Trẻ em có nhu cầu học trường chất lượng cao (ngoài địa bàn) theo chỉ tiêu được phân bổ</li>
</ul>
<h3>Thời gian đăng ký</h3>
<p>Nhà trường tiếp nhận hồ sơ từ ngày <strong>01/06/2025 đến 15/06/2025</strong>. Phụ huynh có thể đăng ký trực tuyến qua cổng tuyển sinh trực tuyến của thành phố hoặc nộp hồ sơ trực tiếp tại văn phòng nhà trường trong giờ hành chính.</p>
<p>Mọi thắc mắc vui lòng liên hệ Ban tuyển sinh: <strong>024.3826.xxxx</strong> hoặc email <strong>tuyensinh@lequydonhanoi.edu.vn</strong>.</p>`,
  },
  {
    title: 'Quy trình và hồ sơ đăng ký nhập học lớp 1',
    slug: 'quy-trinh-va-ho-so-dang-ky-nhap-hoc-lop-1',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-2/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-02-10'),
    content: `<h2>Quy trình và hồ sơ đăng ký nhập học lớp 1</h2>
<p>Để giúp phụ huynh chuẩn bị đầy đủ và nộp hồ sơ thuận tiện, Trường Tiểu học Lê Quý Đôn hướng dẫn chi tiết quy trình đăng ký nhập học lớp 1 năm học 2025-2026.</p>
<h3>Hồ sơ cần chuẩn bị</h3>
<ul>
  <li>Đơn xin nhập học (theo mẫu của nhà trường, tải tại website)</li>
  <li>Bản sao giấy khai sinh (có công chứng)</li>
  <li>Bản sao sổ hộ khẩu hoặc giấy đăng ký tạm trú dài hạn</li>
  <li>Giấy khám sức khỏe do cơ sở y tế có thẩm quyền cấp</li>
  <li>2 ảnh thẻ 3x4 chụp trong vòng 6 tháng gần nhất</li>
</ul>
<h3>Các bước thực hiện</h3>
<p><strong>Bước 1:</strong> Tải và điền đơn đăng ký tại website trường hoặc nhận trực tiếp tại văn phòng.</p>
<p><strong>Bước 2:</strong> Chuẩn bị đầy đủ bộ hồ sơ theo danh sách trên.</p>
<p><strong>Bước 3:</strong> Nộp hồ sơ trực tiếp hoặc đăng ký online trong thời gian quy định.</p>
<p><strong>Bước 4:</strong> Nhận thông báo kết quả qua email hoặc SMS trong vòng 3 ngày làm việc sau khi hết hạn tiếp nhận.</p>`,
  },
  {
    title: 'Học phí và các khoản thu năm học 2025-2026',
    slug: 'hoc-phi-va-cac-khoan-thu-nam-hoc-2025-2026',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-3/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-02-15'),
    content: `<h2>Học phí và các khoản thu năm học 2025-2026</h2>
<p>Nhà trường công khai minh bạch toàn bộ các khoản thu năm học 2025-2026. Phụ huynh vui lòng đọc kỹ để hiểu rõ cơ cấu học phí và chuẩn bị tốt nhất cho con em.</p>
<h3>Học phí cơ bản</h3>
<ul>
  <li>Học phí theo quy định của thành phố: <strong>155.000 đồng/tháng</strong> (chương trình chuẩn)</li>
  <li>Học phí chương trình nâng cao (tiếng Anh tăng cường): <strong>650.000 đồng/tháng</strong></li>
  <li>Bán trú: <strong>950.000 đồng/tháng</strong> (bao gồm ăn trưa, ngủ trưa, quản lý buổi chiều)</li>
</ul>
<h3>Các khoản thu theo thỏa thuận</h3>
<ul>
  <li>Tiền quỹ phụ huynh: do Ban đại diện cha mẹ học sinh quyết định</li>
  <li>Hoạt động ngoại khóa và câu lạc bộ: tùy lựa chọn</li>
  <li>Đồng phục mùa hè, mùa đông: khoảng <strong>500.000 - 700.000 đồng</strong>/bộ</li>
</ul>
<p>Nhà trường <strong>không thu</strong> bất kỳ khoản phí nào ngoài danh mục trên. Phụ huynh có thể phản ánh nếu phát sinh các khoản thu không minh bạch.</p>`,
  },
  {
    title: 'Chính sách học bổng và hỗ trợ học sinh khó khăn',
    slug: 'chinh-sach-hoc-bong-va-ho-tro-hoc-sinh-kho-khan',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-4/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-02-20'),
    content: `<h2>Chính sách học bổng và hỗ trợ học sinh khó khăn</h2>
<p>Trường Tiểu học Lê Quý Đôn cam kết tạo cơ hội học tập bình đẳng cho tất cả học sinh. Nhà trường có nhiều chính sách hỗ trợ học sinh có hoàn cảnh khó khăn và học sinh xuất sắc.</p>
<h3>Học bổng dành cho học sinh xuất sắc</h3>
<ul>
  <li><strong>Học bổng Lê Quý Đôn:</strong> Miễn 100% học phí trong 1 năm học cho học sinh đạt danh hiệu Học sinh Xuất sắc, có hoàn cảnh khó khăn</li>
  <li><strong>Học bổng Khuyến học:</strong> Giảm 50% học phí cho học sinh có thành tích học tập tốt, gia đình thuộc diện hộ nghèo, cận nghèo</li>
</ul>
<h3>Chính sách miễn giảm học phí</h3>
<ul>
  <li>Học sinh thuộc diện hộ nghèo: miễn 100% học phí theo quy định nhà nước</li>
  <li>Học sinh có bố hoặc mẹ là liệt sĩ, thương binh: miễn học phí theo quy định</li>
  <li>Anh/em ruột cùng học một trường: giảm 10% học phí cho em thứ hai trở đi</li>
</ul>
<p>Phụ huynh có nhu cầu xin học bổng hoặc miễn giảm học phí vui lòng liên hệ Ban giám hiệu để được hướng dẫn cụ thể về hồ sơ và thủ tục.</p>`,
  },
  {
    title: 'Đội ngũ giáo viên tận tâm — Nền tảng chất lượng giáo dục',
    slug: 'doi-ngu-giao-vien-tan-tam-nen-tang-chat-luong-giao-duc',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-5/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-01'),
    content: `<h2>Đội ngũ giáo viên tận tâm — Nền tảng chất lượng giáo dục</h2>
<p>Một trong những điểm mạnh nổi bật nhất của Trường Tiểu học Lê Quý Đôn chính là đội ngũ giáo viên giàu kinh nghiệm, tận tâm và không ngừng học hỏi. Với hơn 50 giáo viên có trình độ đại học và sau đại học, nhà trường tự hào mang đến môi trường giảng dạy chuyên nghiệp và ấm áp.</p>
<h3>Thành tích đội ngũ giáo viên</h3>
<ul>
  <li>100% giáo viên đạt chuẩn trình độ đào tạo theo quy định của Bộ GD&ĐT</li>
  <li>85% giáo viên đạt trình độ đại học trở lên, trong đó có 12% có bằng thạc sĩ</li>
  <li>Nhiều giáo viên đạt danh hiệu <strong>Giáo viên giỏi cấp Thành phố</strong></li>
  <li>Thường xuyên tham gia các khóa đào tạo bồi dưỡng chuyên môn trong và ngoài nước</li>
</ul>
<h3>Triết lý giảng dạy</h3>
<p>Giáo viên Lê Quý Đôn đặt học sinh làm trung tâm, khuyến khích tư duy sáng tạo và phát triển toàn diện. Mỗi học sinh được quan tâm cá nhân, giúp các em phát huy tối đa tiềm năng của bản thân.</p>`,
  },
  {
    title: 'Cơ sở vật chất hiện đại — Môi trường học lý tưởng',
    slug: 'co-so-vat-chat-hien-dai-moi-truong-hoc-ly-tuong',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-6/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-05'),
    content: `<h2>Cơ sở vật chất hiện đại — Môi trường học lý tưởng</h2>
<p>Trường Tiểu học Lê Quý Đôn đầu tư mạnh vào cơ sở hạ tầng và thiết bị giảng dạy, tạo môi trường học tập hiện đại, an toàn và kích thích sự sáng tạo của học sinh.</p>
<h3>Phòng học và khu vui chơi</h3>
<ul>
  <li>30 phòng học tiêu chuẩn, đầy đủ điều hòa, máy chiếu và bảng tương tác</li>
  <li>4 phòng lab STEM được trang bị máy tính, robot giáo dục và thiết bị thực hành</li>
  <li>Thư viện với hơn 15.000 đầu sách, khu đọc sách thoáng mát</li>
  <li>Sân chơi ngoài trời rộng rãi với khu vui chơi đạt tiêu chuẩn an toàn</li>
</ul>
<h3>Tiện ích dịch vụ</h3>
<ul>
  <li>Nhà ăn bán trú sạch sẽ, thực đơn dinh dưỡng được chuyên gia tư vấn</li>
  <li>Phòng y tế với y tá chuyên nghiệp trực 24/7 trong giờ học</li>
  <li>Hệ thống camera an ninh toàn trường, giúp phụ huynh yên tâm</li>
  <li>Bãi đỗ xe ô tô và xe máy rộng rãi cho phụ huynh đón đưa</li>
</ul>
<p>Nhà trường liên tục nâng cấp cơ sở vật chất, đảm bảo môi trường học tập tốt nhất cho mỗi thế hệ học sinh.</p>`,
  },
  {
    title: 'Chương trình học — Chuẩn quốc gia và hội nhập quốc tế',
    slug: 'chuong-trinh-hoc-chuan-quoc-gia-va-hoi-nhap-quoc-te',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-7/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-08'),
    content: `<h2>Chương trình học — Chuẩn quốc gia và hội nhập quốc tế</h2>
<p>Trường Tiểu học Lê Quý Đôn thực hiện chương trình giáo dục phổ thông 2018 của Bộ GD&ĐT, đồng thời tích hợp nhiều yếu tố hiện đại để phát triển toàn diện năng lực học sinh trong bối cảnh hội nhập quốc tế.</p>
<h3>Chương trình cơ bản</h3>
<ul>
  <li>Toán, Tiếng Việt, Đạo đức — nền tảng tư duy và nhân cách</li>
  <li>Tự nhiên và xã hội, Lịch sử và Địa lý — hiểu biết thế giới</li>
  <li>Nghệ thuật (Âm nhạc, Mỹ thuật), Thể dục — phát triển thẩm mỹ và thể chất</li>
</ul>
<h3>Chương trình nâng cao và bổ sung</h3>
<ul>
  <li><strong>Tiếng Anh tăng cường:</strong> 4 tiết/tuần với giáo viên bản ngữ và Việt Nam</li>
  <li><strong>Tin học:</strong> Lập trình Scratch, kỹ năng số từ lớp 3</li>
  <li><strong>STEM/STEAM:</strong> Tích hợp tư duy khoa học vào bài học</li>
  <li><strong>Kỹ năng sống:</strong> Chương trình riêng theo từng khối lớp</li>
</ul>
<p>Khung chương trình được thiết kế khoa học, đảm bảo học sinh không bị quá tải, có đủ thời gian vui chơi và phát triển sở thích cá nhân.</p>`,
  },
  {
    title: 'Chương trình tiếng Anh tăng cường — Cánh cửa ra thế giới',
    slug: 'chuong-trinh-tieng-anh-tang-cuong-canh-cua-ra-the-gioi',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-8/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-12'),
    content: `<h2>Chương trình tiếng Anh tăng cường — Cánh cửa ra thế giới</h2>
<p>Chương trình tiếng Anh tăng cường của Trường Tiểu học Lê Quý Đôn được thiết kế bài bản, kết hợp phương pháp giảng dạy hiện đại với đội ngũ giáo viên bản ngữ và Việt Nam có kinh nghiệm, giúp học sinh phát triển 4 kỹ năng Nghe - Nói - Đọc - Viết một cách tự nhiên và hiệu quả.</p>
<h3>Nội dung chương trình</h3>
<ul>
  <li>4 tiết tiếng Anh/tuần (2 tiết với GV Việt Nam + 2 tiết với GV bản ngữ)</li>
  <li>Sử dụng bộ sách <em>Cambridge Primary English</em> kết hợp tài liệu bổ sung nội bộ</li>
  <li>Học tiếng Anh qua dự án, bài hát, trò chơi phù hợp từng độ tuổi</li>
  <li>Cuối năm học sinh thi chứng chỉ Cambridge YLE (tùy chọn, không bắt buộc)</li>
</ul>
<h3>Kết quả đầu ra</h3>
<p>Học sinh hoàn thành chương trình cấp tiểu học tại Lê Quý Đôn có thể giao tiếp tiếng Anh tự tin trong các tình huống hàng ngày, đạt trình độ tương đương A2-B1 theo khung CEFR. Đây là nền tảng vững chắc để tiếp tục học lên THCS và THPT chuyên Anh.</p>`,
  },
  {
    title: 'Hoạt động ngoài giờ và câu lạc bộ phong phú',
    slug: 'hoat-dong-ngoai-gio-va-cau-lac-bo-phong-phu',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-9/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-15'),
    content: `<h2>Hoạt động ngoài giờ và câu lạc bộ phong phú</h2>
<p>Bên cạnh chương trình học chính khóa, Trường Tiểu học Lê Quý Đôn tổ chức hơn 20 câu lạc bộ và hoạt động ngoại khóa đa dạng, giúp học sinh khám phá đam mê và phát triển kỹ năng toàn diện.</p>
<h3>Câu lạc bộ thể thao</h3>
<ul>
  <li>Bóng đá, bơi lội, cầu lông, bóng rổ, võ thuật (Taekwondo)</li>
  <li>Nhảy dây, thể dục dụng cụ, điền kinh</li>
</ul>
<h3>Câu lạc bộ nghệ thuật và học thuật</h3>
<ul>
  <li>Múa, âm nhạc (đàn piano, guitar, trống), mỹ thuật, thư pháp</li>
  <li>Toán tư duy, tiếng Anh nâng cao, lập trình Scratch, robot giáo dục</li>
  <li>Kỹ năng sống, diễn xuất, MC nhí</li>
</ul>
<p>Tất cả câu lạc bộ hoạt động sau giờ học, có thu phí riêng theo từng bộ môn. Phụ huynh đăng ký cho con theo sở thích và khả năng, không bắt buộc.</p>`,
  },
  {
    title: 'Thể chất và dinh dưỡng — Sức khỏe là nền tảng học tập',
    slug: 'the-chat-va-dinh-duong-suc-khoe-la-nen-tang-hoc-tap',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-10/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-18'),
    content: `<h2>Thể chất và dinh dưỡng — Sức khỏe là nền tảng học tập</h2>
<p>Trường Tiểu học Lê Quý Đôn coi trọng sức khỏe thể chất và dinh dưỡng như một phần không thể thiếu trong giáo dục toàn diện. Nhà trường phối hợp chặt chẽ với chuyên gia dinh dưỡng và y tế để đảm bảo mỗi học sinh phát triển khỏe mạnh.</p>
<h3>Chương trình thể chất</h3>
<ul>
  <li>2 tiết thể dục/tuần trong chương trình chính khóa</li>
  <li>Giờ chơi ngoài trời mỗi ngày ít nhất 30 phút</li>
  <li>Ngày hội thể thao thường niên vào tháng 4 hàng năm</li>
  <li>Kiểm tra thể lực định kỳ 2 lần/năm</li>
</ul>
<h3>Dịch vụ bán trú và dinh dưỡng</h3>
<ul>
  <li>Thực đơn tuần được xây dựng bởi chuyên gia dinh dưỡng, đảm bảo đủ 4 nhóm chất</li>
  <li>Kiểm soát vệ sinh an toàn thực phẩm nghiêm ngặt, có camera giám sát bếp ăn</li>
  <li>Nước uống sạch RO, hoa quả tráng miệng theo mùa</li>
  <li>Phụ huynh có thể xem thực đơn hàng tuần qua app nhà trường</li>
</ul>`,
  },
  {
    title: 'Chương trình STEM — Chuẩn bị cho tương lai số',
    slug: 'chuong-trinh-stem-chuan-bi-cho-tuong-lai-so',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-11/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-20'),
    content: `<h2>Chương trình STEM — Chuẩn bị cho tương lai số</h2>
<p>Trong bối cảnh cách mạng công nghiệp 4.0, giáo dục STEM (Khoa học, Công nghệ, Kỹ thuật, Toán học) đóng vai trò then chốt trong việc chuẩn bị thế hệ trẻ cho tương lai. Trường Tiểu học Lê Quý Đôn tự hào là một trong những trường tiểu học tiên phong đưa STEM vào chương trình giảng dạy tại Hà Nội.</p>
<h3>Nội dung STEM tại Lê Quý Đôn</h3>
<ul>
  <li>Phòng Lab STEM hiện đại với robot giáo dục Lego Spike, micro:bit</li>
  <li>Lập trình Scratch từ lớp 3, Python cơ bản từ lớp 5</li>
  <li>Dự án STEM tích hợp liên môn mỗi học kỳ</li>
  <li>Tham gia cuộc thi Khoa học kỹ thuật cấp quận, thành phố</li>
</ul>
<h3>Thành tích STEM nổi bật</h3>
<p>Trong 3 năm gần đây, học sinh Lê Quý Đôn đã giành nhiều giải thưởng tại các cuộc thi STEM cấp quận và thành phố. Năm 2024, đội robot của trường đạt giải Nhì cuộc thi Robotics Hà Nội dành cho học sinh tiểu học.</p>`,
  },
  {
    title: 'Dịch vụ xe đưa đón — An toàn và tiện lợi',
    slug: 'dich-vu-xe-dua-don-an-toan-va-tien-loi',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-12/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-22'),
    content: `<h2>Dịch vụ xe đưa đón — An toàn và tiện lợi</h2>
<p>Hiểu được nỗi lo của các bậc phụ huynh về việc đưa đón con trong giờ cao điểm, Trường Tiểu học Lê Quý Đôn cung cấp dịch vụ xe đưa đón học sinh tận nhà với nhiều tuyến đường phủ khắp nội thành Hà Nội.</p>
<h3>Thông tin dịch vụ</h3>
<ul>
  <li>Xe 16-45 chỗ, có điều hòa, đạt tiêu chuẩn an toàn giao thông</li>
  <li>Có giáo viên/cô bảo mẫu đi kèm trên mỗi xe</li>
  <li>GPS tracking, phụ huynh theo dõi vị trí xe qua app nhà trường</li>
  <li>Hiện có 8 tuyến, phủ các quận: Đống Đa, Hoàn Kiếm, Hai Bà Trưng, Cầu Giấy, Ba Đình, Tây Hồ, Thanh Xuân</li>
</ul>
<h3>Phí dịch vụ</h3>
<p>Phí xe đưa đón dao động từ <strong>500.000 - 800.000 đồng/tháng</strong> tùy theo tuyến đường. Phụ huynh đăng ký theo tháng hoặc theo học kỳ. Liên hệ nhà trường để biết tuyến xe gần nhà và mức phí cụ thể.</p>`,
  },
  {
    title: 'Ngày Hội Mở — Cơ hội khám phá ngôi trường Lê Quý Đôn',
    slug: 'ngay-hoi-mo-co-hoi-kham-pha-ngoi-truong-le-quy-don',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-13/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-25'),
    content: `<h2>Ngày Hội Mở — Cơ hội khám phá ngôi trường Lê Quý Đôn</h2>
<p>Trường Tiểu học Lê Quý Đôn tổ chức <strong>Ngày Hội Mở (Open Day)</strong> dành cho phụ huynh và các em học sinh tương lai. Đây là cơ hội tuyệt vời để gia đình trực tiếp tham quan trường, gặp gỡ Ban Giám hiệu, giáo viên và trải nghiệm các hoạt động học tập thú vị.</p>
<h3>Lịch Open Day 2025</h3>
<ul>
  <li><strong>Đợt 1:</strong> Thứ Bảy, ngày 15/03/2025 — 8:00 đến 11:00</li>
  <li><strong>Đợt 2:</strong> Thứ Bảy, ngày 19/04/2025 — 8:00 đến 11:00</li>
</ul>
<h3>Chương trình Open Day</h3>
<ul>
  <li>Tham quan khuôn viên trường: phòng học, Lab STEM, thư viện, nhà ăn, sân chơi</li>
  <li>Gặp gỡ Ban Giám hiệu và giáo viên chủ nhiệm tiêu biểu</li>
  <li>Trải nghiệm tiết học mẫu: tiếng Anh với GV bản ngữ, STEM, Âm nhạc</li>
  <li>Giải đáp thắc mắc về tuyển sinh, học phí, chương trình học</li>
</ul>
<p>Phụ huynh vui lòng đăng ký trước tại website hoặc gọi điện để nhà trường chuẩn bị chu đáo nhất. Số lượng có hạn, đăng ký sớm để đảm bảo suất!</p>`,
  },
  {
    title: 'Câu chuyện cựu học sinh — Hành trình từ Lê Quý Đôn',
    slug: 'cau-chuyen-cuu-hoc-sinh-hanh-trinh-tu-le-quy-don',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-14/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-03-28'),
    content: `<h2>Câu chuyện cựu học sinh — Hành trình từ Lê Quý Đôn</h2>
<p>Nhiều thế hệ học sinh đã trưởng thành từ mái trường Tiểu học Lê Quý Đôn và tiếp tục ghi dấu ấn tại các trường THCS, THPT danh tiếng và đại học hàng đầu. Dưới đây là những câu chuyện truyền cảm hứng từ các cựu học sinh.</p>
<h3>Em Nguyễn Minh Khoa — Lớp 5B (2019-2020)</h3>
<p>Hiện đang học tại THCS Nguyễn Tất Thành, Khoa chia sẻ: <em>"Những năm tháng ở Lê Quý Đôn cho mình nền tảng tiếng Anh rất tốt và kỹ năng tư duy logic. Mình yêu Toán hơn nhờ các thầy cô ở đây."</em></p>
<h3>Em Trần Thị Bảo Châu — Lớp 5A (2020-2021)</h3>
<p>Hiện học tại THCS Chu Văn An, Bảo Châu chia sẻ: <em>"Chương trình kỹ năng sống và các câu lạc bộ tại Lê Quý Đôn giúp mình tự tin, mạnh dạn hơn rất nhiều. Cô chủ nhiệm luôn quan tâm và lắng nghe từng học sinh."</em></p>
<p>Trường Tiểu học Lê Quý Đôn tự hào khi hàng năm có trên 90% học sinh lớp 5 đỗ vào các trường THCS công lập chất lượng cao và các trường có tiếng ở Hà Nội.</p>`,
  },
  {
    title: 'So sánh chương trình chuẩn và nâng cao — Phụ huynh cần biết gì?',
    slug: 'so-sanh-chuong-trinh-chuan-va-nang-cao-phu-huynh-can-biet-gi',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-15/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-01'),
    content: `<h2>So sánh chương trình chuẩn và nâng cao — Phụ huynh cần biết gì?</h2>
<p>Trường Tiểu học Lê Quý Đôn cung cấp hai luồng chương trình: <strong>Chương trình chuẩn</strong> theo quy định của Bộ GD&ĐT và <strong>Chương trình nâng cao</strong> với tiếng Anh tăng cường. Bài viết này giúp phụ huynh hiểu rõ sự khác biệt để lựa chọn phù hợp cho con.</p>
<h3>Chương trình chuẩn</h3>
<ul>
  <li>Thực hiện đúng theo CT GDPT 2018</li>
  <li>2 tiết tiếng Anh/tuần với GV Việt Nam</li>
  <li>Học phí thấp hơn, phù hợp gia đình có thu nhập trung bình</li>
  <li>Thích hợp cho trẻ yêu thích học theo nhịp độ bình thường</li>
</ul>
<h3>Chương trình nâng cao (Tiếng Anh tăng cường)</h3>
<ul>
  <li>4 tiết tiếng Anh/tuần với cả GV bản ngữ và Việt Nam</li>
  <li>Tích hợp thêm STEM, kỹ năng thế kỷ 21</li>
  <li>Học phí cao hơn (~500.000 đồng/tháng so với chương trình chuẩn)</li>
  <li>Thích hợp cho trẻ năng động, gia đình mong con giỏi ngoại ngữ từ nhỏ</li>
</ul>
<p>Cả hai chương trình đều sử dụng SGK quốc gia, học sinh đều được tham gia đầy đủ các hoạt động ngoại khóa, câu lạc bộ và dịch vụ bán trú của nhà trường.</p>`,
  },
  {
    title: 'Thủ tục chuyển trường — Hướng dẫn cho phụ huynh',
    slug: 'thu-tuc-chuyen-truong-huong-dan-cho-phu-huynh',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-16/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-02'),
    content: `<h2>Thủ tục chuyển trường — Hướng dẫn cho phụ huynh</h2>
<p>Đối với học sinh đã đang học tại trường khác và muốn chuyển về Trường Tiểu học Lê Quý Đôn, nhà trường hướng dẫn thủ tục chuyển trường rõ ràng, đơn giản và nhanh chóng.</p>
<h3>Điều kiện chuyển trường</h3>
<ul>
  <li>Nhà trường có chỉ tiêu còn trống ở lớp tương ứng</li>
  <li>Học sinh đáp ứng yêu cầu học lực theo quy định</li>
  <li>Ưu tiên học sinh có hộ khẩu tại địa bàn trường</li>
</ul>
<h3>Hồ sơ chuyển trường</h3>
<ul>
  <li>Đơn xin chuyển trường (có xác nhận của trường cũ)</li>
  <li>Học bạ gốc từ lớp 1 đến lớp hiện tại</li>
  <li>Giấy xác nhận hoàn thành chương trình học kỳ gần nhất</li>
  <li>Hộ khẩu, giấy khai sinh bản sao</li>
</ul>
<p>Liên hệ phòng hành chính của nhà trường để được tư vấn về chỉ tiêu còn trống và thời điểm tiếp nhận hồ sơ chuyển trường phù hợp.</p>`,
  },
  {
    title: 'Chính sách ưu đãi học phí cho anh chị em trong gia đình',
    slug: 'chinh-sach-uu-dai-hoc-phi-cho-anh-chi-em-trong-gia-dinh',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-17/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-03'),
    content: `<h2>Chính sách ưu đãi học phí cho anh chị em trong gia đình</h2>
<p>Trường Tiểu học Lê Quý Đôn có chính sách ưu đãi đặc biệt dành cho các gia đình có từ 2 con trở lên cùng học tại trường. Đây là cách nhà trường ghi nhận sự tin tưởng và gắn bó của các gia đình qua nhiều năm.</p>
<h3>Mức ưu đãi</h3>
<ul>
  <li>Con thứ hai cùng học tại trường: giảm <strong>10%</strong> học phí tháng</li>
  <li>Con thứ ba trở đi: giảm <strong>15%</strong> học phí tháng</li>
  <li>Ưu đãi áp dụng cho cả học phí chương trình chuẩn và nâng cao</li>
  <li>Ưu đãi áp dụng từ tháng đầu tiên sau khi em/con thứ hai nhập học</li>
</ul>
<h3>Cách đăng ký</h3>
<p>Phụ huynh nộp đơn đề nghị ưu đãi học phí kèm theo giấy khai sinh các con tại văn phòng nhà trường. Ban kế toán sẽ xác nhận và áp dụng giảm giá ngay từ tháng tiếp theo.</p>
<p>Ưu đãi này không áp dụng cộng dồn với các chính sách miễn giảm học phí theo diện chính sách nhà nước.</p>`,
  },
  {
    title: 'Kết quả tuyển sinh năm học 2024-2025 — Nhìn lại để tiến xa hơn',
    slug: 'ket-qua-tuyen-sinh-nam-hoc-2024-2025-nhin-lai-de-tien-xa-hon',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-18/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-05'),
    content: `<h2>Kết quả tuyển sinh năm học 2024-2025 — Nhìn lại để tiến xa hơn</h2>
<p>Năm học 2024-2025, Trường Tiểu học Lê Quý Đôn ghi nhận nhiều tín hiệu tích cực về công tác tuyển sinh. Nhà trường chia sẻ kết quả để phụ huynh hiểu rõ hơn về quy mô và chất lượng của trường.</p>
<h3>Số liệu tuyển sinh 2024-2025</h3>
<ul>
  <li>Tổng số hồ sơ đăng ký: <strong>420 hồ sơ</strong> cho 6 lớp lớp 1 (180 chỉ tiêu)</li>
  <li>Tỷ lệ cạnh tranh: 2,3 hồ sơ/1 chỉ tiêu</li>
  <li>Học sinh trúng tuyển thuộc địa bàn trường: 120 em (67%)</li>
  <li>Học sinh ngoài địa bàn (chương trình nâng cao): 60 em (33%)</li>
</ul>
<h3>Nhận định cho mùa tuyển sinh 2025-2026</h3>
<p>Ban Giám hiệu dự kiến nhu cầu sẽ tiếp tục tăng do uy tín của trường ngày càng được khẳng định. Phụ huynh quan tâm nên đăng ký sớm, nộp đủ hồ sơ và theo dõi thông tin chính thức trên website nhà trường.</p>`,
  },
  {
    title: 'Tổng hợp câu hỏi thường gặp từ phụ huynh mùa tuyển sinh',
    slug: 'tong-hop-cau-hoi-thuong-gap-tu-phu-huynh-mua-tuyen-sinh',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-19/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-06'),
    content: `<h2>Tổng hợp câu hỏi thường gặp từ phụ huynh mùa tuyển sinh</h2>
<p>Trong mùa tuyển sinh, Ban Tuyển sinh nhận được rất nhiều câu hỏi từ phụ huynh. Bài viết này tổng hợp những câu hỏi phổ biến nhất và câu trả lời chi tiết để phụ huynh tiện theo dõi.</p>
<h3>Q: Trẻ học trái tuyến có được nhận không?</h3>
<p><strong>A:</strong> Có, nhưng chỉ khi còn chỉ tiêu sau khi đã nhận đủ học sinh trong địa bàn. Ưu tiên học sinh đăng ký chương trình nâng cao.</p>
<h3>Q: Con tôi chưa biết đọc có vào lớp 1 được không?</h3>
<p><strong>A:</strong> Hoàn toàn được. Nhà trường không yêu cầu trẻ phải biết đọc, biết viết hay biết đếm trước khi vào lớp 1. Chương trình lớp 1 được thiết kế để dạy từ đầu.</p>
<h3>Q: Học sinh nước ngoài hoặc Việt kiều có được nhận không?</h3>
<p><strong>A:</strong> Có, tuy nhiên cần liên hệ trực tiếp với nhà trường để trao đổi về hồ sơ và điều kiện cụ thể theo quy định hiện hành.</p>
<h3>Q: Đăng ký online hay nộp trực tiếp tốt hơn?</h3>
<p><strong>A:</strong> Cả hai hình thức đều được chấp nhận và xử lý như nhau. Đăng ký online tiện lợi hơn, nhưng phụ huynh vẫn cần đến nộp bản gốc hồ sơ trước ngày khai giảng.</p>`,
  },
  {
    title: 'Tour tham quan ảo — Khám phá Lê Quý Đôn từ xa',
    slug: 'tour-tham-quan-ao-kham-pha-le-quy-don-tu-xa',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-20/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-07'),
    content: `<h2>Tour tham quan ảo — Khám phá Lê Quý Đôn từ xa</h2>
<p>Dành cho phụ huynh ở xa hoặc bận rộn chưa có điều kiện đến trực tiếp, Trường Tiểu học Lê Quý Đôn ra mắt <strong>Tour tham quan ảo 360°</strong> trên website, giúp gia đình khám phá toàn bộ khuôn viên ngay từ điện thoại hay máy tính.</p>
<h3>Những gì bạn sẽ thấy trong tour ảo</h3>
<ul>
  <li>Khu vực đón trả học sinh, cổng trường và bãi đỗ xe</li>
  <li>Hành lang và phòng học tiêu chuẩn</li>
  <li>Phòng Lab STEM, phòng máy tính, phòng âm nhạc</li>
  <li>Thư viện, nhà ăn bán trú, phòng y tế</li>
  <li>Sân chơi, sân bóng và khu vui chơi ngoài trời</li>
</ul>
<p>Tour ảo có thể xem tại mục <strong>Về chúng tôi → Tham quan trường</strong> trên website. Chúng tôi cũng có video giới thiệu trường trên kênh YouTube chính thức. Phụ huynh xem xong nếu có thêm câu hỏi hãy liên hệ trực tiếp để được tư vấn thêm.</p>`,
  },
  {
    title: 'Phụ huynh chia sẻ — Tại sao chọn Lê Quý Đôn cho con?',
    slug: 'phu-huynh-chia-se-tai-sao-chon-le-quy-don-cho-con',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-21/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-08'),
    content: `<h2>Phụ huynh chia sẻ — Tại sao chọn Lê Quý Đôn cho con?</h2>
<p>Không có lời giới thiệu nào chân thực hơn những chia sẻ từ chính các bậc phụ huynh đã và đang gửi con tại Trường Tiểu học Lê Quý Đôn. Dưới đây là những câu chuyện thực tế.</p>
<h3>Chị Nguyễn Thị Hà — Phụ huynh lớp 3B</h3>
<p><em>"Mình chọn Lê Quý Đôn vì nghe nhiều người giới thiệu về thầy cô tận tâm. Và đúng thật, cô chủ nhiệm của con mình luôn nhắn tin báo cáo tình hình học tập hàng tuần. Cảm giác an tâm hơn rất nhiều."</em></p>
<h3>Anh Trần Đức Bình — Phụ huynh lớp 2A</h3>
<p><em>"Điều tôi ưng nhất là chương trình không áp lực, con vẫn vui chơi đủ nhưng học lực tốt. Con tôi tiến bộ tiếng Anh rất nhiều chỉ sau 1 năm học."</em></p>
<h3>Chị Lê Phương Linh — Phụ huynh lớp 4C</h3>
<p><em>"Trường sạch sẽ, bữa ăn ngon, giáo viên thân thiện. Quan trọng là con thích đi học, buổi sáng dậy sớm không kêu ca. Đó là điều tôi mong nhất."</em></p>`,
  },
  {
    title: 'Giáo dục 4.0 tại Lê Quý Đôn — Học sinh của tương lai',
    slug: 'giao-duc-4-0-tai-le-quy-don-hoc-sinh-cua-tuong-lai',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-22/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-09'),
    content: `<h2>Giáo dục 4.0 tại Lê Quý Đôn — Học sinh của tương lai</h2>
<p>Cách mạng công nghiệp 4.0 đang thay đổi mọi lĩnh vực, bao gồm cả giáo dục. Trường Tiểu học Lê Quý Đôn chủ động thích ứng và đổi mới, mang đến cho học sinh những trải nghiệm học tập hiện đại nhất phù hợp với lứa tuổi tiểu học.</p>
<h3>Ứng dụng công nghệ trong dạy học</h3>
<ul>
  <li>Bảng tương tác thông minh (Interactive Whiteboard) tại tất cả phòng học</li>
  <li>Phần mềm quản lý học tập kết nối phụ huynh - giáo viên - học sinh</li>
  <li>Thư viện số với hàng nghìn đầu sách điện tử và video bài giảng</li>
  <li>Bài kiểm tra và phản hồi kết quả học tập tức thời qua tablet</li>
</ul>
<h3>Kỹ năng thế kỷ 21</h3>
<p>Ngoài kiến thức, nhà trường chú trọng phát triển <strong>4C</strong> — Critical Thinking (Tư duy phản biện), Creativity (Sáng tạo), Collaboration (Hợp tác) và Communication (Giao tiếp) — những kỹ năng thiết yếu mà AI và robot chưa thể thay thế con người.</p>`,
  },
  {
    title: 'Kế hoạch mở rộng cơ sở mới — Đón đầu nhu cầu tuyển sinh tăng cao',
    slug: 'ke-hoach-mo-rong-co-so-moi-don-dau-nhu-cau-tuyen-sinh-tang-cao',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-23/800/400',
    status: AdmissionPostStatus.DRAFT,
    published_at: null,
    content: `<h2>Kế hoạch mở rộng cơ sở mới — Đón đầu nhu cầu tuyển sinh tăng cao</h2>
<p>Trước nhu cầu ngày càng tăng của phụ huynh và học sinh, Trường Tiểu học Lê Quý Đôn đang trong giai đoạn lên kế hoạch mở rộng với cơ sở mới tại địa điểm thuận tiện hơn cho các gia đình phía Tây Hà Nội.</p>
<h3>Dự kiến cơ sở mới</h3>
<ul>
  <li>Vị trí: khu vực Cầu Giấy - Nam Từ Liêm (đang trong giai đoạn khảo sát)</li>
  <li>Quy mô: 20 phòng học, đủ tiếp nhận 600 học sinh</li>
  <li>Dự kiến khai trương: năm học 2026-2027 (chưa chính thức)</li>
</ul>
<h3>Cam kết về chất lượng</h3>
<p>Dù mở rộng quy mô, nhà trường cam kết duy trì tiêu chuẩn chất lượng đồng đều giữa các cơ sở, với đội ngũ giáo viên được đào tạo thống nhất và chương trình học nhất quán. Thông tin chính thức sẽ được công bố trong thời gian sớm nhất.</p>`,
  },
  {
    title: 'Gia hạn thời gian nộp hồ sơ tuyển sinh — Cơ hội cuối cho phụ huynh',
    slug: 'gia-han-thoi-gian-nop-ho-so-tuyen-sinh-co-hoi-cuoi-cho-phu-huynh',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-24/800/400',
    status: AdmissionPostStatus.DRAFT,
    published_at: null,
    content: `<h2>Gia hạn thời gian nộp hồ sơ tuyển sinh — Cơ hội cuối cho phụ huynh</h2>
<p>Do một số phụ huynh chưa kịp hoàn thiện hồ sơ trong thời gian quy định, Trường Tiểu học Lê Quý Đôn xem xét gia hạn tiếp nhận hồ sơ tuyển sinh thêm 7 ngày. Thông báo chính thức sẽ được đăng sau khi có quyết định từ Ban Giám hiệu.</p>
<h3>Dự kiến thời gian gia hạn</h3>
<ul>
  <li>Thời gian gia hạn (dự kiến): 16/06/2025 đến 22/06/2025</li>
  <li>Áp dụng cho: các hồ sơ chưa nộp hoặc nộp thiếu giấy tờ</li>
  <li>Điều kiện: vẫn còn chỉ tiêu trống sau đợt 1</li>
</ul>
<p>Phụ huynh chưa nộp hồ sơ đừng bỏ lỡ cơ hội này. Tiếp tục theo dõi website nhà trường để cập nhật thông tin chính thức sớm nhất.</p>`,
  },
  {
    title: 'Hướng dẫn đăng ký tuyển sinh trực tuyến năm 2025',
    slug: 'huong-dan-dang-ky-tuyen-sinh-truc-tuyen-nam-2025',
    thumbnail_url: 'https://picsum.photos/seed/lqd-admission-25/800/400',
    status: AdmissionPostStatus.PUBLISHED,
    published_at: new Date('2025-04-10'),
    content: `<h2>Hướng dẫn đăng ký tuyển sinh trực tuyến năm 2025</h2>
<p>Để tạo thuận lợi tối đa cho phụ huynh, Trường Tiểu học Lê Quý Đôn triển khai hệ thống đăng ký tuyển sinh trực tuyến. Phụ huynh có thể thực hiện hoàn toàn trên điện thoại hoặc máy tính mà không cần đến trường.</p>
<h3>Các bước đăng ký trực tuyến</h3>
<ul>
  <li><strong>Bước 1:</strong> Truy cập website nhà trường tại <em>lequydonhanoi.edu.vn</em>, chọn mục <strong>Tuyển sinh → Đăng ký online</strong></li>
  <li><strong>Bước 2:</strong> Điền đầy đủ thông tin học sinh và phụ huynh vào form đăng ký</li>
  <li><strong>Bước 3:</strong> Upload ảnh scan các giấy tờ cần thiết (giấy khai sinh, hộ khẩu)</li>
  <li><strong>Bước 4:</strong> Xác nhận và gửi form. Hệ thống sẽ gửi email xác nhận trong vòng 24 giờ</li>
  <li><strong>Bước 5:</strong> Mang bản gốc hồ sơ đến trường xác minh trong tuần đầu tháng 7</li>
</ul>
<h3>Lưu ý quan trọng</h3>
<p>Đăng ký online chỉ là bước đầu tiên, <strong>chưa đảm bảo chỗ học</strong>. Kết quả trúng tuyển chính thức sẽ được thông báo sau khi nhà trường xét duyệt toàn bộ hồ sơ. Phụ huynh lưu lại mã đăng ký để tra cứu kết quả.</p>`,
  },
];

async function seedAdmissionPosts(adminId: string) {
  const repo = AppDataSource.getRepository(AdmissionPost);
  let created = 0;

  for (const data of admissionPostsData) {
    const existing = await repo.findOne({ where: { slug: data.slug } });
    if (existing) continue;

    await repo.save(
      repo.create({
        id: generateUlid(),
        title: data.title,
        slug: data.slug,
        content: data.content,
        thumbnail_url: data.thumbnail_url,
        status: data.status,
        published_at: data.published_at,
        created_by: adminId,
        updated_by: null,
      }),
    );
    created++;
  }

  console.log(`[SEED] AdmissionPosts: ${created} moi, ${admissionPostsData.length - created} da ton tai.`);
}

// ═══════════════════════════════════════════════════
// ADMISSION FAQS
// ═══════════════════════════════════════════════════

interface AdmissionFaqData {
  question: string;
  answer: string;
  display_order: number;
  is_visible: boolean;
}

const admissionFaqsData: AdmissionFaqData[] = [
  {
    question: 'Trường tiếp nhận học sinh từ lớp mấy đến lớp mấy?',
    answer: 'Trường Tiểu học Lê Quý Đôn tiếp nhận học sinh từ lớp 1 đến lớp 5. Hàng năm nhà trường tổ chức tuyển sinh lớp 1 chính thức theo kế hoạch của Sở GD&ĐT Hà Nội, đồng thời tiếp nhận học sinh chuyển trường ở các khối lớp khác tùy theo chỉ tiêu còn trống.',
    display_order: 1,
    is_visible: true,
  },
  {
    question: 'Học phí tháng là bao nhiêu?',
    answer: 'Học phí chương trình chuẩn là 155.000 đồng/tháng theo quy định thành phố. Học phí chương trình nâng cao (tiếng Anh tăng cường) là 650.000 đồng/tháng. Ngoài ra phí bán trú là 950.000 đồng/tháng nếu học sinh ăn ngủ tại trường. Các khoản thu khác được công khai minh bạch tại văn phòng nhà trường.',
    display_order: 2,
    is_visible: true,
  },
  {
    question: 'Chương trình tiếng Anh tăng cường khác gì so với chương trình thông thường?',
    answer: 'Chương trình tiếng Anh tăng cường có 4 tiết tiếng Anh/tuần thay vì 2 tiết, trong đó có 2 tiết do giáo viên bản ngữ giảng dạy. Học sinh sử dụng sách Cambridge Primary English và có cơ hội thi chứng chỉ Cambridge YLE cuối năm. Mức học phí cao hơn khoảng 500.000 đồng/tháng so với chương trình chuẩn.',
    display_order: 3,
    is_visible: true,
  },
  {
    question: 'Nhà trường có dịch vụ bán trú không? Chi phí như thế nào?',
    answer: 'Có, nhà trường cung cấp dịch vụ bán trú đầy đủ bao gồm ăn trưa, ngủ trưa và quản lý học sinh buổi chiều đến 17h00. Phí bán trú là 950.000 đồng/tháng. Thực đơn do chuyên gia dinh dưỡng xây dựng, đảm bảo đủ 4 nhóm chất dinh dưỡng. Phụ huynh có thể xem thực đơn hàng tuần qua app nhà trường.',
    display_order: 4,
    is_visible: true,
  },
  {
    question: 'Nhà trường có xe đưa đón học sinh không?',
    answer: 'Có, nhà trường cung cấp dịch vụ xe đưa đón học sinh tận nơi với 8 tuyến phủ các quận nội thành. Xe có điều hòa, GPS tracking và giáo viên/bảo mẫu đi kèm. Phí dao động 500.000 - 800.000 đồng/tháng tùy tuyến đường. Phụ huynh liên hệ văn phòng để đăng ký theo tuyến gần nhà.',
    display_order: 5,
    is_visible: true,
  },
  {
    question: 'Mỗi lớp có bao nhiêu học sinh?',
    answer: 'Mỗi lớp tại trường có tối đa 35 học sinh, đảm bảo giáo viên có đủ thời gian quan tâm đến từng em. Hiện tại mỗi khối lớp có 5-6 lớp. Quy mô lớp học nhỏ hơn mức tối đa cho phép giúp chất lượng giảng dạy được duy trì ổn định.',
    display_order: 6,
    is_visible: true,
  },
  {
    question: 'Đồng phục của trường như thế nào? Có bắt buộc mặc không?',
    answer: 'Học sinh bắt buộc mặc đồng phục theo quy định của trường. Bộ đồng phục mùa hè gồm áo trắng và quần/váy navy, bộ đông gồm áo đồng phục dài tay và khoác ngoài. Chi phí khoảng 500.000 - 700.000 đồng/bộ. Nhà trường bán đồng phục chính hãng tại văn phòng đầu năm học.',
    display_order: 7,
    is_visible: true,
  },
  {
    question: 'Sau giờ học chính khóa trường có giữ trẻ không?',
    answer: 'Có, nhà trường tổ chức chương trình bán trú và hoạt động sau giờ học đến 17h30 mỗi ngày trong tuần. Học sinh có thể tham gia các câu lạc bộ ngoại khóa, học thêm các môn năng khiếu hoặc được giáo viên hỗ trợ hoàn thành bài tập. Phụ huynh đăng ký theo tháng hoặc học kỳ.',
    display_order: 8,
    is_visible: true,
  },
  {
    question: 'Nhà trường có các câu lạc bộ thể thao nào?',
    answer: 'Nhà trường có nhiều câu lạc bộ thể thao đa dạng: bóng đá, bơi lội, cầu lông, bóng rổ, Taekwondo, nhảy dây, thể dục dụng cụ. Các CLB hoạt động sau giờ học và thu phí riêng theo từng bộ môn. Học sinh đăng ký theo sở thích, không bắt buộc.',
    display_order: 9,
    is_visible: true,
  },
  {
    question: 'Nhà trường dạy mỹ thuật và âm nhạc không?',
    answer: 'Có, mỹ thuật và âm nhạc là môn học bắt buộc trong chương trình GDPT 2018. Ngoài ra nhà trường còn có câu lạc bộ âm nhạc (đàn piano, guitar, trống) và câu lạc bộ mỹ thuật nâng cao cho học sinh có đam mê. Cuối năm học có liên hoan văn nghệ để học sinh thể hiện tài năng.',
    display_order: 10,
    is_visible: true,
  },
  {
    question: 'Học sinh từ trường khác có thể xin chuyển về không?',
    answer: 'Có thể, nếu nhà trường còn chỉ tiêu trống ở lớp tương ứng. Phụ huynh cần chuẩn bị đơn chuyển trường có xác nhận của trường cũ, học bạ gốc và các giấy tờ cần thiết. Ưu tiên học sinh có hộ khẩu trong địa bàn trường. Liên hệ văn phòng để biết tình trạng chỉ tiêu hiện tại.',
    display_order: 11,
    is_visible: true,
  },
  {
    question: 'Nhà trường có chính sách học bổng không?',
    answer: 'Có, nhà trường có học bổng Lê Quý Đôn (miễn 100% học phí 1 năm) dành cho học sinh xuất sắc có hoàn cảnh khó khăn và học bổng Khuyến học (giảm 50%) cho học sinh học tốt thuộc hộ nghèo, cận nghèo. Học sinh diện chính sách nhà nước được miễn học phí theo quy định. Liên hệ Ban Giám hiệu để biết thêm chi tiết.',
    display_order: 12,
    is_visible: true,
  },
  {
    question: 'Trường có hỗ trợ học sinh khuyết tật hoặc có nhu cầu đặc biệt không?',
    answer: 'Nhà trường hoan nghênh và cam kết tạo môi trường hòa nhập cho học sinh có nhu cầu đặc biệt. Tùy theo mức độ, nhà trường sẽ làm việc với gia đình để xây dựng kế hoạch hỗ trợ phù hợp. Phụ huynh vui lòng liên hệ trực tiếp với Ban Giám hiệu để trao đổi chi tiết trước khi nộp hồ sơ.',
    display_order: 13,
    is_visible: true,
  },
  {
    question: 'Giáo viên liên lạc với phụ huynh như thế nào?',
    answer: 'Nhà trường sử dụng app quản lý học sinh để giáo viên chủ nhiệm gửi thông báo, nhận xét học tập và thông tin sự kiện đến phụ huynh. Ngoài ra có họp phụ huynh định kỳ mỗi học kỳ và gặp riêng theo yêu cầu. Phụ huynh cũng có thể liên hệ trực tiếp giáo viên qua số điện thoại hoặc email được cung cấp đầu năm.',
    display_order: 14,
    is_visible: true,
  },
  {
    question: 'Giờ học và giờ tan trường là mấy giờ?',
    answer: 'Buổi sáng học sinh vào lớp lúc 7h30 và tan trường lúc 11h30. Đối với học sinh bán trú, buổi chiều học từ 13h30 đến 16h30. Phụ huynh đưa đón trong khoảng 7h00-7h30 buổi sáng và 11h30-12h00 hoặc 16h30-17h00 buổi chiều. Nhà trường có bảo vệ và giáo viên giám sát khu vực đón trả.',
    display_order: 15,
    is_visible: true,
  },
  {
    question: 'Nhà trường có chương trình hè không?',
    answer: 'Có, nhà trường tổ chức chương trình hè từ đầu tháng 6 đến cuối tháng 7, bao gồm các hoạt động học thuật (tiếng Anh, Toán tư duy), thể thao, nghệ thuật và kỹ năng sống. Chương trình hè giúp học sinh ôn tập và phát triển thêm trong kỳ nghỉ. Thông tin đăng ký chương trình hè được công bố vào tháng 5 hàng năm.',
    display_order: 16,
    is_visible: true,
  },
  {
    question: 'Sách giáo khoa có phải mua không? Giá bao nhiêu?',
    answer: 'Học sinh cần mua sách giáo khoa theo bộ sách nhà trường đang sử dụng (bộ Cánh Diều). Chi phí sách giáo khoa mỗi năm khoảng 300.000 - 500.000 đồng tùy khối lớp. Nhà trường cung cấp danh sách sách cần mua trước khi khai giảng. Ngoài SGK, học sinh còn cần vở, bút và đồ dùng học tập khác theo hướng dẫn của giáo viên.',
    display_order: 17,
    is_visible: true,
  },
  {
    question: 'Nhà trường có phòng y tế không? Xử lý thế nào khi học sinh bị ốm?',
    answer: 'Nhà trường có phòng y tế với y tá chuyên nghiệp trực trong suốt giờ học. Khi học sinh bị ốm hoặc tai nạn nhỏ, y tá sẽ sơ cứu và thông báo ngay cho phụ huynh. Trường hợp cần cấp cứu, nhà trường sẽ gọi xe cấp cứu và đưa học sinh đến cơ sở y tế gần nhất, đồng thời liên hệ phụ huynh ngay lập tức.',
    display_order: 18,
    is_visible: true,
  },
  {
    question: 'Các biện pháp an toàn trong trường là gì?',
    answer: 'Trường có hệ thống camera an ninh phủ toàn bộ khuôn viên, bảo vệ trực 24/7, cổng trường kiểm soát người ra vào bằng thẻ từ. Khu vực đón trả học sinh có hàng rào phân luồng, giáo viên giám sát. Định kỳ nhà trường tổ chức diễn tập phòng cháy chữa cháy và thoát hiểm cho học sinh.',
    display_order: 19,
    is_visible: true,
  },
  {
    question: 'Khi nào có ngày Hội Mở (Open Day) để tham quan trường?',
    answer: 'Nhà trường tổ chức Open Day 2 lần mỗi năm, thường vào tháng 3 và tháng 4, trước mùa tuyển sinh. Phụ huynh có thể tham quan trường, gặp gỡ Ban Giám hiệu và trải nghiệm tiết học mẫu. Thông tin Open Day được thông báo trên website và fanpage Facebook của trường ít nhất 2 tuần trước.',
    display_order: 20,
    is_visible: true,
  },
  {
    question: 'Có thể đăng ký tuyển sinh online không?',
    answer: 'Có, nhà trường hỗ trợ đăng ký tuyển sinh trực tuyến qua website. Phụ huynh điền form, upload ảnh scan giấy tờ và gửi online. Sau đó mang bản gốc đến xác minh trước khai giảng. Đăng ký online và trực tiếp đều được xử lý như nhau, không phân biệt ưu tiên theo hình thức nộp hồ sơ.',
    display_order: 21,
    is_visible: true,
  },
  {
    question: 'Phụ huynh có thể thanh toán học phí bằng những cách nào?',
    answer: 'Nhà trường chấp nhận thanh toán học phí qua nhiều hình thức: chuyển khoản ngân hàng (có tài khoản chuyên thu), tiền mặt tại văn phòng, và qua app nhà trường (tích hợp VNPay và MoMo). Học phí thu theo tháng hoặc học kỳ, có giảm 2% nếu thanh toán cả năm một lần.',
    display_order: 22,
    is_visible: true,
  },
  {
    question: 'Gia đình có 2 con cùng học trường có được giảm học phí không?',
    answer: 'Có, nhà trường có chính sách ưu đãi dành cho gia đình có 2 con trở lên cùng học. Con thứ hai được giảm 10% học phí tháng, con thứ ba trở đi giảm 15%. Phụ huynh nộp đơn đề nghị kèm giấy khai sinh các con tại văn phòng để được áp dụng ưu đãi ngay từ tháng tiếp theo.',
    display_order: 23,
    is_visible: true,
  },
  {
    question: 'Nếu con không trúng tuyển thì có danh sách chờ không?',
    answer: 'Có, nhà trường lập danh sách chờ cho học sinh chưa trúng tuyển trong đợt chính. Nếu có học sinh trúng tuyển từ bỏ chỗ, nhà trường sẽ liên hệ học sinh trong danh sách chờ theo thứ tự ưu tiên. Phụ huynh được thông báo kết quả và hướng dẫn đăng ký danh sách chờ nếu không trúng tuyển đợt 1.',
    display_order: 24,
    is_visible: false,
  },
  {
    question: 'Trường có hợp tác với trường nước ngoài hoặc tổ chức quốc tế nào không?',
    answer: 'Hiện tại nhà trường đang trong quá trình xây dựng quan hệ đối tác với một số tổ chức giáo dục quốc tế. Chương trình Cambridge YLE là một trong những hoạt động hợp tác quốc tế đầu tiên. Nhà trường cũng thường xuyên mời các chuyên gia giáo dục quốc tế đến chia sẻ và tập huấn cho giáo viên.',
    display_order: 25,
    is_visible: false,
  },
];

async function seedAdmissionFaqs() {
  const repo = AppDataSource.getRepository(AdmissionFaq);
  let created = 0;

  for (const data of admissionFaqsData) {
    // Kiem tra theo noi dung cau hoi (100 ky tu dau)
    const existing = await repo
      .createQueryBuilder('faq')
      .where('faq.question = :question', { question: data.question })
      .getOne();
    if (existing) continue;

    await repo.save(
      repo.create({
        id: generateUlid(),
        question: data.question,
        answer: data.answer,
        display_order: data.display_order,
        is_visible: data.is_visible,
      }),
    );
    created++;
  }

  console.log(`[SEED] AdmissionFaqs: ${created} moi, ${admissionFaqsData.length - created} da ton tai.`);
}

// ═══════════════════════════════════════════════════
// ADMISSION REGISTRATIONS
// ═══════════════════════════════════════════════════

interface AdmissionRegistrationData {
  full_name: string;
  phone: string;
  email: string | null;
  grade: string;
  is_club_member: boolean;
  status: RegistrationStatus;
  note: string | null;
}

const admissionRegistrationsData: AdmissionRegistrationData[] = [
  {
    full_name: 'Nguyễn Thị Hương',
    phone: '0912345678',
    email: 'nguyenthihuong@gmail.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.NEW,
    note: null,
  },
  {
    full_name: 'Trần Văn Minh',
    phone: '0387654321',
    email: 'tranvanminh@yahoo.com',
    grade: 'Lớp 1',
    is_club_member: true,
    status: RegistrationStatus.CONTACTED,
    note: 'Muốn CLB bơi lội',
  },
  {
    full_name: 'Lê Thị Mai Anh',
    phone: '0976543210',
    email: 'lethimaianh@gmail.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.COMPLETED,
    note: null,
  },
  {
    full_name: 'Phạm Đức Anh',
    phone: '0912111222',
    email: null,
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.NEW,
    note: 'Hỏi về xe đưa đón',
  },
  {
    full_name: 'Hoàng Thị Lan',
    phone: '0387222333',
    email: 'hoangthilan@gmail.com',
    grade: 'Lớp 2',
    is_club_member: true,
    status: RegistrationStatus.CONTACTED,
    note: null,
  },
  {
    full_name: 'Vũ Văn Hùng',
    phone: '0976333444',
    email: 'vuvanhung@yahoo.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.COMPLETED,
    note: 'Đã xác nhận nhập học',
  },
  {
    full_name: 'Đỗ Thị Ngọc',
    phone: '0912444555',
    email: 'dothi_ngoc@gmail.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.NEW,
    note: null,
  },
  {
    full_name: 'Bùi Quang Huy',
    phone: '0387555666',
    email: null,
    grade: 'Lớp 3',
    is_club_member: true,
    status: RegistrationStatus.NEW,
    note: 'Muốn CLB bóng đá',
  },
  {
    full_name: 'Ngô Thị Thu',
    phone: '0976666777',
    email: 'ngothithu@gmail.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.CONTACTED,
    note: null,
  },
  {
    full_name: 'Dương Văn Tùng',
    phone: '0912777888',
    email: 'duongvantung88@gmail.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.COMPLETED,
    note: null,
  },
  {
    full_name: 'Phan Thị Bích Ngọc',
    phone: '0387888999',
    email: 'ptbngoc@yahoo.com',
    grade: 'Lớp 1',
    is_club_member: true,
    status: RegistrationStatus.NEW,
    note: 'Hỏi về chương trình tiếng Anh',
  },
  {
    full_name: 'Trương Minh Tuấn',
    phone: '0976999000',
    email: null,
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.CONTACTED,
    note: 'Hỏi về xe đưa đón khu vực Cầu Giấy',
  },
  {
    full_name: 'Lý Thị Cẩm Vân',
    phone: '0912000111',
    email: 'camvan.ly@gmail.com',
    grade: 'Lớp 2',
    is_club_member: false,
    status: RegistrationStatus.COMPLETED,
    note: 'Chuyển từ trường Đống Đa',
  },
  {
    full_name: 'Đinh Quốc Bảo',
    phone: '0387111222',
    email: null,
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.NEW,
    note: null,
  },
  {
    full_name: 'Trần Thị Hồng Nhung',
    phone: '0976222333',
    email: 'hongnhung.tran@gmail.com',
    grade: 'Lớp 1',
    is_club_member: true,
    status: RegistrationStatus.CONTACTED,
    note: 'Muốn đăng ký CLB múa',
  },
  {
    full_name: 'Nguyễn Văn Đức',
    phone: '0912333444',
    email: 'nguyenvanduc97@yahoo.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.NEW,
    note: null,
  },
  {
    full_name: 'Hoàng Thị Mỹ Linh',
    phone: '0387444555',
    email: 'mylinh.hoang@gmail.com',
    grade: 'Lớp 4',
    is_club_member: true,
    status: RegistrationStatus.COMPLETED,
    note: 'Xin chuyển trường từ Thanh Xuân',
  },
  {
    full_name: 'Phùng Minh Khoa',
    phone: '0976555666',
    email: null,
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.COMPLETED,
    note: 'Đã đóng học phí học kỳ 1',
  },
  {
    full_name: 'Cao Thị Thanh Hương',
    phone: '0912666777',
    email: 'thanhhuong.cao@gmail.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.NEW,
    note: 'Hỏi về chính sách học bổng',
  },
  {
    full_name: 'Vũ Thị Lan Anh',
    phone: '0387777888',
    email: null,
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.CONTACTED,
    note: null,
  },
  {
    full_name: 'Đặng Văn Long',
    phone: '0976888999',
    email: 'dangvanlong@yahoo.com',
    grade: 'Lớp 5',
    is_club_member: true,
    status: RegistrationStatus.CONTACTED,
    note: 'Muốn CLB bơi lội và bóng rổ',
  },
  {
    full_name: 'Nguyễn Thị Thu Hà',
    phone: '0912999000',
    email: 'thuha.nguyen@gmail.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.NEW,
    note: null,
  },
  {
    full_name: 'Lê Quang Vinh',
    phone: '0387000111',
    email: null,
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.COMPLETED,
    note: 'Đăng ký chương trình nâng cao',
  },
  {
    full_name: 'Tô Thị Hải Yến',
    phone: '0976111222',
    email: 'haiyento@gmail.com',
    grade: 'Lớp 1',
    is_club_member: true,
    status: RegistrationStatus.NEW,
    note: 'Hỏi về xe đưa đón khu vực Ba Đình',
  },
  {
    full_name: 'Bùi Thị Phương Thảo',
    phone: '0912222333',
    email: 'phuongthao.bui@yahoo.com',
    grade: 'Lớp 1',
    is_club_member: false,
    status: RegistrationStatus.CONTACTED,
    note: null,
  },
];

async function seedAdmissionRegistrations() {
  const repo = AppDataSource.getRepository(AdmissionRegistration);
  let created = 0;

  for (const data of admissionRegistrationsData) {
    // Kiem tra theo so dien thoai (unique per phone)
    const existing = await repo.findOne({ where: { phone: data.phone } });
    if (existing) continue;

    await repo.save(
      repo.create({
        id: generateUlid(),
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        grade: data.grade,
        is_club_member: data.is_club_member,
        status: data.status,
        note: data.note,
      }),
    );
    created++;
  }

  console.log(`[SEED] AdmissionRegistrations: ${created} moi, ${admissionRegistrationsData.length - created} da ton tai.`);
}

seed().catch(e => { console.error(e); process.exit(1); });
