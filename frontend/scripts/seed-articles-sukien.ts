/**
 * Seed 10 bai viet cho chuyen muc "Tin tuc - Su kien"
 * Noi dung truong tieu hoc Le Quy Don Ha Noi
 */
import { apiPost, apiGet } from './seed-helpers';

const articles = [
  {
    title: 'Thư ngỏ V/v Đảm bảo an toàn thực phẩm tại Nhà trường',
    publishedAt: '2026-01-08',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-1/800/500',
    excerpt:
      'Ban Giám hiệu Trường Tiểu học Lê Quý Đôn gửi thư ngỏ tới toàn thể phụ huynh về công tác đảm bảo an toàn vệ sinh thực phẩm trong bếp ăn bán trú.',
    content: `
<h2>Kính gửi Quý Phụ huynh học sinh Trường Tiểu học Lê Quý Đôn</h2>
<p>Nhằm đảm bảo sức khỏe và sự phát triển toàn diện của các em học sinh, Ban Giám hiệu Trường Tiểu học Lê Quý Đôn xin gửi đến Quý Phụ huynh bức thư ngỏ về công tác an toàn vệ sinh thực phẩm tại bếp ăn bán trú của Nhà trường. Đây là vấn đề luôn được Nhà trường đặt lên hàng đầu trong suốt quá trình hoạt động.</p>
<h2>Các biện pháp đảm bảo an toàn thực phẩm</h2>
<p>Nhà trường cam kết thực hiện nghiêm ngặt quy trình kiểm soát nguồn gốc thực phẩm đầu vào. Tất cả nguyên liệu được nhập từ các nhà cung cấp uy tín, có giấy chứng nhận an toàn thực phẩm và được kiểm tra hàng ngày trước khi đưa vào chế biến. Bếp ăn được trang bị hệ thống bảo quản lạnh hiện đại, đảm bảo thực phẩm luôn tươi ngon.</p>
<p>Đội ngũ nhân viên bếp được tập huấn định kỳ về quy trình vệ sinh an toàn thực phẩm theo tiêu chuẩn của Bộ Y tế. Mỗi bữa ăn đều được lưu mẫu trong 24 giờ để phục vụ công tác kiểm tra khi cần thiết. Nhà trường cũng phối hợp chặt chẽ với Trung tâm Y tế quận Ba Đình để thực hiện kiểm tra định kỳ hàng tháng.</p>
<h2>Vai trò của Phụ huynh trong giám sát</h2>
<p>Nhà trường trân trọng mời Quý Phụ huynh tham gia Ban đại diện cha mẹ học sinh giám sát bếp ăn. Các buổi kiểm tra đột xuất sẽ được tổ chức mỗi tuần với sự tham gia của đại diện phụ huynh từ các lớp. Mọi phản ánh, góp ý xin gửi về hòm thư góp ý hoặc liên hệ trực tiếp với văn phòng Nhà trường.</p>
<p>Ban Giám hiệu xin khẳng định: sức khỏe của học sinh là ưu tiên số một. Chúng tôi sẽ không ngừng nâng cao chất lượng bữa ăn bán trú để các em được phát triển khỏe mạnh, vui vẻ mỗi ngày đến trường.</p>
    `.trim(),
  },
  {
    title: 'Lễ kết nạp Đội Khối 3: Dấu mốc đáng nhớ của học sinh Lê Quý Đôn',
    publishedAt: '2026-01-15',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-2/800/500',
    excerpt:
      'Hơn 200 em học sinh khối 3 đã chính thức được kết nạp vào Đội Thiếu niên Tiền phong Hồ Chí Minh trong buổi lễ trang trọng tại Quảng trường Ba Đình.',
    content: `
<h2>Buổi lễ trang trọng tại Quảng trường Ba Đình lịch sử</h2>
<p>Sáng ngày 15 tháng 1 năm 2026, hơn 200 em học sinh khối 3 Trường Tiểu học Lê Quý Đôn đã vinh dự được kết nạp vào Đội Thiếu niên Tiền phong Hồ Chí Minh ngay tại Quảng trường Ba Đình — nơi Bác Hồ đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa. Đây là truyền thống tốt đẹp được Nhà trường duy trì nhiều năm qua.</p>
<p>Trong không khí trang nghiêm và xúc động, các em học sinh mặc đồng phục chỉnh tề, khăn quàng đỏ thắm trên vai, cùng hô vang lời hứa dưới cờ Đội. Nhiều em không giấu nổi niềm vui và tự hào khi chính thức trở thành đội viên Đội Thiếu niên Tiền phong Hồ Chí Minh.</p>
<h2>Ý nghĩa giáo dục sâu sắc</h2>
<p>Cô Nguyễn Thị Hồng Nhung — Hiệu trưởng Nhà trường chia sẻ: "Việc tổ chức Lễ kết nạp Đội tại Quảng trường Ba Đình không chỉ là một nghi lễ, mà còn là bài học lịch sử sinh động, giúp các em hiểu và trân trọng truyền thống cách mạng của dân tộc. Mỗi em đội viên từ hôm nay sẽ mang trên mình trách nhiệm học tập tốt, rèn luyện chăm."</p>
<h2>Phụ huynh xúc động chứng kiến con trưởng thành</h2>
<p>Rất nhiều phụ huynh đã đến tham dự buổi lễ cùng con em mình. Chị Trần Thu Hà, phụ huynh lớp 3A1, chia sẻ: "Nhìn con đứng nghiêm trang dưới cờ Tổ quốc, tôi thực sự xúc động. Cảm ơn Nhà trường đã tạo điều kiện cho các con có một buổi lễ ý nghĩa như thế này." Sau buổi lễ, các em đã cùng nhau viếng Lăng Bác và chụp ảnh lưu niệm, khép lại một ngày đầy cảm xúc và kỷ niệm đẹp.</p>
    `.trim(),
  },
  {
    title: 'Trường TH Lê Quý Đôn chủ động kiểm chứng nguồn thịt bàn trù',
    publishedAt: '2026-01-22',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-3/800/500',
    excerpt:
      'Nhà trường phối hợp cùng Ban đại diện phụ huynh thực hiện kiểm tra đột xuất nguồn gốc thịt lợn và thịt bò tại bếp ăn bán trú.',
    content: `
<h2>Kiểm tra đột xuất bếp ăn bán trú</h2>
<p>Ngày 22 tháng 1 năm 2026, Ban Giám hiệu Trường Tiểu học Lê Quý Đôn phối hợp cùng Ban đại diện cha mẹ học sinh đã tiến hành kiểm tra đột xuất nguồn gốc thịt lợn và thịt bò được sử dụng tại bếp ăn bán trú. Đây là hoạt động nằm trong chương trình giám sát an toàn thực phẩm thường xuyên của Nhà trường.</p>
<h2>Kết quả kiểm tra minh bạch</h2>
<p>Kết quả kiểm tra cho thấy 100% thịt lợn và thịt bò đều có nguồn gốc rõ ràng, đi kèm giấy chứng nhận kiểm dịch của cơ quan thú y có thẩm quyền. Nhà cung cấp thịt cho bếp ăn là Công ty TNHH Thực phẩm Sạch Hà Nội — đơn vị đã được cấp giấy chứng nhận VietGAP và có hợp đồng cung cấp dài hạn với nhiều trường học trên địa bàn quận Ba Đình.</p>
<p>Quy trình nhập thịt được thực hiện nghiêm ngặt: thịt được giao đến trường vào mỗi sáng sớm, bảo quản trong tủ lạnh công nghiệp ở nhiệt độ dưới 4°C. Nhân viên bếp kiểm tra màu sắc, mùi và giấy tờ kèm theo trước khi nhận hàng. Tất cả hóa đơn và chứng từ được lưu trữ đầy đủ để phục vụ công tác truy xuất nguồn gốc.</p>
<h2>Phụ huynh yên tâm và tin tưởng</h2>
<p>Bà Lê Minh Châu, đại diện Ban phụ huynh khối 2, nhận xét: "Tôi rất hài lòng khi chứng kiến quy trình kiểm soát thực phẩm chặt chẽ tại trường. Điều này giúp phụ huynh chúng tôi hoàn toàn yên tâm khi gửi con ăn bán trú." Nhà trường cho biết sẽ tiếp tục duy trì kiểm tra đột xuất mỗi tuần và công khai kết quả trên website để phụ huynh theo dõi.</p>
    `.trim(),
  },
  {
    title: 'Chào đón 20 năm thành lập Hệ thống Trường Liên cấp Lê Quý Đôn',
    publishedAt: '2026-02-10',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-4/800/500',
    excerpt:
      'Hệ thống Trường Liên cấp Lê Quý Đôn chính thức bước sang tuổi 20 với chuỗi sự kiện đặc biệt kỷ niệm chặng đường hai thập kỷ xây dựng và phát triển.',
    content: `
<h2>Hai thập kỷ ươm mầm tri thức</h2>
<p>Ngày 10 tháng 2 năm 2026, toàn thể cán bộ, giáo viên, nhân viên và học sinh Hệ thống Trường Liên cấp Lê Quý Đôn hân hoan chào đón mốc son 20 năm thành lập. Từ ngôi trường nhỏ với vài trăm học sinh ban đầu, Lê Quý Đôn ngày nay đã trở thành một trong những hệ thống giáo dục tư thục uy tín hàng đầu Hà Nội với hơn 3.000 học sinh từ bậc Mầm non đến Trung học Cơ sở.</p>
<p>Trong hai mươi năm qua, Nhà trường đã đào tạo hàng nghìn thế hệ học sinh, nhiều em đã đạt thành tích xuất sắc trong các kỳ thi cấp quận, cấp thành phố và quốc gia. Đặc biệt, chương trình giáo dục song ngữ và kỹ năng sống đã trở thành thương hiệu riêng của Lê Quý Đôn.</p>
<h2>Chuỗi sự kiện kỷ niệm đặc biệt</h2>
<p>Nhân dịp kỷ niệm 20 năm, Nhà trường tổ chức chuỗi sự kiện phong phú: Triển lãm ảnh "Hành trình 20 năm", Đêm Gala với sự tham gia của các thế hệ cựu học sinh, Hội thảo "Giáo dục cho tương lai" mời các chuyên gia giáo dục hàng đầu, và Ngày hội thể thao toàn trường. Điểm nhấn là lễ trồng cây kỷ niệm tại sân trường với sự tham gia của học sinh các khóa từ 2006 đến nay.</p>
<h2>Tầm nhìn cho thập kỷ tiếp theo</h2>
<p>Phát biểu tại buổi lễ, Nhà sáng lập Hệ thống chia sẻ: "20 năm là một chặng đường đáng tự hào, nhưng cũng chỉ là khởi đầu. Chúng tôi cam kết tiếp tục đầu tư vào cơ sở vật chất, chương trình đào tạo và đội ngũ giáo viên để mang đến môi trường giáo dục tốt nhất cho các em." Nhà trường đặt mục tiêu đến năm 2030 sẽ mở rộng thêm cơ sở mới và triển khai chương trình giáo dục STEM toàn diện.</p>
    `.trim(),
  },
  {
    title: 'Lễ khai giảng năm học 2025-2026 đầy ấn tượng',
    publishedAt: '2026-02-20',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-5/800/500',
    excerpt:
      'Trường Tiểu học Lê Quý Đôn tổ chức lễ khai giảng năm học mới 2025-2026 với chủ đề "Vươn tới những ước mơ" đầy sáng tạo và ấn tượng.',
    content: `
<h2>Ngày hội "Vươn tới những ước mơ"</h2>
<p>Sáng ngày 5 tháng 9 năm 2025, sân trường Tiểu học Lê Quý Đôn tràn ngập sắc màu và niềm vui trong ngày khai giảng năm học 2025-2026. Với chủ đề "Vươn tới những ước mơ", buổi lễ được tổ chức sinh động với nhiều tiết mục văn nghệ đặc sắc do chính các em học sinh thể hiện, mang đến không khí hân hoan cho ngày đầu tiên của năm học mới.</p>
<h2>Chào đón gần 500 học sinh lớp 1</h2>
<p>Năm học 2025-2026, Nhà trường đón chào gần 500 em học sinh lớp 1 — những "công dân nhí" chính thức bước vào hành trình học tập. Các anh chị lớp 5 đã tặng hoa và dẫn các em nhỏ vào lớp trong một nghi thức ấm áp và đầy ý nghĩa. Nhiều em lớp 1 tỏ ra háo hức, mắt sáng ngời khi lần đầu tiên bước vào ngôi trường mới rộng rãi và khang trang.</p>
<p>Đại diện phụ huynh học sinh lớp 1 — anh Nguyễn Văn Dũng chia sẻ: "Gia đình tôi rất ấn tượng với cách Nhà trường chào đón các con. Buổi lễ không chỉ trang trọng mà còn gần gũi, giúp các con không bỡ ngỡ mà ngược lại rất phấn khích."</p>
<h2>Nhiều điểm mới trong năm học</h2>
<p>Năm học 2025-2026 đánh dấu nhiều đổi mới quan trọng: Nhà trường triển khai chương trình tiếng Anh tăng cường với giáo viên bản ngữ cho toàn bộ khối lớp, mở thêm các câu lạc bộ Robotics và Coding cho học sinh khối 3-5, nâng cấp thư viện với hơn 5.000 đầu sách mới, và áp dụng hệ thống quản lý học tập trực tuyến để phụ huynh dễ dàng theo dõi tiến trình học tập của con em mình.</p>
    `.trim(),
  },
  {
    title: 'Hội thao mùa xuân 2026 — Ngày hội của tình thân',
    publishedAt: '2026-02-28',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-6/800/500',
    excerpt:
      'Hội thao mùa xuân 2026 với chủ đề "Ngày hội của tình thân" quy tụ hơn 2.000 học sinh và phụ huynh trong ngày hội thể thao sôi động.',
    content: `
<h2>Sân trường rộn ràng sắc xuân</h2>
<p>Ngày 28 tháng 2 năm 2026, sân trường Tiểu học Lê Quý Đôn rộn ràng trong không khí lễ hội với Hội thao mùa xuân mang chủ đề "Ngày hội của tình thân". Hơn 2.000 học sinh cùng phụ huynh đã có mặt từ sớm, ai cũng háo hức và tràn đầy năng lượng cho một ngày hội thể thao đặc biệt.</p>
<h2>Các nội dung thi đấu đa dạng</h2>
<p>Hội thao năm nay bao gồm nhiều nội dung thi đấu phù hợp với từng lứa tuổi: chạy tiếp sức, nhảy bao bố, kéo co, bóng rổ mini, và đặc biệt là phần thi "Gia đình năng động" — nơi bố mẹ và con cái cùng phối hợp vượt qua các thử thách vận động. Đây là nội dung được mong chờ nhất, tạo nên những khoảnh khắc vui vẻ và gắn kết giữa các thành viên trong gia đình.</p>
<p>Khối 4 và khối 5 còn có thêm phần thi bóng đá mini và cầu lông với sự cổ vũ cuồng nhiệt từ các cổ động viên nhí. Lớp 5A3 đã giành chức vô địch bóng đá mini sau trận chung kết nghẹt thở với lớp 5A1, trong khi đội kéo co của khối 3 khiến khán giả không ngừng hò reo cổ vũ.</p>
<h2>Kết nối gia đình và nhà trường</h2>
<p>Thầy Phạm Đức Minh — Phó Hiệu trưởng phụ trách hoạt động ngoại khóa cho biết: "Hội thao mùa xuân không chỉ là dịp để các em rèn luyện thể chất mà quan trọng hơn là tạo sân chơi gắn kết gia đình với nhà trường. Nhìn các bậc phụ huynh cùng con chạy nhảy, cười đùa trên sân — đó mới chính là thành công lớn nhất của ngày hội." Hội thao khép lại với lễ trao giải và bữa tiệc ngoài trời ấm cúng.</p>
    `.trim(),
  },
  {
    title: 'Ngày hội sách Lê Quý Đôn lần thứ 5',
    publishedAt: '2026-03-10',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-7/800/500',
    excerpt:
      'Ngày hội sách lần thứ 5 với chủ đề "Sách — Người bạn đồng hành" thu hút hơn 1.500 lượt tham gia, quyên góp được hơn 3.000 cuốn sách.',
    content: `
<h2>Sách — Người bạn đồng hành</h2>
<p>Ngày 10 tháng 3 năm 2026, Trường Tiểu học Lê Quý Đôn tổ chức Ngày hội sách lần thứ 5 với chủ đề ý nghĩa "Sách — Người bạn đồng hành". Sự kiện diễn ra trong không gian sân trường được trang trí sinh động với các gian hàng sách đầy màu sắc, thu hút sự tham gia nhiệt tình của toàn thể học sinh, giáo viên và phụ huynh.</p>
<h2>Phong phú hoạt động trải nghiệm</h2>
<p>Ngày hội sách năm nay không chỉ có hoạt động trao đổi sách cũ mà còn nhiều hoạt động trải nghiệm hấp dẫn: cuộc thi vẽ bìa sách sáng tạo, kể chuyện theo sách cho khối 1-2, viết cảm nhận sách cho khối 3-5, và workshop làm bookmark handmade. Đặc biệt, Nhà trường mời tác giả Nguyễn Nhật Ánh — người viết bộ truyện "Kính vạn hoa" được các em yêu thích — đến giao lưu và ký tặng sách.</p>
<p>Bên cạnh đó, chương trình "Tủ sách nhân ái" tiếp tục được phát động, kêu gọi học sinh và phụ huynh quyên góp sách cho các trường tiểu học vùng khó khăn. Năm nay, chương trình thu được hơn 3.000 cuốn sách — con số kỷ lục kể từ khi Ngày hội sách được tổ chức lần đầu.</p>
<h2>Nuôi dưỡng văn hóa đọc</h2>
<p>Cô Vũ Thị Lan Anh — Phụ trách thư viện Nhà trường chia sẻ: "Qua 5 năm tổ chức, Ngày hội sách đã thực sự trở thành sự kiện được mong chờ nhất trong năm. Số lượng sách các em mượn đọc tại thư viện đã tăng 40% so với năm đầu tiên tổ chức. Đọc sách giờ đây đã trở thành thói quen hàng ngày của rất nhiều em học sinh Lê Quý Đôn."</p>
    `.trim(),
  },
  {
    title: 'Tổng kết học kỳ I năm học 2025-2026',
    publishedAt: '2026-03-18',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-8/800/500',
    excerpt:
      'Trường Tiểu học Lê Quý Đôn tổ chức lễ tổng kết học kỳ I, ghi nhận kết quả học tập và rèn luyện ấn tượng của hơn 2.500 học sinh.',
    content: `
<h2>Một học kỳ đầy nỗ lực</h2>
<p>Chiều ngày 18 tháng 1 năm 2026, Trường Tiểu học Lê Quý Đôn tổ chức buổi lễ tổng kết học kỳ I năm học 2025-2026 tại Hội trường lớn của Nhà trường. Với sự tham dự của toàn thể giáo viên, đại diện phụ huynh và học sinh các khối lớp, buổi lễ là dịp nhìn lại những thành quả đáng tự hào sau một học kỳ đầy nỗ lực.</p>
<h2>Kết quả học tập và rèn luyện nổi bật</h2>
<p>Theo báo cáo tổng kết, học kỳ I ghi nhận nhiều kết quả ấn tượng: 95% học sinh đạt mức "Hoàn thành tốt" trở lên trong đánh giá cuối kỳ, 45 em đạt giải trong các kỳ thi Olympic cấp quận môn Toán và tiếng Anh, 12 em đạt chứng chỉ Cambridge Movers và Flyers. Đội tuyển Robotics của trường lần đầu giành Huy chương Bạc tại cuộc thi STEM cấp thành phố.</p>
<p>Về hoạt động ngoại khóa, Nhà trường đã tổ chức thành công 15 chuyến tham quan trải nghiệm, 8 buổi workshop kỹ năng sống, và 3 chương trình giao lưu với trường bạn. Câu lạc bộ Tiếng Anh và Câu lạc bộ Sách hoạt động đều đặn mỗi tuần với tỷ lệ tham gia đạt 80%.</p>
<h2>Khen thưởng và phương hướng học kỳ II</h2>
<p>Tại buổi lễ, Nhà trường đã trao 150 giấy khen cho học sinh xuất sắc toàn diện, 50 phần thưởng cho học sinh có tiến bộ vượt bậc, và 20 suất học bổng khuyến học cho học sinh có hoàn cảnh khó khăn nhưng nỗ lực vươn lên. Cô Hiệu trưởng cũng chia sẻ phương hướng học kỳ II với trọng tâm là chuẩn bị cho kỳ thi cuối năm, tăng cường hoạt động STEM và mở rộng chương trình tiếng Anh tăng cường.</p>
    `.trim(),
  },
  {
    title: 'Lễ trao giải học sinh xuất sắc cấp Thành phố',
    publishedAt: '2026-03-28',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-9/800/500',
    excerpt:
      '15 học sinh Lê Quý Đôn được vinh danh tại Lễ trao giải học sinh xuất sắc cấp Thành phố Hà Nội năm học 2025-2026.',
    content: `
<h2>Niềm tự hào của Lê Quý Đôn tại đấu trường Thành phố</h2>
<p>Ngày 28 tháng 3 năm 2026, 15 em học sinh Trường Tiểu học Lê Quý Đôn đã vinh dự được nhận giải thưởng học sinh xuất sắc cấp Thành phố Hà Nội trong buổi lễ trang trọng tại Cung Văn hóa Hữu nghị Việt Xô. Đây là con số kỷ lục của Nhà trường, tăng 5 em so với năm học trước, khẳng định chất lượng giáo dục ngày càng được nâng cao.</p>
<h2>Thành tích ở nhiều lĩnh vực</h2>
<p>Trong số 15 em được vinh danh, có 6 em đạt giải môn Toán (2 giải Nhì, 4 giải Ba), 5 em đạt giải tiếng Anh (1 giải Nhất, 2 giải Nhì, 2 giải Ba), 2 em đạt giải Tin học (1 giải Nhì, 1 giải Ba), và 2 em đạt giải Khoa học Tự nhiên. Đặc biệt, em Nguyễn Minh Anh lớp 5A2 xuất sắc giành giải Nhất tiếng Anh cấp Thành phố với số điểm gần tuyệt đối.</p>
<p>Các thầy cô giáo trực tiếp bồi dưỡng đội tuyển cũng được Sở Giáo dục và Đào tạo Hà Nội tặng bằng khen vì có thành tích xuất sắc trong công tác bồi dưỡng học sinh giỏi. Cô Trần Thị Mai — giáo viên bồi dưỡng đội tuyển Toán xúc động chia sẻ: "Thành tích này là kết quả của sự nỗ lực không ngừng từ các em, sự đồng hành của gia đình và sự hỗ trợ tuyệt vời từ Nhà trường."</p>
<h2>Đón các em trở về trong vinh quang</h2>
<p>Chiều cùng ngày, Nhà trường tổ chức buổi đón tiếp các em học sinh đạt giải. Toàn trường vỗ tay chào đón, các bạn nhỏ tặng hoa và biểu diễn tiết mục chúc mừng. Ban Giám hiệu trao phần thưởng bổ sung và tuyên dương tinh thần học tập gương mẫu. Nhiều phụ huynh cho biết sẽ tiếp tục đồng hành và động viên con em theo đuổi đam mê học tập.</p>
    `.trim(),
  },
  {
    title: 'Đêm nhạc Sắc màu tuổi thơ chào mừng 20/11',
    publishedAt: '2026-04-05',
    thumbnailUrl: 'https://picsum.photos/seed/lqd-sukien-10/800/500',
    excerpt:
      'Đêm nhạc "Sắc màu tuổi thơ" chào mừng Ngày Nhà giáo Việt Nam 20/11 với hơn 30 tiết mục văn nghệ đặc sắc từ học sinh toàn trường.',
    content: `
<h2>Đêm nhạc rực rỡ sắc màu</h2>
<p>Tối ngày 19 tháng 11 năm 2025, sân khấu ngoài trời của Trường Tiểu học Lê Quý Đôn bừng sáng với đêm nhạc "Sắc màu tuổi thơ" — chương trình văn nghệ đặc biệt chào mừng Ngày Nhà giáo Việt Nam 20/11. Hơn 30 tiết mục được dàn dựng công phu bởi chính các em học sinh, mang đến một đêm diễn đầy cảm xúc và niềm tự hào cho toàn trường.</p>
<h2>Những tiết mục để đời</h2>
<p>Chương trình mở đầu bằng màn hợp xướng "Bụi phấn" do 100 em học sinh khối 4 thể hiện, khiến nhiều thầy cô giáo không kìm được nước mắt. Tiếp đó là các tiết mục múa đương đại, nhạc kịch "Lớp học thần tiên" của khối 3, hòa tấu đàn organ và violin của Câu lạc bộ Âm nhạc, và đặc biệt là vở kịch ngắn "Cô giáo em" — tái hiện những khoảnh khắc xúc động nhất trong đời giáo viên.</p>
<p>Tiết mục gây ấn tượng mạnh nhất đêm diễn là phần trình diễn beatbox kết hợp nhảy hiện đại của nhóm học sinh lớp 5A4, nhận được tràng pháo tay không dứt từ khán giả. Bên cạnh đó, phần trình chiếu video "Cảm ơn thầy cô" với những hình ảnh, lời nhắn nhủ từ học sinh các thế hệ đã tạo nên khoảnh khắc xúc động nhất trong đêm.</p>
<h2>Lời tri ân từ trái tim</h2>
<p>Kết thúc đêm nhạc, đại diện học sinh các khối lớp lên tặng hoa và đọc thư cảm ơn gửi đến toàn thể thầy cô giáo. Em Phạm Gia Hân — lớp 5A1, Liên đội trưởng nghẹn ngào: "Chúng con cảm ơn các thầy cô đã yêu thương và dạy dỗ chúng con mỗi ngày. Đêm nhạc này là món quà nhỏ từ trái tim của chúng con." Cô Hiệu trưởng xúc động chia sẻ đây là một trong những đêm nhạc thành công nhất từ trước đến nay, và cảm ơn tổ Âm nhạc cùng các em học sinh đã cống hiến hết mình.</p>
    `.trim(),
  },
];

export default async function seedArticlesSuKien() {
  console.log('\n--- Seed: Tin tức - Sự kiện (10 bài) ---');

  // Lay danh sach category, tim "su-kien"
  const catRes = await apiGet('/categories');
  const categories = catRes.data || catRes;
  const suKienCat = Array.isArray(categories)
    ? categories.find(
        (c: any) => c.slug === 'su-kien' || c.slug === 'tin-tuc-su-kien',
      )
    : null;

  if (!suKienCat) {
    console.error('  Khong tim thay category "su-kien". Danh sach:', categories);
    return;
  }

  console.log(`  Category: ${suKienCat.name} (id=${suKienCat.id})`);

  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const res = await apiPost('/articles', {
      title: a.title,
      content: a.content,
      excerpt: a.excerpt,
      status: 'published',
      publishedAt: a.publishedAt,
      thumbnailUrl: a.thumbnailUrl,
      categoryId: suKienCat.id,
    });
    if (res.id || res.data?.id) {
      console.log(`  [${i + 1}] OK — ${a.title}`);
    } else {
      console.log(`  [${i + 1}] FAIL — ${a.title}: ${res.message || JSON.stringify(res)}`);
    }
  }

  console.log('--- Done: Tin tức - Sự kiện ---\n');
}
