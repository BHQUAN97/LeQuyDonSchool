// Chay: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-pages-part3.ts
// Hoac: npm run seed:pages-part3

import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Page, PageStatus } from '../../modules/pages/entities/page.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed part 3 — 8 trang noi dung (pages 18–25) cho website truong tieu hoc Le Quy Don.
 * Idempotent — kiem tra slug truoc khi insert.
 */

async function seed() {
  await AppDataSource.initialize();

  const admin = await AppDataSource.getRepository(User).findOne({
    where: { role: UserRole.SUPER_ADMIN },
  });
  if (!admin) {
    console.error('Chay seed:admin truoc de co tai khoan SUPER_ADMIN');
    process.exit(1);
  }

  const repo = AppDataSource.getRepository(Page);

  const pages: Array<{
    title: string;
    slug: string;
    content: string;
    status: PageStatus;
    seo_title?: string;
    seo_description?: string;
  }> = [
    // ═══════════════════════════════════════════════════
    // PAGE 18 — lien-he (PUBLISHED)
    // ═══════════════════════════════════════════════════
    {
      title: 'Liên hệ',
      slug: 'lien-he',
      status: PageStatus.PUBLISHED,
      seo_title: 'Liên hệ — Trường Tiểu học Lê Quý Đôn Hà Nội',
      seo_description:
        'Thông tin liên hệ trường Tiểu học Lê Quý Đôn: địa chỉ, điện thoại, email, ban giám hiệu và giờ làm việc.',
      content: `<section class="page-content">
<h2>Thông tin liên hệ trường Tiểu học Lê Quý Đôn</h2>
<p>Trường Tiểu học Lê Quý Đôn tọa lạc tại trung tâm quận Đống Đa, Hà Nội — khu vực thuận tiện giao thông, dễ dàng tiếp cận từ nhiều hướng của thành phố. Nhà trường luôn sẵn sàng đón tiếp phụ huynh, học sinh và mọi cá nhân, tổ chức có nhu cầu trao đổi, hợp tác. Chúng tôi cam kết phản hồi mọi yêu cầu trong vòng 24 giờ làm việc.</p>

<h3>Địa chỉ và liên lạc</h3>
<p>Địa chỉ: <strong>Phố Lê Quý Đôn, phường Trung Phụng, quận Đống Đa, Hà Nội</strong>. Trường nằm cách Hồ Gươm khoảng 3 km về phía Tây Nam, gần ngã tư Xã Đàn — một vị trí trung tâm, thuận lợi cho học sinh từ các phường Trung Phụng, Trung Tự, Phương Liên, Kim Liên và các khu vực lân cận.</p>
<ul>
  <li><strong>Điện thoại:</strong> 024-3456-7890</li>
  <li><strong>Fax:</strong> 024-3456-7891</li>
  <li><strong>Email chung:</strong> info@lequydonhanoi.edu.vn</li>
  <li><strong>Email tuyển sinh:</strong> tuyensinh@lequydonhanoi.edu.vn</li>
  <li><strong>Email nhân sự:</strong> hr@lequydonhanoi.edu.vn</li>
</ul>

<h3>Ban giám hiệu</h3>
<p>Ban giám hiệu nhà trường là những nhà quản lý giáo dục giàu kinh nghiệm, tận tâm với sự nghiệp giáo dục và phát triển toàn diện cho học sinh.</p>
<ul>
  <li><strong>Hiệu trưởng:</strong> Cô Nguyễn Thị Minh Hằng — Thạc sĩ Quản lý giáo dục, hơn 20 năm kinh nghiệm trong ngành. Điện thoại: 024-3456-7892. Email: hieutruong@lequydonhanoi.edu.vn</li>
  <li><strong>Phó Hiệu trưởng (Chuyên môn):</strong> Thầy Trần Văn Đức — Thạc sĩ Giáo dục Tiểu học, phụ trách chương trình học và đội ngũ giáo viên. Điện thoại: 024-3456-7893</li>
  <li><strong>Phó Hiệu trưởng (Cơ sở vật chất):</strong> Cô Lê Thị Thu Hương — phụ trách cơ sở hạ tầng, thiết bị và hoạt động hành chính. Điện thoại: 024-3456-7894</li>
</ul>

<h3>Giờ làm việc</h3>
<p>Nhà trường tiếp nhận phụ huynh và giải quyết các thủ tục hành chính trong giờ hành chính. Ngoài giờ, phụ huynh có thể liên hệ qua email hoặc đặt lịch hẹn qua điện thoại để được phục vụ tốt nhất.</p>
<ul>
  <li><strong>Thứ Hai đến Thứ Sáu:</strong> 07:00 — 17:00</li>
  <li><strong>Thứ Bảy:</strong> 07:30 — 11:30 (chỉ nhận hồ sơ tuyển sinh và giải quyết công việc khẩn)</li>
  <li><strong>Chủ Nhật và ngày lễ:</strong> Nghỉ</li>
</ul>

<h3>Hướng dẫn đến trường</h3>
<p>Có nhiều cách để đến trường Tiểu học Lê Quý Đôn. Phụ huynh và học sinh có thể lựa chọn phương tiện phù hợp nhất:</p>
<ul>
  <li><strong>Xe buýt:</strong> Tuyến 32 (Kim Mã — Giáp Bát), dừng tại Xã Đàn; Tuyến 38 (Giáp Bát — Nhổn), dừng tại Lê Duẩn — đi bộ 5 phút; Tuyến 48 (Trần Khánh Dư — Hà Đông), dừng tại Khâm Thiên.</li>
  <li><strong>Xe cá nhân:</strong> Từ trung tâm (Hồ Gươm), đi theo đường Đinh Tiên Hoàng — Trần Nhân Tông — Xã Đàn — rẽ vào phố Lê Quý Đôn. Có bãi đỗ xe ngay trước cổng trường.</li>
  <li><strong>Xe đưa đón của trường:</strong> Nhà trường tổ chức tuyến xe đưa đón theo các tuyến đường chính. Phụ huynh đăng ký tại phòng hành chính hoặc qua email tuyensinh@lequydonhanoi.edu.vn.</li>
</ul>
<p>Trường hiện chưa có bản đồ nhúng trực tiếp trên trang này. Phụ huynh có thể tìm kiếm <em>"Trường Tiểu học Lê Quý Đôn Đống Đa"</em> trên Google Maps hoặc liên hệ trường để được hỗ trợ thêm.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 19 — chinh-sach-bao-mat (HIDDEN)
    // ═══════════════════════════════════════════════════
    {
      title: 'Chính sách bảo mật',
      slug: 'chinh-sach-bao-mat',
      status: PageStatus.HIDDEN,
      seo_title: 'Chính sách bảo mật — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Chính sách bảo mật thông tin cá nhân của trường Tiểu học Lê Quý Đôn — cam kết bảo vệ dữ liệu phụ huynh và học sinh.',
      content: `<section class="page-content">
<h2>Chính sách bảo mật thông tin cá nhân</h2>
<p>Trường Tiểu học Lê Quý Đôn (sau đây gọi là "Nhà trường") tôn trọng và cam kết bảo vệ quyền riêng tư của phụ huynh, học sinh và các cá nhân có giao dịch với nhà trường. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi sử dụng website <strong>lequydonhanoi.edu.vn</strong> và các dịch vụ liên quan. Bằng việc sử dụng website, bạn đồng ý với các điều khoản được nêu trong chính sách này.</p>

<h3>Thu thập thông tin cá nhân</h3>
<p>Nhà trường chỉ thu thập những thông tin cá nhân thực sự cần thiết cho mục đích giáo dục và quản lý. Các loại thông tin chúng tôi có thể thu thập bao gồm: <strong>họ và tên</strong> (phụ huynh và học sinh), <strong>địa chỉ email</strong>, <strong>số điện thoại liên hệ</strong>, thông tin về học sinh (ngày sinh, lớp học, kết quả học tập), địa chỉ cư trú và các thông tin cần thiết cho thủ tục tuyển sinh. Thông tin được thu thập khi phụ huynh điền vào biểu mẫu đăng ký, gửi email liên hệ, hoặc đăng ký tài khoản trên hệ thống quản lý học tập của trường.</p>

<h3>Mục đích sử dụng thông tin</h3>
<p>Thông tin cá nhân được thu thập nhằm phục vụ các mục đích sau: (1) <strong>Liên lạc và thông báo</strong> — gửi thông báo học phí, lịch học, sự kiện nhà trường và các thông tin quan trọng đến phụ huynh; (2) <strong>Quản lý học sinh</strong> — theo dõi quá trình học tập, điểm danh, kết quả học tập và phát triển của học sinh; (3) <strong>Tuyển sinh</strong> — xử lý hồ sơ và thông báo kết quả tuyển sinh; (4) <strong>Cải thiện dịch vụ</strong> — phân tích dữ liệu tổng hợp (ẩn danh) để nâng cao chất lượng giáo dục và dịch vụ. Nhà trường <strong>không sử dụng thông tin cá nhân</strong> cho các mục đích marketing thương mại không liên quan đến giáo dục.</p>

<h3>Không chia sẻ thông tin với bên thứ ba</h3>
<p>Nhà trường cam kết <strong>không bán, không cho thuê, không chia sẻ thông tin cá nhân</strong> của phụ huynh và học sinh với bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được chia sẻ trong các trường hợp: (a) có sự đồng ý rõ ràng của phụ huynh/người giám hộ; (b) theo yêu cầu của cơ quan nhà nước có thẩm quyền theo quy định pháp luật; (c) với các đối tác giáo dục được ủy quyền (như tổ chức thi cử Cambridge, Bộ Giáo dục) trong phạm vi cần thiết cho các chương trình học tập; (d) với đội ngũ cán bộ, giáo viên nhà trường theo phân quyền chặt chẽ, chỉ truy cập thông tin liên quan đến nhiệm vụ của họ.</p>

<h3>Bảo mật thông tin</h3>
<p>Nhà trường áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân. Website sử dụng giao thức <strong>HTTPS/SSL</strong> (mã hóa 256-bit) để mã hóa toàn bộ dữ liệu truyền tải. Hệ thống máy chủ được đặt tại trung tâm dữ liệu đạt chuẩn ISO 27001, được sao lưu định kỳ và bảo vệ bởi tường lửa nhiều lớp. Quyền truy cập vào dữ liệu cá nhân được kiểm soát nghiêm ngặt theo nguyên tắc tối thiểu cần thiết (least privilege). Tuy nhiên, không có hệ thống bảo mật nào hoàn toàn tuyệt đối — nếu phát hiện bất kỳ dấu hiệu vi phạm bảo mật nào, phụ huynh vui lòng thông báo ngay cho nhà trường qua email: <strong>info@lequydonhanoi.edu.vn</strong>.</p>

<h3>Quyền của chủ thể dữ liệu và chính sách Cookie</h3>
<p>Phụ huynh và học sinh (từ 15 tuổi trở lên) có các quyền sau đối với dữ liệu cá nhân của mình theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân: <strong>quyền truy cập</strong> để xem toàn bộ thông tin đang được lưu trữ; <strong>quyền chỉnh sửa</strong> thông tin không chính xác; <strong>quyền xóa</strong> dữ liệu (trong phạm vi không ảnh hưởng đến nghĩa vụ pháp lý); <strong>quyền phản đối</strong> việc xử lý dữ liệu cho một số mục đích nhất định. Để thực hiện các quyền này, vui lòng liên hệ Người phụ trách bảo vệ dữ liệu (DPO) qua email: <strong>info@lequydonhanoi.edu.vn</strong> hoặc gọi 024-3456-7890. Về chính sách Cookie: website sử dụng cookie kỹ thuật (bắt buộc để website hoạt động) và cookie phân tích (Google Analytics — ẩn danh hóa IP). Phụ huynh có thể tắt cookie phân tích trong phần cài đặt trình duyệt mà không ảnh hưởng đến trải nghiệm sử dụng cơ bản. Chính sách bảo mật này có thể được cập nhật định kỳ — mọi thay đổi quan trọng sẽ được thông báo qua email hoặc đăng trên website ít nhất 30 ngày trước khi có hiệu lực.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 20 — dieu-khoan-su-dung (PUBLISHED)
    // ═══════════════════════════════════════════════════
    {
      title: 'Điều khoản sử dụng',
      slug: 'dieu-khoan-su-dung',
      status: PageStatus.PUBLISHED,
      seo_title: 'Điều khoản sử dụng — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Điều khoản và điều kiện sử dụng website trường Tiểu học Lê Quý Đôn Hà Nội.',
      content: `<section class="page-content">
<h2>Điều khoản sử dụng website</h2>
<p>Chào mừng bạn đến với website chính thức của trường Tiểu học Lê Quý Đôn (<strong>lequydonhanoi.edu.vn</strong>). Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng website. Nhà trường có quyền cập nhật, sửa đổi các điều khoản này tại bất kỳ thời điểm nào mà không cần thông báo trước, trừ những thay đổi có ảnh hưởng quan trọng đến quyền lợi người dùng.</p>

<h3>Quyền sở hữu nội dung</h3>
<p>Toàn bộ nội dung trên website — bao gồm nhưng không giới hạn ở văn bản, hình ảnh, logo, biểu tượng, đồ họa, video, âm thanh, tài liệu tải xuống và thiết kế giao diện — là <strong>tài sản thuộc quyền sở hữu của trường Tiểu học Lê Quý Đôn</strong> hoặc đã được cấp phép sử dụng hợp lệ. Các nội dung này được bảo hộ bởi Luật Sở hữu trí tuệ Việt Nam và các quy định pháp luật liên quan. Nghiêm cấm sao chép, phân phối, chỉnh sửa, tái xuất bản, truyền tải hoặc sử dụng bất kỳ phần nào của website cho mục đích thương mại mà không có sự cho phép bằng văn bản từ nhà trường. Việc sử dụng hợp lệ cho mục đích cá nhân, phi thương mại và học thuật được khuyến khích, với điều kiện ghi rõ nguồn và không làm thay đổi ý nghĩa nội dung gốc.</p>

<h3>Quy định sử dụng website</h3>
<p>Người dùng có nghĩa vụ sử dụng website một cách hợp pháp, trung thực và không gây hại cho nhà trường, cộng đồng người dùng khác hoặc bất kỳ bên thứ ba nào. Nghiêm cấm các hành vi sau: đăng tải nội dung vi phạm pháp luật, thuần phong mỹ tục hoặc gây xúc phạm danh dự nhà trường và đội ngũ giáo viên; cố tình tấn công, làm gián đoạn hoặc truy cập trái phép vào hệ thống máy chủ; thu thập thông tin cá nhân của người dùng khác mà không có sự đồng ý; phát tán phần mềm độc hại, virus hoặc bất kỳ mã độc hại nào; sử dụng website để spam hoặc gửi nội dung thương mại không được yêu cầu; mạo danh cán bộ, giáo viên, nhân viên nhà trường.</p>

<h3>Giới hạn trách nhiệm</h3>
<p>Website được cung cấp trên cơ sở <em>"nguyên trạng"</em> (as-is) và <em>"theo khả năng có thể"</em> (as-available). Nhà trường nỗ lực duy trì website hoạt động ổn định và nội dung chính xác, nhưng không đảm bảo website hoạt động liên tục, không có lỗi kỹ thuật. Nhà trường <strong>không chịu trách nhiệm</strong> về các thiệt hại trực tiếp hoặc gián tiếp phát sinh từ: việc không thể truy cập website do sự cố kỹ thuật; quyết định của người dùng dựa trên thông tin từ website; các liên kết đến website bên ngoài; mất mát dữ liệu do yếu tố bất khả kháng. Trong mọi trường hợp, trách nhiệm tối đa của nhà trường không vượt quá giá trị dịch vụ trực tiếp liên quan.</p>

<h3>Liên kết đến website bên ngoài</h3>
<p>Website có thể chứa các liên kết đến website của bên thứ ba — bao gồm cơ quan quản lý giáo dục, đối tác học thuật, tổ chức thi cử quốc tế và các nguồn tài liệu học tập. Những liên kết này được cung cấp chỉ nhằm mục đích tham khảo và thuận tiện cho người dùng. Nhà trường <strong>không kiểm soát, không chứng thực và không chịu trách nhiệm</strong> về nội dung, chính sách bảo mật hay hoạt động của bất kỳ website bên ngoài nào. Người dùng chịu hoàn toàn trách nhiệm khi truy cập và sử dụng các website đó. Nếu phát hiện liên kết dẫn đến nội dung không phù hợp, vui lòng thông báo cho nhà trường qua email: <strong>info@lequydonhanoi.edu.vn</strong>.</p>

<h3>Thay đổi điều khoản và luật áp dụng</h3>
<p>Nhà trường có quyền sửa đổi các điều khoản sử dụng này tại bất kỳ thời điểm nào. Đối với những thay đổi có ảnh hưởng quan trọng, nhà trường sẽ thông báo trên trang chủ hoặc qua email ít nhất 15 ngày trước khi có hiệu lực. Việc tiếp tục sử dụng website sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các điều khoản mới. Mọi tranh chấp phát sinh từ hoặc liên quan đến việc sử dụng website này sẽ được giải quyết theo <strong>pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam</strong>, cụ thể là Luật Công nghệ thông tin 2006, Luật An ninh mạng 2018 và các quy định liên quan. Tòa án có thẩm quyền giải quyết tranh chấp là Tòa án nhân dân có thẩm quyền tại Hà Nội. Nếu có câu hỏi về điều khoản sử dụng, vui lòng liên hệ: <strong>info@lequydonhanoi.edu.vn</strong>.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 21 — chuong-trinh/stem-va-robotics (PUBLISHED)
    // ═══════════════════════════════════════════════════
    {
      title: 'STEM & Robotics',
      slug: 'chuong-trinh/stem-va-robotics',
      status: PageStatus.PUBLISHED,
      seo_title: 'Chương trình STEM & Robotics — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Chương trình STEM và Robotics tại trường Tiểu học Lê Quý Đôn — trang bị tư duy công nghệ từ sớm cho học sinh tiểu học.',
      content: `<section class="page-content">
<h2>Chương trình STEM &amp; Robotics</h2>
<p>Trường Tiểu học Lê Quý Đôn tự hào là một trong những trường tiểu học tiên phong tại Hà Nội triển khai <strong>chương trình STEM &amp; Robotics</strong> toàn diện ngay từ bậc tiểu học. Với quan điểm rằng tư duy khoa học và kỹ năng công nghệ phải được nuôi dưỡng từ sớm, nhà trường đã đầu tư bài bản từ cơ sở vật chất đến chương trình giảng dạy, giúp học sinh tiếp cận với thế giới công nghệ một cách tự nhiên, thú vị và sáng tạo. STEM không chỉ là môn học — đó là cách tư duy giải quyết vấn đề mà chúng tôi muốn trang bị cho mọi học sinh.</p>
<img src="/uploads/placeholder-stem.jpg" alt="Phòng STEM &amp; Robotics trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Cơ sở vật chất phòng STEM</h3>
<p>Phòng STEM của trường được trang bị hiện đại với tổng diện tích 120 m², thiết kế theo tiêu chuẩn phòng học STEM quốc tế. Thiết bị bao gồm: <strong>Bộ Lego Education SPIKE Prime và WeDo 2.0</strong> (30 bộ) cho lập trình kéo thả và lắp ráp cơ bản; <strong>Bộ Arduino Uno và Mega</strong> (20 bộ) cho lập trình nhúng; <strong>Micro:bit BBC</strong> (30 chiếc) cho lập trình IoT và dự án thực tế; <strong>Máy in 3D Creality Ender</strong> (2 máy) cho thiết kế và in mô hình; <strong>Màn hình chiếu tương tác 85 inch</strong> phục vụ giảng dạy trực quan; bộ linh kiện điện tử cơ bản, công cụ lắp ráp và vật liệu tái chế cho các dự án sáng tạo. Phòng được kết nối WiFi tốc độ cao và có khu trưng bày sản phẩm của học sinh.</p>

<h3>Chương trình học theo lớp</h3>
<p>Chương trình STEM &amp; Robotics được thiết kế theo lộ trình phù hợp với độ tuổi và nhận thức của học sinh từng khối lớp, đảm bảo tính liên tục và nâng cao dần độ phức tạp:</p>
<ul>
  <li><strong>Lớp 1 và 2:</strong> Làm quen với tư duy STEM qua các trò chơi lắp ráp, thí nghiệm khoa học đơn giản (trồng cây, làm pin chanh, thí nghiệm màu sắc) và hoạt động nhóm. Thời lượng: 1 tiết/tuần.</li>
  <li><strong>Lớp 3:</strong> Làm quen với Robotics qua bộ Lego WeDo 2.0 — lắp ráp và lập trình các mô hình robot đơn giản (cánh chim, cá bơi, xe chạy). Tìm hiểu các khái niệm cơ bản: cảm biến, động cơ, vòng lặp. Thời lượng: 2 tiết/tuần.</li>
  <li><strong>Lớp 4:</strong> Lập trình cơ bản với Scratch và Micro:bit — tạo game đơn giản, đèn nhấp nháy, đồng hồ đếm giờ. Hiểu về biến, điều kiện if-else, vòng lặp. Thực hiện 2 dự án nhỏ mỗi học kỳ. Thời lượng: 2 tiết/tuần.</li>
  <li><strong>Lớp 5:</strong> Dự án robot hoàn chỉnh với Lego SPIKE Prime và Arduino — lập trình robot né vật cản, robot theo đường màu, xe điều khiển qua Bluetooth. Thiết kế và in 3D phụ kiện. Tham gia thi Robotics cấp quận và cấp thành phố. Thời lượng: 2 tiết/tuần + ngoại khóa tùy chọn.</li>
</ul>

<h3>Hợp tác học thuật và kết quả nổi bật</h3>
<p>Nhà trường đã ký kết hợp tác với <strong>Đại học Bách khoa Hà Nội</strong> (Khoa Điện tử Viễn thông) trong việc thiết kế chương trình, đào tạo giáo viên STEM và tổ chức các buổi tham quan, trải nghiệm thực tế tại phòng lab của trường đại học. Sinh viên Bách khoa cũng định kỳ đến hỗ trợ dạy học và cố vấn cho các dự án STEM của học sinh tiểu học, tạo nên mô hình mentorship thế hệ ý nghĩa.</p>
<p>Những kết quả nổi bật của chương trình STEM &amp; Robotics: <strong>Giải Nhất cuộc thi Robotics cấp Thành phố Hà Nội năm 2025</strong> (nội dung xe tự hành vượt chướng ngại vật); Giải Nhì cuộc thi Sáng tạo Khoa học Kỹ thuật cấp Quận Đống Đa năm 2024; 3 dự án học sinh được lựa chọn trình bày tại Ngày hội STEM Hà Nội 2024; 100% học sinh lớp 5 hoàn thành ít nhất một dự án robot hoàn chỉnh mỗi năm học. Phụ huynh quan tâm đến CLB Robotics ngoại khóa vui lòng liên hệ phòng hành chính hoặc gửi email: <strong>info@lequydonhanoi.edu.vn</strong>.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 22 — hoat-dong-ngoai-khoa (PUBLISHED)
    // ═══════════════════════════════════════════════════
    {
      title: 'Hoạt động ngoại khóa',
      slug: 'hoat-dong-ngoai-khoa',
      status: PageStatus.PUBLISHED,
      seo_title: 'Hoạt động ngoại khóa — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Hơn 15 câu lạc bộ ngoại khóa tại trường Tiểu học Lê Quý Đôn — thể thao, âm nhạc, nghệ thuật, khoa học và nhiều hơn nữa.',
      content: `<section class="page-content">
<h2>Hoạt động ngoại khóa phong phú tại Lê Quý Đôn</h2>
<p>Trường Tiểu học Lê Quý Đôn tin rằng giáo dục toàn diện không thể chỉ dừng lại ở trong lớp học. Hệ thống <strong>hơn 15 câu lạc bộ ngoại khóa</strong> đa dạng được tổ chức bài bản, giúp học sinh khám phá đam mê, phát triển kỹ năng và xây dựng những tình bạn gắn bó. Mỗi câu lạc bộ đều có giáo viên phụ trách chuyên môn, lịch học cố định và chương trình học học kỳ rõ ràng. Nhà trường khuyến khích mỗi học sinh tham gia ít nhất một câu lạc bộ để phát triển toàn diện cả về thể chất lẫn tinh thần.</p>

<h3>Câu lạc bộ Thể thao</h3>
<p>Thể thao không chỉ rèn luyện sức khỏe mà còn dạy tinh thần đồng đội, ý chí vươn lên và sự bền bỉ — những phẩm chất quan trọng cho cả cuộc đời. Các CLB thể thao của trường bao gồm:</p>
<ul>
  <li><strong>CLB Bóng đá:</strong> Dành cho học sinh nam từ lớp 2, tập luyện kỹ thuật căn bản và chiến thuật đội hình. Tham gia giải bóng đá học sinh cấp quận hàng năm. HLV: Thầy Nguyễn Minh Tuấn.</li>
  <li><strong>CLB Bơi lội:</strong> Tập tại bể bơi Đống Đa (cách trường 500m). Phân cấp theo trình độ: mới bắt đầu, trung cấp và nâng cao. Học sinh hoàn thành khóa được cấp chứng chỉ bơi lội an toàn.</li>
  <li><strong>CLB Taekwondo:</strong> Hợp tác với võ đường Kim Mã. Chương trình chuẩn WTF với các cấp đai từ trắng đến vàng. Rèn luyện kỷ luật, tập trung và kỹ năng tự vệ.</li>
  <li><strong>CLB Cờ vua:</strong> Giáo viên chuyên biệt với kinh nghiệm thi đấu quốc gia. Học sinh được học từ khai cuộc đến tàn cuộc. Thi học sinh giỏi cờ vua cấp thành phố.</li>
</ul>

<h3>Câu lạc bộ Âm nhạc và Nghệ thuật</h3>
<p>Nghệ thuật nuôi dưỡng tâm hồn, phát triển tư duy sáng tạo và khả năng biểu đạt cảm xúc. Trường cung cấp môi trường học nghệ thuật chuyên nghiệp ngay trong khuôn viên trường:</p>
<ul>
  <li><strong>CLB Piano:</strong> Phòng nhạc trang bị 8 đàn piano Yamaha Clavinova. Chương trình theo giáo trình ABRSM (Anh). Từ sơ cấp đến Grade 3 cho học sinh tiểu học.</li>
  <li><strong>CLB Guitar:</strong> Guitar cổ điển và guitar điện. Học từ hợp âm cơ bản đến chơi bài đơn giản. Biểu diễn tại hội diễn văn nghệ trường mỗi học kỳ.</li>
  <li><strong>CLB Hội họa:</strong> Tranh màu nước, màu sáp, tranh mực Nhật và vẽ kỹ thuật số cơ bản. Triển lãm tranh học sinh vào cuối năm học. Một số tác phẩm được in để trang trí khuôn viên trường.</li>
  <li><strong>CLB Múa:</strong> Múa dân gian Việt Nam và múa hiện đại (K-pop dance). Tập luyện tiết mục biểu diễn cho các sự kiện nhà trường: khai giảng, 20/11, Tết Nguyên Đán.</li>
  <li><strong>CLB Nhiếp ảnh:</strong> Học cách chụp ảnh đẹp bằng điện thoại và máy ảnh compact. Kỹ thuật bố cục, ánh sáng và chỉnh sửa ảnh cơ bản. Triển lãm ảnh cuối năm.</li>
</ul>

<h3>Câu lạc bộ Học thuật và Kỹ năng</h3>
<p>Bên cạnh thể thao và nghệ thuật, nhà trường còn tổ chức nhiều câu lạc bộ phát triển trí tuệ và kỹ năng sống thiết thực:</p>
<ul>
  <li><strong>CLB Robotics:</strong> Học lập trình và chế tạo robot (xem thêm trang STEM &amp; Robotics). Thi đấu cấp TP hàng năm.</li>
  <li><strong>CLB Tiếng Anh giao tiếp:</strong> Hội thoại thực tế với giáo viên bản ngữ. Tổ chức English Day mỗi tháng. Chuẩn bị cho kỳ thi Cambridge Starters/Movers.</li>
  <li><strong>CLB Khoa học vui:</strong> Thí nghiệm khoa học thú vị mỗi tuần — làm núi lửa phun trào, tên lửa nước, đèn dung nham. Phát triển tư duy khoa học và sự tò mò tự nhiên.</li>
  <li><strong>CLB Nấu ăn:</strong> Học các món ăn Việt Nam truyền thống và một số món quốc tế đơn giản. Rèn kỹ năng tự chăm sóc bản thân và ý thức dinh dưỡng. Có đầu bếp chuyên nghiệp hướng dẫn.</li>
  <li><strong>CLB Làm vườn:</strong> Chăm sóc vườn rau hữu cơ trên sân thượng trường. Học về sinh thái, môi trường và nguồn gốc thực phẩm. Thu hoạch rau sạch đóng góp cho bếp ăn bán trú.</li>
  <li><strong>CLB Đọc sách:</strong> Giờ đọc sách tự do, trao đổi sách, kể chuyện sáng tạo. Tủ sách CLB có hơn 1.000 đầu sách thiếu nhi trong nước và quốc tế (song ngữ).</li>
</ul>

<h3>Lịch học và học phí</h3>
<p>Tất cả các câu lạc bộ ngoại khóa tổ chức từ <strong>Thứ Hai đến Thứ Sáu, từ 15h30 đến 17h00</strong>, ngay sau giờ học chính khóa. Học sinh bán trú sẽ được hỗ trợ chuyển tiếp giữa bữa ăn và giờ CLB. Học phí tham gia CLB dao động từ <strong>500.000 VNĐ đến 1.000.000 VNĐ/tháng</strong> tùy theo câu lạc bộ, bao gồm chi phí giáo viên, dụng cụ học tập và tài liệu cơ bản. Riêng CLB Bơi lội chưa bao gồm phí vào bể. Phụ huynh đăng ký cho con tham gia CLB tại phòng hành chính hoặc gửi email: <strong>info@lequydonhanoi.edu.vn</strong>. Hạn đăng ký mỗi học kỳ: trước ngày 20 tháng đầu học kỳ.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 23 — thu-vien-anh (DRAFT)
    // ═══════════════════════════════════════════════════
    {
      title: 'Thư viện ảnh',
      slug: 'thu-vien-anh',
      status: PageStatus.DRAFT,
      seo_title: 'Thư viện ảnh — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Thư viện ảnh hoạt động trường Tiểu học Lê Quý Đôn — khai giảng, ngày nhà giáo, Trung thu, hội thể thao, dã ngoại và văn nghệ.',
      content: `<section class="page-content">
<h2>Thư viện ảnh hoạt động trường</h2>
<p>Thư viện ảnh là nơi lưu giữ những khoảnh khắc đáng nhớ trong hành trình học tập và trưởng thành của các thế hệ học sinh trường Tiểu học Lê Quý Đôn. Mỗi bức ảnh là một mảnh ghép của ký ức đẹp — nụ cười của trẻ em trong ngày khai giảng, những tia mắt háo hức khi được thực hành thí nghiệm, hay những giọt mồ hôi trên sân bóng trong Hội khỏe Phù Đổng. Phụ huynh và học sinh có thể tìm lại những hình ảnh thân thương qua các album được sắp xếp theo chủ đề và thời gian.</p>

<h3>Các album ảnh chính</h3>
<p>Thư viện được tổ chức thành nhiều album theo các sự kiện và hoạt động tiêu biểu của trường trong suốt năm học:</p>
<ul>
  <li><strong>Album Khai giảng:</strong> Lưu giữ hình ảnh lễ khai giảng năm học mới — học sinh lớp 1 trong tà áo dài trắng, nghi thức chào cờ, tiết mục văn nghệ mở đầu năm học đầy ý nghĩa và xúc động.</li>
  <li><strong>Album Ngày Nhà giáo Việt Nam 20/11:</strong> Những bó hoa tươi thắm từ bàn tay nhỏ bé học sinh, tiết mục văn nghệ chúc mừng thầy cô, và những khoảnh khắc ấm áp giữa thầy trò.</li>
  <li><strong>Album Tết Trung thu:</strong> Rước đèn, phá cỗ, múa lân và các tiết mục văn nghệ đặc sắc trong đêm Trung thu sáng ánh đèn lồng. Nụ cười rạng rỡ của các em nhỏ là hình ảnh không thể quên.</li>
  <li><strong>Album Hội khỏe Phù Đổng:</strong> Không khí tưng bừng của ngày hội thể dục thể thao — điền kinh, bóng đá, bơi lội, cờ vua. Tinh thần thể thao và sự cổ vũ nhiệt tình của toàn trường.</li>
  <li><strong>Album Dã ngoại:</strong> Các chuyến tham quan học tập tại Văn Miếu, Bảo tàng Lịch sử, Vườn thú Hà Nội, Làng gốm Bát Tràng và các điểm đến giáo dục khác trong và ngoài thành phố.</li>
  <li><strong>Album Văn nghệ và Lễ hội:</strong> Các buổi biểu diễn văn nghệ chào mừng, hội diễn cuối năm, các tiết mục múa, hát và kịch của học sinh toàn trường.</li>
</ul>
<p>Thư viện ảnh hiện đang trong quá trình cập nhật và bổ sung thêm nội dung. Các album ảnh mới từ năm học 2024–2025 sẽ được đăng tải trong thời gian sớm nhất. Phụ huynh có ảnh đẹp muốn chia sẻ với cộng đồng trường, vui lòng gửi về địa chỉ: <strong>info@lequydonhanoi.edu.vn</strong> với tiêu đề <em>"Ảnh đóng góp — [Tên sự kiện]"</em>. Nhà trường sẽ xem xét và đăng tải sau khi được kiểm duyệt.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 24 — tuyen-dung (PUBLISHED)
    // ═══════════════════════════════════════════════════
    {
      title: 'Tuyển dụng giáo viên',
      slug: 'tuyen-dung',
      status: PageStatus.PUBLISHED,
      seo_title: 'Tuyển dụng giáo viên — Trường Tiểu học Lê Quý Đôn Hà Nội',
      seo_description:
        'Trường Tiểu học Lê Quý Đôn tuyển dụng giáo viên Toán, Tiếng Anh, Thể dục, Mỹ thuật — môi trường làm việc chuyên nghiệp, lương cạnh tranh.',
      content: `<section class="page-content">
<h2>Tuyển dụng giáo viên năm học 2025–2026</h2>
<p>Trường Tiểu học Lê Quý Đôn đang tìm kiếm những giáo viên tài năng, tâm huyết và yêu nghề để bổ sung vào đội ngũ nhà giáo của trường. Chúng tôi tin rằng <strong>giáo viên tốt là nền tảng của giáo dục tốt</strong>. Vì vậy, nhà trường không chỉ coi trọng trình độ chuyên môn mà còn đặc biệt đánh giá cao tình yêu trẻ em, tinh thần cầu thị và khả năng sáng tạo trong giảng dạy. Hãy cùng chúng tôi xây dựng môi trường giáo dục xuất sắc cho thế hệ tương lai của Hà Nội.</p>

<h3>Vị trí đang tuyển dụng</h3>
<p>Nhà trường hiện có nhu cầu tuyển dụng các vị trí sau trong năm học 2025–2026:</p>
<ul>
  <li>
    <strong>Giáo viên Toán (2 vị trí)</strong><br />
    Phụ trách dạy Toán cho học sinh lớp 3, 4 và 5. Kỳ vọng giáo viên có khả năng truyền đạt sinh động, tổ chức các trò chơi học Toán và áp dụng phương pháp dạy học tích cực. Ưu tiên giáo viên có kinh nghiệm dạy học theo Chương trình GDPT 2018.
  </li>
  <li>
    <strong>Giáo viên Tiếng Anh (1 vị trí)</strong><br />
    Dạy Tiếng Anh tăng cường cho lớp 1–5 theo giáo trình Cambridge Primary. Yêu cầu: phát âm chuẩn, có kinh nghiệm dạy học sinh tiểu học, ưu tiên có chứng chỉ CELTA hoặc TKT. Phối hợp với giáo viên bản ngữ trong một số tiết dạy.
  </li>
  <li>
    <strong>Giáo viên Thể dục (1 vị trí)</strong><br />
    Phụ trách các tiết Thể dục chính khóa và hỗ trợ CLB thể thao ngoại khóa. Có khả năng tổ chức và điều hành Hội khỏe Phù Đổng cấp trường. Ưu tiên có năng khiếu bơi lội hoặc bóng đá.
  </li>
  <li>
    <strong>Giáo viên Mỹ thuật (1 vị trí)</strong><br />
    Dạy Mỹ thuật theo chương trình tích hợp với định hướng STEAM. Hướng dẫn CLB Hội họa ngoại khóa. Tổ chức triển lãm tranh học sinh cuối năm. Ưu tiên giáo viên có kiến thức về thiết kế số và nghệ thuật thị giác đương đại.
  </li>
</ul>

<h3>Yêu cầu chung</h3>
<p>Ngoài các yêu cầu chuyên môn riêng của từng vị trí, tất cả ứng viên cần đáp ứng các tiêu chí chung sau: <strong>bằng Đại học Sư phạm</strong> đúng chuyên ngành (hoặc bằng Đại học chuyên ngành + chứng chỉ nghiệp vụ sư phạm); kinh nghiệm giảng dạy bậc tiểu học tối thiểu <strong>2 năm</strong>; kỹ năng tin học văn phòng tốt (Word, Excel, PowerPoint) và có thể sử dụng phần mềm giáo dục; yêu trẻ em, kiên nhẫn, có khả năng giao tiếp tốt với phụ huynh và học sinh; sức khỏe tốt, không có tiền án tiền sự liên quan đến trẻ em; cam kết gắn bó ít nhất 1 năm học và có định hướng lâu dài trong nghề.</p>

<h3>Quyền lợi và chế độ đãi ngộ</h3>
<p>Nhà trường cam kết tạo môi trường làm việc chuyên nghiệp, nhân văn và có cơ hội phát triển nghề nghiệp rõ ràng. Quyền lợi bao gồm: <strong>mức lương cạnh tranh</strong> (thỏa thuận theo kinh nghiệm và năng lực, tham chiếu thang lương nhà nước); đóng đầy đủ <strong>BHXH, BHYT, BHTN</strong> theo quy định; thưởng lễ Tết, thưởng tháng 13 theo năng lực; <strong>hỗ trợ đào tạo nâng cao</strong> — trường chi trả 100% học phí các khóa bồi dưỡng chuyên môn, hội thảo giáo dục trong nước; ưu tiên giảm học phí 30-50% cho con em giáo viên theo học tại trường; <strong>môi trường làm việc thân thiện</strong>, được trang bị đầy đủ thiết bị dạy học hiện đại; nghỉ hè và nghỉ lễ theo lịch nhà nước; hoạt động teambuilding, du lịch nội bộ hàng năm.</p>

<h3>Cách nộp hồ sơ</h3>
<p>Ứng viên quan tâm vui lòng gửi hồ sơ (CV kèm ảnh 3x4, bằng cấp chứng chỉ scan) về địa chỉ email: <strong>hr@lequydonhanoi.edu.vn</strong> với tiêu đề email: <em>"[Vị trí ứng tuyển] — Họ và tên"</em>. Hồ sơ nhận đến hết ngày <strong>31/05/2025</strong>. Ứng viên phù hợp sẽ được liên hệ để phỏng vấn trong vòng 7 ngày làm việc sau khi nộp hồ sơ. Vui lòng không gửi hồ sơ qua bưu điện — nhà trường chỉ nhận hồ sơ qua email. Mọi thắc mắc, liên hệ phòng nhân sự: 024-3456-7890 (trong giờ hành chính).</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 25 — cau-hoi-thuong-gap (PUBLISHED)
    // ═══════════════════════════════════════════════════
    {
      title: 'Câu hỏi thường gặp',
      slug: 'cau-hoi-thuong-gap',
      status: PageStatus.PUBLISHED,
      seo_title: 'Câu hỏi thường gặp (FAQ) — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Giải đáp các câu hỏi thường gặp về tuyển sinh, học phí, tiếng Anh, bán trú, đồng phục và hoạt động ngoại khóa tại trường Tiểu học Lê Quý Đôn.',
      content: `<section class="page-content">
<h2>Câu hỏi thường gặp</h2>
<p>Dưới đây là danh sách những câu hỏi phụ huynh hỏi nhiều nhất về trường Tiểu học Lê Quý Đôn. Chúng tôi cập nhật thường xuyên để cung cấp thông tin chính xác và mới nhất. Nếu câu hỏi của bạn chưa được giải đáp ở đây, vui lòng liên hệ trực tiếp qua hotline <strong>024-3456-7890</strong> hoặc email <strong>info@lequydonhanoi.edu.vn</strong>.</p>

<h3>1. Trường Tiểu học Lê Quý Đôn tuyển sinh cho những khối lớp nào?</h3>
<p>Nhà trường tuyển sinh từ <strong>lớp 1 đến lớp 5</strong> — toàn bộ cấp tiểu học. Hàng năm, trường tuyển sinh đầu vào chính thức cho <strong>lớp 1</strong> (dành cho trẻ em sinh năm 2019 vào năm học 2025–2026, đủ 6 tuổi trước ngày 01/09). Các khối lớp 2–5 nhận học sinh chuyển trường tùy theo chỉ tiêu còn trống. Phụ huynh quan tâm đến chuyển trường vui lòng liên hệ phòng tuyển sinh để biết số lượng chỉ tiêu còn lại từng lớp.</p>

<h3>2. Học phí năm học 2025–2026 là bao nhiêu?</h3>
<p>Học phí của trường được chia thành hai phần: <strong>học phí chính khóa</strong> (theo quy định UBND Quận Đống Đa, áp dụng thống nhất cho tất cả trường công lập trên địa bàn) và <strong>các khoản thu dịch vụ tự nguyện</strong> bao gồm bán trú, xe đưa đón, câu lạc bộ ngoại khóa và học Tiếng Anh tăng cường với giáo viên bản ngữ. Chi tiết mức thu cụ thể sẽ được thông báo tại buổi họp phụ huynh đầu năm học hoặc bạn có thể liên hệ phòng kế toán: <strong>024-3456-7895</strong>.</p>

<h3>3. Trường có dạy tiếng Anh với giáo viên bản ngữ không?</h3>
<p>Có. Nhà trường tổ chức chương trình <strong>Tiếng Anh tăng cường với giáo viên bản ngữ</strong> (Native Speaker) từ lớp 1 đến lớp 5, với tần suất 2 tiết/tuần do giáo viên nước ngoài đứng lớp, phối hợp cùng giáo viên tiếng Anh Việt Nam. Chương trình theo giáo trình Cambridge Primary và hướng tới kỳ thi Cambridge Young Learners (Starters, Movers, Flyers). Đây là chương trình tự nguyện, phụ huynh đóng thêm học phí tương ứng. Hơn 90% học sinh hiện tại của trường tham gia chương trình này.</p>

<h3>4. Trường có tổ chức bán trú không? Bữa ăn như thế nào?</h3>
<p>Trường tổ chức <strong>bán trú 5 ngày/tuần</strong> (Thứ Hai đến Thứ Sáu). Học sinh bán trú được ăn trưa tại canteen trường và nghỉ ngơi buổi trưa có giám sát. Thực đơn do chuyên gia dinh dưỡng xây dựng, đảm bảo đủ 4 nhóm chất, thay đổi hàng tuần và được công bố trên nhóm Zalo phụ huynh. Thực phẩm được nhập từ nhà cung cấp có hợp đồng kiểm định an toàn thực phẩm hàng tháng. Phụ huynh có thể đăng ký bán trú theo tháng hoặc theo ngày tùy nhu cầu.</p>

<h3>5. Trường có xe đưa đón học sinh không? Phạm vi phục vụ đến đâu?</h3>
<p>Trường tổ chức <strong>dịch vụ xe đưa đón</strong> theo 6 tuyến chính bao phủ các khu vực: Đống Đa, Thanh Xuân, Cầu Giấy, Hai Bà Trưng, Hoàn Kiếm và một phần Hà Đông. Xe 29 chỗ có phụ xe giám sát, lịch đón/trả cố định và ứng dụng theo dõi vị trí xe theo thời gian thực. Phụ huynh đăng ký theo học kỳ. Để biết tuyến xe đi qua gần khu vực bạn sinh sống, vui lòng liên hệ: <strong>024-3456-7896</strong>.</p>

<h3>6. Sĩ số mỗi lớp là bao nhiêu học sinh?</h3>
<p>Nhà trường duy trì <strong>sĩ số tối đa 35 học sinh/lớp</strong> — thấp hơn mức quy định của Bộ Giáo dục (35-40 em/lớp). Mục tiêu là đảm bảo giáo viên có đủ thời gian quan tâm đến từng học sinh, phát hiện sớm các khó khăn trong học tập và điều chỉnh kịp thời. Hiện tại, trường có 25 lớp, mỗi khối từ lớp 1 đến lớp 5 có 5 lớp học song song.</p>

<h3>7. Đồng phục học sinh như thế nào? Phụ huynh mua ở đâu?</h3>
<p>Học sinh mặc <strong>đồng phục theo ngày</strong>: Thứ Hai bộ đồng phục truyền thống (áo trắng, quần/váy kẻ xanh navy, cà vạt đỏ); Thứ Ba đến Thứ Sáu bộ thể thao trường (áo thun polo xanh navy logo vàng, quần thể thao xanh). Học sinh lớp 1 được tặng 1 bộ đồng phục chào mừng đầu năm học. Đồng phục bán tại <strong>phòng dịch vụ nhà trường</strong> (mở cửa Thứ Hai, Thứ Tư, Thứ Sáu: 7h-8h và 15h30-17h). Giá tham khảo: 200.000–350.000 VNĐ/bộ tùy size và loại.</p>

<h3>8. Trường có những hoạt động ngoại khóa nào? Có bắt buộc không?</h3>
<p>Trường có <strong>hơn 15 câu lạc bộ ngoại khóa</strong> đa dạng: thể thao (Bóng đá, Bơi lội, Taekwondo, Cờ vua), âm nhạc (Piano, Guitar, Múa), nghệ thuật (Hội họa, Nhiếp ảnh), học thuật (Robotics, Tiếng Anh giao tiếp, Khoa học vui) và kỹ năng sống (Nấu ăn, Làm vườn, Đọc sách). Các hoạt động ngoại khóa là <strong>tự nguyện, không bắt buộc</strong>. Tuy nhiên, nhà trường khuyến khích mỗi học sinh tham gia ít nhất một câu lạc bộ để phát triển toàn diện. Đăng ký tại phòng hành chính trước ngày 20 đầu mỗi học kỳ.</p>

<h3>9. Học sinh có được khám sức khỏe định kỳ không?</h3>
<p>Có. Nhà trường tổ chức <strong>khám sức khỏe định kỳ 2 lần/năm</strong> (đầu năm học và giữa năm học) cho toàn bộ học sinh tại trường, do đội ngũ y tế Bệnh viện Nhi Trung ương thực hiện. Nội dung khám bao gồm: đo chiều cao, cân nặng, kiểm tra thị lực, thính lực, răng miệng và sức khỏe tổng quát. Kết quả khám được gửi đến từng phụ huynh. Trường cũng có phòng y tế học đường với y tá thường trực trong giờ học, xử lý các trường hợp đau bệnh nhẹ và sơ cứu cơ bản.</p>

<h3>10. Làm thế nào để liên hệ với giáo viên chủ nhiệm của con?</h3>
<p>Phụ huynh có thể liên hệ với giáo viên chủ nhiệm theo nhiều cách: (1) <strong>Qua nhóm Zalo lớp</strong> — giáo viên chủ nhiệm lập nhóm Zalo riêng cho mỗi lớp, phụ huynh nhắn tin trong giờ hành chính và sẽ được phản hồi trong vòng 24 giờ; (2) <strong>Gặp trực tiếp</strong> sau giờ tan học (15h-15h30) hoặc đặt lịch hẹn qua nhóm Zalo; (3) <strong>Qua sổ liên lạc điện tử</strong> trên ứng dụng quản lý trường; (4) <strong>Gọi điện qua tổng đài</strong> 024-3456-7890 (trong giờ hành chính) để được kết nối. Nhà trường tổ chức họp phụ huynh định kỳ 3 lần/năm học (đầu năm, giữa kỳ 1 và cuối năm) để giáo viên và phụ huynh trao đổi trực tiếp về tình hình học tập của học sinh.</p>
</section>`,
    },
  ];

  let created = 0;
  for (const p of pages) {
    const exists = await repo.findOne({ where: { slug: p.slug } });
    if (exists) {
      console.log(`[SKIP] slug="${p.slug}" da ton tai`);
      continue;
    }
    await repo.save(
      repo.create({
        id: generateUlid(),
        ...p,
        created_by: admin.id,
        updated_by: null,
      }),
    );
    created++;
    console.log(`[OK]   slug="${p.slug}" da tao`);
  }

  console.log(
    `\n[SEED] Pages part3: ${created} created, ${pages.length - created} skipped`,
  );
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
