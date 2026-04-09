/**
 * Seed 8 bai viet cho danh muc "Hoat dong ngoai khoa"
 * Chay: npx tsx scripts/seed-articles-ngoaikhoa.ts
 */

import { apiPost, apiGet } from './seed-helpers';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const articles = [
  {
    title: 'Hành Trình Khám Phá Của Doners Khối 5 Tại Bản Rôm',
    slug: 'hanh-trinh-kham-pha-doners-khoi-5-ban-rom',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-ngoaikhoa-1/800/500',
    publishedAt: '2026-01-10T08:00:00.000Z',
    excerpt:
      'Học sinh khối 5 trường Tiểu học Lê Quý Đôn có chuyến dã ngoại đáng nhớ tại Bản Rôm, trải nghiệm văn hóa dân tộc và thiên nhiên vùng cao.',
    content: `
<h2>Hành trình đến Bản Rôm</h2>
<p>Sáng ngày 10 tháng 1 năm 2026, gần 120 học sinh khối 5 trường Tiểu học Lê Quý Đôn đã háo hức lên xe để bắt đầu chuyến hành trình khám phá tại Bản Rôm — một bản làng truyền thống của người Mường nằm sâu trong thung lũng xanh mát thuộc tỉnh Hòa Bình. Các em được chia thành 6 nhóm, mỗi nhóm mang tên một loài hoa đặc trưng của vùng cao: Đào, Mai, Lan, Cúc, Hướng Dương và Ban.</p>

<h2>Trải nghiệm văn hóa bản địa</h2>
<p>Đến nơi, các Doners nhí được bà con dân bản chào đón nồng nhiệt với điệu múa cồng chiêng truyền thống. Các em được tận mắt chứng kiến cách người Mường dệt vải thổ cẩm, nấu cơm lam trong ống nứa và chế biến các món ăn đặc sản vùng cao. Nhiều em lần đầu tiên được thử giã gạo bằng cối đá, tay chân lóng ngóng nhưng tràn đầy tiếng cười.</p>

<h3>Khám phá thiên nhiên</h3>
<p>Buổi chiều, các nhóm tham gia hoạt động trekking nhẹ dọc theo con suối trong vắt chảy quanh bản. Thầy cô hướng dẫn các em quan sát và ghi chép lại các loài thực vật, côn trùng gặp trên đường đi. Bộ sưu tập lá cây ép khô mà các em mang về đã trở thành tài liệu học tập quý giá cho môn Tự nhiên và Xã hội trong suốt học kỳ.</p>

<p>Cô Nguyễn Thị Hồng Nhung — giáo viên chủ nhiệm lớp 5A3 — chia sẻ: <em>"Chuyến đi giúp các em hiểu hơn về giá trị văn hóa truyền thống, biết trân trọng thiên nhiên và sống hòa hợp với cộng đồng. Đây là bài học mà không sách vở nào có thể thay thế được."</em></p>

<p>Kết thúc chuyến đi, mỗi Doner đều mang về một chiếc vòng tay thổ cẩm do chính tay mình đan, cùng những kỷ niệm đẹp không bao giờ quên. Ban Giám hiệu nhà trường cho biết sẽ tiếp tục tổ chức các chuyến trải nghiệm tương tự cho các khối lớp trong năm học tới.</p>
`.trim(),
  },
  {
    title: 'Đại phim kể của Doners Sao — Nhảy mí là cả thế giới',
    slug: 'dai-phim-ke-doners-sao-nhay-mi-la-ca-the-gioi',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-ngoaikhoa-2/800/500',
    publishedAt: '2026-01-25T08:00:00.000Z',
    excerpt:
      'Dự án phim ngắn do chính học sinh Doners Sao thực hiện, kể câu chuyện về ước mơ và đam mê nhảy múa của các em nhỏ trường Lê Quý Đôn.',
    content: `
<h2>Khi các em nhỏ trở thành nhà làm phim</h2>
<p>Trong khuôn khổ dự án "Đại phim kể" — chương trình giáo dục sáng tạo đặc biệt dành cho khối Doners Sao (lớp 1-2), các em học sinh trường Tiểu học Lê Quý Đôn đã lần đầu tiên được trải nghiệm quy trình sản xuất một bộ phim ngắn hoàn chỉnh. Chủ đề năm nay là "Nhảy mí là cả thế giới" — nơi các Doner nhỏ tuổi nhất kể câu chuyện về niềm đam mê nhảy múa của mình.</p>

<h2>Từ kịch bản đến phim trường</h2>
<p>Dưới sự hướng dẫn của thầy Trần Minh Đức — giáo viên nghệ thuật — và ê-kíp tình nguyện viên gồm các phụ huynh có kinh nghiệm trong lĩnh vực truyền thông, 45 em học sinh đã cùng nhau viết kịch bản, thiết kế bối cảnh, tự làm đạo cụ từ giấy bìa và vải vụn. Quá trình quay phim diễn ra trong 3 ngày tại sân trường và phòng nghệ thuật.</p>

<h3>Câu chuyện đầy cảm xúc</h3>
<p>Bộ phim dài 12 phút kể về Bông — một cô bé lớp 2 nhút nhát, luôn sợ đứng trước đám đông nhưng lại có niềm đam mê mãnh liệt với nhảy múa. Qua sự động viên của bạn bè và thầy cô, Bông dần tự tin hơn và cuối cùng tỏa sáng trên sân khấu Đêm hội Trăng Rằm của trường. Các cảnh quay do chính các em thực hiện mang lại cảm xúc chân thật và xúc động đến bất ngờ.</p>

<p>Buổi chiếu phim ra mắt tại hội trường trường đã thu hút hơn 200 phụ huynh và học sinh tham dự. Nhiều phụ huynh không giấu được nước mắt khi thấy con mình xuất hiện trên màn hình lớn. Bé Ngọc Anh — diễn viên chính vai Bông — chia sẻ: <em>"Con thích làm phim lắm, con muốn kể thật nhiều câu chuyện nữa!"</em></p>

<p>Dự án "Đại phim kể" không chỉ phát triển kỹ năng sáng tạo mà còn giúp các em rèn luyện kỹ năng làm việc nhóm, giao tiếp và tự tin thể hiện bản thân trước đám đông.</p>
`.trim(),
  },
  {
    title: 'Biệt đội nhí — Doners kể sứ hiệp câu chuyện xanh',
    slug: 'biet-doi-nhi-doners-ke-su-hiep-cau-chuyen-xanh',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-ngoaikhoa-3/800/500',
    publishedAt: '2026-02-14T08:00:00.000Z',
    excerpt:
      'Dự án môi trường "Câu chuyện xanh" với sự tham gia của hơn 300 học sinh, biến khuôn viên trường thành không gian xanh mát.',
    content: `
<h2>Sứ mệnh xanh của Biệt đội nhí</h2>
<p>Nhân dịp Tết trồng cây đầu xuân 2026, trường Tiểu học Lê Quý Đôn đã phát động dự án "Biệt đội nhí — Câu chuyện xanh" với sự tham gia nhiệt tình của hơn 300 học sinh từ lớp 3 đến lớp 5. Mỗi lớp thành lập một "Biệt đội xanh" gồm 10 thành viên, chịu trách nhiệm chăm sóc một khu vực cây xanh trong khuôn viên trường suốt cả học kỳ.</p>

<h2>Hoạt động cụ thể</h2>
<p>Dự án được chia thành 4 giai đoạn chính: Khảo sát và lập kế hoạch (tuần 1-2), Trồng cây và thiết kế vườn (tuần 3-4), Chăm sóc và theo dõi (tuần 5-12), và Tổng kết đánh giá (tuần 13). Các Biệt đội nhí không chỉ trồng cây mà còn tự thiết kế biển tên cây, viết nhật ký theo dõi sự phát triển và tạo video ngắn giới thiệu "người bạn xanh" của mình.</p>

<h3>Kết quả ấn tượng</h3>
<p>Sau 3 tháng triển khai, khuôn viên trường đã có thêm 50 cây xanh mới, bao gồm cây bóng mát, cây ăn quả và cây hoa. Đặc biệt, Biệt đội xanh lớp 4A2 đã sáng tạo ra mô hình "Vườn rau sạch mini" từ chai nhựa tái chế, trở thành nguồn cung cấp rau xanh cho bữa trưa bán trú. Mô hình này sau đó được nhân rộng cho toàn trường.</p>

<p>Em Phạm Gia Bảo — đội trưởng Biệt đội xanh lớp 5A1 — hào hứng kể: <em>"Mỗi sáng đến trường, việc đầu tiên của chúng em là chạy ra vườn xem cây lớn thêm bao nhiêu. Có lần cây bị sâu, cả đội lo lắng suốt cả tuần, may mà cô hướng dẫn cách xử lý kịp thời."</em></p>

<p>Thầy Hiệu trưởng Nguyễn Văn Thành đánh giá: <em>"Dự án không chỉ giúp trường xanh hơn mà còn giáo dục các em ý thức bảo vệ môi trường, tinh thần trách nhiệm và kỹ năng làm việc nhóm. Chúng tôi sẽ duy trì hoạt động này thường niên."</em></p>
`.trim(),
  },
  {
    title: 'Trại Xuân 2026 — Team Tên Trộm 3 Doners Mùa xuân ơi',
    slug: 'trai-xuan-2026-team-ten-trom-3-doners-mua-xuan-oi',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-ngoaikhoa-4/800/500',
    publishedAt: '2026-02-20T08:00:00.000Z',
    excerpt:
      'Trại Xuân 2026 với chủ đề "Mùa xuân ơi" mang đến 2 ngày trải nghiệm đầy sắc màu cho toàn thể học sinh nhà trường.',
    content: `
<h2>Trại Xuân rực rỡ sắc màu</h2>
<p>Ngày 20-21 tháng 2 năm 2026, trường Tiểu học Lê Quý Đôn đã tổ chức chương trình Trại Xuân thường niên với chủ đề "Mùa xuân ơi" tại khuôn viên trường. Năm nay, gần 800 học sinh được chia thành 16 đội chơi, trong đó Team "Tên Trộm 3" của khối Doners lớp 3 đã trở thành hiện tượng với màn trình diễn sáng tạo và tinh thần đồng đội xuất sắc.</p>

<h2>Các hoạt động tại trại</h2>
<p>Chương trình Trại Xuân bao gồm nhiều hoạt động phong phú: Thi gói bánh chưng mini, hội thi trang trí trại, trò chơi dân gian (kéo co, nhảy bao bố, đập niêu), cuộc thi hát dân ca, và thử thách giải mật thư tìm kho báu ẩn trong khuôn viên trường. Mỗi hoạt động mang lại những bài học và trải nghiệm khác nhau về văn hóa truyền thống Việt Nam.</p>

<h3>Điểm nhấn: Team Tên Trộm 3</h3>
<p>Team "Tên Trộm 3" gồm 50 thành viên đến từ các lớp 3A1 đến 3A5, gây ấn tượng mạnh với phần trang trí trại lấy cảm hứng từ làng quê Bắc Bộ thu nhỏ, hoàn chỉnh với cổng làng, giếng nước và cây đa. Đặc biệt, các em tự sáng tác và biểu diễn một vở kịch ngắn mang tên "Ba chú mèo đi hội xuân" — câu chuyện vui nhộn về tình bạn và sự chia sẻ, khiến cả hội trường cười nghiêng ngả.</p>

<p>Cô Lê Thị Thanh Hương — Tổng phụ trách Đội — cho biết: <em>"Trại Xuân không chỉ là dịp vui chơi mà còn là cơ hội để các em được rèn luyện kỹ năng sống, hiểu thêm về phong tục tập quán ngày Tết. Năm nay các em tự chủ và sáng tạo hơn rất nhiều so với năm trước."</em></p>

<p>Kết thúc Trại Xuân, Team "Tên Trộm 3" xuất sắc giành giải Nhất toàn đoàn với tổng điểm cao nhất ở cả 5 phần thi. Mỗi thành viên được nhận phần thưởng là bộ sách hay và huy hiệu "Doner xuất sắc Trại Xuân 2026".</p>
`.trim(),
  },
  {
    title: 'Chuyến dã ngoại Ba Vì cho học sinh khối 4-5',
    slug: 'chuyen-da-ngoai-ba-vi-hoc-sinh-khoi-4-5',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-ngoaikhoa-5/800/500',
    publishedAt: '2026-03-08T08:00:00.000Z',
    excerpt:
      'Hơn 250 học sinh khối 4-5 có chuyến trải nghiệm một ngày tại Vườn Quốc gia Ba Vì với nhiều hoạt động giáo dục bổ ích.',
    content: `
<h2>Một ngày tuyệt vời tại Ba Vì</h2>
<p>Sáng thứ Bảy ngày 8 tháng 3, hơn 250 học sinh khối 4 và khối 5 trường Tiểu học Lê Quý Đôn đã khởi hành từ sân trường để đến Vườn Quốc gia Ba Vì — lá phổi xanh cách Hà Nội khoảng 60 km về phía Tây. Đây là chuyến dã ngoại kết hợp học tập thực địa thuộc chương trình "Trải nghiệm — Sáng tạo" của nhà trường trong năm học 2025-2026.</p>

<h2>Hành trình khám phá</h2>
<p>Đến nơi, các em được chia thành các nhóm nhỏ, mỗi nhóm có một giáo viên và một hướng dẫn viên của Vườn Quốc gia đi cùng. Lộ trình bao gồm tham quan Vườn thực vật quốc gia với hơn 1.000 loài cây, trong đó có nhiều loài quý hiếm được ghi trong Sách Đỏ Việt Nam. Các em được hướng dẫn nhận biết các loại cây thuốc nam truyền thống, cách phân biệt cây lá rộng và cây lá kim.</p>

<h3>Hoạt động nhóm và trò chơi</h3>
<p>Buổi trưa, sau khi picnic dưới tán rừng thông, các nhóm tham gia cuộc thi "Nhà thám hiểm nhí" — một chuỗi thử thách bao gồm đọc bản đồ, xác định phương hướng bằng la bàn, nhận biết dấu vết động vật và thu thập mẫu lá cây. Nhóm "Đại Bàng Xanh" của lớp 5A2 đã giành chiến thắng chung cuộc với khả năng phối hợp nhịp nhàng và kiến thức tự nhiên vượt trội.</p>

<p>Em Trần Khánh Linh — học sinh lớp 4A1 — phấn khởi nói: <em>"Con thích nhất là được nhìn thấy cây Pơ-mu nghìn năm tuổi. Cây to lắm, mấy bạn nắm tay nhau mới ôm hết thân cây. Con sẽ viết bài văn kể về cây này cho cô giáo."</em></p>

<p>Phụ huynh em Đặng Minh Khôi (lớp 5A4) gửi lời cảm ơn: <em>"Chuyến đi rất ý nghĩa, cháu về nhà kể suốt cả tuần. Cháu còn tự tra cứu thêm về các loài cây đã gặp, điều mà trước đây chưa bao giờ thấy cháu chủ động làm."</em> Ban Giám hiệu nhà trường dự kiến sẽ tổ chức thêm chuyến dã ngoại tại Cúc Phương cho khối 3 vào tháng 4.</p>
`.trim(),
  },
  {
    title: 'CLB Robotics giành giải Nhất cuộc thi STEM cấp Thành phố',
    slug: 'clb-robotics-gianh-giai-nhat-stem-cap-thanh-pho',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-ngoaikhoa-6/800/500',
    publishedAt: '2026-03-22T08:00:00.000Z',
    excerpt:
      'Đội tuyển Robotics trường Lê Quý Đôn xuất sắc giành giải Nhất cuộc thi STEM cấp Thành phố Hà Nội năm 2026.',
    content: `
<h2>Chiến thắng xứng đáng</h2>
<p>Ngày 22 tháng 3 năm 2026, đội tuyển CLB Robotics trường Tiểu học Lê Quý Đôn đã xuất sắc giành giải Nhất tại cuộc thi "STEM Challenge Hà Nội 2026" dành cho bậc Tiểu học, được tổ chức tại Cung Thiếu nhi Hà Nội với sự tham gia của 48 đội tuyển đến từ 35 trường trên toàn thành phố.</p>

<h2>Đội tuyển và sản phẩm dự thi</h2>
<p>Đội tuyển gồm 6 thành viên: Nguyễn Minh Anh, Phạm Đức Huy, Lê Thảo Nguyên, Trần Bảo Long, Vũ Khánh Chi và Đỗ Quang Minh — đều là học sinh lớp 4 và lớp 5. Sản phẩm dự thi mang tên "AquaGuard" — một hệ thống tưới cây tự động sử dụng cảm biến độ ẩm đất, được lập trình trên nền tảng Arduino và điều khiển qua ứng dụng di động do các em tự thiết kế.</p>

<h3>Hành trình chuẩn bị</h3>
<p>Dưới sự hướng dẫn tận tình của thầy Hoàng Đình Nam — giáo viên phụ trách CLB Robotics, các em đã dành hơn 3 tháng nghiên cứu, thiết kế và hoàn thiện sản phẩm. Quá trình không hề dễ dàng: đội đã phải thay đổi thiết kế 4 lần, xử lý hàng chục lỗi lập trình và thử nghiệm liên tục trên vườn rau của trường trước khi hoàn thiện phiên bản cuối cùng.</p>

<p>Em Nguyễn Minh Anh — đội trưởng — chia sẻ: <em>"Phần khó nhất là làm cho cảm biến đo chính xác trong mọi điều kiện thời tiết. Chúng em đã thất bại rất nhiều lần nhưng không bỏ cuộc. Khi nghe thông báo đạt giải Nhất, cả đội ôm nhau khóc vì vui quá."</em></p>

<p>Ban giám khảo đánh giá cao tính thực tiễn, khả năng trình bày rõ ràng và tinh thần đồng đội của nhóm. Đặc biệt, phần thuyết trình hoàn toàn bằng tiếng Anh của đội đã gây ấn tượng mạnh. AquaGuard hiện đang được lắp đặt tại vườn rau sạch của trường và sẽ được nhân rộng cho các trường bạn quan tâm. Đội tuyển sẽ đại diện Hà Nội tham dự vòng thi cấp Quốc gia tại Đà Nẵng vào tháng 5.</p>
`.trim(),
  },
  {
    title: 'Chương trình trao đổi học sinh với PLC Sydney',
    slug: 'chuong-trinh-trao-doi-hoc-sinh-plc-sydney',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-ngoaikhoa-7/800/500',
    publishedAt: '2026-04-01T08:00:00.000Z',
    excerpt:
      'Lần đầu tiên trường Lê Quý Đôn triển khai chương trình trao đổi học sinh quốc tế với trường PLC Sydney, Australia.',
    content: `
<h2>Cầu nối hữu nghị Việt — Úc</h2>
<p>Từ ngày 1 đến ngày 7 tháng 4 năm 2026, trường Tiểu học Lê Quý Đôn đã vinh dự đón tiếp đoàn 15 học sinh và 4 giáo viên từ trường Presbyterian Ladies' College (PLC) Sydney, Australia trong khuôn khổ chương trình trao đổi học sinh quốc tế đầu tiên của nhà trường. Đồng thời, 12 học sinh lớp 5 của trường Lê Quý Đôn cũng đã được chọn để sang thăm PLC Sydney vào tháng 6 tới.</p>

<h2>Tuần lễ trải nghiệm đa văn hóa</h2>
<p>Trong suốt 7 ngày, các bạn học sinh Australia đã được tham gia trực tiếp vào các tiết học cùng học sinh Lê Quý Đôn, từ môn Toán, Tiếng Việt cho đến Mỹ thuật và Thể dục. Điều đặc biệt là các bạn PLC Sydney tỏ ra rất hứng thú với tiết học Tiếng Việt — các em háo hức tập phát âm các thanh điệu và học viết chữ Việt bằng bút lông.</p>

<h3>Hoạt động giao lưu văn hóa</h3>
<p>Chương trình còn bao gồm nhiều hoạt động giao lưu ý nghĩa: buổi "Culture Show" nơi hai nhóm học sinh trình diễn các tiết mục văn nghệ đặc trưng của mỗi quốc gia, workshop nấu phở và làm bánh lamington, tham quan Văn Miếu — Quốc Tử Giám và phố cổ Hà Nội. Đặc biệt, dự án "Friendship Mural" — bức tranh tường chung do học sinh hai trường cùng vẽ tại sảnh chính — đã trở thành biểu tượng đẹp cho tình hữu nghị giữa hai ngôi trường.</p>

<p>Cô Sarah Thompson — trưởng đoàn PLC Sydney — xúc động chia sẻ: <em>"Chúng tôi ấn tượng sâu sắc với sự hiếu khách và thân thiện của thầy trò trường Lê Quý Đôn. Các em học sinh Việt Nam rất thông minh, năng động và có khả năng giao tiếp tiếng Anh tốt hơn chúng tôi kỳ vọng rất nhiều."</em></p>

<p>Em Lily Chen — học sinh lớp 5 PLC Sydney — viết trong nhật ký: <em>"Việt Nam đẹp hơn tôi tưởng rất nhiều. Tôi đã có thêm nhiều người bạn mới tuyệt vời. Tôi hứa sẽ quay lại."</em> Chương trình trao đổi sẽ được tổ chức thường niên, luân phiên giữa hai trường, nhằm thúc đẩy sự hiểu biết và tình hữu nghị quốc tế từ thuở nhỏ.</p>
`.trim(),
  },
  {
    title: 'Hội khỏe Phù Đổng cấp trường 2026',
    slug: 'hoi-khoe-phu-dong-cap-truong-2026',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-ngoaikhoa-8/800/500',
    publishedAt: '2026-04-05T08:00:00.000Z',
    excerpt:
      'Hội khỏe Phù Đổng cấp trường 2026 với sự tham gia của toàn bộ học sinh, thi đấu 12 môn thể thao trong 3 ngày sôi động.',
    content: `
<h2>Ngày hội thể thao lớn nhất năm</h2>
<p>Từ ngày 5 đến ngày 7 tháng 4 năm 2026, trường Tiểu học Lê Quý Đôn đã long trọng tổ chức Hội khỏe Phù Đổng cấp trường — sự kiện thể thao thường niên lớn nhất và được mong đợi nhất trong năm học. Với sự tham gia của toàn bộ hơn 1.200 học sinh từ khối 1 đến khối 5, Hội khỏe năm nay thi đấu 12 môn thể thao, vượt xa quy mô 8 môn của năm ngoái.</p>

<h2>Các nội dung thi đấu</h2>
<p>Chương trình thi đấu được thiết kế phù hợp với từng độ tuổi: Khối 1-2 tham gia các môn vận động vui như chạy tiếp sức, nhảy bao bố và kéo co. Khối 3-4 tranh tài ở các môn cầu lông, bóng bàn, cờ vua và nhảy dây. Khối 5 thi đấu chính thức các môn điền kinh (chạy 60m, chạy 200m, nhảy xa), bóng đá mini, bóng rổ và bơi lội.</p>

<h3>Những khoảnh khắc đáng nhớ</h3>
<p>Hội khỏe năm nay chứng kiến nhiều kỷ lục mới được thiết lập. Em Nguyễn Hoàng Phúc (lớp 5A3) phá kỷ lục chạy 60m với thành tích 8,2 giây, cải thiện 0,3 giây so với kỷ lục cũ tồn tại suốt 5 năm. Đội bóng đá mini khối 5 mang đến trận chung kết kịch tính giữa 5A1 và 5A4, kết thúc với tỷ số 3-2 sau hiệp phụ, khiến khán đài sôi sục cổ vũ.</p>

<p>Đặc biệt, nội dung kéo co của khối 2 thu hút đông đảo phụ huynh đến cổ vũ nhất. Lớp 2A3 với chiến thuật "neo vững — kéo đều" do chính các em tự nghĩ ra đã đánh bại tất cả các đối thủ để giành chức vô địch, bất chấp việc không phải là lớp có nhiều bạn "to con" nhất.</p>

<p>Thầy Phạm Quốc Tuấn — Tổ trưởng Tổ Thể dục — nhận xét: <em>"Hội khỏe Phù Đổng không chỉ là sân chơi thể thao mà còn là nơi các em học cách thi đấu fair-play, biết chấp nhận thắng thua và cổ vũ cho bạn bè. Tinh thần thể thao của các em năm nay thật sự đáng tự hào."</em></p>

<p>Lễ tổng kết và trao giải diễn ra chiều ngày 7/4 với nhiều phần thưởng giá trị. Khối 5A3 giành ngôi Nhất toàn đoàn, tiếp theo là 4A2 và 3A1. Các vận động viên xuất sắc sẽ được chọn vào đội tuyển trường để tham dự Hội khỏe Phù Đổng cấp Quận vào tháng 5 tới.</p>
`.trim(),
  },
];

/**
 * Seed 8 bai viet ngoai khoa vao category "Hoat dong ngoai khoa"
 * Tim category theo slug, neu khong co thi tao moi
 */
export default async function seedArticlesNgoaiKhoa() {
  console.log('\n=== Seed Articles: Hoạt động ngoại khóa ===\n');

  // Tim category "Hoat dong ngoai khoa"
  let categoryId: string | null = null;

  const catRes = await apiGet('/categories');
  const categories: Category[] = catRes.data || catRes;

  const found = categories.find(
    (c: Category) =>
      c.slug === 'ngoai-khoa' ||
      c.slug === 'hoat-dong-ngoai-khoa' ||
      c.name === 'Hoạt động ngoại khóa',
  );

  if (found) {
    categoryId = found.id;
    console.log(`Category found: ${found.name} (${found.id})`);
  } else {
    // Tao category moi neu chua co
    console.log('Category not found, creating...');
    const newCat = await apiPost('/categories', {
      name: 'Hoạt động ngoại khóa',
      slug: 'ngoai-khoa',
      description: 'Các hoạt động ngoại khóa, dã ngoại, câu lạc bộ của trường',
      displayOrder: 5,
      status: 'active',
    });
    categoryId = newCat.id || newCat.data?.id;
    console.log(`Category created: ${categoryId}`);
  }

  // Tao 8 bai viet
  let success = 0;
  for (const article of articles) {
    const payload = {
      ...article,
      categoryId: categoryId,
      status: 'published',
    };

    const res = await apiPost('/articles', payload);
    if (res.id || res.data?.id) {
      success++;
      console.log(`  ✓ ${article.title}`);
    } else {
      console.error(`  ✗ ${article.title}:`, res.message || 'Unknown error');
    }
  }

  console.log(`\nDone: ${success}/${articles.length} articles created.\n`);
}
