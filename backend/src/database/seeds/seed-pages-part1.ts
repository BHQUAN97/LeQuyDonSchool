// Chay: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-pages-part1.ts
// Hoac them vao package.json scripts: "seed:pages1": "ts-node -r tsconfig-paths/register src/database/seeds/seed-pages-part1.ts"

import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Page, PageStatus } from '../../modules/pages/entities/page.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed 9 trang noi dung chinh (Pages Part 1) cho website truong tieu hoc Le Quy Don.
 * Idempotent — kiem tra slug truoc khi insert.
 * Yeu cau: chay seed:admin truoc de co tai khoan super_admin.
 */

const pagesData: Array<{
  title: string;
  slug: string;
  content: string;
  status: PageStatus;
  seo_title: string;
  seo_description: string;
}> = [
  // ═══════════════════════════════════════════════════
  // PAGE 1: tong-quan (Tong quan ve truong)
  // ═══════════════════════════════════════════════════
  {
    title: 'Tổng quan về trường Tiểu học Lê Quý Đôn',
    slug: 'tong-quan',
    status: PageStatus.PUBLISHED,
    seo_title: 'Tổng quan — Trường Tiểu học Lê Quý Đôn Hà Nội',
    seo_description:
      'Giới thiệu tổng quan về trường Tiểu học Lê Quý Đôn Hà Nội — lịch sử thành lập, vị trí, quy mô và triết lý giáo dục toàn diện.',
    content: `<section class="page-content">
<h2>Trường Tiểu học Lê Quý Đôn — Nơi ươm mầm tương lai</h2>
<p>Trường Tiểu học Lê Quý Đôn tọa lạc tại quận Đống Đa, thành phố Hà Nội — trung tâm văn hóa và giáo dục của cả nước. Được thành lập vào năm <strong>1995</strong>, nhà trường mang tên vị danh nhân, nhà bác học lỗi lạc <em>Lê Quý Đôn</em> (1726–1784) như một lời cam kết gìn giữ và phát huy truyền thống hiếu học của dân tộc Việt Nam. Trải qua gần 30 năm hình thành và phát triển, nhà trường đã trở thành một trong những địa chỉ giáo dục tiểu học uy tín và được tin tưởng hàng đầu tại Hà Nội.</p>

<h2>Vị trí và cơ sở vật chất</h2>
<p>Trường tọa lạc tại một vị trí thuận lợi trong lòng quận Đống Đa, dễ dàng tiếp cận từ nhiều tuyến phố và phương tiện công cộng. Khuôn viên trường rộng hơn <strong>8.000 m²</strong> với kiến trúc 4 tầng khang trang, hiện đại được bao phủ bởi cây xanh và không gian thoáng đãng. Toàn bộ hệ thống phòng học được trang bị máy chiếu, bảng tương tác và điều hòa nhiệt độ, tạo điều kiện học tập tốt nhất cho học sinh trong mọi thời tiết.</p>

<h2>Quy mô và đội ngũ</h2>
<p>Hiện nay, nhà trường đang đón nhận hơn <strong>1.200 học sinh</strong> từ lớp 1 đến lớp 5, được phân chia vào các lớp học với sĩ số hợp lý để đảm bảo mỗi học sinh đều nhận được sự quan tâm sát sao của giáo viên. Đội ngũ nhà trường bao gồm <strong>65 giáo viên</strong> — trong đó hơn 90% có trình độ đại học trở lên, nhiều giáo viên sở hữu bằng thạc sĩ chuyên ngành giáo dục — cùng đội ngũ nhân viên hành chính, y tế và bảo vệ chuyên nghiệp, tận tâm. Mỗi giáo viên đều được thường xuyên cập nhật phương pháp sư phạm và tham gia các chương trình bồi dưỡng chuyên môn trong nước và quốc tế.</p>

<h2>Triết lý giáo dục toàn diện</h2>
<p>Trường Tiểu học Lê Quý Đôn theo đuổi triết lý giáo dục <em>"Phát triển toàn diện Trí — Đức — Thể — Mỹ"</em>. Nhà trường không chỉ chú trọng đến thành tích học thuật mà còn đặc biệt quan tâm đến sự phát triển đạo đức, thể chất và cảm thụ nghệ thuật của mỗi học sinh. Chương trình học phong phú, kết hợp kiến thức phổ thông với các hoạt động trải nghiệm, ngoại khóa và giáo dục kỹ năng sống, giúp học sinh phát triển hài hòa và toàn diện ngay từ những năm đầu đời.</p>

<h2>Thành tích và công nhận</h2>
<p>Sau gần 30 năm hoạt động, nhà trường đã đạt được nhiều danh hiệu và giải thưởng danh giá: <strong>Trường Tiên tiến Xuất sắc</strong> nhiều năm liên tiếp do Sở GD&ĐT Hà Nội trao tặng, <strong>Kiểm định chất lượng giáo dục mức độ 3</strong> (cấp độ cao nhất) năm 2023, cùng hàng trăm giải thưởng cấp quận, cấp thành phố và cấp quốc gia từ học sinh trong các kỳ thi học sinh giỏi, hội thi thể thao và văn nghệ. Những thành tích này là minh chứng rõ ràng cho chất lượng giảng dạy và sự nỗ lực không ngừng của tập thể thầy cô, phụ huynh và học sinh nhà trường.</p>

<h2>Cộng đồng và kết nối</h2>
<p>Trường Tiểu học Lê Quý Đôn tự hào xây dựng được một cộng đồng gắn kết bền vững giữa nhà trường, gia đình và xã hội. Ban đại diện cha mẹ học sinh hoạt động tích cực, đồng hành cùng nhà trường trong nhiều chương trình giáo dục và hoạt động ngoại khóa. Mạng lưới cựu học sinh ngày càng mở rộng với hơn 5.000 thành viên, nhiều người đã và đang đóng góp tích cực cho sự phát triển của trường — từ hỗ trợ học bổng, chia sẻ kinh nghiệm đến đồng tổ chức các sự kiện cộng đồng. Đây chính là nền tảng vững chắc giúp nhà trường không ngừng phát triển và vươn lên trong thời đại mới.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // PAGE 2: tong-quan/tam-nhin-su-menh
  // ═══════════════════════════════════════════════════
  {
    title: 'Tầm nhìn & Sứ mệnh',
    slug: 'tong-quan/tam-nhin-su-menh',
    status: PageStatus.PUBLISHED,
    seo_title: 'Tầm nhìn & Sứ mệnh — Trường Tiểu học Lê Quý Đôn',
    seo_description:
      'Tầm nhìn, sứ mệnh và bốn giá trị cốt lõi của trường Tiểu học Lê Quý Đôn — nơi giáo dục toàn diện Trí, Đức, Thể, Mỹ.',
    content: `<section class="page-content">
<h2>Tầm nhìn — Hướng đến ngôi trường hàng đầu Hà Nội</h2>
<p>Trường Tiểu học Lê Quý Đôn đặt mục tiêu trở thành <strong>ngôi trường tiểu học hàng đầu tại Hà Nội</strong> — một môi trường giáo dục tiên tiến, nhân văn và sáng tạo, nơi mỗi học sinh được phát hiện, nuôi dưỡng và phát huy tối đa tiềm năng của mình. Đến năm 2030, nhà trường phấn đấu đạt chuẩn quốc gia mức độ 2, trở thành địa chỉ giáo dục được gia đình Hà Nội và khu vực tin tưởng lựa chọn, đồng thời là mô hình tham chiếu cho các trường tiểu học trong cả nước.</p>

<h2>Sứ mệnh — Đồng hành cùng gia đình, kiến tạo tương lai</h2>
<p>Sứ mệnh của trường Tiểu học Lê Quý Đôn là <strong>xây dựng môi trường giáo dục an toàn, thân thiện và truyền cảm hứng</strong>, nơi mỗi học sinh được giáo dục toàn diện về <em>Trí — Đức — Thể — Mỹ</em>. Nhà trường cam kết đồng hành cùng mỗi gia đình trong hành trình nuôi dưỡng con trẻ: trang bị kiến thức nền tảng, rèn luyện phẩm chất đạo đức, phát triển thể lực và khơi dậy tâm hồn yêu cái đẹp — để mỗi học sinh ra trường là một công dân trẻ tự tin, nhân ái và sáng tạo.</p>

<h2>Bốn giá trị cốt lõi</h2>
<p>Bốn giá trị cốt lõi tạo nên bản sắc và kim chỉ nam của mọi hoạt động giáo dục tại Lê Quý Đôn:</p>
<ul>
  <li><strong>Yêu thương (Love):</strong> Nhà trường xây dựng mối quan hệ thầy — trò, bạn bè trên nền tảng yêu thương, tôn trọng và thấu hiểu. Mỗi học sinh đều cảm thấy được chào đón, được lắng nghe và được quan tâm chân thành.</li>
  <li><strong>Sáng tạo (Creativity):</strong> Khuyến khích học sinh tự do tư duy, khám phá và thử nghiệm. Phương pháp dạy học tích cực, dự án và trải nghiệm thực tế là môi trường màu mỡ để tư duy sáng tạo nảy nở và phát triển.</li>
  <li><strong>Trách nhiệm (Responsibility):</strong> Từ những điều nhỏ nhất trong cuộc sống học đường — giữ gìn lớp học, hoàn thành bài tập, hỗ trợ bạn bè — học sinh được rèn luyện ý thức trách nhiệm với bản thân, với tập thể và với cộng đồng.</li>
  <li><strong>Hội nhập (Integration):</strong> Trang bị cho học sinh năng lực ngôn ngữ, tư duy cởi mở và kỹ năng thích ứng để tự tin hội nhập trong thế giới đa văn hóa ngày càng kết nối chặt chẽ.</li>
</ul>

<h2>Cam kết chất lượng giáo dục</h2>
<p>Thực hiện tầm nhìn và sứ mệnh, nhà trường cam kết duy trì chất lượng dạy và học ở mức cao nhất: 100% giáo viên đạt chuẩn nghề nghiệp, thường xuyên cập nhật phương pháp sư phạm tiên tiến; chương trình học bám sát Chương trình Giáo dục phổ thông 2018 của Bộ GD&ĐT, đồng thời bổ sung các nội dung nâng cao, chuyên biệt phù hợp với định hướng phát triển của nhà trường. Kết quả học tập và sự tiến bộ của từng học sinh được theo dõi, đánh giá thường xuyên và phản hồi kịp thời đến gia đình.</p>

<h2>Triết lý — Mỗi em học sinh là một ngôi sao sáng</h2>
<p>Triết lý giáo dục của Lê Quý Đôn được đúc kết trong câu nói <em>"Mỗi em học sinh là một ngôi sao sáng"</em>. Mỗi trẻ em đều được sinh ra với những tài năng, cá tính và tiềm năng riêng biệt. Vai trò của nhà trường không phải là tạo ra những học sinh giống nhau, mà là tạo điều kiện để mỗi em được tỏa sáng theo cách riêng của mình — dù là qua toán học, tiếng Anh, hội họa, âm nhạc hay thể thao. Đây là lý do nhà trường đặc biệt chú trọng các hoạt động phong trào, câu lạc bộ và chương trình năng khiếu song song với học tập chính khóa.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // PAGE 3: tong-quan/cot-moc-phat-trien
  // ═══════════════════════════════════════════════════
  {
    title: 'Cột mốc phát triển',
    slug: 'tong-quan/cot-moc-phat-trien',
    status: PageStatus.PUBLISHED,
    seo_title: 'Cột mốc phát triển — Trường Tiểu học Lê Quý Đôn',
    seo_description:
      'Hành trình 30 năm phát triển của trường Tiểu học Lê Quý Đôn từ 1995 đến 2025 — những dấu mốc quan trọng định hình ngôi trường hôm nay.',
    content: `<section class="page-content">
<h2>Hành trình 30 năm xây dựng và phát triển</h2>
<p>Nhìn lại hành trình gần 30 năm, trường Tiểu học Lê Quý Đôn đã trải qua nhiều giai đoạn phát triển đáng tự hào. Từ một ngôi trường nhỏ với cơ sở vật chất còn khiêm tốn, nhà trường đã không ngừng đổi mới, mở rộng và nâng cấp để trở thành một trong những trường tiểu học được đánh giá cao nhất tại quận Đống Đa và thành phố Hà Nội. Dưới đây là những cột mốc quan trọng đánh dấu từng bước trưởng thành của ngôi trường.</p>

<h3>1995 — Thành lập trường</h3>
<p>Trường Tiểu học Lê Quý Đôn chính thức được thành lập theo Quyết định của UBND quận Đống Đa, thành phố Hà Nội. Khóa học sinh đầu tiên gồm 6 lớp với gần 200 em được đón nhận vào mái trường mang tên vị danh nhân lỗi lạc của dân tộc. Đội ngũ sáng lập bao gồm 15 giáo viên tâm huyết và Ban giám hiệu đầu tiên với quyết tâm xây dựng một mô hình giáo dục tiểu học chất lượng cao cho con em nhân dân quận Đống Đa.</p>

<h3>2000 — Đạt chuẩn quốc gia lần đầu tiên</h3>
<p>Sau 5 năm nỗ lực, trường Tiểu học Lê Quý Đôn vinh dự được Bộ GD&ĐT công nhận đạt <strong>chuẩn quốc gia mức độ 1</strong> — một cột mốc quan trọng khẳng định chất lượng giáo dục và cơ sở vật chất của nhà trường. Đây là nguồn động lực to lớn cho toàn thể thầy cô, học sinh và phụ huynh, mở ra giai đoạn phát triển mới với nhiều chương trình đầu tư và nâng cấp toàn diện.</p>

<h3>2005 — Mở rộng cơ sở và tăng quy mô</h3>
<p>Đáp ứng nhu cầu ngày càng tăng của phụ huynh và học sinh trong khu vực, nhà trường tiến hành mở rộng khuôn viên và xây thêm dãy nhà mới với đầy đủ phòng chức năng: phòng máy tính, phòng thư viện, phòng nhạc và phòng mỹ thuật. Quy mô trường tăng lên 20 lớp học với gần 700 học sinh, đội ngũ giáo viên phát triển lên 35 người. Đây cũng là năm nhà trường chính thức triển khai chương trình học 2 buổi/ngày toàn trường.</p>

<h3>2010 — Triển khai chương trình Tiếng Anh bản ngữ</h3>
<p>Năm 2010 đánh dấu bước đột phá trong chiến lược giáo dục của nhà trường khi ký kết hợp tác với tổ chức giáo dục quốc tế để triển khai <strong>chương trình Tiếng Anh có giáo viên bản ngữ</strong> từ lớp 1. Đây là một trong những trường tiểu học công lập đầu tiên tại Hà Nội áp dụng mô hình này. Bốn giáo viên người Anh và Úc gia nhập đội ngũ, mang đến môi trường ngôn ngữ đích thực và hấp dẫn cho học sinh.</p>

<h3>2015 — Xây dựng bể bơi và sân vận động</h3>
<p>Với quan điểm giáo dục thể chất là nền tảng không thể thiếu trong phát triển toàn diện, nhà trường đầu tư xây dựng <strong>bể bơi 4 làn tiêu chuẩn</strong> và <strong>sân bóng đá mini trải cỏ nhân tạo</strong> trong khuôn viên trường. Từ đây, 100% học sinh được học bơi bắt buộc từ lớp 2, tham gia các hoạt động thể thao đa dạng và thường xuyên. Nhà trường cũng bổ sung giáo viên thể dục chuyên biệt và huấn luyện viên bơi lội được đào tạo chuyên nghiệp.</p>

<h3>2018 — Triển khai chương trình STEM</h3>
<p>Bắt kịp xu hướng giáo dục toàn cầu, năm 2018 nhà trường chính thức đưa <strong>chương trình STEM (Khoa học — Công nghệ — Kỹ thuật — Toán học)</strong> vào giảng dạy từ lớp 3 đến lớp 5. Phòng STEM hiện đại được trang bị robot lập trình, thiết bị thí nghiệm và vật liệu sáng tạo. Học sinh được tham gia các dự án STEM theo nhóm, học cách giải quyết vấn đề thực tế thông qua tư duy khoa học và kỹ thuật.</p>

<h3>2020 — Số hóa giáo dục — Bước ngoặt kỷ nguyên mới</h3>
<p>Đại dịch COVID-19 trở thành chất xúc tác đẩy nhanh quá trình chuyển đổi số của nhà trường. Trong vòng 2 tuần, toàn bộ 1.200 học sinh chuyển sang học trực tuyến một cách mượt mà nhờ hạ tầng công nghệ được chuẩn bị kỹ lưỡng. Hệ thống quản lý học tập (LMS) được triển khai, kết nối giáo viên — học sinh — phụ huynh trong một nền tảng thống nhất. Sau đại dịch, các công cụ số tiếp tục được duy trì và phát triển như một phần không thể thiếu của môi trường học tập hiện đại.</p>

<h3>2023 — Đạt kiểm định chất lượng mức độ 3</h3>
<p>Sau quá trình tự đánh giá nghiêm túc và được Sở GD&ĐT Hà Nội thẩm định, trường Tiểu học Lê Quý Đôn chính thức được công nhận đạt <strong>kiểm định chất lượng giáo dục mức độ 3</strong> — mức cao nhất trong hệ thống kiểm định của Việt Nam. Kết quả này phản ánh sự xuất sắc toàn diện trong 5 tiêu chuẩn: tổ chức và quản lý, cán bộ giáo viên, cơ sở vật chất, hoạt động giáo dục và kết quả giáo dục.</p>

<h3>2025 — Kỷ niệm 30 năm thành lập</h3>
<p>Năm 2025, trường Tiểu học Lê Quý Đôn tổ chức trọng thể <strong>Lễ kỷ niệm 30 năm thành lập</strong> với sự tham gia của hàng nghìn cựu học sinh, phụ huynh và thầy cô từ nhiều thế hệ. Ba mươi năm — một hành trình đáng tự hào với hơn 15.000 học sinh đã trưởng thành từ mái trường này, tỏa đi khắp mọi miền đất nước và thế giới, mang theo ký ức đẹp và giá trị tốt đẹp được vun đắp từ những năm tiểu học tại Lê Quý Đôn.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // PAGE 4: tong-quan/ngoi-nha-le-quy-don
  // ═══════════════════════════════════════════════════
  {
    title: 'Ngôi nhà Lê Quý Đôn',
    slug: 'tong-quan/ngoi-nha-le-quy-don',
    status: PageStatus.PUBLISHED,
    seo_title: 'Ngôi nhà Lê Quý Đôn — Khuôn viên và cơ sở vật chất',
    seo_description:
      'Khám phá khuôn viên xanh mát, kiến trúc hiện đại và các tiện ích đa dạng của trường Tiểu học Lê Quý Đôn — ngôi nhà thứ hai của hơn 1.200 học sinh.',
    content: `<section class="page-content">
<h2>Khuôn viên — Không gian sống và học tập lý tưởng</h2>
<p>Khuôn viên trường Tiểu học Lê Quý Đôn rộng hơn <strong>8.000 m²</strong>, được quy hoạch khoa học với sự cân bằng hài hòa giữa không gian học tập, khu vực vui chơi thể thao và mảng xanh cây cối. Ngay từ cổng trường, học sinh và phụ huynh được chào đón bởi hàng cây xanh mát, những chậu hoa rực rỡ và bảng hiệu trường được thiết kế ấm áp. Không gian này mang lại cảm giác an toàn, gần gũi và truyền cảm hứng cho việc học tập ngay từ buổi sáng đầu ngày.</p>

<h2>Kiến trúc 4 tầng — Thiết kế vì học sinh</h2>
<p>Toà nhà chính của trường được xây dựng theo kiến trúc <strong>4 tầng hiện đại</strong>, với tổng cộng 30 phòng học chính và hơn 15 phòng chức năng chuyên biệt. Mỗi tầng được thiết kế cho một khối lớp riêng biệt, giúp học sinh nhỏ (lớp 1–2) có khu vực học tập riêng ở tầng thấp để thuận tiện và an toàn. Hệ thống cầu thang rộng rãi, có tay vịn chắc chắn; hành lang thoáng đãng với nhiều góc học tập nhỏ xinh — tất cả đều được thiết kế dành riêng cho lứa tuổi tiểu học.</p>

<h2>Sân trường và vườn sinh thái</h2>
<p>Sân trong của trường là nơi các học sinh vui chơi, nghỉ ngơi và tham gia các hoạt động tập thể trong giờ ra chơi. Sân được lát gạch chống trơn, có nhiều cụm ghế ngồi dưới bóng cây và các khu vực trò chơi phù hợp với từng độ tuổi. Đặc biệt, trường tự hào có <strong>vườn sinh thái</strong> — một khoảng xanh với nhiều loại cây, rau và hoa do chính học sinh chăm sóc, trở thành phòng học thực tế sinh động cho các bài học khoa học và giáo dục môi trường.</p>

<h2>Phòng học và phòng chức năng hiện đại</h2>
<p>Toàn bộ 30 phòng học được trang bị <strong>máy chiếu thông minh, bảng tương tác điện tử và hệ thống điều hòa nhiệt độ</strong>, đảm bảo môi trường học tập tốt nhất trong mọi thời tiết. Bên cạnh phòng học chính khóa, nhà trường có đầy đủ hệ thống phòng chức năng: phòng máy tính với 40 máy tính kết nối internet tốc độ cao, phòng STEM trang bị robot và dụng cụ thí nghiệm, phòng âm nhạc với đàn piano và nhạc cụ đa dạng, phòng mỹ thuật rộng rãi và phòng thư viện với hơn 10.000 đầu sách.</p>

<h2>Khu vực thể thao — Sức khỏe là nền tảng</h2>
<p>Nhà trường đặc biệt đầu tư vào cơ sở vật chất thể thao, thể hiện cam kết với việc phát triển thể chất toàn diện cho học sinh. Khu thể thao bao gồm: <strong>bể bơi 4 làn tiêu chuẩn</strong> được vận hành quanh năm với hệ thống lọc nước hiện đại, <strong>sân bóng đá mini trải cỏ nhân tạo</strong> đủ điều kiện tổ chức thi đấu, sân bóng rổ và cầu lông. Tất cả các hoạt động thể thao đều được hướng dẫn bởi giáo viên và huấn luyện viên chuyên nghiệp, đảm bảo an toàn tuyệt đối cho học sinh.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // PAGE 5: tong-quan/sac-mau-le-quy-don
  // ═══════════════════════════════════════════════════
  {
    title: 'Sắc màu Lê Quý Đôn',
    slug: 'tong-quan/sac-mau-le-quy-don',
    status: PageStatus.PUBLISHED,
    seo_title: 'Sắc màu Lê Quý Đôn — Văn hóa và bản sắc trường',
    seo_description:
      'Khám phá văn hóa trường Tiểu học Lê Quý Đôn — đồng phục xanh navy, logo ngôi sao, slogan và những truyền thống đặc sắc tạo nên bản sắc riêng của Đôners.',
    content: `<section class="page-content">
<h2>Bản sắc văn hóa — Điều làm nên một Đôners</h2>
<p>Mỗi trường học đều có văn hóa riêng — những giá trị, biểu tượng và truyền thống tạo nên sợi dây gắn kết giữa các thế hệ học sinh, giáo viên và phụ huynh. Tại Lê Quý Đôn, văn hóa trường được gọi là <em>"Sắc màu Đôners"</em> — một tập hợp những biểu tượng, nghi lễ và truyền thống tươi vui, ý nghĩa, tạo nên bản sắc riêng biệt không thể nhầm lẫn của ngôi trường thân yêu này. Là một Đôners không chỉ là mặc đồng phục đến trường — đó là thuộc về một cộng đồng với những giá trị và ký ức chung.</p>

<h2>Đồng phục — Xanh navy và trắng tinh khôi</h2>
<p>Đồng phục trường Tiểu học Lê Quý Đôn mang tông màu chủ đạo <strong>xanh navy và trắng</strong> — sự kết hợp toát lên vẻ nghiêm túc, thanh lịch và trẻ trung. Áo sơ mi trắng với viền xanh navy và logo trường thêu tinh tế trên ngực trái; quần/váy xanh navy với đường may gọn gàng. Chiếc cà vạt xanh nhỏ cho học sinh nam và nơ xanh cho học sinh nữ là điểm nhấn đáng yêu tạo nên hình ảnh học sinh Lê Quý Đôn chỉn chu, lễ phép. Mỗi buổi sáng, hàng trăm bộ đồng phục xanh trắng tụ hội trước cổng trường là hình ảnh đẹp đã trở thành thương hiệu của Lê Quý Đôn.</p>

<h2>Logo và slogan — Biểu tượng của tri thức và khát vọng</h2>
<p>Logo trường Tiểu học Lê Quý Đôn là hình ảnh <strong>ngọn bút lông và ngôi sao năm cánh</strong> — biểu tượng kết hợp giữa tri thức truyền thống (ngọn bút, gợi nhớ nhà bác học Lê Quý Đôn và truyền thống hiếu học) và khát vọng tương lai (ngôi sao sáng trên bầu trời). Màu xanh navy và vàng gold của logo tạo nên sự trang trọng và ấm áp. Slogan chính thức của trường là <em>"Học để sáng tạo"</em> — nhắn nhủ học sinh không chỉ tiếp thu kiến thức mà còn biết ứng dụng, sáng tạo và tạo ra giá trị từ những gì đã học.</p>

<h2>Lễ chào cờ — Nghi lễ gắn kết cộng đồng</h2>
<p>Mỗi thứ Hai đầu tuần, toàn thể học sinh và giáo viên trường Tiểu học Lê Quý Đôn tập trung tại sân trường trong <strong>Lễ chào cờ trang trọng</strong>. Đây không chỉ là nghi lễ chính trị mà còn là dịp để cả trường kết nối, nhìn lại tuần qua và đặt ra mục tiêu cho tuần mới. Học sinh xuất sắc được vinh danh, các câu lạc bộ công bố hoạt động mới, thông báo các sự kiện sắp tới. Đội Nghi lễ của trường — gồm học sinh lớp 4 và 5 được tuyển chọn và tập luyện nghiêm túc — thực hiện lễ chào cờ với tác phong chuyên nghiệp và đáng tự hào.</p>

<h2>Sinh nhật tập thể và Ngày hội sắc màu</h2>
<p>Hai sự kiện văn hóa nổi bật nhất của Lê Quý Đôn là <strong>Sinh nhật tập thể</strong> và <strong>Ngày hội sắc màu</strong>. Sinh nhật tập thể được tổ chức mỗi tháng một lần, tôn vinh tất cả học sinh có ngày sinh trong tháng đó — tạo cho mỗi em cảm giác đặc biệt và được cộng đồng trường quan tâm. Ngày hội sắc màu Lê Quý Đôn (tổ chức vào tháng 4 hằng năm) là ngày hội lớn nhất của trường, nơi học sinh mặc trang phục màu sắc rực rỡ đại diện cho lớp mình, tham gia hàng chục hoạt động nghệ thuật, thể thao và trò chơi dân gian trong không khí vui tươi, đoàn kết và đầy ắp tiếng cười.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // PAGE 6: tong-quan/gia-dinh-doners
  // ═══════════════════════════════════════════════════
  {
    title: 'Gia đình Đôners',
    slug: 'tong-quan/gia-dinh-doners',
    status: PageStatus.PUBLISHED,
    seo_title: 'Gia đình Đôners — Cộng đồng trường Tiểu học Lê Quý Đôn',
    seo_description:
      'Cộng đồng Đôners — học sinh, cựu học sinh, phụ huynh và giáo viên gắn kết trong tinh thần yêu thương, chia sẻ và cùng nhau phát triển.',
    content: `<section class="page-content">
<h2>Đôners — Hơn cả một trường học, là một gia đình</h2>
<p>Tại Lê Quý Đôn, chúng tôi không gọi nhau là "thành viên" hay "học sinh" — chúng tôi gọi nhau là <strong>Đôners</strong>. Đôners là những ai đã từng bước qua cổng trường Lê Quý Đôn — dù là học sinh hiện tại đang ngồi trên ghế lớp 1, những cựu học sinh đã tốt nghiệp nhiều năm trước, hay những bậc phụ huynh âm thầm đồng hành, hay những thầy cô suốt đời tận tụy vì nghề. Đôners là một cộng đồng được gắn kết bằng tình yêu thương, sự sẻ chia và niềm tự hào chung về mái trường thân yêu.</p>

<h2>Học sinh hiện tại — Những ngôi sao đang tỏa sáng</h2>
<p>Hơn <strong>1.200 học sinh</strong> đang theo học tại Lê Quý Đôn là trung tâm, là lý do tồn tại của toàn bộ cộng đồng Đôners. Mỗi em mang trong mình một câu chuyện, một tài năng và một ước mơ riêng. Nhà trường nỗ lực tạo ra môi trường mà ở đó, mỗi học sinh — dù học giỏi hay còn cần cố gắng thêm, dù hoạt bát hay trầm lặng, dù có năng khiếu nghệ thuật hay thể thao hay khoa học — đều có cơ hội được nhìn nhận, được phát triển và được tự hào về bản thân mình.</p>

<h2>Ban đại diện cha mẹ học sinh — Cánh tay đồng hành đắc lực</h2>
<p>Ban đại diện cha mẹ học sinh trường Tiểu học Lê Quý Đôn hoạt động <strong>tích cực và chuyên nghiệp</strong>, là cầu nối quan trọng giữa gia đình và nhà trường. Không chỉ tham gia các cuộc họp phụ huynh định kỳ, Ban đại diện trực tiếp tham gia lên kế hoạch và tổ chức nhiều hoạt động ngoại khóa, dã ngoại, gây quỹ học bổng và các chương trình hỗ trợ học sinh có hoàn cảnh khó khăn. Mỗi lớp học đều có một đại diện phụ huynh năng động, thường xuyên kết nối với giáo viên chủ nhiệm và nhà trường để phối hợp giáo dục học sinh một cách hiệu quả nhất.</p>

<h2>Mạng lưới cựu học sinh — 5.000+ Đôners trưởng thành</h2>
<p>Sau gần 30 năm, mạng lưới cựu học sinh Lê Quý Đôn đã phát triển lên hơn <strong>5.000 thành viên</strong>, trải dài từ các bạn học sinh tốt nghiệp vài năm trước đến những cựu học sinh đã trưởng thành, thành đạt trong nhiều lĩnh vực khác nhau của xã hội. Hội Cựu học sinh hoạt động tích cực với ban lãnh đạo được bầu chọn minh bạch, tổ chức gặp gỡ thường niên, giao lưu thế hệ và các chương trình ý nghĩa như trao học bổng "Ngôi sao Đôners" cho học sinh xuất sắc có hoàn cảnh khó khăn, chia sẻ kinh nghiệm hướng nghiệp và đồng hành cùng sự phát triển của trường.</p>

<h2>Tinh thần Đôners — Gắn kết, hỗ trợ, cùng lớn lên</h2>
<p>Điều làm nên sức mạnh của cộng đồng Đôners không phải là số lượng thành viên, mà là <strong>tinh thần gắn kết và hỗ trợ lẫn nhau</strong> thấm sâu vào từng cá nhân. Một Đôners khi gặp khó khăn luôn có thể tìm đến cộng đồng — dù đó là tìm lời khuyên nghề nghiệp, hỗ trợ học bổng, hay đơn giản chỉ là cần một người lắng nghe và chia sẻ. Tinh thần "Đôners yêu Đôners" này không được giảng dạy trong lớp học, mà được trao truyền tự nhiên qua văn hóa trường, qua những kỷ niệm đẹp được tạo ra trong suốt 5 năm tiểu học — những năm tháng quan trọng nhất trong hành trình trưởng thành của mỗi con người.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // PAGE 7: chuong-trinh/tieng-anh-tang-cuong
  // ═══════════════════════════════════════════════════
  {
    title: 'Chương trình Tiếng Anh tăng cường',
    slug: 'chuong-trinh/tieng-anh-tang-cuong',
    status: PageStatus.PUBLISHED,
    seo_title: 'Tiếng Anh tăng cường — Chương trình Cambridge YLE tại Lê Quý Đôn',
    seo_description:
      'Chương trình Tiếng Anh tăng cường với giáo viên bản ngữ, chứng chỉ Cambridge YLE và phòng lab ngôn ngữ hiện đại — 90% học sinh đạt chứng chỉ quốc tế.',
    content: `<section class="page-content">
<h2>Tiếng Anh tăng cường — Nền tảng hội nhập từ lớp 1</h2>
<p>Trong bối cảnh hội nhập quốc tế sâu rộng, năng lực tiếng Anh là <strong>chìa khóa mở ra mọi cánh cửa</strong> cho thế hệ trẻ Việt Nam. Trường Tiểu học Lê Quý Đôn hiểu rõ điều này và đã đưa <strong>chương trình Tiếng Anh tăng cường</strong> vào giảng dạy từ lớp 1 — sớm hơn nhiều so với yêu cầu của Bộ GD&ĐT. Với 4 tiết tiếng Anh mỗi tuần (gấp đôi chương trình chuẩn), học sinh Lê Quý Đôn được tiếp xúc với tiếng Anh đủ nhiều và đủ sâu để thực sự làm chủ ngôn ngữ, chứ không chỉ học đối phó với bài kiểm tra.</p>

<h2>Giáo viên bản ngữ — Môi trường ngôn ngữ đích thực</h2>
<p>Điểm đặc biệt nhất của chương trình Tiếng Anh tại Lê Quý Đôn là sự tham gia của <strong>giáo viên bản ngữ đến từ Anh, Mỹ và Úc</strong>. Các thầy cô người nước ngoài này không chỉ mang đến phát âm chuẩn xác mà còn mang cả văn hóa, tư duy và phong cách giao tiếp của người bản xứ vào lớp học. Mỗi lớp học đều có ít nhất 2 tiết/tuần với giáo viên bản ngữ, đảm bảo học sinh được thực hành giao tiếp thực tế trong môi trường ngôn ngữ đích thực. Phương pháp TPR (Total Physical Response) và task-based learning được áp dụng linh hoạt, biến mỗi tiết học thành một trải nghiệm ngôn ngữ vui vẻ và hiệu quả.</p>

<h2>Chương trình Cambridge YLE — Chuẩn mực quốc tế</h2>
<p>Nhà trường là <strong>Trung tâm được Cambridge Assessment English ủy quyền</strong> tổ chức thi chứng chỉ Young Learners English (YLE) ngay tại trường. Chương trình học được thiết kế theo lộ trình Cambridge: <em>Starters</em> (lớp 2–3), <em>Movers</em> (lớp 3–4) và <em>Flyers</em> (lớp 4–5) — tương ứng với 3 cấp độ tăng dần từ cơ bản đến nâng cao. Tỷ lệ đạt chứng chỉ của học sinh Lê Quý Đôn liên tục ở mức cao: <strong>hơn 90%</strong> học sinh dự thi đạt chứng chỉ Cambridge YLE tương ứng với cấp độ của mình.</p>

<h2>Phòng Lab ngôn ngữ và công nghệ hỗ trợ học</h2>
<p>Nhà trường đầu tư xây dựng <strong>phòng lab ngôn ngữ hiện đại</strong> với 40 cabin học độc lập, mỗi cabin trang bị tai nghe chất lượng cao, micro và màn hình cảm ứng kết nối với hệ thống quản lý bài tập của giáo viên. Phòng lab được sử dụng cho các tiết luyện nghe — nói — phát âm chuyên sâu, cũng như cho các buổi thi thử Cambridge được tổ chức mỗi học kỳ. Ngoài ra, học sinh còn có thể tự luyện tập qua nền tảng học trực tuyến của trường, với hàng nghìn bài tập đa dạng được đề xuất theo năng lực cá nhân của từng em.</p>

<h2>Kết quả và thành tích nổi bật</h2>
<p>Sau hơn 15 năm triển khai chương trình Tiếng Anh tăng cường, những con số đã nói lên tất cả: <strong>hơn 90%</strong> học sinh tốt nghiệp lớp 5 đạt chứng chỉ Cambridge Movers hoặc Flyers; nhiều học sinh đạt điểm tuyệt đối (Shield) trong các kỳ thi Cambridge YLE; đội tuyển Tiếng Anh của trường nhiều năm liên tiếp giành giải nhất cuộc thi Tiếng Anh cấp quận và cấp thành phố; học sinh tốt nghiệp Lê Quý Đôn tự tin giao tiếp với người nước ngoài, sẵn sàng học tiếp chương trình song ngữ hoặc quốc tế ở bậc THCS. Đây là kết quả của sự đầu tư bài bản, nhất quán và tâm huyết suốt nhiều năm của nhà trường.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // PAGE 8: chuong-trinh/quoc-gia-nang-cao
  // ═══════════════════════════════════════════════════
  {
    title: 'Chương trình Quốc gia nâng cao',
    slug: 'chuong-trinh/quoc-gia-nang-cao',
    status: PageStatus.PUBLISHED,
    seo_title: 'Chương trình Quốc gia nâng cao — Lê Quý Đôn',
    seo_description:
      'Chương trình Giáo dục phổ thông 2018 bổ sung nâng cao Toán và Tiếng Việt — 40% học sinh đạt giải cấp quận, dạy học tích cực lấy học sinh làm trung tâm.',
    content: `<section class="page-content">
<h2>Chương trình Quốc gia — Nền tảng vững chắc, tiêu chuẩn cao hơn</h2>
<p>Chương trình dạy học chính khóa tại trường Tiểu học Lê Quý Đôn được xây dựng trên nền <strong>Chương trình Giáo dục phổ thông 2018</strong> của Bộ GD&ĐT — chương trình quốc gia hiện đại, tiên tiến, được thiết kế theo định hướng phát triển năng lực và phẩm chất người học. Tuy nhiên, nhà trường không dừng lại ở mức chuẩn tối thiểu. Với định hướng <em>nâng cao chất lượng</em>, trường Lê Quý Đôn bổ sung thêm nội dung nâng cao cho hai môn nền tảng quan trọng nhất: <strong>Toán học</strong> và <strong>Tiếng Việt</strong>, giúp học sinh phát triển tư duy logic, ngôn ngữ và nền tảng tri thức vượt trội so với mặt bằng chung.</p>

<h2>Nội dung nâng cao — Toán tư duy và Tiếng Việt chuyên sâu</h2>
<p>Chương trình Toán nâng cao tập trung vào phát triển <strong>tư duy toán học và khả năng giải quyết vấn đề</strong>. Học sinh không chỉ học thuộc công thức mà được dạy cách phân tích bài toán, tìm nhiều hướng giải khác nhau và chứng minh lý do chọn cách giải tối ưu. Các dạng bài toán có lời văn, bài toán logic, bài toán tổ hợp và hình học phẳng được đưa vào từ lớp 2, tạo nền tảng vững chắc cho các bậc học cao hơn. Chương trình Tiếng Việt nâng cao chú trọng kỹ năng đọc hiểu sâu, viết sáng tạo và biểu đạt chính xác — học sinh lớp 5 có thể viết được những bài văn miêu tả, kể chuyện và nghị luận đơn giản với ngôn ngữ giàu hình ảnh và cảm xúc.</p>

<h2>Phương pháp dạy học tích cực — Học sinh là trung tâm</h2>
<p>Nhà trường kiên định áp dụng <strong>phương pháp dạy học tích cực</strong>, trong đó học sinh là chủ thể hoạt động, không phải người thụ động ngồi nghe giảng. Các phương pháp chủ yếu được sử dụng bao gồm: học theo dự án (Project-Based Learning), học hợp tác theo nhóm nhỏ, khăn trải bàn, sơ đồ tư duy, học qua trò chơi và học qua tình huống thực tế. Giáo viên đóng vai trò là người tổ chức, định hướng và hỗ trợ, tạo ra những tình huống học tập kích thích sự tò mò và tư duy độc lập của học sinh. Phương pháp này không chỉ giúp học sinh nắm kiến thức sâu hơn mà còn phát triển các kỹ năng thế kỷ 21 như tư duy phê phán, giao tiếp và hợp tác.</p>

<h2>Đánh giá theo năng lực — Công bằng và toàn diện</h2>
<p>Thay vì chỉ dựa vào điểm số bài kiểm tra, trường Tiểu học Lê Quý Đôn áp dụng mô hình <strong>đánh giá toàn diện theo năng lực</strong>. Kết quả của mỗi học sinh được đánh giá qua nhiều kênh: bài kiểm tra định kỳ, bài tập dự án, quan sát thái độ học tập hàng ngày, tự đánh giá và đánh giá đồng đẳng. Nhà trường thực hiện đầy đủ hồ sơ học tập điện tử cho mỗi học sinh, ghi lại sự tiến bộ theo thời gian và phản hồi chi tiết đến phụ huynh sau mỗi kỳ học. Triết lý đánh giá của nhà trường là <em>ghi nhận sự tiến bộ, không so sánh học sinh với nhau</em> — điều này giúp mỗi em tự tin vào giá trị bản thân và có động lực học tập bền vững.</p>

<h2>Kết quả học tập — Thành tích đáng tự hào</h2>
<p>Chất lượng giáo dục của chương trình nâng cao được phản ánh rõ nét qua các con số thực tế: <strong>hơn 40%</strong> học sinh lớp 4–5 đạt giải trong các kỳ thi học sinh giỏi Toán và Tiếng Việt cấp quận và cấp thành phố; tỷ lệ học sinh hoàn thành tốt chương trình tiểu học đạt trên 85% nhiều năm liên tiếp; 100% học sinh tốt nghiệp tiểu học đạt ngưỡng điểm đầu vào các trường THCS top đầu quận Đống Đa. Những thành tích này không đến từ việc nhồi nhét hay học thêm quá nhiều, mà đến từ một nền giáo dục chất lượng, bài bản và tôn trọng sự phát triển tự nhiên của trẻ.</p>
</section>`,
  },

  // ═══════════════════════════════════════════════════
  // PAGE 9: chuong-trinh/ky-nang-song
  // ═══════════════════════════════════════════════════
  {
    title: 'Chương trình Kỹ năng sống',
    slug: 'chuong-trinh/ky-nang-song',
    status: PageStatus.PUBLISHED,
    seo_title: 'Kỹ năng sống — Chương trình giáo dục toàn diện tại Lê Quý Đôn',
    seo_description:
      'Chương trình Kỹ năng sống 2 tiết/tuần với chuyên gia tâm lý — giao tiếp, làm việc nhóm, quản lý cảm xúc, an toàn cá nhân và bảo vệ môi trường.',
    content: `<section class="page-content">
<h2>Kỹ năng sống — Trang bị hành trang cho cuộc đời</h2>
<p>Bên cạnh kiến thức học thuật, <strong>kỹ năng sống</strong> là nền tảng không thể thiếu để một đứa trẻ phát triển thành một người trưởng thành hạnh phúc, tự lập và có ích cho xã hội. Trường Tiểu học Lê Quý Đôn là một trong số ít trường tiểu học tại Hà Nội dành riêng <strong>2 tiết kỹ năng sống mỗi tuần</strong> trong khung chương trình chính khóa — không phải hoạt động ngoài giờ tuỳ chọn, mà là môn học bắt buộc được thiết kế bài bản, có giáo trình rõ ràng và được giảng dạy bởi đội ngũ giáo viên chuyên biệt kết hợp với chuyên gia tâm lý học đường.</p>

<h2>Nội dung chương trình — Toàn diện và thực tiễn</h2>
<p>Chương trình Kỹ năng sống tại Lê Quý Đôn bao gồm 6 nhóm kỹ năng cốt lõi, được phân bổ xuyên suốt 5 năm học theo mức độ từ cơ bản đến nâng cao:</p>
<ul>
  <li><strong>Kỹ năng giao tiếp:</strong> Lắng nghe tích cực, biểu đạt rõ ràng, ngôn ngữ cơ thể, giao tiếp phi bạo lực và kỹ năng thuyết trình trước đám đông.</li>
  <li><strong>Kỹ năng làm việc nhóm:</strong> Phân công nhiệm vụ, hợp tác, giải quyết xung đột trong nhóm và lãnh đạo tập thể nhỏ.</li>
  <li><strong>Quản lý cảm xúc:</strong> Nhận biết và đặt tên cho cảm xúc, kỹ thuật bình tĩnh khi tức giận, đồng cảm với người khác và xây dựng tư duy tích cực.</li>
  <li><strong>Giải quyết vấn đề:</strong> Tư duy phân tích, đánh giá lựa chọn, ra quyết định và rút kinh nghiệm sau sai lầm.</li>
  <li><strong>An toàn cá nhân:</strong> Phòng tránh tai nạn, nhận biết và phản ứng trước các tình huống nguy hiểm, bảo vệ thông tin cá nhân trên không gian mạng và kỹ năng sơ cứu cơ bản.</li>
  <li><strong>Bảo vệ môi trường:</strong> Ý thức tiết kiệm năng lượng, phân loại rác tái chế, trồng và chăm sóc cây xanh, tham gia các hoạt động bảo vệ môi trường cộng đồng.</li>
</ul>

<h2>Phương pháp giảng dạy — Trải nghiệm, đóng vai, dự án</h2>
<p>Điểm mạnh nổi bật của chương trình Kỹ năng sống tại Lê Quý Đôn là phương pháp giảng dạy <strong>hoàn toàn dựa trên trải nghiệm thực tế</strong>, không có lý thuyết suông. Mỗi tiết học là một cuộc phiêu lưu: học sinh tham gia đóng vai các tình huống thực tế (bị bắt nạt, bị lạc đường, tranh cãi với bạn bè), thực hành kỹ thuật thở và bình tĩnh, thực hiện các dự án nhóm như thiết kế chiến dịch bảo vệ môi trường trong lớp học hoặc tổ chức một buổi giao lưu giữa các lớp. Học sinh học bằng cách <em>làm, cảm nhận và phản tư</em> — chứ không phải ghi nhớ định nghĩa.</p>

<h2>Hợp tác với chuyên gia tâm lý học đường</h2>
<p>Nhà trường duy trì hợp tác thường xuyên với <strong>đội ngũ chuyên gia tâm lý giáo dục</strong> từ các trường đại học uy tín và tổ chức giáo dục chuyên nghiệp. Các chuyên gia này tham gia thiết kế chương trình, tập huấn giáo viên và trực tiếp giảng dạy một số chủ đề chuyên sâu như quản lý lo âu học đường, xây dựng lòng tự trọng và phòng chống bạo lực học đường. Ngoài ra, nhà trường có <strong>phòng tư vấn tâm lý học đường</strong> mở cửa mỗi ngày, nơi học sinh có thể đến gặp chuyên gia tâm lý theo lịch hoặc khi cần thiết — hoàn toàn bảo mật và không phán xét.</p>

<h2>Tác động và kết quả ghi nhận</h2>
<p>Sau nhiều năm triển khai bài bản, chương trình Kỹ năng sống tại Lê Quý Đôn đã tạo ra những thay đổi tích cực rõ ràng trong môi trường học đường: tỷ lệ xung đột giữa học sinh giảm đáng kể; học sinh biết cách xử lý cảm xúc thay vì bùng phát; nhiều em tự tin hơn khi phát biểu trước lớp và tham gia các hoạt động tập thể. Phụ huynh phản hồi rằng con em đã biết áp dụng kỹ năng học ở trường vào cuộc sống gia đình — từ việc tự giải quyết mâu thuẫn với anh chị em, đến việc chủ động bày tỏ cảm xúc và lắng nghe người thân. Đây là thành quả mà nhà trường trân trọng hơn bất kỳ giải thưởng học thuật nào.</p>
</section>`,
  },
];

async function seed() {
  await AppDataSource.initialize();

  const admin = await AppDataSource.getRepository(User).findOne({
    where: { role: UserRole.SUPER_ADMIN },
  });

  if (!admin) {
    console.error('[SEED] Khong tim thay Super Admin. Chay seed:admin truoc.');
    await AppDataSource.destroy();
    process.exit(1);
  }

  const repo = AppDataSource.getRepository(Page);
  let created = 0;

  for (const p of pagesData) {
    const exists = await repo.findOne({ where: { slug: p.slug } });
    if (exists) {
      console.log(`[SEED] Skip (da ton tai): ${p.slug}`);
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
    console.log(`[SEED] Tao trang: ${p.slug}`);
    created++;
  }

  console.log(
    `[SEED] Pages part1: ${created} created, ${pagesData.length - created} skipped`,
  );
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
