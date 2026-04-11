// Chay: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-pages-part2.ts
// Hoac them vao package.json scripts: "seed:pages2": "ts-node -r tsconfig-paths/register src/database/seeds/seed-pages-part2.ts"

import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Page, PageStatus } from '../../modules/pages/entities/page.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed 8 trang noi dung bo sung cho website truong tieu hoc Le Quy Don.
 * Pages 10-17: The chat, Y te, Ban tru, Xe dua don, CSVC, Doi ngu GV, Thanh tich, Tuyen sinh.
 * Idempotent — kiem tra slug truoc khi insert.
 */

async function seed() {
  await AppDataSource.initialize();

  const admin = await AppDataSource.getRepository(User).findOne({
    where: { role: UserRole.SUPER_ADMIN },
  });
  if (!admin) {
    console.error('Chay seed:admin truoc');
    process.exit(1);
  }

  const repo = AppDataSource.getRepository(Page);

  const pages = [
    // ═══════════════════════════════════════════════════
    // PAGE 10: chuong-trinh/the-chat-nghe-thuat
    // ═══════════════════════════════════════════════════
    {
      title: 'Thể chất & Nghệ thuật',
      slug: 'chuong-trinh/the-chat-nghe-thuat',
      seo_title: 'Thể chất & Nghệ thuật — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Chương trình thể chất và nghệ thuật toàn diện tại trường Tiểu học Lê Quý Đôn: bơi lội, võ thuật, bóng đá, âm nhạc, mỹ thuật và múa đương đại.',
      status: PageStatus.PUBLISHED,
      content: `<section class="page-content">
<h2>Chương trình Thể chất &amp; Nghệ thuật — Trường Tiểu học Lê Quý Đôn</h2>
<p>Trường Tiểu học Lê Quý Đôn đặc biệt chú trọng phát triển thể chất và năng khiếu nghệ thuật cho học sinh bên cạnh chương trình học văn hóa. Với triết lý giáo dục "phát triển toàn diện", nhà trường đầu tư bài bản vào cơ sở vật chất, đội ngũ huấn luyện viên chuyên nghiệp và chương trình học phong phú, mang đến cho các em cơ hội khám phá và nuôi dưỡng niềm đam mê từ sớm. Mỗi học sinh được tham gia ít nhất 2 tiết thể chất và 2 tiết nghệ thuật mỗi tuần theo lịch học chính khóa, ngoài các câu lạc bộ ngoại khóa tự chọn.</p>
<img src="/uploads/placeholder-school.jpg" alt="Học sinh tham gia hoạt động thể chất và nghệ thuật" class="rounded-xl shadow" />

<h3>Chương trình Thể chất</h3>
<p>Nhà trường tổ chức các môn thể thao đa dạng nhằm rèn luyện sức khỏe, tính kỷ luật và tinh thần đồng đội cho học sinh. Các môn thể chất chính thức trong chương trình bao gồm:</p>
<ul>
  <li><strong>Bơi lội:</strong> Học sinh được tập luyện tại bể bơi 25m, 4 làn hiện đại ngay trong khuôn viên trường. Chương trình bơi lội được thiết kế theo chuẩn học tập từng bước, đảm bảo 100% học sinh biết bơi trước khi hoàn thành bậc tiểu học. Mỗi lớp học 2 tiết bơi/tuần dưới sự hướng dẫn của huấn luyện viên được đào tạo bài bản.</li>
  <li><strong>Võ thuật — Taekwondo &amp; Aikido:</strong> Chương trình võ thuật kép giúp học sinh phát triển sức mạnh, sự nhanh nhẹn, tinh thần thép và khả năng tự bảo vệ bản thân. Taekwondo rèn luyện kỹ thuật đá nhanh và mạnh; Aikido đề cao sự hòa hợp và kiểm soát năng lượng. Học sinh được phân nhóm theo trình độ và thi đai định kỳ.</li>
  <li><strong>Bóng đá mini:</strong> Sân bóng cỏ nhân tạo trong khuôn viên trường là nơi các em thỏa sức thi đấu. Bóng đá không chỉ rèn thể lực mà còn phát triển kỹ năng phối hợp nhóm, tư duy chiến thuật và tinh thần fair-play. Nhà trường tổ chức giải bóng đá học sinh nội bộ mỗi học kỳ, tạo sân chơi lành mạnh và kịch tính.</li>
  <li><strong>Cầu lông:</strong> Cầu lông là môn thể thao rèn luyện tốt khả năng phản xạ, sự khéo léo và độ bền của học sinh. Giờ cầu lông được tổ chức trong nhà thể chất khép kín, đảm bảo tập luyện tốt dù thời tiết ra sao. Câu lạc bộ cầu lông ngoại khóa hoạt động 3 buổi/tuần dành cho học sinh có năng khiếu.</li>
</ul>

<h3>Chương trình Nghệ thuật</h3>
<p>Song song với thể chất, chương trình nghệ thuật tại trường Tiểu học Lê Quý Đôn được xây dựng toàn diện, bao gồm ba lĩnh vực chính: Âm nhạc, Mỹ thuật và Múa đương đại. Mỗi môn được giảng dạy 2 tiết/tuần trong chương trình chính khóa, và học sinh có thể đăng ký học nâng cao tại các câu lạc bộ sau giờ học:</p>
<ul>
  <li><strong>Âm nhạc — Piano, Guitar &amp; Trống:</strong> Phòng âm nhạc được trang bị 10 đàn piano điện, bộ guitar acoustic và điện, bộ trống acoustic và bộ gõ Orff. Học sinh được tiếp xúc với nhiều thể loại nhạc cụ, từ đó phát hiện sở trường và đăng ký học chuyên sâu. Câu lạc bộ âm nhạc tổ chức biểu diễn định kỳ tại các sự kiện của trường, tạo cơ hội trình diễn thực tế cho các em.</li>
  <li><strong>Mỹ thuật — Vẽ, Nặn &amp; Cắt dán:</strong> Lớp học mỹ thuật là không gian sáng tạo tự do, nơi học sinh được khám phá nhiều kỹ thuật tạo hình đa dạng. Vẽ màu nước, màu acrylic, bút chì — nặn đất sét, đất nặn polymer — cắt dán giấy nghệ thuật, kỹ thuật collage. Các tác phẩm xuất sắc được trưng bày tại gallery nghệ thuật của trường và tham dự các cuộc thi mỹ thuật thiếu nhi thành phố.</li>
  <li><strong>Múa đương đại:</strong> Chương trình múa kết hợp giữa các phong cách truyền thống và hiện đại, giúp học sinh phát triển ngôn ngữ cơ thể, cảm thụ âm nhạc và biểu đạt cảm xúc qua chuyển động. Đội múa nhà trường thường xuyên đạt giải cao tại các liên hoan văn nghệ thiếu nhi cấp quận và thành phố.</li>
</ul>

<h3>Lịch học và đăng ký</h3>
<p>Mỗi học sinh tham gia đầy đủ các tiết thể chất và nghệ thuật theo thời khóa biểu chính khóa (2 tiết/tuần/môn). Phụ huynh có thể đăng ký thêm các câu lạc bộ ngoại khóa chuyên sâu tại văn phòng nhà trường hoặc qua hệ thống đăng ký trực tuyến. Học phí ngoại khóa được tính riêng theo từng câu lạc bộ, ưu tiên học sinh có hoàn cảnh khó khăn.</p>

<h3>Thành tích nổi bật</h3>
<p>Chương trình thể chất và nghệ thuật của nhà trường đã ghi dấu ấn qua nhiều giải thưởng cấp quận và thành phố: đội bơi lội giành 8 Huy chương Vàng tại Hội thao học sinh quận Đống Đa 2024; đội múa đạt Giải Đặc biệt Liên hoan Văn nghệ Thiếu nhi Hà Nội 2025; nhiều học sinh đội tuyển Taekwondo đã thi đỗ đai đen và đai xanh trong các kỳ thi kiểm định quốc gia. Những thành tích đó là minh chứng cho chất lượng đào tạo toàn diện mà nhà trường cam kết mang lại.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 11: dich-vu-hoc-duong/y-te-hoc-duong
    // ═══════════════════════════════════════════════════
    {
      title: 'Y tế học đường',
      slug: 'dich-vu-hoc-duong/y-te-hoc-duong',
      seo_title: 'Y tế học đường — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Phòng y tế học đường chuyên nghiệp tại trường Tiểu học Lê Quý Đôn: y sĩ trực 7h-17h, khám định kỳ 2 lần/năm, liên kết bệnh viện Nhi TW.',
      status: PageStatus.PUBLISHED,
      content: `<section class="page-content">
<h2>Y tế học đường — Trường Tiểu học Lê Quý Đôn</h2>
<p>Sức khỏe học sinh là nền tảng không thể thiếu của quá trình học tập và phát triển. Trường Tiểu học Lê Quý Đôn đầu tư xây dựng hệ thống y tế học đường chuyên nghiệp, đảm bảo mỗi học sinh được chăm sóc sức khỏe toàn diện trong suốt thời gian ở trường. Phụ huynh có thể hoàn toàn yên tâm khi gửi con em đến nhà trường — sức khỏe của các em luôn được theo dõi và xử lý kịp thời bởi đội ngũ y tế có chuyên môn.</p>
<img src="/uploads/placeholder-school.jpg" alt="Phòng y tế học đường trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Cơ sở vật chất phòng y tế</h3>
<p>Phòng y tế nhà trường được trang bị đầy đủ thiết bị y tế thiết yếu để xử lý các trường hợp sức khỏe thông thường và cấp cứu ban đầu. Tủ thuốc được cập nhật và kiểm tra định kỳ hàng tháng, đảm bảo không có thuốc hết hạn và đầy đủ các loại thuốc cần thiết: thuốc hạ sốt, thuốc chống dị ứng, băng gạc vô trùng, dung dịch sát khuẩn, thuốc nhỏ mắt, thuốc đau bụng và các vật tư y tế cơ bản. Phòng y tế có giường nghỉ, thiết bị đo thân nhiệt, huyết áp, độ bão hòa oxy trong máu (SpO2) và máy sốc điện AED (Automated External Defibrillator) dự phòng khẩn cấp.</p>

<h3>Nhân sự y tế</h3>
<p>Nhà trường bố trí y sĩ trực từ <strong>7h00 đến 17h00</strong> tất cả các ngày học trong tuần. Y sĩ có trình độ chuyên môn từ trung cấp y trở lên, được đào tạo bổ sung về y tế học đường và sơ cấp cứu nhi khoa. Ngoài nhiệm vụ trực chính, y sĩ thường xuyên tuần tra các lớp học để phát hiện sớm các dấu hiệu bệnh tật, nhắc nhở vệ sinh cá nhân và báo cáo tình hình sức khỏe cho Ban giám hiệu và phụ huynh. Mọi trường hợp học sinh cần chăm sóc y tế đều được ghi chép vào sổ theo dõi sức khỏe cá nhân và thông báo kịp thời cho gia đình.</p>

<h3>Khám sức khỏe định kỳ</h3>
<p>Nhà trường tổ chức khám sức khỏe định kỳ <strong>2 lần/năm học</strong> (đầu năm tháng 9 và giữa năm tháng 1) với sự phối hợp của bác sĩ từ bệnh viện đối tác. Mỗi lần khám bao gồm các hạng mục: đo chiều cao và cân nặng, kiểm tra thị lực, thính lực, huyết áp, phân loại thể trạng theo tiêu chuẩn WHO và tư vấn dinh dưỡng. Kết quả khám được lưu vào hồ sơ sức khỏe cá nhân của từng học sinh và gửi bản sao cho phụ huynh. Những trường hợp cần theo dõi hoặc điều trị thêm sẽ được tư vấn chuyển gửi đến cơ sở y tế phù hợp.</p>

<h3>Theo dõi cân nặng, chiều cao và thị lực</h3>
<p>Ngoài các đợt khám định kỳ, nhà trường thực hiện theo dõi cân nặng và chiều cao học sinh mỗi học kỳ, kết hợp với chương trình giáo dục dinh dưỡng cho học sinh và phụ huynh. Thị lực được kiểm tra mỗi học kỳ; những học sinh có dấu hiệu giảm thị lực được thông báo cho gia đình để có biện pháp can thiệp sớm. Nhà trường cũng phối hợp với Trung tâm Y tế Dự phòng quận để theo dõi dịch bệnh học đường theo mùa và triển khai các biện pháp phòng ngừa kịp thời.</p>

<h3>Liên kết bệnh viện Nhi Trung ương và chương trình nha học đường</h3>
<p>Trường Tiểu học Lê Quý Đôn ký kết hợp tác chính thức với <strong>Bệnh viện Nhi Trung ương</strong> — đơn vị y tế nhi khoa hàng đầu Việt Nam. Trong các trường hợp khẩn cấp vượt ngoài phạm vi xử lý tại trường, học sinh được chuyển viện nhanh chóng với quy trình ưu tiên đã được thiết lập sẵn. Đội ngũ bác sĩ của bệnh viện cũng định kỳ đến trường để tập huấn cho giáo viên và nhân viên về kỹ năng sơ cấp cứu, nhận biết các dấu hiệu bệnh nguy hiểm ở trẻ em. Bên cạnh đó, chương trình nha học đường được triển khai mỗi năm một lần: các nha sĩ từ bệnh viện đến khám răng miệng cho toàn bộ học sinh, phát hiện sâu răng, viêm nướu sớm và hướng dẫn kỹ năng vệ sinh răng miệng đúng cách theo tiêu chuẩn quốc tế.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 12: dich-vu-hoc-duong/ban-tru
    // ═══════════════════════════════════════════════════
    {
      title: 'Dịch vụ bán trú',
      slug: 'dich-vu-hoc-duong/ban-tru',
      seo_title: 'Dịch vụ bán trú — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Bếp ăn bán trú đạt chuẩn VSATTP, thực đơn dinh dưỡng do chuyên gia xây dựng, 500 chỗ ăn, giá 60.000đ/ngày tại trường Tiểu học Lê Quý Đôn.',
      status: PageStatus.PUBLISHED,
      content: `<section class="page-content">
<h2>Dịch vụ bán trú — Trường Tiểu học Lê Quý Đôn</h2>
<p>Dịch vụ bán trú của trường Tiểu học Lê Quý Đôn là giải pháp toàn diện giúp các gia đình yên tâm về bữa ăn trưa và giờ nghỉ ngơi của con em trong ngày học. Với bếp ăn đạt chuẩn Vệ sinh An toàn Thực phẩm (VSATTP), thực đơn được thiết kế bởi chuyên gia dinh dưỡng và không gian ăn uống thoải mái 500 chỗ, nhà trường cam kết mang đến bữa ăn ngon, đủ chất và an toàn cho mỗi học sinh mỗi ngày.</p>
<img src="/uploads/placeholder-school.jpg" alt="Nhà ăn bán trú trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Bếp ăn đạt chuẩn VSATTP</h3>
<p>Bếp ăn nhà trường được xây dựng và vận hành theo đúng quy chuẩn Vệ sinh An toàn Thực phẩm của Bộ Y tế, được cấp giấy chứng nhận VSATTP và kiểm tra định kỳ bởi cơ quan y tế quận. Toàn bộ khu bếp được thiết kế theo nguyên tắc "một chiều" — thực phẩm di chuyển từ khu tiếp nhận → sơ chế → chế biến → phân phối → thu dọn mà không có điểm giao chéo, tránh nguy cơ nhiễm khuẩn chéo. Nhà bếp trang bị tủ đông lạnh công nghiệp, bếp công nghiệp bằng điện (không dùng than/gas trực tiếp), hệ thống khử trùng dụng cụ ăn uống và hệ thống thông gió đảm bảo không khí sạch trong khu chế biến. Nhân viên bếp được kiểm tra sức khỏe và tập huấn VSATTP định kỳ 6 tháng/lần.</p>

<h3>Thực đơn dinh dưỡng</h3>
<p>Toàn bộ thực đơn bán trú được xây dựng bởi <strong>chuyên gia dinh dưỡng nhi khoa</strong> với nguyên tắc cân bằng đầy đủ 4 nhóm chất: tinh bột (30%), đạm (25%), chất béo (20%) và vitamin/khoáng chất (25%). Thực đơn thay đổi hàng ngày, không lặp lại trong vòng 2 tuần, đảm bảo học sinh luôn có bữa ăn ngon miệng và đủ dinh dưỡng. Nhà trường ưu tiên sử dụng thực phẩm tươi sống, rau củ quả theo mùa, hạn chế tối đa thực phẩm chế biến sẵn và các chất phụ gia. Thực đơn tuần được công bố trên bảng thông báo và website nhà trường để phụ huynh theo dõi, góp ý. Đối với học sinh có dị ứng thực phẩm, nhà trường có phương án thực đơn thay thế riêng sau khi nhận thông báo từ gia đình.</p>

<h3>Giờ ăn và nghỉ trưa</h3>
<p>Lịch ăn trưa được sắp xếp theo khối lớp để đảm bảo không gian ăn thoải mái và không xảy ra tình trạng tập trung đông người cùng lúc:</p>
<ul>
  <li><strong>Lớp 1 &amp; Lớp 2:</strong> Giờ ăn 11h15 — Học sinh nhỏ tuổi hơn được ưu tiên ăn trước để có thêm thời gian nghỉ ngơi.</li>
  <li><strong>Lớp 3, 4 &amp; 5:</strong> Giờ ăn 11h30 — Các em lớn hơn tự phục vụ có hướng dẫn, rèn tính tự lập và tinh thần trách nhiệm.</li>
  <li><strong>Giờ nghỉ trưa:</strong> 12h00 đến 13h30 — Học sinh nghỉ ngơi tại phòng nghỉ trưa chuyên dụng, có điều hòa và nệm riêng cho từng em. Giáo viên trực trưa đảm bảo trật tự và an toàn trong giờ nghỉ.</li>
</ul>

<h3>Học phí bán trú</h3>
<p>Học phí dịch vụ bán trú là <strong>60.000 đồng/ngày</strong>, được thanh toán hàng tháng theo thực tế ngày học (trừ các ngày nghỉ lễ, nghỉ phép). Phụ huynh thanh toán qua hệ thống thu học phí trực tuyến của nhà trường hoặc tại văn phòng. Nhà trường miễn giảm học phí bán trú cho học sinh thuộc diện chính sách theo quy định của Nhà nước và hỗ trợ thêm cho các trường hợp gia đình có hoàn cảnh đặc biệt khó khăn được Ban giám hiệu xét duyệt.</p>

<h3>Đăng ký và liên hệ</h3>
<p>Phụ huynh có nhu cầu đăng ký bán trú cho con có thể liên hệ trực tiếp tại Văn phòng nhà trường hoặc gửi yêu cầu qua hệ thống trực tuyến. Việc đăng ký và hủy bán trú cần thực hiện trước ngày 25 của tháng trước để ban quản lý bếp ăn có thể điều phối phù hợp. Mọi phản hồi về chất lượng bữa ăn được nhà trường trân trọng ghi nhận và xử lý trong vòng 24 giờ làm việc.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 13: dich-vu-hoc-duong/xe-dua-don
    // ═══════════════════════════════════════════════════
    {
      title: 'Xe đưa đón học sinh',
      slug: 'dich-vu-hoc-duong/xe-dua-don',
      seo_title: 'Xe đưa đón học sinh — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        '8 tuyến xe đưa đón học sinh khắp nội thành Hà Nội, xe 16 chỗ điều hòa + GPS + camera, đưa đón tận nhà, phí 1.500.000đ/tháng.',
      status: PageStatus.PUBLISHED,
      content: `<section class="page-content">
<h2>Dịch vụ Xe đưa đón học sinh — Trường Tiểu học Lê Quý Đôn</h2>
<p>Hiểu rằng việc đưa đón con đi học mỗi ngày là nỗi trăn trở lớn của nhiều gia đình tại Hà Nội — đặc biệt trong bối cảnh giao thông đô thị ngày càng phức tạp — trường Tiểu học Lê Quý Đôn cung cấp dịch vụ xe đưa đón học sinh chuyên nghiệp, an toàn và tiện lợi. Với 8 tuyến xe phủ rộng các quận nội thành, gia đình hoàn toàn có thể tin tưởng giao phó việc đưa đón cho nhà trường để tập trung cho công việc của mình.</p>
<img src="/uploads/placeholder-school.jpg" alt="Xe đưa đón học sinh trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Mạng lưới 8 tuyến nội thành</h3>
<p>Dịch vụ xe đưa đón hiện phủ <strong>8 tuyến</strong> bao gồm các quận nội thành Hà Nội: Đống Đa, Hoàn Kiếm, Hai Bà Trưng, Ba Đình, Cầu Giấy, Thanh Xuân, Tây Hồ và Long Biên. Mỗi tuyến được thiết kế tối ưu để đảm bảo thời gian di chuyển không quá 45 phút, tránh các điểm ùn tắc thường xuyên. Tuyến đường được cập nhật định kỳ mỗi học kỳ dựa trên địa chỉ thực tế của học sinh đăng ký, đảm bảo lộ trình hợp lý và hiệu quả nhất cho tất cả các gia đình.</p>

<h3>Phương tiện và trang thiết bị an toàn</h3>
<p>Đội xe của nhà trường gồm các xe <strong>16 chỗ ngồi</strong> chuyên dụng cho học sinh, được đầu tư đồng bộ và bảo dưỡng định kỳ nghiêm ngặt. Mỗi xe được trang bị đầy đủ thiết bị an toàn và tiện ích:</p>
<ul>
  <li><strong>Điều hòa không khí:</strong> Hệ thống điều hòa 2 chiều đảm bảo nhiệt độ thoải mái cho học sinh trong mọi thời tiết.</li>
  <li><strong>GPS theo dõi hành trình:</strong> Thiết bị GPS gắn trên từng xe, dữ liệu hành trình được theo dõi theo thời gian thực bởi bộ phận quản lý xe. Phụ huynh có thể liên hệ để kiểm tra vị trí xe bất kỳ lúc nào.</li>
  <li><strong>Camera quan sát:</strong> Camera ghi hình toàn bộ không gian trong và ngoài xe trong suốt hành trình, lưu trữ dữ liệu 30 ngày để tra cứu khi cần.</li>
  <li><strong>Ghế ngồi có dây an toàn:</strong> Mỗi chỗ ngồi được trang bị dây an toàn, và lái xe có trách nhiệm kiểm tra học sinh thắt dây trước khi xe lăn bánh.</li>
  <li><strong>Bình cứu hỏa và hộp sơ cứu:</strong> Được kiểm tra và thay thế định kỳ theo quy định.</li>
</ul>

<h3>Nhân viên đưa đón chuyên nghiệp</h3>
<p>Mỗi tuyến xe có <strong>1 lái xe và 1 nhân viên đưa đón</strong> (còn gọi là bảo mẫu xe). Nhân viên đưa đón được đào tạo kỹ năng chăm sóc trẻ, sơ cấp cứu và quy trình an toàn học sinh. Họ có nhiệm vụ đến tận nhà đón học sinh theo giờ đã thỏa thuận, bàn giao học sinh trực tiếp cho giáo viên tại cổng trường vào buổi sáng, và chiều trả học sinh tận tay phụ huynh hoặc người được ủy quyền tại địa chỉ đã đăng ký. Không trả học sinh cho người không có trong danh sách ủy quyền đã đăng ký, đảm bảo an toàn tuyệt đối cho các em.</p>

<h3>Lịch hoạt động</h3>
<p>Xe đưa đón hoạt động theo lịch học chính thức của nhà trường:</p>
<ul>
  <li><strong>Buổi sáng — Giờ đón:</strong> 6h30 đến 7h15. Lái xe xuất phát từ điểm đầu tuyến lúc 6h30, lần lượt đón học sinh theo lộ trình và đến trường trước 7h30.</li>
  <li><strong>Buổi chiều — Giờ trả:</strong> 16h30 đến 17h15. Xe khởi hành từ trường sau khi đón đầy đủ học sinh, lần lượt trả các em về nhà an toàn trước 17h30.</li>
  <li>Trong các ngày học bù, ngày lễ đặc biệt hoặc khi có thay đổi lịch học, ban quản lý sẽ thông báo điều chỉnh lịch xe qua ứng dụng hoặc nhóm phụ huynh ít nhất 1 ngày trước.</li>
</ul>

<h3>Học phí và đăng ký</h3>
<p>Phí dịch vụ xe đưa đón là <strong>1.500.000 đồng/tháng/học sinh</strong>, thanh toán theo tháng. Phí đã bao gồm toàn bộ chi phí xe, nhiên liệu, nhân viên và bảo hiểm hành khách. Gia đình có từ 2 con đăng ký cùng tuyến sẽ được ưu đãi 10% học phí cho con thứ hai. Để đăng ký, phụ huynh điền vào mẫu đăng ký tại văn phòng hoặc trực tuyến, ghi rõ địa chỉ đón/trả và số điện thoại liên hệ. Ban quản lý sẽ phản hồi tuyến phù hợp và lịch đón trong vòng 2 ngày làm việc.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 14: co-so-vat-chat
    // ═══════════════════════════════════════════════════
    {
      title: 'Cơ sở vật chất',
      slug: 'co-so-vat-chat',
      seo_title: 'Cơ sở vật chất — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Khuôn viên 8000m², 30 phòng học hiện đại, bể bơi 25m, sân cỏ nhân tạo, thư viện 10.000 sách, nhà ăn 500 chỗ tại trường Tiểu học Lê Quý Đôn.',
      status: PageStatus.PUBLISHED,
      content: `<section class="page-content">
<h2>Cơ sở vật chất — Trường Tiểu học Lê Quý Đôn</h2>
<p>Trường Tiểu học Lê Quý Đôn tọa lạc trên khuôn viên rộng <strong>8.000 m²</strong> tại quận Đống Đa, Hà Nội. Toàn bộ cơ sở vật chất được đầu tư đồng bộ, hiện đại và duy trì trong tình trạng tốt nhất để phục vụ học tập, sinh hoạt và phát triển toàn diện của học sinh. Nhà trường kiên định với quan điểm rằng môi trường học tập chất lượng cao là điều kiện tiên quyết để thực hiện sứ mệnh giáo dục xuất sắc.</p>
<img src="/uploads/placeholder-school.jpg" alt="Toàn cảnh cơ sở vật chất trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Hệ thống phòng học</h3>
<p>Nhà trường có <strong>30 phòng học</strong> chuẩn, mỗi phòng đáp ứng tối đa 35 học sinh với không gian thoáng mát, ánh sáng tự nhiên tốt và hệ thống điều hòa hai chiều. Tất cả phòng học được trang bị:</p>
<ul>
  <li><strong>Máy chiếu Full HD</strong> và màn hình chiếu điện tự động</li>
  <li><strong>Bảng tương tác thông minh</strong> (Interactive Whiteboard) hỗ trợ giảng dạy số hóa</li>
  <li>Hệ thống âm thanh lớp học với micro không dây cho giáo viên</li>
  <li>Bàn ghế ergonomic phù hợp với từng độ tuổi, dễ điều chỉnh chiều cao</li>
  <li>Tủ sách lớp học với thư viện sách nhỏ theo chủ đề từng khối lớp</li>
</ul>

<h3>Phòng học chuyên biệt</h3>
<p>Ngoài phòng học văn hóa, nhà trường trang bị đầy đủ các phòng học chuyên biệt phục vụ giảng dạy hiện đại:</p>
<ul>
  <li><strong>2 phòng tin học</strong> với tổng cộng 80 máy tính cấu hình cao, mạng LAN và Wi-Fi tốc độ cao, phục vụ giảng dạy lập trình, kỹ năng số và các môn liên quan đến công nghệ</li>
  <li><strong>2 phòng ngoại ngữ</strong> được thiết kế theo mô hình Language Lab với tai nghe, micro và phần mềm học tiếng Anh chuyên dụng; tích hợp hệ thống kết nối video call để giao tiếp với giáo viên bản ngữ từ xa</li>
  <li><strong>Phòng STEM</strong> trang bị bộ Lego Mindstorms, Arduino, dụng cụ thí nghiệm khoa học và không gian làm việc nhóm linh hoạt, nơi học sinh thực hành các dự án sáng tạo kỹ thuật</li>
  <li><strong>Phòng âm nhạc</strong> với 10 đàn piano điện, bộ trống, bộ guitar và dàn âm thanh chuyên dụng; cách âm hoàn toàn để không ảnh hưởng các lớp bên cạnh</li>
  <li><strong>Phòng mỹ thuật</strong> với ánh sáng tự nhiên được thiết kế đặc biệt, giá vẽ, bàn nặn đất, góc cắt dán và tủ trưng bày tác phẩm học sinh</li>
</ul>

<h3>Thư viện và không gian đọc sách</h3>
<p>Thư viện trường Tiểu học Lê Quý Đôn sở hữu bộ sưu tập hơn <strong>10.000 đầu sách</strong> bao gồm sách giáo khoa, sách tham khảo, truyện thiếu nhi, bách khoa toàn thư và sách ngoại ngữ. Thư viện được tổ chức theo phân loại Dewey, dễ tìm kiếm, với hệ thống quản lý mượn/trả điện tử. Không gian đọc sách thoáng đãng với ghế sofa nhỏ và bàn đọc cá nhân; thư viện mở cửa mỗi ngày học, bao gồm cả giờ nghỉ trưa. Chương trình "Mỗi tuần một cuốn sách" khuyến khích học sinh đọc sách thường xuyên, tích điểm và nhận phần thưởng mỗi tháng.</p>

<h3>Cơ sở thể dục thể thao</h3>
<p>Hạ tầng thể thao của nhà trường đáp ứng đầy đủ cho các hoạt động thể chất đa dạng:</p>
<ul>
  <li><strong>Bể bơi 25m, 4 làn</strong> với hệ thống lọc nước hiện đại, kiểm soát nồng độ clo tự động, hệ thống sưởi nước mùa đông; đảm bảo an toàn tuyệt đối với phao cứu sinh, tay vịn và sàn chống trượt</li>
  <li><strong>Sân bóng đá cỏ nhân tạo</strong> kích thước 40m × 25m với khung thành, đèn chiếu sáng và khán đài nhỏ cho học sinh cổ vũ</li>
  <li><strong>Nhà thể chất đa năng</strong> diện tích 600m², sàn gỗ đàn hồi, phục vụ cầu lông, bóng rổ, võ thuật và các hoạt động thể dục nhịp điệu; có điều hòa và hệ thống đèn LED chuyên dụng</li>
  <li>Sân chơi ngoài trời với thiết bị vận động an toàn dành riêng cho học sinh tiểu học, mặt sân lót cao su mềm chống va đập</li>
</ul>

<h3>Nhà ăn, nhà nghỉ trưa và an ninh</h3>
<p>Nhà ăn bán trú rộng rãi với <strong>500 chỗ ngồi</strong>, thiết kế thoáng mát, sạch sẽ và dễ vệ sinh. Khu bếp được tách biệt hoàn toàn khỏi khu ăn theo tiêu chuẩn VSATTP. Phòng nghỉ trưa chuyên dụng với giường/nệm riêng cho từng học sinh, điều hòa và ánh sáng dịu nhẹ. Hệ thống <strong>camera an ninh 24/7</strong> phủ toàn bộ khuôn viên trường gồm hơn 60 camera HD; hệ thống kiểm soát ra vào bằng thẻ từ tại cổng chính và cổng phụ, chỉ cho phép phụ huynh/người được ủy quyền vào đón học sinh trong khung giờ quy định.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 15: doi-ngu-giao-vien
    // ═══════════════════════════════════════════════════
    {
      title: 'Đội ngũ giáo viên',
      slug: 'doi-ngu-giao-vien',
      seo_title: 'Đội ngũ giáo viên — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        '65 giáo viên, 28% thạc sĩ, 4 giáo viên bản ngữ, tỷ lệ GV/HS 1/18, bồi dưỡng chuyên môn hàng tháng tại trường Tiểu học Lê Quý Đôn.',
      status: PageStatus.PUBLISHED,
      content: `<section class="page-content">
<h2>Đội ngũ giáo viên — Trường Tiểu học Lê Quý Đôn</h2>
<p>Con người là yếu tố cốt lõi tạo nên chất lượng giáo dục. Trường Tiểu học Lê Quý Đôn tự hào sở hữu đội ngũ <strong>65 giáo viên</strong> được tuyển chọn kỹ lưỡng, tận tâm với nghề và không ngừng cập nhật phương pháp giảng dạy hiện đại. Mỗi giáo viên không chỉ là người truyền đạt kiến thức mà còn là người bạn đồng hành, người truyền cảm hứng và là hình mẫu đạo đức cho học sinh trong những năm tháng hình thành nhân cách quan trọng nhất của cuộc đời.</p>
<img src="/uploads/placeholder-school.jpg" alt="Đội ngũ giáo viên trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Trình độ chuyên môn</h3>
<p>100% giáo viên của nhà trường đạt chuẩn trình độ đào tạo theo quy định của Bộ Giáo dục và Đào tạo. Trong đó, <strong>28% giáo viên có trình độ thạc sĩ</strong> — tỷ lệ cao hơn đáng kể so với mặt bằng chung các trường tiểu học trong quận. Nhà trường đang triển khai lộ trình hỗ trợ và khuyến khích thêm giáo viên theo học cao học để nâng tỷ lệ thạc sĩ lên 40% vào năm 2028.</p>

<h3>Giáo viên giỏi và được công nhận</h3>
<p>Nhà trường có <strong>22 giáo viên giỏi được công nhận cấp quận và thành phố</strong> — con số phản ánh chất lượng giảng dạy thực chất, không chỉ dừng lại ở danh hiệu. Hàng năm, nhà trường tổ chức hội thi giáo viên giỏi nội bộ, khuyến khích giáo viên tham gia các kỳ thi cấp quận và thành phố. Những giáo viên đạt danh hiệu được khen thưởng xứng đáng và có cơ hội tham gia các chương trình bồi dưỡng chuyên sâu trong và ngoài nước.</p>

<h3>Giáo viên bản ngữ</h3>
<p>Chương trình tiếng Anh tăng cường của nhà trường được hỗ trợ bởi <strong>4 giáo viên bản ngữ</strong> đến từ Anh, Mỹ và Úc — những người mang đến môi trường giao tiếp tiếng Anh chân thực, chuẩn phát âm và phong phú về văn hóa. Giáo viên bản ngữ dạy trực tiếp tại lớp và phối hợp với giáo viên người Việt để thiết kế chương trình học phù hợp với trình độ và tâm lý học sinh tiểu học Việt Nam. Học sinh được tiếp xúc với giáo viên nước ngoài từ lớp 1, giúp xây dựng sự tự tin khi nói tiếng Anh ngay từ đầu.</p>

<h3>Tỷ lệ giáo viên trên học sinh</h3>
<p>Tỷ lệ <strong>1 giáo viên / 18 học sinh</strong> tại trường Tiểu học Lê Quý Đôn đảm bảo mỗi em nhận được sự quan tâm cá nhân hóa đầy đủ. Sĩ số lớp không vượt quá 35 học sinh, và mỗi lớp có thêm giáo viên hỗ trợ trong các giờ học năng khiếu đặc biệt. Giáo viên chủ nhiệm theo dõi sát sao sự tiến bộ học tập và phát triển cá nhân của từng học sinh, thường xuyên trao đổi với phụ huynh qua ứng dụng kết nối gia đình-nhà trường.</p>

<h3>Đội ngũ hỗ trợ chuyên biệt</h3>
<p>Bên cạnh giáo viên, nhà trường còn có đội ngũ chuyên gia hỗ trợ toàn diện cho học sinh:</p>
<ul>
  <li><strong>Chuyên viên tâm lý học đường:</strong> 2 chuyên viên tâm lý được đào tạo bài bản hỗ trợ học sinh có khó khăn về cảm xúc, học tập hoặc các vấn đề gia đình. Phòng tư vấn tâm lý hoạt động hàng ngày, học sinh có thể đặt lịch gặp riêng tư.</li>
  <li><strong>Y tế học đường:</strong> Y sĩ trực 7h-17h mỗi ngày học, đảm bảo sức khỏe học sinh được chăm sóc kịp thời.</li>
  <li><strong>Chuyên viên IT:</strong> Hỗ trợ kỹ thuật cho hệ thống phòng tin học, bảng tương tác và hạ tầng mạng của trường, đảm bảo công nghệ luôn sẵn sàng phục vụ giảng dạy.</li>
</ul>

<h3>Bồi dưỡng chuyên môn liên tục</h3>
<p>Nhà trường tổ chức <strong>sinh hoạt chuyên môn hàng tháng</strong> cho toàn bộ giáo viên, nơi thầy cô chia sẻ kinh nghiệm, thảo luận phương pháp mới và cùng giải quyết các vấn đề sư phạm thực tế. Hàng năm, giáo viên được tham dự ít nhất 2 khóa bồi dưỡng nghiệp vụ do Phòng và Sở Giáo dục tổ chức, và được nhà trường tài trợ tham gia các hội thảo giáo dục quốc tế. Những giáo viên trẻ mới vào nghề được phân công giáo viên cố vấn (mentoring) có kinh nghiệm để đồng hành trong năm đầu công tác.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 16: thanh-tich
    // ═══════════════════════════════════════════════════
    {
      title: 'Thành tích nổi bật',
      slug: 'thanh-tich',
      seo_title: 'Thành tích nổi bật — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Các thành tích nổi bật của trường Tiểu học Lê Quý Đôn: Olympic Toán, tiếng Anh Cambridge, Robotics, bơi lội, thể thao và văn nghệ cấp quận và thành phố.',
      status: PageStatus.PUBLISHED,
      content: `<section class="page-content">
<h2>Thành tích nổi bật — Trường Tiểu học Lê Quý Đôn</h2>
<p>Trong nhiều năm qua, trường Tiểu học Lê Quý Đôn đã ghi dấu ấn trên nhiều lĩnh vực học thuật, thể thao và nghệ thuật với những thành tích đáng tự hào ở cấp quận và thành phố. Mỗi giải thưởng không chỉ là vinh dự cho cá nhân học sinh mà còn là minh chứng cho chất lượng đào tạo toàn diện và sự tâm huyết của toàn thể thầy cô giáo nhà trường.</p>
<img src="/uploads/placeholder-school.jpg" alt="Học sinh trường Lê Quý Đôn nhận giải thưởng" class="rounded-xl shadow" />

<h3>Olympic Toán cấp quận</h3>
<p>Đội tuyển Olympic Toán của trường Tiểu học Lê Quý Đôn luôn là lực lượng mạnh trong các kỳ thi cấp quận Đống Đa. Kết quả 3 năm học gần nhất ghi nhận tổng cộng <strong>15 giải</strong> bao gồm:</p>
<ul>
  <li><strong>3 Giải Nhất</strong> — khẳng định vị thế top đầu của đội tuyển Toán nhà trường</li>
  <li><strong>5 Giải Nhì</strong> — thể hiện chiều sâu lực lượng với nhiều học sinh xuất sắc</li>
  <li><strong>7 Giải Ba</strong> — cho thấy phong trào học Toán được phát triển rộng rãi, không chỉ tập trung ở một vài cá nhân</li>
</ul>
<p>Học sinh đội tuyển được bồi dưỡng chuyên sâu bởi giáo viên Toán có kinh nghiệm, kết hợp với tài liệu bài tập nâng cao và các buổi giao lưu với trường bạn.</p>

<h3>Tiếng Anh Cambridge</h3>
<p>Chương trình tiếng Anh Cambridge (Cambridge Young Learners — Starters, Movers, Flyers) được triển khai từ lớp 1, là một trong những điểm mạnh nổi bật của nhà trường. Kết quả kỳ thi Cambridge gần nhất ghi nhận <strong>90% học sinh dự thi đạt chứng chỉ Cambridge</strong> ở các cấp độ tương ứng với lớp học, trong đó hơn 60% đạt điểm Shield (điểm cao). Chứng chỉ Cambridge được công nhận quốc tế, là nền tảng vững chắc cho học sinh khi bước vào THCS và có nguyện vọng học tại các trường quốc tế.</p>

<h3>Robotics và STEM</h3>
<p>Câu lạc bộ Robotics & STEM của trường đã gây ấn tượng mạnh tại các cuộc thi cấp thành phố:</p>
<ul>
  <li><strong>Giải Nhì — Cuộc thi Robotics cấp Thành phố 2024:</strong> Đội Robotics nhà trường lần đầu tham dự kỳ thi cấp TP đã xuất sắc về Nhì, vượt qua hàng chục đội từ các quận khác.</li>
  <li><strong>Giải Nhất — Cuộc thi Robotics cấp Thành phố 2025:</strong> Một năm sau, đội Robotics khẳng định đẳng cấp bằng chức vô địch, trở thành niềm tự hào của cả quận Đống Đa.</li>
</ul>
<p>Thành công của đội Robotics là kết quả của đầu tư bài bản vào phòng STEM, chương trình giảng dạy lập trình từ lớp 3 và sự dẫn dắt tận tâm của giáo viên phụ trách câu lạc bộ.</p>

<h3>Bơi lội — Hội thao học sinh quận</h3>
<p>Với bể bơi 25m ngay trong khuôn viên và chương trình bơi lội đưa vào chính khóa, đội tuyển bơi lội nhà trường ghi dấu ấn mạnh mẽ tại Hội thao Học sinh quận Đống Đa 2024 với <strong>8 Huy chương Vàng</strong> ở các nội dung: bơi ếch 25m, bơi tự do 25m và 50m, tiếp sức 4×25m. Đây là thành tích tốt nhất trong lịch sử tham dự hội thao của nhà trường, và là minh chứng rõ nhất cho hiệu quả của chương trình bơi lội chính khóa.</p>

<h3>Hội khỏe Phù Đổng — Thể thao toàn diện</h3>
<p>Tại Hội khỏe Phù Đổng cấp quận, trường Tiểu học Lê Quý Đôn liên tục duy trì thứ hạng <strong>Top 3 toàn quận</strong> trong 3 năm liên tiếp gần đây. Học sinh tham gia thi đấu tổng hợp nhiều môn thể thao bao gồm chạy, nhảy, ném bóng và bơi lội. Thành tích này khẳng định chương trình thể dục thể thao của nhà trường không chỉ mạnh ở một môn mà toàn diện, phát triển đồng đều thể chất cho toàn bộ học sinh.</p>

<h3>Nghệ thuật — Liên hoan Văn nghệ Thiếu nhi</h3>
<p>Đội múa và đội văn nghệ của trường Tiểu học Lê Quý Đôn là những gương mặt quen thuộc tại các liên hoan văn nghệ thiếu nhi Hà Nội. Nổi bật nhất là <strong>Giải Đặc biệt</strong> tại Liên hoan Văn nghệ Thiếu nhi Thành phố Hà Nội 2025 dành cho tiết mục múa đương đại "Mùa xuân của em" — kết quả của hàng tháng tập luyện nghiêm túc và tài năng thực sự của các em học sinh. Ngoài ra, nhiều học sinh đã đạt giải cá nhân tại các cuộc thi vẽ tranh thiếu nhi, cuộc thi tiếng hát học sinh thành phố và cuộc thi viết thư UPU quốc tế.</p>
</section>`,
    },

    // ═══════════════════════════════════════════════════
    // PAGE 17: tuyen-sinh-2026
    // ═══════════════════════════════════════════════════
    {
      title: 'Tuyển sinh năm học 2026-2027',
      slug: 'tuyen-sinh-2026',
      seo_title: 'Tuyển sinh 2026-2027 — Trường Tiểu học Lê Quý Đôn',
      seo_description:
        'Thông tin tuyển sinh năm học 2026-2027 trường Tiểu học Lê Quý Đôn: 180 chỉ tiêu lớp 1, hồ sơ, lịch nộp, học phí 3.500.000đ/tháng.',
      status: PageStatus.PUBLISHED,
      content: `<section class="page-content">
<h2>Tuyển sinh năm học 2026-2027 — Trường Tiểu học Lê Quý Đôn</h2>
<p>Trường Tiểu học Lê Quý Đôn trân trọng thông báo kế hoạch tuyển sinh vào lớp 1 năm học 2026-2027. Đây là cơ hội để các gia đình tại Hà Nội gửi gắm con em vào một môi trường giáo dục toàn diện, hiện đại và tận tâm — nơi mỗi đứa trẻ được phát triển theo tiềm năng riêng của mình. Nhà trường khuyến khích phụ huynh tìm hiểu kỹ thông tin tuyển sinh và liên hệ sớm để được tư vấn trực tiếp.</p>
<img src="/uploads/placeholder-school.jpg" alt="Tuyển sinh lớp 1 trường Lê Quý Đôn 2026" class="rounded-xl shadow" />

<h3>Chỉ tiêu tuyển sinh</h3>
<p>Năm học 2026-2027, nhà trường tuyển sinh <strong>180 học sinh lớp 1</strong>, chia thành <strong>6 lớp</strong>, mỗi lớp không quá 30 học sinh. Sĩ số nhỏ đảm bảo mỗi học sinh nhận được sự quan tâm cá nhân hóa đầy đủ từ giáo viên chủ nhiệm ngay từ những ngày đầu tiên đến trường. Do nhu cầu đăng ký thường vượt chỉ tiêu, nhà trường khuyến khích phụ huynh nộp hồ sơ sớm để đảm bảo suất học cho con.</p>

<h3>Đối tượng tuyển sinh</h3>
<p>Nhà trường tuyển sinh học sinh đáp ứng đồng thời các điều kiện sau:</p>
<ul>
  <li><strong>Độ tuổi:</strong> Sinh năm 2020 (tính đến ngày 31/12/2026 đủ 6 tuổi)</li>
  <li><strong>Hộ khẩu ưu tiên:</strong> Học sinh có hộ khẩu thường trú tại quận Đống Đa được ưu tiên xét tuyển theo đúng quy định phân tuyến của UBND quận</li>
  <li><strong>Hộ khẩu ngoại quận:</strong> Học sinh có hộ khẩu tại các quận lân cận (Hoàn Kiếm, Hai Bà Trưng, Ba Đình, Thanh Xuân) được xét tuyển vào các suất còn lại sau khi đã đáp ứng đủ chỉ tiêu học sinh nội quận</li>
  <li><strong>Sức khỏe:</strong> Đủ điều kiện sức khỏe để tham gia học tập bình thường theo xác nhận của cơ sở y tế</li>
</ul>

<h3>Hồ sơ đăng ký</h3>
<p>Hồ sơ đăng ký tuyển sinh vào lớp 1 bao gồm các giấy tờ sau (bản gốc xuất trình, bản photo nộp lưu):</p>
<ul>
  <li><strong>Đơn đăng ký tuyển sinh</strong> theo mẫu của nhà trường (tải tại website hoặc nhận tại văn phòng)</li>
  <li><strong>Giấy khai sinh</strong> của học sinh (bản sao có công chứng)</li>
  <li><strong>Sổ hộ khẩu</strong> hoặc giấy tờ chứng minh nơi cư trú hợp lệ</li>
  <li><strong>Phiếu tiêm chủng</strong> đầy đủ theo lịch tiêm chủng quốc gia (hoặc xác nhận của cơ sở y tế)</li>
  <li>Ảnh 3×4 của học sinh (2 ảnh chụp trong vòng 6 tháng)</li>
</ul>

<h3>Lịch nộp hồ sơ và xét tuyển</h3>
<p>Nhà trường tổ chức nhận hồ sơ theo hai hình thức:</p>
<ul>
  <li><strong>Đăng ký trực tuyến:</strong> Từ <strong>01/06/2026 đến 15/06/2026</strong> — Phụ huynh điền và nộp hồ sơ qua cổng tuyển sinh trực tuyến tại website nhà trường. Hệ thống tự động xác nhận tiếp nhận hồ sơ và cấp mã số hồ sơ qua email.</li>
  <li><strong>Nộp trực tiếp tại trường:</strong> Từ <strong>01/07/2026 đến 10/07/2026</strong> (giờ hành chính, thứ 2 đến thứ 6) — Phụ huynh mang đầy đủ hồ sơ gốc đến nộp tại phòng tuyển sinh. Nhân viên tư vấn sẵn sàng hỗ trợ bổ sung hồ sơ nếu còn thiếu sót.</li>
  <li><strong>Thông báo kết quả:</strong> Dự kiến <strong>20/07/2026</strong> — Kết quả được thông báo trực tiếp tới phụ huynh qua email và đăng trên website nhà trường.</li>
</ul>

<h3>Học phí và các khoản thu</h3>
<p>Học phí năm học 2026-2027 là <strong>3.500.000 đồng/tháng/học sinh</strong>, thanh toán theo tháng vào tuần đầu của mỗi tháng. Học phí bao gồm toàn bộ chi phí học tập chương trình chính khóa bao gồm cả tiếng Anh tăng cường và các môn năng khiếu trong thời khóa biểu. Học phí không bao gồm: dịch vụ bán trú (60.000đ/ngày), xe đưa đón (1.500.000đ/tháng) và các câu lạc bộ ngoại khóa tự chọn. Nhà trường có chính sách miễn giảm học phí cho học sinh thuộc diện chính sách và học sinh có thành tích học tập xuất sắc theo quy định.</p>

<h3>Liên hệ và tư vấn</h3>
<p>Phụ huynh có nhu cầu tư vấn về tuyển sinh, tham quan cơ sở vật chất hoặc tìm hiểu chương trình giáo dục có thể liên hệ phòng tuyển sinh nhà trường qua các kênh: gọi điện thoại trong giờ hành chính, nhắn tin qua fanpage chính thức của trường hoặc đặt lịch hẹn tham quan trường qua website. Đội ngũ tư vấn tuyển sinh luôn sẵn sàng giải đáp mọi thắc mắc và đồng hành cùng gia đình trong quá trình ra quyết định — lựa chọn đúng môi trường học tập là bước khởi đầu quan trọng nhất của hành trình giáo dục của con.</p>
</section>`,
    },
  ];

  let created = 0;
  for (const p of pages) {
    if (await repo.findOne({ where: { slug: p.slug } })) {
      console.log(`[SKIP] Slug da ton tai: ${p.slug}`);
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
    console.log(`[OK] Tao trang: ${p.slug}`);
  }

  console.log(
    `[SEED] Pages part2: ${created} created, ${pages.length - created} skipped`,
  );
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
