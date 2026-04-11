// Chay: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-events.ts
// Hoac them vao package.json scripts: "seed:events": "ts-node -r tsconfig-paths/register src/database/seeds/seed-events.ts"

import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Event, EventStatus } from '../../modules/events/entities/event.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed su kien (Events) cho website truong tieu hoc Le Quy Don.
 * Idempotent — kiem tra title truoc khi insert.
 * Tong: 25 events (8 PAST + 5 ONGOING + 12 UPCOMING).
 */

interface EventData {
  title: string;
  description: string;
  image_url: string | null;
  start_date: Date;
  end_date: Date | null;
  location: string | null;
  link_url: string | null;
  status: EventStatus;
}

const eventsData: EventData[] = [
  // ═══════════════════════════════════════════════════
  // PAST events (8) — da dien ra trong nam 2025-2026
  // ═══════════════════════════════════════════════════
  {
    title: 'Lễ khai giảng năm học 2025-2026',
    description:
      'Lễ khai giảng năm học 2025-2026 diễn ra trang trọng trên sân trường với sự tham dự của toàn thể thầy cô, học sinh và phụ huynh. Buổi lễ mở đầu bằng nghi thức chào cờ và hát Quốc ca, tiếp theo là các bài phát biểu của Ban Giám hiệu và đại diện cha mẹ học sinh. Đây là thời khắc đặc biệt đánh dấu năm học mới, chào đón các em học sinh lớp 1 lần đầu bước chân vào mái trường thân yêu. Hoạt động khai giảng kết thúc bằng màn biểu diễn văn nghệ sôi động của các em học sinh các khối.',
    image_url: 'https://picsum.photos/seed/lqd-event-1/800/400',
    start_date: new Date('2025-09-05T07:30:00'),
    end_date: null,
    location: 'Sân trường',
    link_url: null,
    status: EventStatus.PAST,
  },
  {
    title: 'Tết Trung thu yêu thương',
    description:
      'Tết Trung thu năm 2025 được tổ chức với chủ đề "Yêu thương" nhằm gắn kết tình cảm thầy trò và lan tỏa niềm vui đến các em học sinh. Nhà trường trang hoàng rực rỡ với lồng đèn nhiều màu sắc, sân khấu trình diễn múa lân và khu vực trưng bày mâm cỗ Trung thu đặc sắc của từng lớp. Các em được tham gia làm đèn ông sao, bánh Trung thu truyền thống và biểu diễn văn nghệ chào mừng. Chương trình còn có hoạt động quyên góp quà tặng cho trẻ em có hoàn cảnh khó khăn tại các vùng nông thôn.',
    image_url: 'https://picsum.photos/seed/lqd-event-2/800/400',
    start_date: new Date('2025-09-29T15:00:00'),
    end_date: null,
    location: 'Sân trường',
    link_url: null,
    status: EventStatus.PAST,
  },
  {
    title: 'Ngày Nhà giáo Việt Nam 20/11',
    description:
      'Lễ kỷ niệm Ngày Nhà giáo Việt Nam 20/11 được tổ chức long trọng tại hội trường với chủ đề "Tri ân thầy cô — Tương lai tươi sáng". Học sinh các khối chuẩn bị những tiết mục văn nghệ ý nghĩa để tri ân công lao dạy dỗ của thầy cô giáo. Đại diện Hội Cha mẹ học sinh cũng gửi lời cảm ơn sâu sắc đến toàn thể đội ngũ nhà giáo của trường. Buổi lễ khép lại với khoảnh khắc học sinh tặng hoa và thiệp tự tay làm cho từng thầy cô, tạo nên những ký ức đẹp không thể quên.',
    image_url: 'https://picsum.photos/seed/lqd-event-3/800/400',
    start_date: new Date('2025-11-20T07:30:00'),
    end_date: null,
    location: 'Hội trường',
    link_url: null,
    status: EventStatus.PAST,
  },
  {
    title: 'Hội diễn văn nghệ mừng Tết',
    description:
      'Hội diễn văn nghệ chào đón Tết Nguyên đán Bính Ngọ 2026 là sự kiện nghệ thuật lớn nhất trong học kỳ 1, quy tụ hơn 500 tiết mục từ tất cả các lớp trong toàn trường. Chương trình bao gồm múa, hát, kịch ngắn, hòa tấu nhạc cụ truyền thống và các tiết mục ngâm thơ về mùa xuân và quê hương đất nước. Ban Giám khảo gồm các giáo viên âm nhạc và đại diện phụ huynh đánh giá và trao giải cho những tiết mục xuất sắc nhất. Hội diễn là cơ hội để các em phát huy năng khiếu nghệ thuật và tự tin trình diễn trước đông đảo khán giả.',
    image_url: 'https://picsum.photos/seed/lqd-event-4/800/400',
    start_date: new Date('2026-01-15T08:00:00'),
    end_date: null,
    location: 'Hội trường',
    link_url: null,
    status: EventStatus.PAST,
  },
  {
    title: 'Hội khỏe Phù Đổng cấp trường',
    description:
      'Hội khỏe Phù Đổng cấp trường năm học 2025-2026 diễn ra sôi nổi với sự tham gia của hơn 800 vận động viên là học sinh từ khối 1 đến khối 5. Các em tranh tài ở nhiều môn thể thao như chạy, nhảy, bơi lội, đá cầu, cầu lông và bóng bàn trong không khí hào hứng và đoàn kết. Ban Tổ chức đã chuẩn bị chu đáo hệ thống đường đua, sân thi đấu và lực lượng y tế đảm bảo an toàn cho toàn bộ vận động viên. Kết quả xuất sắc tại hội thi này là cơ sở để nhà trường tuyển chọn đội tuyển tham dự Hội khỏe Phù Đổng cấp quận.',
    image_url: 'https://picsum.photos/seed/lqd-event-5/800/400',
    start_date: new Date('2025-12-20T07:00:00'),
    end_date: null,
    location: 'Sân thể thao',
    link_url: null,
    status: EventStatus.PAST,
  },
  {
    title: 'Olympic Toán học cấp quận',
    description:
      'Đoàn học sinh trường Tiểu học Lê Quý Đôn tham dự kỳ thi Olympic Toán học cấp quận với 35 thí sinh được tuyển chọn kỹ lưỡng từ các khối lớp 3, 4 và 5. Các em đã được bồi dưỡng chuyên sâu trong hai tháng trước kỳ thi với sự hỗ trợ tận tâm của đội ngũ giáo viên Toán giàu kinh nghiệm. Kết quả, đoàn đạt 8 giải Nhất, 12 giải Nhì và 15 giải Ba, khẳng định chất lượng giáo dục Toán học vượt trội của nhà trường. Nhà trường tự hào với thành tích này và cam kết tiếp tục đầu tư phát triển năng lực tư duy cho học sinh.',
    image_url: 'https://picsum.photos/seed/lqd-event-6/800/400',
    start_date: new Date('2026-01-10T07:30:00'),
    end_date: null,
    location: 'Phòng thi',
    link_url: null,
    status: EventStatus.PAST,
  },
  {
    title: 'Dã ngoại mùa xuân Sóc Sơn',
    description:
      'Chuyến dã ngoại mùa xuân đến Khu du lịch Sóc Sơn là hoạt động trải nghiệm thực tế thường niên được học sinh và phụ huynh mong chờ nhất trong học kỳ 2. Hơn 1.000 học sinh các khối cùng thầy cô và phụ huynh tham gia các hoạt động ngoài trời như đi bộ khám phá thiên nhiên, trồng cây, tìm hiểu hệ sinh thái rừng và tổ chức các trò chơi dân gian. Chuyến đi giúp các em gần gũi hơn với thiên nhiên, rèn luyện kỹ năng sinh tồn và tinh thần đồng đội sau những tháng học tập căng thẳng. Đây cũng là dịp để nhà trường lồng ghép giáo dục môi trường và ý thức bảo vệ rừng cho thế hệ trẻ.',
    image_url: 'https://picsum.photos/seed/lqd-event-7/800/400',
    start_date: new Date('2026-03-15T06:30:00'),
    end_date: null,
    location: 'Khu du lịch Sóc Sơn',
    link_url: null,
    status: EventStatus.PAST,
  },
  {
    title: 'Ngày hội Sách và Văn hóa đọc',
    description:
      'Ngày hội Sách và Văn hóa đọc được tổ chức tại thư viện nhà trường với chủ đề "Sách là cầu nối tri thức", nhằm khơi dậy niềm yêu thích đọc sách và xây dựng thói quen đọc lành mạnh cho học sinh. Các gian hàng trưng bày sách phong phú, buổi kể chuyện sinh động của các thầy cô và cuộc thi giới thiệu sách yêu thích thu hút sự tham gia nhiệt tình của hàng trăm em học sinh. Ban Tổ chức cũng phát động phong trào "Một cuốn sách — Một tấm lòng", kêu gọi học sinh quyên góp sách cũ còn giá trị để tặng cho thư viện các trường vùng sâu vùng xa. Sự kiện kết thúc với lễ trao giải cho những học sinh có thành tích đọc sách xuất sắc nhất trong năm học.',
    image_url: 'https://picsum.photos/seed/lqd-event-8/800/400',
    start_date: new Date('2026-03-20T08:00:00'),
    end_date: null,
    location: 'Thư viện',
    link_url: null,
    status: EventStatus.PAST,
  },

  // ═══════════════════════════════════════════════════
  // ONGOING events (5) — dang dien ra thang 4/2026
  // ═══════════════════════════════════════════════════
  {
    title: 'Tuần lễ STEM 2026',
    description:
      'Tuần lễ STEM 2026 là sự kiện giáo dục khoa học - công nghệ - kỹ thuật - toán học quy mô lớn, kéo dài một tuần với hơn 30 hoạt động thực hành đa dạng. Học sinh được tham gia chế tạo robot đơn giản, thí nghiệm khoa học, lập trình Scratch và xây dựng mô hình công trình kiến trúc bằng vật liệu tái chế. Các chuyên gia từ các công ty công nghệ hàng đầu Hà Nội đến chia sẻ kinh nghiệm và hướng dẫn trực tiếp cho học sinh trong các buổi workshop. Tuần lễ STEM là cơ hội để các em khám phá niềm đam mê với khoa học công nghệ và định hướng tương lai ngay từ khi còn ngồi trên ghế nhà trường.',
    image_url: 'https://picsum.photos/seed/lqd-event-9/800/400',
    start_date: new Date('2026-04-07T08:00:00'),
    end_date: new Date('2026-04-14T17:00:00'),
    location: 'Phòng STEM',
    link_url: null,
    status: EventStatus.ONGOING,
  },
  {
    title: 'Giải bóng đá mini liên lớp',
    description:
      'Giải bóng đá mini liên lớp năm 2026 quy tụ 20 đội bóng đến từ tất cả các lớp trong trường, tạo sân chơi thể thao lành mạnh và bồi dưỡng tinh thần fair-play cho học sinh. Các trận đấu diễn ra vào các buổi chiều sau giờ học, thu hút hàng trăm cổ động viên là học sinh và phụ huynh nhiệt tình cổ vũ. Ban Tổ chức áp dụng thể lệ thi đấu theo hình thức vòng tròn tính điểm trước khi bước vào vòng loại trực tiếp, đảm bảo tất cả các đội có nhiều cơ hội thi đấu. Đây là giải đấu truyền thống thường niên giúp phát hiện tài năng bóng đá trẻ và xây dựng tinh thần đoàn kết giữa các lớp.',
    image_url: 'https://picsum.photos/seed/lqd-event-10/800/400',
    start_date: new Date('2026-04-01T15:00:00'),
    end_date: new Date('2026-04-20T17:30:00'),
    location: 'Sân bóng',
    link_url: null,
    status: EventStatus.ONGOING,
  },
  {
    title: 'Triển lãm mỹ thuật "Sắc màu tuổi thơ"',
    description:
      'Triển lãm mỹ thuật "Sắc màu tuổi thơ" trưng bày hơn 300 tác phẩm hội họa, điêu khắc và thủ công mỹ nghệ của học sinh từ khối 1 đến khối 5, thể hiện thế giới quan trong sáng và đầy màu sắc của lứa tuổi tiểu học. Mỗi tác phẩm đều là kết quả của quá trình học tập và sáng tạo nghiêm túc trong các giờ Mỹ thuật, với chủ đề xoay quanh gia đình, thiên nhiên, quê hương và ước mơ. Phụ huynh và khách tham quan được mời đến chiêm ngưỡng và bình chọn cho những tác phẩm yêu thích, tạo động lực to lớn cho các em nhỏ nghệ sĩ tương lai. Triển lãm cũng là không gian kết nối giữa nhà trường, gia đình và cộng đồng trong việc nuôi dưỡng tài năng nghệ thuật cho thế hệ trẻ.',
    image_url: 'https://picsum.photos/seed/lqd-event-11/800/400',
    start_date: new Date('2026-04-05T08:00:00'),
    end_date: new Date('2026-04-15T17:00:00'),
    location: 'Phòng Mỹ thuật',
    link_url: null,
    status: EventStatus.ONGOING,
  },
  {
    title: 'Cuộc thi Tiếng Anh Cambridge',
    description:
      'Cuộc thi Tiếng Anh Cambridge dành cho học sinh khối 3, 4 và 5 được tổ chức với mục tiêu đánh giá năng lực ngoại ngữ theo chuẩn quốc tế Cambridge Young Learners. Hơn 250 học sinh tham dự các phần thi nghe, đọc, viết và nói trong không khí nghiêm túc nhưng thân thiện. Giáo viên nước ngoài từ Trung tâm Cambridge được mời phối hợp giám sát và đánh giá phần thi nói, đảm bảo tính khách quan và chuẩn mực quốc tế. Kết quả kỳ thi sẽ là cơ sở để nhà trường điều chỉnh chương trình dạy tiếng Anh và giúp phụ huynh theo dõi tiến bộ của con em.',
    image_url: 'https://picsum.photos/seed/lqd-event-12/800/400',
    start_date: new Date('2026-04-10T07:30:00'),
    end_date: new Date('2026-04-12T17:00:00'),
    location: 'Phòng Ngoại ngữ',
    link_url: null,
    status: EventStatus.ONGOING,
  },
  {
    title: 'Khám sức khỏe định kỳ HK2',
    description:
      'Chương trình khám sức khỏe định kỳ học kỳ 2 năm học 2025-2026 được tổ chức với sự phối hợp của Trung tâm Y tế quận và đội ngũ y tế nhà trường. Toàn bộ học sinh được khám tổng quát bao gồm đo chiều cao, cân nặng, kiểm tra thị lực, thính lực và khám răng miệng theo đúng quy định của Bộ Y tế và Bộ Giáo dục. Kết quả khám sức khỏe được ghi vào sổ theo dõi sức khỏe của từng em và thông báo kịp thời đến phụ huynh qua ứng dụng nhà trường. Những trường hợp cần theo dõi đặc biệt sẽ được tư vấn và chuyển tiếp đến cơ sở y tế phù hợp để được chăm sóc tốt nhất.',
    image_url: 'https://picsum.photos/seed/lqd-event-13/800/400',
    start_date: new Date('2026-04-08T07:30:00'),
    end_date: new Date('2026-04-18T11:30:00'),
    location: 'Phòng Y tế',
    link_url: null,
    status: EventStatus.ONGOING,
  },

  // ═══════════════════════════════════════════════════
  // UPCOMING events (12) — thang 5 den thang 12/2026
  // ═══════════════════════════════════════════════════
  {
    title: 'Ngày hội Gia đình 2026',
    description:
      'Ngày hội Gia đình 2026 là sự kiện gắn kết cộng đồng đặc biệt của trường Tiểu học Lê Quý Đôn, với chủ đề "Cùng nhau lớn lên" nhấn mạnh vai trò của gia đình trong sự phát triển toàn diện của trẻ. Phụ huynh và con em cùng tham gia các trạm trải nghiệm, trò chơi tập thể, cuộc thi tài năng gia đình và gian hàng ẩm thực do chính phụ huynh các lớp chuẩn bị. Nhà trường cũng tổ chức buổi hội thảo ngắn về phương pháp đồng hành cùng con trong học tập, mời các chuyên gia tâm lý giáo dục chia sẻ kinh nghiệm thực tiễn. Toàn bộ kinh phí tổ chức được đóng góp bởi Hội Cha mẹ học sinh nhà trường, thể hiện sự đoàn kết và gắn bó của cộng đồng trường Lê Quý Đôn.',
    image_url: 'https://picsum.photos/seed/lqd-event-14/800/400',
    start_date: new Date('2026-05-10T08:00:00'),
    end_date: null,
    location: 'Sân trường',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Lễ tổng kết năm học 2025-2026',
    description:
      'Lễ tổng kết năm học 2025-2026 là sự kiện khép lại một năm học đầy thành tích và kỷ niệm đẹp của thầy trò trường Tiểu học Lê Quý Đôn. Ban Giám hiệu tổng kết thành tích nổi bật của nhà trường, trao bằng khen và giấy chứng nhận cho học sinh đạt thành tích xuất sắc về học tập, rèn luyện và hoạt động ngoại khóa. Lễ tổng kết cũng là thời khắc xúc động chia tay các em học sinh lớp 5 hoàn thành bậc tiểu học, chuẩn bị bước vào giai đoạn học tập mới tại trường trung học cơ sở. Chương trình văn nghệ do học sinh biểu diễn và những khoảnh khắc lưu niệm cùng thầy cô sẽ là ký ức không thể quên trong hành trình trưởng thành của mỗi em.',
    image_url: 'https://picsum.photos/seed/lqd-event-15/800/400',
    start_date: new Date('2026-05-25T07:30:00'),
    end_date: null,
    location: 'Hội trường',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Trại hè vui khỏe 2026',
    description:
      'Trại hè vui khỏe 2026 kéo dài hai tuần với chương trình đa dạng kết hợp giữa học tập, vui chơi và rèn luyện thể chất trong khuôn viên nhà trường. Học sinh được tham gia các lớp học kỹ năng sống, câu lạc bộ thể thao, lớp học nghệ thuật và các buổi dã ngoại ngắn ngày trong thành phố. Đội ngũ giáo viên và huấn luyện viên được tuyển chọn kỹ lưỡng, đảm bảo mỗi trẻ nhận được sự quan tâm và hướng dẫn phù hợp trong suốt chương trình trại hè. Đây là cơ hội tuyệt vời để các em vừa phát triển kỹ năng, vừa kết bạn và tận hưởng mùa hè ý nghĩa trong môi trường an toàn.',
    image_url: 'https://picsum.photos/seed/lqd-event-16/800/400',
    start_date: new Date('2026-06-15T08:00:00'),
    end_date: new Date('2026-06-30T17:00:00'),
    location: 'Khuôn viên trường',
    link_url: '#',
    status: EventStatus.UPCOMING,
  },
  {
    title: 'English Summer Camp 2026',
    description:
      'English Summer Camp 2026 là chương trình học tiếng Anh hè chuyên sâu được thiết kế theo phương pháp nhập vai toàn phần, giúp học sinh sử dụng tiếng Anh tự nhiên trong các tình huống thực tế hằng ngày. Giáo viên bản ngữ người Anh và Mỹ cùng giáo viên Việt Nam giàu kinh nghiệm phối hợp giảng dạy, tạo môi trường giao tiếp sôi động và đa văn hóa. Chương trình bao gồm các hoạt động ngoại khóa tham quan bảo tàng, công viên và giao lưu với học sinh quốc tế đang học tập tại Hà Nội. Học sinh hoàn thành camp sẽ được cấp chứng chỉ và đánh giá năng lực tiếng Anh theo khung Cambridge YLE.',
    image_url: 'https://picsum.photos/seed/lqd-event-17/800/400',
    start_date: new Date('2026-07-01T08:00:00'),
    end_date: new Date('2026-07-15T17:00:00'),
    location: 'Trường + ngoại khóa',
    link_url: '#',
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Tuyển sinh lớp 1 — Ngày gặp mặt',
    description:
      'Ngày gặp mặt tuyển sinh lớp 1 năm học 2026-2027 là cơ hội để phụ huynh và các bé sắp vào lớp 1 khám phá trực tiếp môi trường học tập hiện đại tại trường Tiểu học Lê Quý Đôn. Ban Giám hiệu giới thiệu chương trình đào tạo, phương pháp giảng dạy và các hoạt động ngoại khóa đặc sắc của nhà trường trong buổi tư vấn tuyển sinh chính thức. Các bé được tham quan lớp học, phòng thư viện, phòng STEM và sân thể thao, cùng tham gia các trò chơi vận động nhẹ nhàng do các anh chị học sinh lớp lớn hướng dẫn. Phụ huynh cũng có cơ hội gặp gỡ trực tiếp giáo viên lớp 1 và đặt câu hỏi về chương trình nhập học.',
    image_url: 'https://picsum.photos/seed/lqd-event-18/800/400',
    start_date: new Date('2026-06-01T08:30:00'),
    end_date: null,
    location: 'Hội trường',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Workshop Robotics cho phụ huynh',
    description:
      'Workshop Robotics dành riêng cho phụ huynh học sinh là chương trình đặc biệt giúp cha mẹ hiểu hơn về tầm quan trọng của giáo dục STEM và cách hỗ trợ con học lập trình robot tại nhà. Chuyên gia từ Trung tâm Robotics Hà Nội trực tiếp hướng dẫn phụ huynh lắp ráp và lập trình robot cơ bản với các bộ kit giáo dục, cho phép trải nghiệm thực hành giống con em mình. Nhà trường cũng chia sẻ lộ trình học STEM của nhà trường và các tài nguyên học tập trực tuyến phụ huynh có thể tham khảo để đồng hành cùng con. Đây là một trong những hoạt động nằm trong chương trình "Phụ huynh đồng hành" mà trường Lê Quý Đôn triển khai nhằm tăng cường mối liên kết nhà trường — gia đình.',
    image_url: 'https://picsum.photos/seed/lqd-event-19/800/400',
    start_date: new Date('2026-05-15T14:00:00'),
    end_date: null,
    location: 'Phòng STEM',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Thi bơi lội cấp trường',
    description:
      'Giải bơi lội cấp trường năm 2026 thu hút hơn 200 vận động viên nhí tham gia tranh tài ở các nội dung bơi tự do, bơi ếch và bơi ngửa dành cho học sinh từ lớp 2 đến lớp 5. Cuộc thi được tổ chức theo hình thức thi đấu chính thức với trọng tài, cờ hiệu và bảng điện tử tính giờ, tạo trải nghiệm thi đấu chuyên nghiệp cho các vận động viên nhí. Kết quả xuất sắc nhất sẽ là cơ sở để nhà trường tuyển chọn đội bơi đại diện tham dự Hội khỏe Phù Đổng cấp quận năm học 2026-2027. An toàn bơi lội được đặt lên hàng đầu với sự hiện diện của lực lượng cứu hộ chuyên nghiệp trong suốt thời gian tổ chức.',
    image_url: 'https://picsum.photos/seed/lqd-event-20/800/400',
    start_date: new Date('2026-05-20T07:30:00'),
    end_date: null,
    location: 'Bể bơi',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Ngày hội Âm nhạc',
    description:
      'Ngày hội Âm nhạc là sân chơi nghệ thuật đặc biệt dành cho những học sinh yêu thích ca hát và biểu diễn, với các tiết mục đa dạng từ dân ca Việt Nam đến nhạc thiếu nhi quốc tế. Học sinh có cơ hội biểu diễn solo, song ca hoặc hòa tấu nhạc cụ trước đông đảo khán giả là thầy cô, bạn bè và phụ huynh trong không khí lễ hội âm nhạc sôi động. Nhà trường còn mời các nghệ sĩ trẻ từ Nhạc viện Hà Nội đến biểu diễn giao lưu và truyền cảm hứng âm nhạc cho học sinh. Đây là cơ hội để các em phát triển tự tin, kỹ năng biểu diễn và tình yêu âm nhạc suốt đời.',
    image_url: 'https://picsum.photos/seed/lqd-event-21/800/400',
    start_date: new Date('2026-06-05T08:30:00'),
    end_date: null,
    location: 'Hội trường',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Kỳ thi giữa kỳ HK1 năm học 2026-2027',
    description:
      'Kỳ thi giữa học kỳ 1 năm học 2026-2027 được tổ chức đồng loạt tại tất cả các lớp trong toàn trường, đánh giá toàn diện năng lực học tập của học sinh sau gần hai tháng tiếp thu kiến thức mới. Đề thi được xây dựng theo chuẩn đánh giá năng lực của Bộ Giáo dục và Đào tạo, kết hợp cả phần trắc nghiệm và tự luận nhằm đánh giá nhiều chiều năng lực của học sinh. Kết quả thi giữa kỳ sẽ được phản ánh trong học bạ và là căn cứ để giáo viên điều chỉnh phương pháp giảng dạy phù hợp với từng nhóm học sinh. Nhà trường thông báo kết quả chi tiết đến phụ huynh qua ứng dụng trong vòng 5 ngày làm việc sau kỳ thi.',
    image_url: 'https://picsum.photos/seed/lqd-event-22/800/400',
    start_date: new Date('2026-10-15T07:30:00'),
    end_date: null,
    location: 'Toàn trường',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Lễ khai giảng năm học 2026-2027',
    description:
      'Lễ khai giảng năm học 2026-2027 đánh dấu sự khởi đầu của một năm học mới đầy hứa hẹn với nhiều đổi mới trong chương trình đào tạo và cơ sở vật chất của trường Tiểu học Lê Quý Đôn. Nghi lễ chào cờ, hát Quốc ca và đánh trống khai trường truyền thống mở đầu cho buổi lễ trang trọng với sự tham dự của đại diện UBND quận, Phòng Giáo dục và Đào tạo. Những gương mặt học sinh xuất sắc nhất năm học 2025-2026 được vinh danh và nhận học bổng khuyến học trước toàn thể nhà trường. Đặc biệt, năm học này chào đón thêm hai phòng học thông minh được trang bị màn hình tương tác và hệ thống âm thanh hiện đại nhất.',
    image_url: 'https://picsum.photos/seed/lqd-event-23/800/400',
    start_date: new Date('2026-09-05T07:30:00'),
    end_date: null,
    location: 'Sân trường',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Hội thảo phương pháp giảng dạy',
    description:
      'Hội thảo phương pháp giảng dạy tích cực dành cho toàn thể giáo viên nhà trường được tổ chức trong tuần chuẩn bị năm học mới, nhằm nâng cao năng lực chuyên môn và cập nhật xu hướng giáo dục hiện đại. Chuyên gia từ Viện Khoa học Giáo dục Việt Nam chia sẻ về mô hình lớp học đảo ngược, dạy học theo dự án và ứng dụng trí tuệ nhân tạo trong giảng dạy tiểu học. Giáo viên được thực hành thiết kế bài giảng mẫu và nhận phản hồi trực tiếp từ chuyên gia và đồng nghiệp trong các buổi thực hành nhóm. Hội thảo cũng là dịp để nhà trường thống nhất kế hoạch chuyên môn, đổi mới phương pháp kiểm tra đánh giá và triển khai chương trình giáo dục địa phương cho năm học mới.',
    image_url: 'https://picsum.photos/seed/lqd-event-24/800/400',
    start_date: new Date('2026-08-20T08:00:00'),
    end_date: null,
    location: 'Phòng họp',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
  {
    title: 'Cuộc thi viết chữ đẹp',
    description:
      'Cuộc thi viết chữ đẹp cấp trường năm học 2026-2027 là hoạt động giáo dục truyền thống nhằm bảo tồn và phát huy nghệ thuật viết chữ Việt, rèn luyện tính kiên nhẫn và sự tỉ mỉ cho học sinh. Các em tham gia viết bài thi theo mẫu chữ quy định, được chấm điểm dựa trên các tiêu chí: độ đều đặn, độ nghiêng, khoảng cách và nét đẹp của từng chữ cái. Ban Giám khảo gồm giáo viên Tiếng Việt có kinh nghiệm và đại diện Phòng Giáo dục quận, đảm bảo việc chấm điểm khách quan và nhất quán. Những học sinh đạt giải cao nhất sẽ được nhà trường cử tham gia cuộc thi viết chữ đẹp cấp quận và thành phố trong năm học.',
    image_url: 'https://picsum.photos/seed/lqd-event-25/800/400',
    start_date: new Date('2026-11-10T07:30:00'),
    end_date: null,
    location: 'Các lớp học',
    link_url: null,
    status: EventStatus.UPCOMING,
  },
];

/**
 * Ham chinh chay seed events.
 * Kiem tra title truoc khi insert de dam bao idempotent.
 */
async function seed() {
  await AppDataSource.initialize();
  console.log('[SEED] Bat dau seed events...');

  // Tim admin user lam created_by
  const userRepo = AppDataSource.getRepository(User);
  const admin = await userRepo.findOne({ where: { role: UserRole.SUPER_ADMIN } });
  if (!admin) {
    console.error('[SEED] Khong tim thay Super Admin. Chay "npm run seed:admin" truoc.');
    await AppDataSource.destroy();
    process.exit(1);
  }
  const adminId = admin.id;

  const eventRepo = AppDataSource.getRepository(Event);
  let inserted = 0;
  let skipped = 0;

  for (const data of eventsData) {
    // Kiem tra ton tai theo title (idempotent guard)
    const existing = await eventRepo.findOne({ where: { title: data.title } });
    if (existing) {
      console.log(`[SEED] Bo qua (da ton tai): "${data.title}"`);
      skipped++;
      continue;
    }

    const event = eventRepo.create({
      id: generateUlid(),
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      start_date: data.start_date,
      end_date: data.end_date,
      location: data.location,
      link_url: data.link_url,
      status: data.status,
      created_by: adminId,
      updated_by: null,
    });

    await eventRepo.save(event);
    console.log(`[SEED] Da them: "${data.title}" [${data.status}]`);
    inserted++;
  }

  console.log(`\n[SEED] Hoan tat! Them moi: ${inserted}, Bo qua: ${skipped}, Tong: ${eventsData.length}`);
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
