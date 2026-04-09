/**
 * Seed 8 articles cho category "Thông tin tuyển sinh".
 * Chay qua seed-runner.ts hoac truc tiep: npx tsx scripts/seed-articles-tuyensinh.ts
 */

import { login, apiPost, apiGet } from './seed-helpers';

interface Article {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  publishedAt: string;
}

const CATEGORY_SLUG = 'tuyen-sinh';

const articles: Article[] = [
  {
    title: 'Thông báo Tuyển sinh năm học 2026-2027',
    slug: 'thong-bao-tuyen-sinh-nam-hoc-2026-2027',
    excerpt:
      'Trường Tiểu học Lê Quý Đôn thông báo kế hoạch tuyển sinh lớp 1 và các khối năm học 2026-2027.',
    thumbnailUrl: 'https://picsum.photos/seed/tuyensinh01/800/450',
    publishedAt: '2026-03-15T08:00:00Z',
    content: `
<h2>Thông báo Tuyển sinh năm học 2026-2027</h2>
<p>Trường Tiểu học Lê Quý Đôn trân trọng thông báo kế hoạch tuyển sinh năm học 2026-2027. Nhà trường tuyển sinh các khối lớp từ lớp 1 đến lớp 5, trong đó <strong>tuyển sinh lớp 1</strong> là trọng tâm với chỉ tiêu 210 học sinh (6 lớp, sĩ số tối đa 35 em/lớp).</p>

<h3>Đối tượng tuyển sinh</h3>
<p><strong>Lớp 1:</strong> Trẻ sinh năm 2020 (đủ 6 tuổi tính đến 31/12/2026), đã hoàn thành chương trình mẫu giáo 5 tuổi. Ưu tiên trẻ có hộ khẩu hoặc nơi cư trú tại quận Cầu Giấy và các quận lân cận.</p>
<p><strong>Lớp 2-5 (bổ sung):</strong> Nhận hồ sơ chuyển trường khi còn chỉ tiêu. Học sinh cần đạt kết quả học tập Tốt trở lên tại trường cũ và tham gia bài kiểm tra năng lực đầu vào.</p>

<h3>Thời gian và quy trình</h3>
<ul>
<li><strong>01/04 - 30/04/2026:</strong> Nhận hồ sơ đăng ký trực tuyến tại website và trực tiếp tại Phòng Tuyển sinh</li>
<li><strong>05/05 - 10/05/2026:</strong> Giao lưu, đánh giá năng lực (không phải thi tuyển)</li>
<li><strong>15/05/2026:</strong> Thông báo kết quả qua email và SMS</li>
<li><strong>20/05 - 30/05/2026:</strong> Xác nhận nhập học và đóng phí giữ chỗ</li>
</ul>

<h3>Hồ sơ cần thiết</h3>
<p>Phụ huynh chuẩn bị: Đơn đăng ký (mẫu trên website), bản sao giấy khai sinh, sổ hộ khẩu hoặc giấy xác nhận cư trú, giấy xác nhận hoàn thành chương trình mẫu giáo, 4 ảnh 3x4cm. Hồ sơ nộp trực tiếp tại trường hoặc gửi qua bưu điện.</p>

<p>Mọi thắc mắc xin liên hệ <strong>Phòng Tuyển sinh:</strong> 024.3756.xxxx (ext. 102) hoặc email tuyensinh@lequydon.edu.vn. Nhà trường mở cửa tham quan vào các ngày thứ Bảy hàng tuần từ 8h30 đến 11h30.</p>
`,
  },
  {
    title: 'Thông báo Tuyển sinh năm học 2025-2026',
    slug: 'thong-bao-tuyen-sinh-nam-hoc-2025-2026',
    excerpt:
      'Thông tin tuyển sinh năm học 2025-2026 của Trường Tiểu học Lê Quý Đôn — đã hoàn tất.',
    thumbnailUrl: 'https://picsum.photos/seed/tuyensinh02/800/450',
    publishedAt: '2025-03-10T08:00:00Z',
    content: `
<h2>Thông báo Tuyển sinh năm học 2025-2026</h2>
<p>Trường Tiểu học Lê Quý Đôn thông báo kết quả tuyển sinh năm học 2025-2026 đã hoàn tất. Nhà trường xin cảm ơn sự quan tâm và tin tưởng của các bậc Phụ huynh. Bài viết này được lưu giữ để Phụ huynh tham khảo quy trình tuyển sinh cho các năm tiếp theo.</p>

<h3>Tổng kết tuyển sinh 2025-2026</h3>
<p>Năm học 2025-2026, nhà trường nhận được <strong>hơn 600 hồ sơ đăng ký</strong> cho 180 chỉ tiêu lớp 1 (6 lớp). Tỷ lệ chọi là 1:3.3, thể hiện sự tin tưởng lớn của cộng đồng phụ huynh đối với chất lượng giáo dục của trường.</p>

<h3>Tiêu chí đánh giá</h3>
<p>Nhà trường đánh giá năng lực đầu vào thông qua buổi giao lưu thân thiện, bao gồm các hoạt động: nhận biết chữ cái và số đếm, kỹ năng giao tiếp cơ bản, khả năng tập trung và làm theo hướng dẫn, tương tác với bạn cùng nhóm. Đặc biệt, nhà trường <strong>không tổ chức thi tuyển</strong> dưới bất kỳ hình thức nào đối với lớp 1.</p>

<h3>Chương trình giáo dục nổi bật</h3>
<p>Học sinh Lê Quý Đôn được hưởng chương trình giáo dục chuẩn của Bộ GD&ĐT kết hợp các chương trình bổ trợ: Tiếng Anh Cambridge (8 tiết/tuần), STEM (2 tiết/tuần), Kỹ năng sống, Âm nhạc quốc tế, Thể dục chuyên sâu và nhiều câu lạc bộ ngoại khóa phong phú.</p>

<p>Phụ huynh quan tâm đến năm học 2026-2027 vui lòng theo dõi mục Tuyển sinh trên website hoặc đăng ký nhận thông báo qua email để cập nhật thông tin sớm nhất. Chương trình tham quan trường dành cho phụ huynh dự kiến bắt đầu từ tháng 1/2026.</p>
`,
  },
  {
    title: 'Thông báo CLB Ngôi nhà mơ ước 2026',
    slug: 'thong-bao-clb-ngoi-nha-mo-uoc-2026',
    excerpt:
      'CLB Ngôi nhà mơ ước 2026 — chương trình trải nghiệm học tập dành cho trẻ 5 tuổi chuẩn bị vào lớp 1.',
    thumbnailUrl: 'https://picsum.photos/seed/tuyensinh03/800/450',
    publishedAt: '2026-01-15T08:00:00Z',
    content: `
<h2>CLB Ngôi nhà mơ ước 2026</h2>
<p>Trường Tiểu học Lê Quý Đôn trân trọng giới thiệu chương trình <strong>CLB Ngôi nhà mơ ước 2026</strong> — khóa học trải nghiệm miễn phí dành cho trẻ 5 tuổi đang chuẩn bị vào lớp 1. Đây là cơ hội để các bé và Phụ huynh làm quen với môi trường học tập tại Lê Quý Đôn trước khi đưa ra quyết định chọn trường.</p>

<h3>Nội dung chương trình</h3>
<p>Chương trình gồm <strong>4 buổi học</strong> vào các ngày thứ Bảy (từ 9h00 đến 11h00), bao gồm:</p>
<ul>
<li><strong>Buổi 1 (18/01):</strong> Khám phá trường học — tham quan cơ sở vật chất, gặp gỡ thầy cô, chơi trò chơi tập thể</li>
<li><strong>Buổi 2 (25/01):</strong> Tiếng Anh vui nhộn — học từ vựng qua bài hát và trò chơi cùng giáo viên bản ngữ</li>
<li><strong>Buổi 3 (08/02):</strong> STEM mini — thí nghiệm khoa học đơn giản: núi lửa baking soda, slime ma thuật</li>
<li><strong>Buổi 4 (15/02):</strong> Ngày hội tài năng nhí — các bé biểu diễn năng khiếu và nhận quà kết thúc chương trình</li>
</ul>

<h3>Đăng ký tham gia</h3>
<p>Chỉ tiêu: <strong>60 bé</strong> (chia 3 lớp, mỗi lớp 20 bé). Đăng ký qua form trực tuyến trên website nhà trường hoặc gọi điện đến Phòng Tuyển sinh. Ưu tiên đăng ký sớm — các năm trước, CLB thường kín chỗ trong vòng 2 tuần.</p>

<p>Lưu ý: Việc tham gia CLB Ngôi nhà mơ ước <strong>không phải là điều kiện bắt buộc</strong> để đăng ký tuyển sinh và cũng không ảnh hưởng đến kết quả xét tuyển. Đây thuần túy là chương trình cộng đồng giúp trẻ và phụ huynh hiểu thêm về nhà trường.</p>

<p>Phụ huynh đăng ký sẽ nhận email xác nhận và lịch trình chi tiết. Mọi chi phí chương trình do nhà trường tài trợ hoàn toàn.</p>
`,
  },
  {
    title: 'Thông báo CLB Ngôi nhà mơ ước 2025',
    slug: 'thong-bao-clb-ngoi-nha-mo-uoc-2025',
    excerpt:
      'Nhìn lại chương trình CLB Ngôi nhà mơ ước 2025 với hơn 60 bé tham gia và phản hồi tích cực.',
    thumbnailUrl: 'https://picsum.photos/seed/tuyensinh04/800/450',
    publishedAt: '2025-01-10T08:00:00Z',
    content: `
<h2>CLB Ngôi nhà mơ ước 2025 — Nhìn lại</h2>
<p>Chương trình CLB Ngôi nhà mơ ước 2025 đã kết thúc thành công tốt đẹp với sự tham gia của <strong>62 bé</strong> và gia đình. Đây là năm thứ 5 nhà trường tổ chức chương trình này, và năm nay ghi nhận mức hài lòng cao nhất từ phía phụ huynh.</p>

<h3>Điểm nhấn chương trình</h3>
<p>Bốn buổi học trải nghiệm diễn ra trong không khí vui tươi, an toàn. Các bé được tham gia đa dạng hoạt động: khám phá thư viện và phòng STEM, học hát tiếng Anh cùng thầy giáo người Anh Mr. James, làm thí nghiệm khoa học "Cầu vồng sữa" và "Bóng bay tĩnh điện", và cuối cùng là biểu diễn tài năng trước sân trường.</p>

<h3>Phản hồi từ Phụ huynh</h3>
<p>Khảo sát sau chương trình cho thấy <strong>98% phụ huynh</strong> đánh giá "Rất hài lòng" hoặc "Hài lòng". Chị Nguyễn Thu Hà, phụ huynh bé Gia Hân, chia sẻ: "Bé nhà tôi rất háo hức mỗi thứ Bảy đi học. Về nhà bé kể liên tục và đòi vào Lê Quý Đôn. Chương trình giúp cả phụ huynh và con hiểu rõ hơn về trường."</p>

<h3>Kết quả đáng chú ý</h3>
<p>Trong số 62 bé tham gia CLB, <strong>48 bé (77%)</strong> sau đó đã đăng ký hồ sơ tuyển sinh vào lớp 1 năm 2025-2026. Điều này cho thấy chương trình đã thành công trong việc giúp phụ huynh đưa ra quyết định chọn trường dựa trên trải nghiệm thực tế.</p>

<p>Nhà trường xin cảm ơn tất cả phụ huynh và các bé đã tham gia. Chương trình CLB Ngôi nhà mơ ước 2026 sẽ tiếp tục được tổ chức vào tháng 1/2026 — thông tin chi tiết sẽ được đăng tải trên website và fanpage nhà trường.</p>
`,
  },
  {
    title: 'Hội thảo 3 SẴN SÀNG cùng 1 năm đầu tiên',
    slug: 'hoi-thao-3-san-sang-cung-1-nam-dau-tien',
    excerpt:
      'Hội thảo giúp Phụ huynh chuẩn bị 3 yếu tố then chốt cho con bước vào lớp 1 thành công.',
    thumbnailUrl: 'https://picsum.photos/seed/tuyensinh05/800/450',
    publishedAt: '2026-02-22T09:00:00Z',
    content: `
<h2>Hội thảo "3 SẴN SÀNG cùng 1 năm đầu tiên"</h2>
<p>Ngày 21 tháng 2 năm 2026, trường Tiểu học Lê Quý Đôn tổ chức hội thảo <strong>"3 SẴN SÀNG cùng 1 năm đầu tiên"</strong> dành cho phụ huynh có con chuẩn bị vào lớp 1. Hội thảo thu hút hơn 150 phụ huynh tham dự trực tiếp và 200 phụ huynh theo dõi qua livestream.</p>

<h3>3 Sẵn sàng là gì?</h3>
<p><strong>Sẵn sàng về Tâm lý:</strong> ThS. Lê Thị Phương, chuyên gia tâm lý giáo dục, chia sẻ cách giúp trẻ tự tin, không lo sợ khi chuyển từ mẫu giáo lên tiểu học. Bí quyết nằm ở việc tạo tâm thế tích cực: nói về trường học như một nơi thú vị, cho trẻ tham quan trước, và đặc biệt không dọa "vào lớp 1 là phải ngồi yên, không được chơi nữa".</p>

<p><strong>Sẵn sàng về Kỹ năng:</strong> Cô Nguyễn Minh Ngọc, Tổ trưởng chuyên môn khối 1, hướng dẫn phụ huynh những kỹ năng con cần có: tự phục vụ bản thân (mặc quần áo, đi giày, xếp cặp), kỹ năng giao tiếp (biết xin phép, cảm ơn, xin lỗi), và kỹ năng tập trung (ngồi yên 15-20 phút). Đặc biệt, cô nhấn mạnh phụ huynh <strong>không cần ép con học đọc, viết trước</strong>.</p>

<p><strong>Sẵn sàng về Sức khỏe:</strong> Bác sĩ Trần Hải Nam tư vấn về chế độ dinh dưỡng, giấc ngủ và vận động phù hợp cho trẻ 5-6 tuổi. Thời gian ngủ lý tưởng là 10-11 giờ/ngày, bữa sáng đủ chất trước 7h, và tối thiểu 60 phút vận động ngoài trời mỗi ngày.</p>

<h3>Phần hỏi đáp sôi nổi</h3>
<p>Hơn 30 câu hỏi được phụ huynh đặt ra, tập trung vào: nên cho con học chữ trước không, làm sao biết con sẵn sàng, và cách xử lý khi con khóc không chịu đi học. Các chuyên gia đều nhấn mạnh rằng <strong>mỗi trẻ có tốc độ phát triển riêng</strong>, phụ huynh nên kiên nhẫn đồng hành thay vì so sánh hay tạo áp lực.</p>

<p>Slide bài giảng và video ghi hình hội thảo sẽ được gửi qua email cho tất cả phụ huynh đã đăng ký. Phụ huynh chưa tham dự có thể xem lại trên kênh YouTube của nhà trường.</p>
`,
  },
  {
    title: 'Quy trình tuyển sinh và nhập học tại Lê Quý Đôn',
    slug: 'quy-trinh-tuyen-sinh-va-nhap-hoc-tai-le-quy-don',
    excerpt:
      'Hướng dẫn chi tiết quy trình từ đăng ký, giao lưu đánh giá đến nhập học chính thức.',
    thumbnailUrl: 'https://picsum.photos/seed/tuyensinh06/800/450',
    publishedAt: '2026-02-01T08:00:00Z',
    content: `
<h2>Quy trình Tuyển sinh và Nhập học</h2>
<p>Để giúp Phụ huynh hiểu rõ và chuẩn bị tốt nhất, Trường Tiểu học Lê Quý Đôn xin hướng dẫn chi tiết quy trình tuyển sinh và nhập học năm học 2026-2027 gồm <strong>5 bước chính</strong>.</p>

<h3>Bước 1: Tìm hiểu thông tin (Tháng 1-3)</h3>
<p>Phụ huynh tham quan trường vào các ngày thứ Bảy (đăng ký trước qua website), tham gia hội thảo "3 Sẵn sàng", và cho con trải nghiệm CLB Ngôi nhà mơ ước. Đây là giai đoạn giúp cả phụ huynh và con hiểu về trường trước khi quyết định.</p>

<h3>Bước 2: Nộp hồ sơ (01/04 - 30/04)</h3>
<p>Đăng ký trực tuyến qua website hoặc nộp trực tiếp tại Phòng Tuyển sinh. Hồ sơ gồm: đơn đăng ký (mẫu trên website), bản sao giấy khai sinh có công chứng, sổ hộ khẩu hoặc giấy xác nhận cư trú, giấy hoàn thành chương trình mẫu giáo 5 tuổi, phiếu khám sức khỏe (không quá 6 tháng), và 4 ảnh 3x4cm.</p>

<h3>Bước 3: Giao lưu đánh giá (05/05 - 10/05)</h3>
<p>Đây <strong>không phải kỳ thi tuyển</strong>. Buổi giao lưu kéo dài 60 phút, gồm các hoạt động nhóm và cá nhân: trò chơi nhận biết màu sắc, hình khối, số đếm; bài hát và vận động; giao tiếp với giáo viên. Mục đích là đánh giá mức độ sẵn sàng và phân lớp phù hợp.</p>

<h3>Bước 4: Thông báo kết quả (15/05)</h3>
<p>Kết quả được gửi qua email và SMS đến phụ huynh. Phụ huynh có 10 ngày để xác nhận nhập học và đóng phí giữ chỗ. Sau thời hạn, nhà trường sẽ gọi thí sinh trong danh sách dự phòng.</p>

<h3>Bước 5: Nhập học (Tháng 6-8)</h3>
<p>Hoàn tất hồ sơ nhập học, đóng học phí năm đầu, mua đồng phục và sách giáo khoa. Tháng 7 có buổi họp phụ huynh đầu tiên để gặp giáo viên chủ nhiệm. Tháng 8 tổ chức "Tuần lễ làm quen" giúp học sinh mới thích nghi với môi trường mới trước khai giảng.</p>

<p>Phụ huynh có thắc mắc vui lòng liên hệ Phòng Tuyển sinh qua hotline <strong>024.3756.xxxx</strong> (giờ hành chính) hoặc email tuyensinh@lequydon.edu.vn.</p>
`,
  },
  {
    title: 'Chương trình học bổng năm học 2026-2027',
    slug: 'chuong-trinh-hoc-bong-nam-hoc-2026-2027',
    excerpt:
      'Thông tin chi tiết về 3 loại học bổng dành cho học sinh có thành tích xuất sắc và hoàn cảnh khó khăn.',
    thumbnailUrl: 'https://picsum.photos/seed/tuyensinh07/800/450',
    publishedAt: '2026-03-01T08:00:00Z',
    content: `
<h2>Chương trình Học bổng năm học 2026-2027</h2>
<p>Trường Tiểu học Lê Quý Đôn công bố chương trình học bổng năm học 2026-2027 với tổng giá trị <strong>hơn 500 triệu đồng</strong>, nhằm khuyến khích học sinh xuất sắc và hỗ trợ gia đình có hoàn cảnh khó khăn. Chương trình gồm 3 loại học bổng chính.</p>

<h3>1. Học bổng Tài năng (dành cho học sinh mới)</h3>
<p>Dành cho học sinh đăng ký vào lớp 1 có năng khiếu nổi bật trong buổi giao lưu đánh giá. Mỗi năm chọn <strong>10 suất</strong>, mỗi suất trị giá 50% học phí năm đầu tiên. Tiêu chí: khả năng tư duy logic vượt trội, kỹ năng giao tiếp xuất sắc, hoặc năng khiếu đặc biệt về âm nhạc, mỹ thuật, thể thao.</p>

<h3>2. Học bổng Xuất sắc (dành cho học sinh đang học)</h3>
<p>Dành cho học sinh từ lớp 2 đến lớp 5 đạt thành tích học tập và rèn luyện xuất sắc. Tiêu chí: xếp loại Xuất sắc cả năm, đạt giải cấp Quận trở lên trong các kỳ thi học thuật, và có hạnh kiểm Tốt. Mỗi khối chọn <strong>5 suất</strong>, trị giá 30% học phí năm tiếp theo.</p>

<h3>3. Học bổng Vượt khó (hỗ trợ tài chính)</h3>
<p>Dành cho học sinh có hoàn cảnh gia đình khó khăn nhưng nỗ lực học tập tốt. Phụ huynh nộp đơn kèm giấy xác nhận hoàn cảnh từ chính quyền địa phương. Hội đồng xét duyệt sẽ đánh giá và cấp <strong>hỗ trợ 30-100% học phí</strong> tùy trường hợp. Không giới hạn số suất.</p>

<h3>Cách thức đăng ký</h3>
<p>Phụ huynh tải mẫu đơn trên website nhà trường, điền đầy đủ thông tin và nộp kèm hồ sơ minh chứng. Hạn nộp: <strong>30/04/2026</strong> đối với học bổng Tài năng, và <strong>30/06/2026</strong> đối với học bổng Xuất sắc và Vượt khó. Kết quả thông báo qua email trong vòng 15 ngày làm việc.</p>

<p>Học bổng được duy trì hàng năm nếu học sinh tiếp tục đáp ứng tiêu chí. Nhà trường cam kết không có học sinh nào phải nghỉ học vì lý do tài chính.</p>
`,
  },
  {
    title: 'Lịch tham quan trường dành cho Phụ huynh',
    slug: 'lich-tham-quan-truong-danh-cho-phu-huynh',
    excerpt:
      'Đăng ký tham quan trường vào các ngày thứ Bảy để tìm hiểu cơ sở vật chất và chương trình giáo dục.',
    thumbnailUrl: 'https://picsum.photos/seed/tuyensinh08/800/450',
    publishedAt: '2026-01-05T08:00:00Z',
    content: `
<h2>Lịch tham quan trường dành cho Phụ huynh</h2>
<p>Trường Tiểu học Lê Quý Đôn mở cửa chào đón Phụ huynh đến tham quan và tìm hiểu về nhà trường vào <strong>các ngày thứ Bảy hàng tuần</strong>, từ 8h30 đến 11h30. Đây là cơ hội để Phụ huynh trực tiếp trải nghiệm không gian học tập, gặp gỡ Ban Giám hiệu và đặt câu hỏi.</p>

<h3>Chương trình tham quan (khoảng 2 giờ)</h3>
<p><strong>8h30 - 9h00:</strong> Đón tiếp tại sảnh chính, nhận tài liệu giới thiệu trường. Phụ huynh được phục vụ trà, cà phê và bánh nhẹ trong khi chờ chương trình bắt đầu.</p>

<p><strong>9h00 - 9h30:</strong> Trình chiếu video giới thiệu tổng quan về trường: lịch sử hình thành, triết lý giáo dục, chương trình học, đội ngũ giáo viên, và thành tích học sinh. Thầy Hiệu trưởng chia sẻ tầm nhìn và cam kết chất lượng.</p>

<p><strong>9h30 - 10h30:</strong> Tham quan cơ sở vật chất theo lộ trình: phòng học tiêu chuẩn (máy lạnh, bảng thông minh), phòng STEM và phòng thí nghiệm, thư viện đa phương tiện, phòng âm nhạc và phòng nghệ thuật, khu thể dục thể thao (sân bóng, bể bơi, phòng gym), nhà ăn và khu bếp, phòng y tế.</p>

<p><strong>10h30 - 11h00:</strong> Dự giờ lớp học thực tế (nếu là ngày có lịch học CLB). Phụ huynh được quan sát cách giáo viên tương tác với học sinh, phương pháp giảng dạy và không khí lớp học.</p>

<p><strong>11h00 - 11h30:</strong> Phần hỏi đáp với Ban Giám hiệu và Phòng Tuyển sinh. Phụ huynh có thể hỏi bất kỳ câu hỏi nào về học phí, chương trình, đội ngũ giáo viên, bán trú, xe đưa đón, v.v.</p>

<h3>Đăng ký tham quan</h3>
<p>Phụ huynh đăng ký trước qua form trên website hoặc gọi điện đến số <strong>024.3756.xxxx</strong>. Mỗi buổi nhận tối đa 20 gia đình để đảm bảo chất lượng tham quan. Phụ huynh có thể đến cùng con, nhà trường có khu vui chơi cho các bé trong khi phụ huynh trao đổi.</p>

<p><em>Lưu ý: Lịch tham quan có thể thay đổi vào các tuần có sự kiện đặc biệt. Phụ huynh vui lòng kiểm tra lịch cập nhật trên website hoặc gọi xác nhận trước khi đến.</em></p>
`,
  },
];

export default async function seedArticlesTuyenSinh() {
  // Tim category ID
  const catRes = await apiGet('/categories');
  const categories = catRes.data || catRes;
  const cat = Array.isArray(categories)
    ? categories.find((c: any) => c.slug === CATEGORY_SLUG)
    : null;

  if (!cat) {
    console.log(`  SKIP: Category "${CATEGORY_SLUG}" chua ton tai. Chay seedCategories truoc.`);
    return;
  }

  console.log(`Category: ${cat.name} (id=${cat.id})`);

  for (const article of articles) {
    const result = await apiPost('/articles', {
      ...article,
      categoryId: cat.id,
      status: 'published',
    });
    if (result.id) {
      console.log(`  OK   ${article.title}`);
    }
  }
}

// Cho phep chay truc tiep: npx tsx scripts/seed-articles-tuyensinh.ts
if (require.main === module) {
  (async () => {
    const { login } = await import('./seed-helpers');
    await login();
    await seedArticlesTuyenSinh();
    console.log('Done.');
  })();
}
