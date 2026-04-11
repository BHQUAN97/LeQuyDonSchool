// Chay: npx ts-node -r tsconfig-paths/register src/database/seeds/pages-seed.ts
// Hoac them vao package.json scripts: "seed:pages": "ts-node -r tsconfig-paths/register src/database/seeds/pages-seed.ts"

import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Page, PageStatus } from '../../modules/pages/entities/page.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed trang noi dung (Pages) cho website truong tieu hoc Le Quy Don.
 * Idempotent — kiem tra slug truoc khi insert.
 */

const pagesData = [
  // ═══════════════════════════════════════════════════
  // TONG QUAN (Overview) — 5 pages
  // ═══════════════════════════════════════════════════
  {
    title: 'Tầm nhìn & Sứ mệnh',
    slug: 'tong-quan/tam-nhin-su-menh',
    seo_title: 'Tầm nhìn & Sứ mệnh — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Tầm nhìn, sứ mệnh và giá trị cốt lõi của trường Tiểu học Lê Quý Đôn Hà Nội — nơi ươm mầm tương lai.',
    content: `<section class="page-content">
<h2>Tầm nhìn của trường Tiểu học Lê Quý Đôn</h2>
<p>Trường Tiểu học Lê Quý Đôn được thành lập với khát vọng trở thành <strong>ngôi trường tiểu học hàng đầu tại Hà Nội</strong>, nơi mỗi học sinh được khơi dậy tiềm năng, phát triển toàn diện và tự tin bước vào tương lai. Mang tên nhà bác học lỗi lạc Lê Quý Đôn (1726–1784) — biểu tượng cho tinh thần hiếu học và trí tuệ Việt Nam, nhà trường luôn lấy tri thức và nhân cách làm nền tảng cho mọi hoạt động giáo dục.</p>
<img src="/uploads/placeholder-school.jpg" alt="Toàn cảnh trường Tiểu học Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Tầm nhìn đến năm 2030</h3>
<p>Đến năm 2030, trường Tiểu học Lê Quý Đôn phấn đấu trở thành trường tiểu học đạt chuẩn quốc gia mức độ 2, được công nhận là mô hình giáo dục tiên tiến với các đặc trưng:</p>
<ul>
  <li><strong>Chất lượng giáo dục vượt trội:</strong> 100% học sinh hoàn thành chương trình tiểu học, trên 85% đạt mức hoàn thành tốt các môn học.</li>
  <li><strong>Năng lực hội nhập quốc tế:</strong> Học sinh tốt nghiệp đạt trình độ tiếng Anh tương đương Cambridge Movers, tự tin giao tiếp với bạn bè quốc tế.</li>
  <li><strong>Phát triển toàn diện:</strong> Mỗi học sinh tham gia ít nhất 2 hoạt động ngoại khóa, phát triển đầy đủ về thể chất, trí tuệ, cảm xúc và kỹ năng xã hội.</li>
  <li><strong>Công nghệ giáo dục hiện đại:</strong> Ứng dụng công nghệ thông tin trong 100% tiết dạy, triển khai nền tảng học tập trực tuyến bổ trợ.</li>
</ul>

<h3>Sứ mệnh</h3>
<p>Sứ mệnh của trường Tiểu học Lê Quý Đôn là <strong>xây dựng môi trường giáo dục an toàn, thân thiện và sáng tạo</strong>, giúp mỗi học sinh phát triển toàn diện về trí tuệ, thể chất, đạo đức và kỹ năng sống. Nhà trường cam kết đồng hành cùng gia đình trong hành trình nuôi dưỡng và giáo dục thế hệ trẻ, trang bị cho các em nền tảng vững chắc để trở thành công dân có trách nhiệm, sáng tạo và nhân ái.</p>

<h3>Giá trị cốt lõi</h3>
<p>Bốn giá trị cốt lõi tạo nên bản sắc riêng của trường Tiểu học Lê Quý Đôn:</p>
<ol>
  <li><strong>Yêu thương (Love):</strong> Tạo môi trường học tập ấm áp, gắn kết, nơi mỗi học sinh cảm thấy được yêu thương và tôn trọng. Thầy cô không chỉ là người dạy kiến thức mà còn là người đồng hành, chia sẻ và thấu hiểu từng học trò.</li>
  <li><strong>Sáng tạo (Creativity):</strong> Khuyến khích tư duy phản biện và năng lực sáng tạo thông qua phương pháp dạy học tích cực. Học sinh được tự do khám phá, thử nghiệm và phát triển ý tưởng của riêng mình.</li>
  <li><strong>Trách nhiệm (Responsibility):</strong> Rèn luyện ý thức trách nhiệm với bản thân, gia đình, nhà trường và cộng đồng. Từ việc nhỏ nhất như giữ gìn vệ sinh lớp học đến ý thức bảo vệ môi trường.</li>
  <li><strong>Hội nhập (Integration):</strong> Trang bị kiến thức và kỹ năng cho công dân toàn cầu — ngoại ngữ, công nghệ, tư duy mở và khả năng thích ứng với môi trường đa văn hóa.</li>
</ol>

<h3>Triết lý giáo dục</h3>
<p>Nhà trường theo đuổi triết lý <em>"Mỗi em học sinh là một ngôi sao sáng"</em> — mỗi trẻ em đều có những tài năng và phẩm chất riêng biệt. Nhiệm vụ của giáo dục không phải là tạo ra những khuôn mẫu giống nhau, mà là giúp mỗi em tỏa sáng theo cách riêng của mình.</p>
<p>Với đội ngũ giáo viên tận tâm, cơ sở vật chất hiện đại và chương trình giáo dục toàn diện, trường Tiểu học Lê Quý Đôn tự tin là nơi ươm mầm những thế hệ công dân Việt Nam xuất sắc, sẵn sàng đóng góp cho sự phát triển của đất nước và hội nhập quốc tế.</p>
</section>`,
  },
  {
    title: 'Cột mốc phát triển',
    slug: 'tong-quan/cot-moc-phat-trien',
    seo_title: 'Cột mốc phát triển — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Lịch sử hình thành và các cột mốc phát triển quan trọng của trường Tiểu học Lê Quý Đôn từ năm 1998 đến nay.',
    content: `<section class="page-content">
<h2>Hành trình phát triển của trường Tiểu học Lê Quý Đôn</h2>
<p>Trải qua hơn 25 năm xây dựng và phát triển, trường Tiểu học Lê Quý Đôn đã không ngừng lớn mạnh, từ một ngôi trường nhỏ trở thành một trong những trường tiểu học uy tín hàng đầu tại Hà Nội. Mỗi cột mốc đều ghi dấu sự nỗ lực không ngừng của các thế hệ thầy cô giáo, học sinh và phụ huynh.</p>
<img src="/uploads/placeholder-school.jpg" alt="Lịch sử trường Tiểu học Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Các cột mốc quan trọng</h3>
<table>
  <thead>
    <tr>
      <th>Năm</th>
      <th>Sự kiện</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1998</strong></td>
      <td>Thành lập trường Tiểu học Lê Quý Đôn theo Quyết định của UBND Quận, khóa đầu tiên gồm 6 lớp với 210 học sinh.</td>
    </tr>
    <tr>
      <td><strong>2002</strong></td>
      <td>Khánh thành tòa nhà chính 4 tầng với 24 phòng học đạt chuẩn quốc gia. Số lượng học sinh tăng lên 650 em.</td>
    </tr>
    <tr>
      <td><strong>2005</strong></td>
      <td>Được UBND Thành phố Hà Nội công nhận trường đạt chuẩn quốc gia mức độ 1. Triển khai chương trình tiếng Anh tăng cường.</td>
    </tr>
    <tr>
      <td><strong>2008</strong></td>
      <td>Khánh thành nhà thể chất đa năng và bể bơi bốn mùa. Thành lập các câu lạc bộ thể thao: bơi lội, cầu lông, võ thuật.</td>
    </tr>
    <tr>
      <td><strong>2010</strong></td>
      <td>Đạt giải Nhất toàn đoàn Hội thi "Trường học thân thiện, học sinh tích cực" cấp thành phố. Nhận Bằng khen của Bộ GD&amp;ĐT.</td>
    </tr>
    <tr>
      <td><strong>2013</strong></td>
      <td>Triển khai chương trình STEM giáo dục, thành lập phòng thí nghiệm khoa học và phòng Robotics cho học sinh.</td>
    </tr>
    <tr>
      <td><strong>2015</strong></td>
      <td>Kỷ niệm 17 năm thành lập. Số lượng học sinh đạt 1.100 em với 35 lớp. Nhận Cờ thi đua xuất sắc của UBND TP Hà Nội.</td>
    </tr>
    <tr>
      <td><strong>2018</strong></td>
      <td>Đạt chuẩn quốc gia mức độ 2. Khánh thành thư viện thông minh với hơn 15.000 đầu sách. Triển khai mô hình lớp học thông minh.</td>
    </tr>
    <tr>
      <td><strong>2020</strong></td>
      <td>Ứng phó thành công đại dịch COVID-19, triển khai dạy học trực tuyến đảm bảo 100% học sinh được tiếp cận bài giảng.</td>
    </tr>
    <tr>
      <td><strong>2022</strong></td>
      <td>Triển khai chương trình giáo dục phổ thông mới 2018. Khánh thành khu vui chơi sáng tạo ngoài trời.</td>
    </tr>
    <tr>
      <td><strong>2024</strong></td>
      <td>Kỷ niệm 26 năm thành lập. Số lượng học sinh đạt 1.250 em, 40 lớp. Đội tuyển học sinh đạt 25 giải cấp quận và 8 giải cấp thành phố.</td>
    </tr>
    <tr>
      <td><strong>2025</strong></td>
      <td>Ra mắt website mới, ứng dụng công nghệ AI trong hỗ trợ giảng dạy. Triển khai chương trình Cambridge tiếng Anh cho khối 3–5.</td>
    </tr>
  </tbody>
</table>

<h3>Thành tích nổi bật</h3>
<p>Trong suốt quá trình phát triển, trường Tiểu học Lê Quý Đôn đã đạt được nhiều thành tích đáng tự hào:</p>
<ul>
  <li><strong>Giải thưởng cấp quốc gia:</strong> 2 lần nhận Bằng khen của Bộ Giáo dục và Đào tạo vì thành tích xuất sắc trong công tác giáo dục.</li>
  <li><strong>Giải thưởng cấp thành phố:</strong> 5 lần nhận Cờ thi đua xuất sắc, 8 lần nhận Bằng khen của UBND TP Hà Nội.</li>
  <li><strong>Thành tích học sinh:</strong> Hơn 500 lượt học sinh đạt giải trong các kỳ thi Olympic Toán, Tiếng Anh, Khoa học cấp quận và thành phố.</li>
  <li><strong>Giáo viên giỏi:</strong> 15 giáo viên đạt danh hiệu Giáo viên dạy giỏi cấp thành phố, 45 giáo viên đạt cấp quận.</li>
</ul>

<h3>Hướng tới tương lai</h3>
<p>Với nền tảng vững chắc được xây dựng qua hơn 25 năm, trường Tiểu học Lê Quý Đôn tiếp tục hướng tới mục tiêu trở thành trường tiểu học kiểu mẫu, ứng dụng công nghệ giáo dục tiên tiến, mở rộng hợp tác quốc tế và nâng cao chất lượng giáo dục toàn diện cho mỗi học sinh.</p>
</section>`,
  },
  {
    title: 'Gia đình Doners',
    slug: 'tong-quan/gia-dinh-doners',
    seo_title: 'Gia đình Doners — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Gia đình Doners — cộng đồng giáo viên, nhân viên và phụ huynh trường Tiểu học Lê Quý Đôn gắn kết và yêu thương.',
    content: `<section class="page-content">
<h2>Gia đình Doners — Cộng đồng Lê Quý Đôn</h2>
<p>"Doners" là tên gọi thân thương mà các thành viên trong đại gia đình trường Tiểu học Lê Quý Đôn dành cho nhau. Từ các em học sinh nhỏ tuổi nhất đến các thầy cô giáo kỳ cựu, từ phụ huynh đến cựu học sinh — tất cả đều tự hào là một phần của <strong>gia đình Doners</strong>.</p>
<img src="/uploads/placeholder-school.jpg" alt="Gia đình Doners trường Tiểu học Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Đội ngũ lãnh đạo</h3>
<p>Ban Giám hiệu nhà trường gồm những nhà giáo dục giàu kinh nghiệm và tâm huyết:</p>
<ul>
  <li><strong>Hiệu trưởng — Cô Nguyễn Thị Minh Hằng:</strong> Thạc sĩ Quản lý Giáo dục, hơn 25 năm kinh nghiệm trong ngành giáo dục tiểu học, Nhà giáo ưu tú.</li>
  <li><strong>Phó Hiệu trưởng Chuyên môn — Thầy Trần Văn Đức:</strong> Thạc sĩ Giáo dục học, chuyên gia phát triển chương trình, phụ trách đổi mới phương pháp giảng dạy.</li>
  <li><strong>Phó Hiệu trưởng Hoạt động — Cô Lê Thị Thu Hương:</strong> Cử nhân Quản lý Giáo dục, phụ trách các hoạt động ngoại khóa, sự kiện và quan hệ cộng đồng.</li>
</ul>

<h3>Đội ngũ giáo viên</h3>
<p>Trường Tiểu học Lê Quý Đôn tự hào có đội ngũ <strong>85 giáo viên và nhân viên</strong>, trong đó:</p>
<ul>
  <li>65 giáo viên trực tiếp giảng dạy (100% đạt chuẩn, 70% trên chuẩn)</li>
  <li>8 giáo viên tiếng Anh (gồm 3 giáo viên bản ngữ đến từ Anh, Mỹ và Úc)</li>
  <li>5 giáo viên chuyên biệt: Âm nhạc, Mỹ thuật, Thể dục, Tin học, Thư viện</li>
  <li>7 nhân viên hỗ trợ: Y tế, Tư vấn tâm lý, Hành chính, Kế toán</li>
</ul>

<h3>Phụ huynh — Đối tác đồng hành</h3>
<p>Hội Phụ huynh học sinh trường Tiểu học Lê Quý Đôn là cầu nối quan trọng giữa gia đình và nhà trường. Hội hoạt động tích cực với nhiều chương trình hỗ trợ:</p>
<ul>
  <li>Tổ chức các buổi tọa đàm về phương pháp giáo dục con cái hàng tháng.</li>
  <li>Hỗ trợ tổ chức các sự kiện: Ngày hội Gia đình, Tết Trung thu, Lễ hội Xuân.</li>
  <li>Quỹ học bổng "Doners tương lai" dành cho học sinh có hoàn cảnh khó khăn nhưng học giỏi.</li>
  <li>Chương trình "Phụ huynh đồng giảng" — mời phụ huynh chia sẻ về nghề nghiệp và kinh nghiệm sống.</li>
</ul>

<h3>Cựu học sinh — Niềm tự hào Doners</h3>
<p>Qua hơn 25 năm, hàng nghìn học sinh đã trưởng thành từ mái trường Lê Quý Đôn. Nhiều em đã đạt thành tích xuất sắc trong học tập và sự nghiệp:</p>
<ul>
  <li>Hơn 200 cựu học sinh đỗ vào các trường chuyên, trường điểm cấp thành phố.</li>
  <li>Nhiều em giành học bổng du học tại Mỹ, Anh, Úc, Singapore.</li>
  <li>Câu lạc bộ Cựu học sinh "Doners Alumni" hoạt động từ năm 2015, tổ chức giao lưu và chia sẻ kinh nghiệm thường niên.</li>
</ul>

<h3>Văn hóa Doners</h3>
<p>Điều làm nên bản sắc riêng của gia đình Doners chính là tinh thần <em>"Yêu thương — Chia sẻ — Cùng phát triển"</em>. Mỗi thành viên đều được đón nhận, lắng nghe và tôn trọng. Đó là lý do tại sao nhiều phụ huynh đã gắn bó với trường suốt nhiều năm, từ con lớn đến con nhỏ, và luôn tin tưởng gửi gắm con em cho đại gia đình Doners.</p>
</section>`,
  },
  {
    title: 'Ngôi nhà Lê Quý Đôn',
    slug: 'tong-quan/ngoi-nha-le-quy-don',
    seo_title: 'Ngôi nhà Lê Quý Đôn — Khuôn viên & Cơ sở vật chất',
    seo_description: 'Khám phá khuôn viên, cơ sở vật chất và không gian học tập hiện đại tại trường Tiểu học Lê Quý Đôn Hà Nội.',
    content: `<section class="page-content">
<h2>Ngôi nhà Lê Quý Đôn — Không gian học tập lý tưởng</h2>
<p>Trường Tiểu học Lê Quý Đôn tọa lạc trên khuôn viên rộng <strong>8.500 m²</strong> tại vị trí thuận lợi trong nội thành Hà Nội. Ngôi trường được thiết kế theo phong cách hiện đại, thân thiện với trẻ em, tạo không gian học tập an toàn và đầy cảm hứng.</p>
<img src="/uploads/placeholder-school.jpg" alt="Khuôn viên trường Tiểu học Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Tổng thể khuôn viên</h3>
<p>Khuôn viên trường bao gồm 3 khu chính:</p>
<ul>
  <li><strong>Khu A — Tòa nhà học tập chính:</strong> 4 tầng, 30 phòng học tiêu chuẩn, mỗi phòng được trang bị bảng tương tác thông minh, máy chiếu, điều hòa và hệ thống ánh sáng đạt chuẩn.</li>
  <li><strong>Khu B — Tòa nhà chức năng:</strong> 3 tầng gồm phòng Tin học, phòng STEM/Robotics, phòng Âm nhạc, phòng Mỹ thuật, phòng Ngoại ngữ và thư viện.</li>
  <li><strong>Khu C — Nhà thể chất và dịch vụ:</strong> Nhà thể chất đa năng, bể bơi bốn mùa, nhà ăn, phòng y tế.</li>
</ul>

<h3>Không gian ngoài trời</h3>
<p>Sân trường được quy hoạch khoa học với nhiều khu chức năng:</p>
<ul>
  <li><strong>Sân chào cờ:</strong> Diện tích 800 m², là nơi diễn ra lễ chào cờ thứ Hai hàng tuần và các sự kiện lớn.</li>
  <li><strong>Sân chơi sáng tạo:</strong> Được thiết kế theo tiêu chuẩn an toàn quốc tế, gồm khu cầu trượt, thang leo, xích đu với lớp đệm cao su giảm chấn.</li>
  <li><strong>Vườn sinh thái:</strong> Nơi các em học sinh trồng rau, hoa và tìm hiểu về thiên nhiên — phục vụ bài học Tự nhiên và Xã hội.</li>
  <li><strong>Sân bóng mini:</strong> Sân cỏ nhân tạo tiêu chuẩn, phục vụ các giờ học thể dục và hoạt động câu lạc bộ bóng đá.</li>
</ul>

<h3>Phòng học thông minh</h3>
<p>Tất cả 30 phòng học đều được trang bị theo tiêu chuẩn "Phòng học thông minh" với các thiết bị:</p>
<ul>
  <li>Bảng tương tác thông minh 86 inch kết nối Internet</li>
  <li>Máy tính giảng viên với phần mềm quản lý lớp học</li>
  <li>Hệ thống camera an ninh và đèn LED tiết kiệm năng lượng</li>
  <li>Bàn ghế ergonomic thiết kế theo chiều cao học sinh từng khối lớp</li>
  <li>Máy lọc không khí và hệ thống thông gió đạt chuẩn</li>
</ul>

<h3>An ninh và an toàn</h3>
<p>Nhà trường đặc biệt chú trọng đến an ninh và an toàn cho học sinh:</p>
<ul>
  <li>Hệ thống camera giám sát 24/7 phủ khắp khuôn viên (56 camera)</li>
  <li>Đội bảo vệ chuyên nghiệp trực 24/24, kiểm soát ra vào bằng thẻ từ</li>
  <li>Hệ thống phòng cháy chữa cháy đạt chuẩn, diễn tập PCCC định kỳ</li>
  <li>Phần mềm quản lý đưa đón học sinh, thông báo tự động cho phụ huynh</li>
</ul>
<p>Với cơ sở vật chất hiện đại và không gian xanh — sạch — đẹp, ngôi nhà Lê Quý Đôn thực sự là nơi mỗi học sinh cảm thấy hạnh phúc và yêu thích đến trường mỗi ngày.</p>
</section>`,
  },
  {
    title: 'Sắc màu Lê Quý Đôn',
    slug: 'tong-quan/sac-mau-le-quy-don',
    seo_title: 'Sắc màu Lê Quý Đôn — Đời sống học đường sôi động',
    seo_description: 'Khám phá đời sống học đường đầy sắc màu tại trường Tiểu học Lê Quý Đôn — văn hóa, lễ hội, câu lạc bộ và hoạt động ngoại khóa.',
    content: `<section class="page-content">
<h2>Sắc màu Lê Quý Đôn — Đời sống học đường sôi động</h2>
<p>Tại trường Tiểu học Lê Quý Đôn, mỗi ngày đến trường đều là một ngày đặc biệt. Bên cạnh việc học tập, các em học sinh được tham gia vào vô số hoạt động phong phú, tạo nên bức tranh đời sống học đường đầy <strong>sắc màu và niềm vui</strong>.</p>
<img src="/uploads/placeholder-school.jpg" alt="Hoạt động sắc màu tại trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Lễ hội truyền thống</h3>
<p>Hàng năm, nhà trường tổ chức nhiều lễ hội truyền thống, tạo không gian để các em trải nghiệm văn hóa Việt Nam:</p>
<ul>
  <li><strong>Tết Trung thu:</strong> Đêm hội trăng rằm với rước đèn, phá cỗ, biểu diễn múa lân — sự kiện được các em mong đợi nhất trong năm.</li>
  <li><strong>Lễ hội Xuân:</strong> Gói bánh chưng, viết thư pháp, trò chơi dân gian, biểu diễn áo dài — mang hương vị Tết đến sân trường.</li>
  <li><strong>Ngày Nhà giáo Việt Nam 20/11:</strong> Lễ tri ân thầy cô với chương trình văn nghệ đặc biệt do chính các em dàn dựng.</li>
  <li><strong>Ngày hội Gia đình:</strong> Sự kiện kết nối gia đình với nhà trường, gồm các trò chơi vận động cha mẹ — con cái, hội chợ ẩm thực và biểu diễn văn nghệ.</li>
</ul>

<h3>Câu lạc bộ và hoạt động ngoại khóa</h3>
<p>Nhà trường tổ chức hơn 15 câu lạc bộ ngoại khóa, hoạt động vào các buổi chiều trong tuần:</p>
<table>
  <thead>
    <tr>
      <th>Lĩnh vực</th>
      <th>Câu lạc bộ</th>
      <th>Lịch sinh hoạt</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Học thuật</td>
      <td>Robotics &amp; STEM, Toán tư duy, English Club</td>
      <td>Thứ 3, 5</td>
    </tr>
    <tr>
      <td>Nghệ thuật</td>
      <td>Hợp xướng, Vẽ sáng tạo, Nhảy hiện đại, Đàn organ</td>
      <td>Thứ 2, 4, 6</td>
    </tr>
    <tr>
      <td>Thể thao</td>
      <td>Bóng đá, Bơi lội, Võ Taekwondo, Cờ vua</td>
      <td>Thứ 2–6</td>
    </tr>
    <tr>
      <td>Kỹ năng</td>
      <td>Nấu ăn nhí, Làm vườn, Kỹ năng sống</td>
      <td>Thứ 4, 6</td>
    </tr>
  </tbody>
</table>

<h3>Chương trình đặc biệt</h3>
<p>Ngoài các hoạt động thường niên, nhà trường còn tổ chức nhiều chương trình đặc biệt:</p>
<ul>
  <li><strong>Tuần lễ Khoa học:</strong> Các em được tham gia thí nghiệm, triển lãm sáng tạo và cuộc thi STEM cấp trường.</li>
  <li><strong>Dự án "Nhà sử học nhí":</strong> Tham quan bảo tàng, di tích lịch sử Hà Nội, tìm hiểu về danh nhân Lê Quý Đôn.</li>
  <li><strong>Chương trình "Xanh — Sạch — Đẹp":</strong> Các em tham gia trồng cây, dọn vệ sinh và tái chế rác thải, nâng cao ý thức bảo vệ môi trường.</li>
  <li><strong>Giao lưu quốc tế:</strong> Kết nối với trường tiểu học tại Singapore, Nhật Bản qua video call, trao đổi văn hóa và dự án học tập chung.</li>
</ul>

<h3>Bản tin học đường</h3>
<p>Bản tin "Sắc màu Doners" được phát hành hàng tháng, do chính các em học sinh lớp 4–5 biên tập dưới sự hướng dẫn của thầy cô. Bản tin gồm các chuyên mục: Tin tức trường, Góc sáng tạo, Nhân vật của tháng, Câu đố vui và Thư viện ảnh. Đây là sân chơi tuyệt vời để các em rèn luyện kỹ năng viết, chụp ảnh và làm việc nhóm.</p>
<p>Với hàng trăm hoạt động phong phú mỗi năm, đời sống học đường tại Lê Quý Đôn luôn tràn đầy niềm vui, tiếng cười và những kỷ niệm đáng nhớ cho mỗi em học sinh.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // CHUONG TRINH (Programs) — 4 pages
  // ═══════════════════════════════════════════════════
  {
    title: 'Chương trình Quốc gia nâng cao',
    slug: 'chuong-trinh/quoc-gia-nang-cao',
    seo_title: 'Chương trình Quốc gia nâng cao — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Chương trình giáo dục quốc gia nâng cao tại trường Tiểu học Lê Quý Đôn — Toán, Tiếng Việt, Khoa học và các môn bổ trợ.',
    content: `<section class="page-content">
<h2>Chương trình Quốc gia nâng cao</h2>
<p>Trường Tiểu học Lê Quý Đôn triển khai <strong>Chương trình Giáo dục Phổ thông 2018</strong> của Bộ Giáo dục và Đào tạo, đồng thời bổ sung các nội dung nâng cao nhằm phát huy tối đa năng lực và phẩm chất của học sinh. Chương trình được thiết kế để đảm bảo chuẩn kiến thức quốc gia, đồng thời tạo điều kiện để các em phát triển toàn diện.</p>
<img src="/uploads/placeholder-school.jpg" alt="Giờ học tại trường Tiểu học Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Khung chương trình</h3>
<table>
  <thead>
    <tr>
      <th>Môn học / Hoạt động</th>
      <th>Số tiết/tuần (Lớp 1-2)</th>
      <th>Số tiết/tuần (Lớp 3-5)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Tiếng Việt</td>
      <td>10</td>
      <td>8</td>
    </tr>
    <tr>
      <td>Toán</td>
      <td>5</td>
      <td>5</td>
    </tr>
    <tr>
      <td>Đạo đức</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>Tự nhiên và Xã hội / Khoa học</td>
      <td>2</td>
      <td>2</td>
    </tr>
    <tr>
      <td>Lịch sử và Địa lý</td>
      <td>—</td>
      <td>2</td>
    </tr>
    <tr>
      <td>Tiếng Anh (tăng cường)</td>
      <td>4</td>
      <td>8</td>
    </tr>
    <tr>
      <td>Tin học</td>
      <td>—</td>
      <td>2</td>
    </tr>
    <tr>
      <td>Âm nhạc</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>Mỹ thuật</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>Thể dục</td>
      <td>2</td>
      <td>2</td>
    </tr>
    <tr>
      <td>Hoạt động trải nghiệm</td>
      <td>2</td>
      <td>2</td>
    </tr>
    <tr>
      <td><strong>Tổng cộng</strong></td>
      <td><strong>28</strong></td>
      <td><strong>34</strong></td>
    </tr>
  </tbody>
</table>

<h3>Điểm khác biệt — Chương trình nâng cao</h3>
<p>So với chương trình chuẩn quốc gia, trường Tiểu học Lê Quý Đôn bổ sung các nội dung nâng cao:</p>
<ol>
  <li><strong>Toán tư duy (Lớp 3–5):</strong> Bên cạnh chương trình Toán chuẩn, nhà trường triển khai thêm 2 tiết Toán tư duy mỗi tuần, sử dụng phương pháp giải toán Singapore — giúp các em phát triển tư duy logic, khả năng phân tích và giải quyết vấn đề.</li>
  <li><strong>Tiếng Việt sáng tạo:</strong> Bổ sung hoạt động đọc sách hàng ngày (15 phút/ngày), viết nhật ký sáng tạo hàng tuần và các dự án đọc — viết theo chủ đề.</li>
  <li><strong>STEM cơ bản (Lớp 2–5):</strong> Tích hợp các dự án STEM vào môn Tự nhiên và Xã hội / Khoa học, giúp các em áp dụng kiến thức vào thực tiễn.</li>
  <li><strong>Giáo dục tài chính nhí (Lớp 4–5):</strong> Chương trình mới giúp các em hiểu về tiết kiệm, chi tiêu hợp lý và giá trị của đồng tiền.</li>
</ol>

<h3>Phương pháp giảng dạy</h3>
<p>Nhà trường áp dụng các phương pháp giảng dạy hiện đại, lấy học sinh làm trung tâm:</p>
<ul>
  <li><strong>Dạy học phân hóa:</strong> Thiết kế bài tập phù hợp với năng lực từng nhóm học sinh, đảm bảo không em nào bị bỏ lại phía sau.</li>
  <li><strong>Học qua dự án (PBL):</strong> Mỗi tháng, các lớp thực hiện 1 dự án liên môn gắn với thực tiễn cuộc sống.</li>
  <li><strong>Ứng dụng công nghệ:</strong> Sử dụng bảng tương tác, phần mềm học tập và các ứng dụng giáo dục trong mọi tiết học.</li>
  <li><strong>Đánh giá năng lực:</strong> Đánh giá thường xuyên bằng nhiều hình thức (quan sát, vấn đáp, sản phẩm, bài kiểm tra), không chỉ dựa vào điểm số.</li>
</ul>
<p>Với chương trình quốc gia nâng cao, trường Tiểu học Lê Quý Đôn đảm bảo mỗi học sinh không chỉ đạt chuẩn kiến thức mà còn phát triển tối đa tiềm năng cá nhân.</p>
</section>`,
  },
  {
    title: 'Tiếng Anh tăng cường',
    slug: 'chuong-trinh/tieng-anh-tang-cuong',
    seo_title: 'Tiếng Anh tăng cường — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Chương trình tiếng Anh tăng cường tại trường Tiểu học Lê Quý Đôn — 8 tiết/tuần, giáo viên bản ngữ, chuẩn Cambridge.',
    content: `<section class="page-content">
<h2>Chương trình Tiếng Anh tăng cường</h2>
<p>Tiếng Anh là một trong những môn học được trường Tiểu học Lê Quý Đôn đầu tư mạnh mẽ nhất. Với mục tiêu giúp học sinh <strong>tự tin giao tiếp tiếng Anh</strong> và đạt chuẩn quốc tế từ cấp tiểu học, nhà trường triển khai chương trình tiếng Anh tăng cường với nhiều điểm vượt trội.</p>
<img src="/uploads/placeholder-school.jpg" alt="Giờ học tiếng Anh với giáo viên bản ngữ" class="rounded-xl shadow" />

<h3>Đặc điểm chương trình</h3>
<ul>
  <li><strong>Thời lượng:</strong> 4 tiết/tuần cho lớp 1–2 và 8 tiết/tuần cho lớp 3–5 (so với 2–4 tiết chuẩn quốc gia).</li>
  <li><strong>Giáo viên bản ngữ:</strong> 3 giáo viên đến từ Anh, Mỹ và Úc, có chứng chỉ TESOL/CELTA, giảng dạy trực tiếp 50% số tiết.</li>
  <li><strong>Giáo viên Việt Nam:</strong> 5 giáo viên tiếng Anh có trình độ IELTS 7.0 trở lên, phụ trách ngữ pháp và phần kỹ năng đọc — viết.</li>
  <li><strong>Sĩ số lớp:</strong> Tối đa 25 học sinh/lớp khi học tiếng Anh, đảm bảo mỗi em được thực hành nhiều nhất.</li>
</ul>

<h3>Giáo trình và chuẩn đầu ra</h3>
<p>Nhà trường sử dụng bộ giáo trình chuẩn Cambridge kết hợp tài liệu bổ trợ:</p>
<table>
  <thead>
    <tr>
      <th>Khối lớp</th>
      <th>Giáo trình</th>
      <th>Chuẩn đầu ra</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Lớp 1–2</td>
      <td>Fun Skills (Cambridge)</td>
      <td>Pre-Starters</td>
    </tr>
    <tr>
      <td>Lớp 3</td>
      <td>Kid's Box New Generation 3</td>
      <td>Cambridge Starters</td>
    </tr>
    <tr>
      <td>Lớp 4</td>
      <td>Kid's Box New Generation 4</td>
      <td>Cambridge Movers</td>
    </tr>
    <tr>
      <td>Lớp 5</td>
      <td>Kid's Box New Generation 5</td>
      <td>Cambridge Movers / Flyers</td>
    </tr>
  </tbody>
</table>

<h3>Phương pháp giảng dạy</h3>
<p>Chương trình tiếng Anh tại Lê Quý Đôn áp dụng phương pháp <strong>Communicative Language Teaching (CLT)</strong>, tập trung vào giao tiếp thực tế:</p>
<ol>
  <li><strong>Nghe — Nói (50% thời lượng):</strong> Các em được nghe và nói tiếng Anh mỗi ngày thông qua hội thoại, trò chơi ngôn ngữ, đóng vai và thuyết trình.</li>
  <li><strong>Đọc — Viết (30% thời lượng):</strong> Đọc truyện bằng tiếng Anh (Graded Readers), viết nhật ký, thư và bài luận ngắn.</li>
  <li><strong>Ngữ pháp — Từ vựng (20% thời lượng):</strong> Học ngữ pháp qua ngữ cảnh, mở rộng vốn từ vựng theo chủ đề thực tế.</li>
</ol>

<h3>Hoạt động bổ trợ</h3>
<ul>
  <li><strong>English Club:</strong> Sinh hoạt thứ 4 hàng tuần, các em tham gia trò chơi, xem phim, hát nhạc tiếng Anh.</li>
  <li><strong>English Day:</strong> Mỗi tháng 1 ngày, toàn trường giao tiếp bằng tiếng Anh, từ chào hỏi đến mua hàng tại căng tin.</li>
  <li><strong>Cuộc thi Spelling Bee:</strong> Tổ chức hàng năm, chọn đội tuyển tham dự cấp quận.</li>
  <li><strong>Giao lưu quốc tế:</strong> Kết nối video call với học sinh trường đối tác tại Singapore mỗi tháng.</li>
</ul>

<h3>Kết quả đạt được</h3>
<p>Năm học 2024–2025, chương trình tiếng Anh tăng cường đã đạt được nhiều kết quả ấn tượng:</p>
<ul>
  <li>98% học sinh lớp 5 đạt chuẩn Cambridge Movers, 35% đạt Flyers.</li>
  <li>12 học sinh đạt giải Olympic Tiếng Anh cấp quận, 4 em đạt giải cấp thành phố.</li>
  <li>100% học sinh tốt nghiệp có thể tự tin giao tiếp tiếng Anh cơ bản trong các tình huống hàng ngày.</li>
</ul>
</section>`,
  },
  {
    title: 'Kỹ năng sống',
    slug: 'chuong-trinh/ky-nang-song',
    seo_title: 'Kỹ năng sống — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Chương trình giáo dục kỹ năng sống tại trường Tiểu học Lê Quý Đôn — teamwork, leadership, an toàn, trí tuệ cảm xúc.',
    content: `<section class="page-content">
<h2>Chương trình Kỹ năng sống</h2>
<p>Giáo dục kỹ năng sống là một trong những trụ cột quan trọng trong chiến lược giáo dục toàn diện của trường Tiểu học Lê Quý Đôn. Nhà trường tin rằng bên cạnh kiến thức học thuật, <strong>kỹ năng sống chính là hành trang không thể thiếu</strong> để các em tự tin bước vào cuộc sống.</p>
<img src="/uploads/placeholder-school.jpg" alt="Hoạt động kỹ năng sống tại trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Khung chương trình kỹ năng sống</h3>
<p>Chương trình kỹ năng sống được thiết kế theo 5 nhóm năng lực, phù hợp với từng lứa tuổi:</p>

<h3>1. Kỹ năng giao tiếp và làm việc nhóm</h3>
<ul>
  <li><strong>Lớp 1–2:</strong> Chào hỏi lễ phép, tự giới thiệu bản thân, lắng nghe người khác, chia sẻ đồ dùng với bạn.</li>
  <li><strong>Lớp 3–4:</strong> Thảo luận nhóm, trình bày ý kiến trước lớp, giải quyết mâu thuẫn hòa bình, hợp tác trong dự án.</li>
  <li><strong>Lớp 5:</strong> Thuyết trình trước đông người, lãnh đạo nhóm nhỏ, đàm phán và thương lượng, tổ chức sự kiện.</li>
</ul>

<h3>2. Kỹ năng tự chăm sóc bản thân</h3>
<ul>
  <li>Giữ vệ sinh cá nhân: rửa tay đúng cách, chải răng, giữ gìn quần áo sạch sẽ.</li>
  <li>Ăn uống lành mạnh: nhận biết thực phẩm tốt cho sức khỏe, hạn chế đồ ăn vặt.</li>
  <li>Quản lý thời gian: lập thời gian biểu, sắp xếp sách vở, chuẩn bị đồ dùng học tập.</li>
  <li>Quản lý cảm xúc: nhận biết và gọi tên cảm xúc, kỹ thuật hít thở sâu khi tức giận hoặc lo lắng.</li>
</ul>

<h3>3. Kỹ năng an toàn</h3>
<p>Đây là nhóm kỹ năng được nhà trường đặc biệt chú trọng:</p>
<ul>
  <li><strong>An toàn giao thông:</strong> Quy tắc đi đường, nhận biết biển báo, đội mũ bảo hiểm. Thực hành mô phỏng tại sân trường.</li>
  <li><strong>An toàn phòng cháy:</strong> Diễn tập PCCC 2 lần/năm, hướng dẫn thoát hiểm, sử dụng bình chữa cháy mô phỏng.</li>
  <li><strong>An toàn trên Internet:</strong> Nhận biết thông tin xấu, bảo vệ thông tin cá nhân, sử dụng mạng an toàn (cho lớp 4–5).</li>
  <li><strong>Phòng chống xâm hại:</strong> Chương trình "Vùng cơ thể riêng tư", kỹ năng nói KHÔNG, báo tin cho người lớn tin cậy.</li>
  <li><strong>Sơ cứu cơ bản:</strong> Xử lý vết thương nhỏ, cách gọi cấp cứu 115, sơ cứu đuối nước (cho lớp 5).</li>
</ul>

<h3>4. Kỹ năng tư duy và giải quyết vấn đề</h3>
<ul>
  <li>Đặt câu hỏi và tìm kiếm thông tin từ nhiều nguồn.</li>
  <li>Phân tích tình huống, đánh giá các phương án và lựa chọn giải pháp tối ưu.</li>
  <li>Tư duy sáng tạo: kỹ thuật brainstorming, mind mapping, thiết kế sản phẩm.</li>
  <li>Kiên trì và không bỏ cuộc khi gặp khó khăn — "Thất bại là bước đệm cho thành công".</li>
</ul>

<h3>5. Kỹ năng lãnh đạo và trách nhiệm cộng đồng</h3>
<ul>
  <li><strong>Đội tự quản lớp học:</strong> Luân phiên làm lớp trưởng, tổ trưởng, giúp các em tập lãnh đạo từ sớm.</li>
  <li><strong>Dự án cộng đồng:</strong> Mỗi năm, các lớp 4–5 thực hiện 1 dự án cộng đồng như quyên góp sách, thăm viện dưỡng lão, trồng cây xanh.</li>
  <li><strong>Chương trình "Đại sứ nhỏ":</strong> Học sinh lớp 5 hướng dẫn, giúp đỡ các em lớp 1 trong tháng đầu năm học.</li>
</ul>

<h3>Hình thức triển khai</h3>
<p>Chương trình kỹ năng sống được lồng ghép vào hoạt động hàng ngày: 1 tiết chính khóa/tuần trong giờ Hoạt động trải nghiệm, tích hợp trong các môn học, và thực hành qua các sự kiện, dã ngoại thực tế. Nhà trường cũng mời chuyên gia tâm lý về chia sẻ mỗi quý.</p>
</section>`,
  },
  {
    title: 'Thể chất & Nghệ thuật',
    slug: 'chuong-trinh/the-chat-nghe-thuat',
    seo_title: 'Thể chất & Nghệ thuật — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Chương trình giáo dục thể chất và nghệ thuật tại trường Tiểu học Lê Quý Đôn — võ thuật, bơi lội, âm nhạc, mỹ thuật, nhảy.',
    content: `<section class="page-content">
<h2>Chương trình Thể chất & Nghệ thuật</h2>
<p>Tại trường Tiểu học Lê Quý Đôn, giáo dục thể chất và nghệ thuật được coi là <strong>nền tảng quan trọng cho sự phát triển toàn diện</strong> của trẻ. Nhà trường đầu tư mạnh mẽ vào cơ sở vật chất và đội ngũ giáo viên chuyên biệt để mang đến cho các em những trải nghiệm phong phú nhất.</p>
<img src="/uploads/placeholder-school.jpg" alt="Hoạt động thể chất nghệ thuật tại trường Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Giáo dục Thể chất</h3>
<p>Chương trình thể dục tại Lê Quý Đôn vượt xa khuôn khổ 2 tiết/tuần thông thường, với nhiều hoạt động bổ trợ:</p>

<h3>Bơi lội</h3>
<p>Bơi lội là môn bắt buộc tại trường Lê Quý Đôn, được giảng dạy tại bể bơi bốn mùa trong khuôn viên trường:</p>
<ul>
  <li><strong>Lớp 1–2:</strong> Làm quen với nước, học kỹ thuật nổi và thở nước, bơi ếch cơ bản.</li>
  <li><strong>Lớp 3–4:</strong> Hoàn thiện bơi ếch, học bơi sải, kỹ năng tự cứu đuối nước.</li>
  <li><strong>Lớp 5:</strong> Bơi sải nâng cao, bơi bướm cơ bản, kỹ năng cứu hộ cơ bản.</li>
</ul>
<p>100% học sinh tốt nghiệp biết bơi ít nhất 1 kiểu, đây là cam kết và niềm tự hào của nhà trường.</p>

<h3>Võ thuật — Taekwondo</h3>
<p>Chương trình Taekwondo được giảng dạy bởi huấn luyện viên đai đen 3 đẳng, giúp các em rèn luyện:</p>
<ul>
  <li>Sức mạnh, sự dẻo dai và phản xạ nhanh.</li>
  <li>Kỷ luật, kiên nhẫn và tôn trọng đối thủ.</li>
  <li>Tự vệ cơ bản trong các tình huống nguy hiểm.</li>
</ul>
<p>Đội tuyển Taekwondo của trường đã giành 8 huy chương tại giải Taekwondo thiếu nhi cấp thành phố năm 2024.</p>

<h3>Các môn thể thao khác</h3>
<table>
  <thead>
    <tr>
      <th>Môn thể thao</th>
      <th>Hình thức</th>
      <th>Đối tượng</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Bóng đá</td>
      <td>CLB ngoại khóa + Đội tuyển</td>
      <td>Lớp 2–5</td>
    </tr>
    <tr>
      <td>Cầu lông</td>
      <td>CLB ngoại khóa</td>
      <td>Lớp 3–5</td>
    </tr>
    <tr>
      <td>Cờ vua</td>
      <td>CLB + Giờ chính khóa</td>
      <td>Lớp 1–5</td>
    </tr>
    <tr>
      <td>Thể dục nhịp điệu</td>
      <td>CLB ngoại khóa</td>
      <td>Lớp 1–5</td>
    </tr>
    <tr>
      <td>Bóng rổ mini</td>
      <td>CLB ngoại khóa</td>
      <td>Lớp 3–5</td>
    </tr>
  </tbody>
</table>

<h3>Giáo dục Nghệ thuật</h3>

<h3>Âm nhạc</h3>
<p>Chương trình âm nhạc được thiết kế phong phú, giúp các em phát triển năng khiếu và tình yêu âm nhạc:</p>
<ul>
  <li><strong>Hát:</strong> Hát đồng ca, hợp xướng, hát dân ca Việt Nam và bài hát quốc tế.</li>
  <li><strong>Nhạc cụ:</strong> Học đàn organ cơ bản (lớp 3–5), đàn ukulele, sáo recorder và bộ gõ Orff.</li>
  <li><strong>Lý thuyết âm nhạc:</strong> Nhận biết nốt nhạc, nhịp điệu, ký hiệu âm nhạc phù hợp với lứa tuổi.</li>
  <li><strong>Dàn hợp xướng:</strong> Dàn hợp xướng "Doners Choir" gồm 40 học sinh, biểu diễn tại các sự kiện của trường và đại diện thi cấp quận.</li>
</ul>

<h3>Mỹ thuật</h3>
<p>Giờ Mỹ thuật tại Lê Quý Đôn không chỉ là vẽ tranh, mà là hành trình sáng tạo đa dạng:</p>
<ul>
  <li>Vẽ tranh: màu sáp, màu nước, acrylic trên nhiều chất liệu.</li>
  <li>Thủ công sáng tạo: xé dán, gấp giấy origami, làm mô hình từ vật liệu tái chế.</li>
  <li>Gốm sứ: Nặn đất sét, trang trí gốm (phòng Gốm chuyên dụng).</li>
  <li>Nghệ thuật số: Vẽ trên máy tính bảng với ứng dụng chuyên dụng (lớp 4–5).</li>
</ul>

<h3>Múa và Nhảy hiện đại</h3>
<p>CLB Múa và Nhảy hiện đại "Doners Dance" hoạt động vào thứ 2, 4, 6 với hơn 50 thành viên. Các em được học múa dân gian Việt Nam, nhảy K-pop, nhảy jazz cơ bản và biên đạo theo nhóm. Đội múa của trường thường xuyên biểu diễn tại các sự kiện và đạt giải cao tại hội thi văn nghệ cấp quận.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // DICH VU HOC DUONG (School Services) — 1 page
  // ═══════════════════════════════════════════════════
  {
    title: 'Y tế học đường',
    slug: 'dich-vu-hoc-duong/y-te-hoc-duong',
    seo_title: 'Y tế học đường — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Dịch vụ y tế học đường tại trường Tiểu học Lê Quý Đôn — phòng y tế, vệ sinh, dinh dưỡng và chăm sóc sức khỏe học sinh.',
    content: `<section class="page-content">
<h2>Y tế học đường — Chăm sóc sức khỏe toàn diện</h2>
<p>Sức khỏe của học sinh là ưu tiên hàng đầu tại trường Tiểu học Lê Quý Đôn. Nhà trường vận hành <strong>hệ thống y tế học đường toàn diện</strong>, đảm bảo mỗi em được chăm sóc sức khỏe tốt nhất trong suốt thời gian ở trường.</p>
<img src="/uploads/placeholder-school.jpg" alt="Phòng y tế trường Tiểu học Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Phòng Y tế trường học</h3>
<p>Phòng Y tế của trường được trang bị đầy đủ theo chuẩn của Bộ Y tế:</p>
<ul>
  <li><strong>Nhân sự:</strong> 1 bác sĩ (chuyên khoa Nhi) và 1 y tá trường học trực thường xuyên từ 7h00 đến 17h00.</li>
  <li><strong>Trang thiết bị:</strong> 3 giường bệnh, tủ thuốc cấp cứu, máy đo huyết áp, nhiệt kế điện tử, bộ sơ cứu chuyên dụng, bình oxy cấp cứu.</li>
  <li><strong>Thuốc:</strong> Đầy đủ thuốc sơ cứu, hạ sốt, xử lý vết thương, thuốc dị ứng cơ bản. Tất cả thuốc đều được quản lý và kiểm kê hàng tháng.</li>
</ul>

<h3>Kiểm tra sức khỏe định kỳ</h3>
<p>Nhà trường phối hợp với Trung tâm Y tế Quận tổ chức kiểm tra sức khỏe định kỳ cho học sinh:</p>
<table>
  <thead>
    <tr>
      <th>Đợt kiểm tra</th>
      <th>Thời gian</th>
      <th>Nội dung</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Đầu năm học</td>
      <td>Tháng 9</td>
      <td>Đo chiều cao, cân nặng, thị lực, thính lực, răng miệng, khám tổng quát</td>
    </tr>
    <tr>
      <td>Giữa năm học</td>
      <td>Tháng 1</td>
      <td>Kiểm tra cận — viễn thị, đánh giá dinh dưỡng, sức khỏe răng miệng</td>
    </tr>
    <tr>
      <td>Cuối năm học</td>
      <td>Tháng 5</td>
      <td>Khám tổng quát, đánh giá phát triển thể chất, lập hồ sơ sức khỏe</td>
    </tr>
  </tbody>
</table>
<p>Kết quả kiểm tra được gửi đến phụ huynh qua ứng dụng quản lý của trường, kèm theo lời khuyên từ bác sĩ nếu phát hiện vấn đề cần lưu ý.</p>

<h3>Chương trình Dinh dưỡng học đường</h3>
<p>Bữa ăn bán trú tại trường được thiết kế bởi chuyên gia dinh dưỡng, đảm bảo cân đối và phù hợp với nhu cầu của trẻ tiểu học:</p>
<ul>
  <li><strong>Thực đơn:</strong> Thay đổi hàng ngày, gồm 1 bữa trưa chính + 1 bữa phụ (sữa/trái cây). Thực đơn tuần được gửi phụ huynh vào thứ 6.</li>
  <li><strong>Tiêu chuẩn:</strong> 600–800 kcal/bữa trưa, đầy đủ protein, vitamin, khoáng chất. Ưu tiên thực phẩm sạch, nguồn gốc rõ ràng.</li>
  <li><strong>Chế độ đặc biệt:</strong> Hỗ trợ chế độ ăn cho học sinh dị ứng thực phẩm, ăn chay hoặc có yêu cầu đặc biệt (phụ huynh đăng ký đầu năm).</li>
  <li><strong>Vệ sinh an toàn thực phẩm:</strong> Bếp ăn đạt chuẩn HACCP, nhân viên bếp có giấy chứng nhận vệ sinh ATTP. Mẫu thức ăn được lưu 24 giờ theo quy định.</li>
</ul>

<h3>Vệ sinh môi trường</h3>
<p>Nhà trường thực hiện nghiêm ngặt quy trình vệ sinh môi trường:</p>
<ul>
  <li>Vệ sinh phòng học, hành lang, nhà vệ sinh: 2 lần/ngày (trưa và chiều).</li>
  <li>Khử khuẩn bề mặt tiếp xúc (bàn, ghế, tay nắm cửa): hàng ngày.</li>
  <li>Phun khử trùng toàn trường: 1 lần/tuần bằng dung dịch an toàn cho trẻ.</li>
  <li>Trạm rửa tay với xà phòng bố trí tại mỗi tầng, trước nhà ăn và khu vệ sinh.</li>
  <li>Nước uống tinh khiết: hệ thống lọc nước RO tại mỗi tầng, kiểm tra chất lượng hàng tháng.</li>
</ul>

<h3>Phòng chống dịch bệnh</h3>
<p>Nhà trường có quy trình ứng phó dịch bệnh bài bản, rút kinh nghiệm từ giai đoạn COVID-19:</p>
<ul>
  <li>Theo dõi sức khỏe học sinh hàng ngày, phát hiện sớm các triệu chứng bất thường.</li>
  <li>Cách ly tạm thời tại phòng Y tế và thông báo phụ huynh ngay khi phát hiện học sinh có dấu hiệu bệnh truyền nhiễm.</li>
  <li>Phối hợp với Trung tâm Y tế Quận trong tiêm chủng mở rộng và phòng chống dịch.</li>
</ul>

<h3>Tư vấn tâm lý học đường</h3>
<p>Ngoài chăm sóc sức khỏe thể chất, nhà trường còn có chuyên viên tư vấn tâm lý (1 chuyên viên, trực 3 ngày/tuần) hỗ trợ các em trong vấn đề: lo lắng khi đến trường, khó khăn trong kết bạn, áp lực học tập, thay đổi hành vi và các vấn đề tâm lý khác. Phụ huynh có thể đặt lịch tư vấn riêng qua Văn phòng nhà trường.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // STANDALONE PAGES
  // ═══════════════════════════════════════════════════
  {
    title: 'Cơ sở vật chất',
    slug: 'co-so-vat-chat',
    seo_title: 'Cơ sở vật chất — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Cơ sở vật chất hiện đại tại trường Tiểu học Lê Quý Đôn — phòng học, phòng thí nghiệm, thư viện, nhà thể chất, bể bơi, nhà ăn.',
    content: `<section class="page-content">
<h2>Cơ sở vật chất hiện đại</h2>
<p>Trường Tiểu học Lê Quý Đôn được đầu tư xây dựng cơ sở vật chất <strong>đạt chuẩn quốc gia mức độ 2</strong>, đáp ứng mọi nhu cầu học tập, vui chơi và phát triển toàn diện của học sinh. Dưới đây là tổng quan về các khu vực và trang thiết bị chính.</p>
<img src="/uploads/placeholder-school.jpg" alt="Cơ sở vật chất trường Tiểu học Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Phòng học tiêu chuẩn</h3>
<p>Trường có <strong>30 phòng học</strong>, mỗi phòng diện tích 54 m², đáp ứng tiêu chuẩn quy định cho lớp học tối đa 35 học sinh:</p>
<ul>
  <li>Bảng tương tác thông minh ViewSonic 86 inch kết nối wifi.</li>
  <li>Máy tính giáo viên cài đặt phần mềm quản lý lớp học ClassDojo.</li>
  <li>Hệ thống điều hòa nhiệt độ 2 chiều, đèn LED chống cận thị.</li>
  <li>Bàn ghế gỗ tự nhiên thiết kế theo chiều cao chuẩn của từng khối lớp.</li>
  <li>Tủ sách góc lớp với ít nhất 50 đầu sách phù hợp lứa tuổi.</li>
</ul>

<h3>Phòng chức năng</h3>
<table>
  <thead>
    <tr>
      <th>Phòng</th>
      <th>Số lượng</th>
      <th>Trang thiết bị chính</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Phòng Tin học</td>
      <td>2</td>
      <td>40 máy tính/phòng, phần mềm lập trình Scratch, robot Lego Mindstorms</td>
    </tr>
    <tr>
      <td>Phòng STEM / Robotics</td>
      <td>1</td>
      <td>Bộ kit Robotics, máy in 3D mini, kính hiển vi điện tử, dụng cụ thí nghiệm</td>
    </tr>
    <tr>
      <td>Phòng Ngoại ngữ</td>
      <td>2</td>
      <td>Hệ thống âm thanh chuyên dụng, tai nghe cá nhân, bảng tương tác</td>
    </tr>
    <tr>
      <td>Phòng Âm nhạc</td>
      <td>1</td>
      <td>Piano điện, 30 đàn organ mini, bộ gõ Orff, hệ thống loa chuyên dụng</td>
    </tr>
    <tr>
      <td>Phòng Mỹ thuật</td>
      <td>1</td>
      <td>Giá vẽ, bồn rửa, khu trưng bày tác phẩm, máy tính bảng vẽ số</td>
    </tr>
    <tr>
      <td>Phòng Gốm</td>
      <td>1</td>
      <td>Lò nung gốm mini, bàn xoay, đất sét và dụng cụ tạo hình</td>
    </tr>
  </tbody>
</table>

<h3>Thư viện thông minh</h3>
<p>Thư viện trường là không gian yêu thích của nhiều học sinh, với:</p>
<ul>
  <li><strong>Diện tích:</strong> 200 m², chia thành 3 khu: Đọc sách yên tĩnh, Khu hoạt động nhóm, Khu đọc truyện tranh.</li>
  <li><strong>Số lượng sách:</strong> Hơn 15.000 đầu sách tiếng Việt và tiếng Anh, phân loại theo lứa tuổi và chủ đề.</li>
  <li><strong>Công nghệ:</strong> Hệ thống quản lý thư viện điện tử, quét mã QR mượn/trả sách, 10 máy tính tra cứu.</li>
  <li><strong>Hoạt động:</strong> Giờ đọc sách cố định (15 phút/ngày), cuộc thi đọc sách hàng tháng, gặp gỡ tác giả sách thiếu nhi.</li>
</ul>

<h3>Nhà thể chất đa năng</h3>
<p>Nhà thể chất đa năng rộng <strong>600 m²</strong>, được thiết kế đa chức năng:</p>
<ul>
  <li>Sân bóng rổ mini tiêu chuẩn, sân cầu lông, khu tập võ Taekwondo.</li>
  <li>Sân khấu di động phục vụ các sự kiện văn nghệ, hội thảo.</li>
  <li>Hệ thống âm thanh, ánh sáng chuyên nghiệp, điều hòa trung tâm.</li>
  <li>Phòng thay đồ, phòng tắm riêng cho nam và nữ.</li>
</ul>

<h3>Bể bơi bốn mùa</h3>
<p>Bể bơi trong nhà với hệ thống sưởi ấm, duy trì nhiệt độ nước 28–30°C quanh năm:</p>
<ul>
  <li><strong>Kích thước:</strong> 25m x 12m, độ sâu 0.8m–1.4m (phù hợp trẻ tiểu học).</li>
  <li><strong>Hệ thống lọc nước:</strong> Lọc tuần hoàn bằng clo + tia UV, kiểm tra chất lượng nước 2 lần/ngày.</li>
  <li><strong>An toàn:</strong> 2 nhân viên cứu hộ trực thường xuyên, phao cứu sinh và thiết bị an toàn đầy đủ.</li>
</ul>

<h3>Nhà ăn — Bếp ăn</h3>
<p>Nhà ăn rộng <strong>400 m²</strong>, phục vụ bữa trưa bán trú cho hơn 1.000 học sinh:</p>
<ul>
  <li>Bếp ăn đạt tiêu chuẩn HACCP, khu vực chế biến riêng biệt: sống — chín — chia suất.</li>
  <li>Khu ăn sạch sẽ, bàn ghế inox dễ vệ sinh, điều hòa mát mẻ.</li>
  <li>Trạm rửa tay sát khuẩn trước khi vào khu ăn.</li>
</ul>
<p>Toàn bộ cơ sở vật chất được bảo trì, nâng cấp hàng năm, đảm bảo luôn trong tình trạng tốt nhất phục vụ việc học tập và phát triển toàn diện của các em.</p>
</section>`,
  },
  {
    title: 'Đội ngũ giáo viên',
    slug: 'doi-ngu-giao-vien',
    seo_title: 'Đội ngũ giáo viên — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Đội ngũ giáo viên trường Tiểu học Lê Quý Đôn — trình độ chuyên môn, thành tích và phương pháp giảng dạy hiện đại.',
    content: `<section class="page-content">
<h2>Đội ngũ giáo viên — Tâm huyết và Chuyên nghiệp</h2>
<p>Đội ngũ giáo viên là <strong>tài sản quý giá nhất</strong> của trường Tiểu học Lê Quý Đôn. Với gần 70 giáo viên trực tiếp giảng dạy, nhà trường tự hào có đội ngũ vừa giỏi chuyên môn, vừa tận tâm với nghề, luôn đặt lợi ích của học sinh lên hàng đầu.</p>
<img src="/uploads/placeholder-school.jpg" alt="Đội ngũ giáo viên trường Tiểu học Lê Quý Đôn" class="rounded-xl shadow" />

<h3>Thống kê đội ngũ</h3>
<table>
  <thead>
    <tr>
      <th>Tiêu chí</th>
      <th>Số liệu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Tổng số giáo viên</td>
      <td>68 giáo viên</td>
    </tr>
    <tr>
      <td>Trình độ Thạc sĩ trở lên</td>
      <td>22 giáo viên (32%)</td>
    </tr>
    <tr>
      <td>Trình độ Đại học</td>
      <td>46 giáo viên (68%)</td>
    </tr>
    <tr>
      <td>Đạt chuẩn nghề nghiệp</td>
      <td>100%</td>
    </tr>
    <tr>
      <td>Trên chuẩn nghề nghiệp</td>
      <td>70%</td>
    </tr>
    <tr>
      <td>Giáo viên tiếng Anh bản ngữ</td>
      <td>3 giáo viên (Anh, Mỹ, Úc)</td>
    </tr>
    <tr>
      <td>Giáo viên tiếng Anh Việt Nam</td>
      <td>5 giáo viên (IELTS 7.0+)</td>
    </tr>
    <tr>
      <td>Tuổi trung bình</td>
      <td>35 tuổi</td>
    </tr>
    <tr>
      <td>Kinh nghiệm trung bình</td>
      <td>12 năm</td>
    </tr>
  </tbody>
</table>

<h3>Tiêu chuẩn tuyển dụng</h3>
<p>Để trở thành giáo viên tại Lê Quý Đôn, ứng viên phải đáp ứng các tiêu chuẩn nghiêm ngặt:</p>
<ol>
  <li><strong>Trình độ chuyên môn:</strong> Tốt nghiệp Đại học Sư phạm hoặc tương đương, ưu tiên Thạc sĩ. Giáo viên tiếng Anh yêu cầu IELTS 7.0 hoặc tương đương.</li>
  <li><strong>Kinh nghiệm:</strong> Tối thiểu 3 năm giảng dạy tại trường tiểu học, có hồ sơ thành tích rõ ràng.</li>
  <li><strong>Kỹ năng sư phạm:</strong> Qua vòng dạy thử 3 tiết do Ban Giám hiệu và Tổ chuyên môn đánh giá.</li>
  <li><strong>Phẩm chất đạo đức:</strong> Phỏng vấn chuyên sâu về triết lý giáo dục, tình yêu trẻ em và cam kết với nghề.</li>
  <li><strong>Kỹ năng công nghệ:</strong> Thành thạo sử dụng máy tính, bảng tương tác, phần mềm giáo dục.</li>
</ol>

<h3>Phát triển chuyên môn liên tục</h3>
<p>Nhà trường đầu tư mạnh mẽ vào việc bồi dưỡng và phát triển chuyên môn giáo viên:</p>
<ul>
  <li><strong>Sinh hoạt chuyên môn:</strong> 2 buổi/tháng — chia sẻ phương pháp giảng dạy, phân tích bài học (Lesson Study).</li>
  <li><strong>Tập huấn nội bộ:</strong> Mỗi tháng 1 buổi tập huấn về chủ đề: công nghệ giáo dục, tâm lý trẻ em, phương pháp đánh giá.</li>
  <li><strong>Đào tạo bên ngoài:</strong> Hỗ trợ kinh phí để giáo viên tham gia hội thảo, khóa học ngắn hạn tại các trường đại học và tổ chức giáo dục uy tín.</li>
  <li><strong>Trao đổi kinh nghiệm:</strong> Tổ chức tham quan, học tập tại các trường tiểu học tiên tiến trong và ngoài nước mỗi năm.</li>
  <li><strong>Nghiên cứu khoa học sư phạm:</strong> Khuyến khích giáo viên viết sáng kiến kinh nghiệm, đề tài nghiên cứu — hỗ trợ kinh phí và thời gian.</li>
</ul>

<h3>Thành tích nổi bật</h3>
<ul>
  <li><strong>Giáo viên dạy giỏi cấp thành phố:</strong> 15 giáo viên (năm học 2023–2025)</li>
  <li><strong>Giáo viên dạy giỏi cấp quận:</strong> 45 giáo viên</li>
  <li><strong>Sáng kiến kinh nghiệm cấp thành phố:</strong> 8 đề tài được công nhận</li>
  <li><strong>Danh hiệu Nhà giáo ưu tú:</strong> 2 thầy cô</li>
  <li><strong>Bằng khen Bộ GD&amp;ĐT:</strong> 5 thầy cô</li>
</ul>

<h3>Giáo viên bản ngữ</h3>
<p>Ba giáo viên bản ngữ tại trường đều có chứng chỉ TESOL/CELTA và ít nhất 3 năm kinh nghiệm dạy trẻ em:</p>
<ul>
  <li><strong>Mr. James Wilson</strong> (Anh) — 7 năm kinh nghiệm, chuyên phụ trách lớp 4–5, chương trình Cambridge.</li>
  <li><strong>Ms. Sarah Johnson</strong> (Mỹ) — 5 năm kinh nghiệm, phụ trách lớp 1–2, phương pháp Phonics.</li>
  <li><strong>Mr. Daniel Smith</strong> (Úc) — 4 năm kinh nghiệm, phụ trách lớp 3 và CLB English Club.</li>
</ul>

<h3>Văn hóa giáo viên</h3>
<p>Tại Lê Quý Đôn, giáo viên không chỉ là người truyền đạt kiến thức mà còn là <em>người bạn đồng hành</em> với mỗi học sinh. Các thầy cô luôn lắng nghe, thấu hiểu và tôn trọng sự khác biệt của từng em. Phương châm của đội ngũ giáo viên: <strong>"Mỗi ngày đến trường là một ngày vui — cho cả thầy và trò"</strong>.</p>
</section>`,
  },
];

export async function seedPages() {
  await AppDataSource.initialize();
  console.log('[SEED] Bat dau seed pages...');

  // Tim admin user lam created_by
  const userRepo = AppDataSource.getRepository(User);
  const admin = await userRepo.findOne({
    where: { role: UserRole.SUPER_ADMIN },
  });
  if (!admin) {
    console.error('[SEED] Khong tim thay Super Admin. Chay "npm run seed:admin" truoc.');
    await AppDataSource.destroy();
    process.exit(1);
  }
  const adminId = admin.id;

  const repo = AppDataSource.getRepository(Page);
  let created = 0;

  for (const p of pagesData) {
    const existing = await repo.findOne({ where: { slug: p.slug } });
    if (existing) continue;

    await repo.save(
      repo.create({
        id: generateUlid(),
        title: p.title,
        slug: p.slug,
        content: p.content,
        status: PageStatus.PUBLISHED,
        seo_title: p.seo_title,
        seo_description: p.seo_description,
        created_by: adminId,
        updated_by: null,
      }),
    );
    created++;
  }

  console.log(`[SEED] Pages: ${created} moi tao, ${pagesData.length - created} da ton tai.`);
  console.log('[SEED] Hoan tat seed pages!');
  await AppDataSource.destroy();
}

seedPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
