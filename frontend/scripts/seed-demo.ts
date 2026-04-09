/**
 * Seed demo data cho LeQuyDon school website
 * Tao categories, articles, events, FAQs qua backend API
 *
 * Usage: npx ts-node scripts/seed-demo.ts
 */

const API_BASE = 'http://localhost:4200/api';

let accessToken = '';

// ─── HELPERS ──────────────────────────────────────────────

async function apiPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed (${res.status}): ${text}`);
  }

  return res.json();
}

async function login() {
  console.log('🔑 Dang nhap...');
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@lequydon.edu.vn',
      password: 'Admin@123456',
    }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  accessToken = json.access_token || json.data?.accessToken;
  console.log('   OK — da lay access token');
}

/** Tao ngay publish trai deu trong 3 thang gan day */
function recentDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function thumbnail(slug: string): string {
  return `https://picsum.photos/seed/lqd-${slug}/800/500`;
}

// ─── CATEGORIES ───────────────────────────────────────────

interface CategoryDef {
  name: string;
  slug: string;
  description: string;
}

const CATEGORIES: CategoryDef[] = [
  { name: 'Tin tức - Sự kiện', slug: 'su-kien', description: 'Tin tức và sự kiện của nhà trường' },
  { name: 'Hoạt động ngoại khóa', slug: 'ngoai-khoa', description: 'Các hoạt động ngoại khóa, dã ngoại, câu lạc bộ' },
  { name: 'Hoạt động học tập', slug: 'hoc-tap', description: 'Kết quả học tập, thành tích học sinh' },
  { name: 'Thông tin tuyển sinh', slug: 'tuyen-sinh', description: 'Thông báo tuyển sinh các năm học' },
  { name: 'Thực đơn', slug: 'thuc-don', description: 'Thực đơn hàng tuần cho học sinh' },
];

// ─── ARTICLES ─────────────────────────────────────────────

interface ArticleDef {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  daysAgo: number;
}

const ARTICLES: Record<string, ArticleDef[]> = {
  'su-kien': [
    {
      title: 'Thư ngỏ V/v Đảm bảo an toàn thực phẩm tại Nhà trường',
      slug: 'thu-ngo-an-toan-thuc-pham',
      excerpt: 'Nhà trường cam kết đảm bảo an toàn vệ sinh thực phẩm cho toàn bộ học sinh.',
      daysAgo: 5,
      content: `<h2>Kính gửi Quý Phụ huynh Trường Tiểu học Lê Quý Đôn</h2>
<p>Nhà trường xin trân trọng gửi tới Quý Phụ huynh lời chào trân trọng và lời cảm ơn sâu sắc vì đã tin tưởng gửi gắm con em theo học tại trường.</p>
<p>Trước những lo ngại chính đáng của Quý Phụ huynh về vấn đề an toàn thực phẩm, Ban Giám hiệu nhà trường xin thông báo một số biện pháp đã và đang được thực hiện nhằm đảm bảo sức khỏe cho các con:</p>
<ul>
  <li>100% nguyên liệu đầu vào được kiểm tra nguồn gốc xuất xứ rõ ràng</li>
  <li>Bếp ăn đạt chuẩn VSATTP theo quy định của Bộ Y tế</li>
  <li>Đội ngũ nhân viên bếp được khám sức khỏe định kỳ 6 tháng/lần</li>
  <li>Mẫu thức ăn được lưu giữ 24h theo đúng quy định</li>
</ul>
<p>Nhà trường luôn đặt sức khỏe của các con lên hàng đầu. Mọi phản hồi xin gửi về email: info@lequydonhanoi.edu.vn</p>`,
    },
    {
      title: 'Lễ kết nạp Đội Khối 3: Dấu mốc đáng nhớ của học sinh Lê Quý Đôn',
      slug: 'le-ket-nap-doi-khoi-3',
      excerpt: 'Buổi lễ kết nạp Đội viên thiếu niên Tiền phong Hồ Chí Minh cho học sinh Khối 3.',
      daysAgo: 10,
      content: `<h2>Lễ kết nạp Đội TNTP Hồ Chí Minh — Khối 3</h2>
<p>Sáng ngày 26/3/2026, Liên đội Trường Tiểu học Lê Quý Đôn đã long trọng tổ chức Lễ kết nạp Đội viên Thiếu niên Tiền phong Hồ Chí Minh cho 120 học sinh Khối 3.</p>
<p>Trong không khí trang nghiêm và xúc động, các em học sinh đã tuyên thệ trước cờ Đội, hứa sẽ chăm ngoan, học giỏi, xứng đáng là con ngoan trò giỏi.</p>
<h3>Điểm nhấn buổi lễ</h3>
<ul>
  <li>120 đội viên mới được kết nạp</li>
  <li>Chương trình văn nghệ chào mừng do các anh chị Khối 4-5 biểu diễn</li>
  <li>Phần thi "Tìm hiểu về Đội TNTP HCM" sôi nổi</li>
</ul>
<p>Đây là dấu mốc quan trọng trong hành trình trưởng thành của mỗi học sinh, giúp các em thêm tự hào và có trách nhiệm hơn với bản thân, gia đình và nhà trường.</p>`,
    },
    {
      title: 'Trường TH Lê Quý Đôn chủ động kiểm chứng nguồn thịt bàn trù',
      slug: 'kiem-chung-nguon-thit',
      excerpt: 'Nhà trường phối hợp với cơ quan chức năng kiểm tra nguồn gốc thực phẩm phục vụ bữa ăn.',
      daysAgo: 15,
      content: `<h2>Minh bạch nguồn gốc thực phẩm — Cam kết từ Nhà trường</h2>
<p>Trường Tiểu học Lê Quý Đôn vừa phối hợp cùng Chi cục An toàn vệ sinh thực phẩm Quận Ba Đình tiến hành kiểm tra toàn diện nguồn cung cấp thịt cho bếp ăn nhà trường.</p>
<p>Kết quả kiểm tra cho thấy 100% các mẫu thịt đều đạt tiêu chuẩn về vệ sinh an toàn thực phẩm, có đầy đủ giấy tờ chứng nhận nguồn gốc xuất xứ và tem kiểm dịch.</p>
<h3>Các biện pháp kiểm soát</h3>
<p>Nhà trường đã ký hợp đồng dài hạn với các đơn vị cung cấp thực phẩm uy tín, có chứng nhận VietGAP. Mỗi lô hàng nhập về đều được kiểm tra nghiêm ngặt trước khi đưa vào chế biến.</p>
<p>Ban Giám hiệu khuyến khích Phụ huynh tham gia giám sát bếp ăn vào bất kỳ thời điểm nào trong giờ chế biến.</p>`,
    },
    {
      title: 'Chào đón 20 năm thành lập Hệ thống Trường Liên cấp Lê Quý Đôn',
      slug: 'chao-don-20-nam-thanh-lap',
      excerpt: 'Kỷ niệm 20 năm xây dựng và phát triển Hệ thống Trường Liên cấp Lê Quý Đôn.',
      daysAgo: 25,
      content: `<h2>20 năm — Một chặng đường tự hào</h2>
<p>Ngày 04/08/2025, Hệ thống Trường Liên cấp Lê Quý Đôn tròn 20 năm thành lập. Nhìn lại chặng đường đã qua, nhà trường tự hào với những thành tựu đã đạt được trong sự nghiệp trồng người.</p>
<h3>Những con số ấn tượng</h3>
<ul>
  <li>Hơn 10.000 học sinh đã tốt nghiệp</li>
  <li>95% học sinh đạt học lực Giỏi và Xuất sắc</li>
  <li>Đội ngũ 200+ giáo viên có trình độ Đại học và Sau đại học</li>
  <li>Cơ sở vật chất hiện đại với 3 cơ sở tại Hà Nội</li>
</ul>
<p>Lễ kỷ niệm 20 năm sẽ được tổ chức trang trọng với sự tham gia của các thế hệ cựu học sinh, phụ huynh và đối tác.</p>`,
    },
    {
      title: 'Lễ khai giảng năm học 2025-2026 đầy ấn tượng',
      slug: 'le-khai-giang-2025-2026',
      excerpt: 'Lễ khai giảng năm học mới với nhiều hoạt động hấp dẫn chào đón các em học sinh.',
      daysAgo: 35,
      content: `<h2>Khai giảng năm học 2025-2026</h2>
<p>Sáng ngày 05/09/2025, Trường Tiểu học Lê Quý Đôn đã tổ chức Lễ khai giảng năm học 2025-2026 trong không khí trang trọng và vui tươi.</p>
<p>Hơn 1.200 học sinh cùng toàn thể giáo viên, nhân viên nhà trường và đông đảo phụ huynh đã tham dự buổi lễ. Đặc biệt, các em học sinh lớp 1 lần đầu tiên bước vào ngôi trường mới với niềm háo hức và phấn khởi.</p>
<h3>Điểm nhấn</h3>
<ul>
  <li>Tiết mục văn nghệ đặc sắc "Vui tựu trường" do học sinh biểu diễn</li>
  <li>Nghi lễ đánh trống khai trường truyền thống</li>
  <li>Thả bóng bay mang ước mơ của các em học sinh</li>
</ul>`,
    },
    {
      title: 'Hội thao mùa xuân 2026 - Ngày hội của tình thân',
      slug: 'hoi-thao-mua-xuan-2026',
      excerpt: 'Hội thao mùa xuân với nhiều trò chơi vận động dành cho cả phụ huynh và học sinh.',
      daysAgo: 20,
      content: `<h2>Hội thao mùa xuân 2026</h2>
<p>Ngày 15/3/2026, toàn trường sôi nổi với Hội thao mùa xuân 2026 mang chủ đề "Ngày hội của tình thân". Đây là hoạt động thường niên nhằm tăng cường sức khỏe và gắn kết giữa gia đình - nhà trường.</p>
<h3>Các nội dung thi đấu</h3>
<ul>
  <li>Kéo co (theo khối lớp)</li>
  <li>Nhảy bao bố tiếp sức</li>
  <li>Chạy việt dã mini (800m)</li>
  <li>Bóng đá mini giao hữu Phụ huynh - Giáo viên</li>
</ul>
<p>Hơn 500 phụ huynh đã tham gia cổ vũ và thi đấu cùng con em mình, tạo nên một ngày hội đầy tiếng cười và kỷ niệm đẹp.</p>`,
    },
    {
      title: 'Ngày hội sách Lê Quý Đôn lần thứ 5',
      slug: 'ngay-hoi-sach-lan-5',
      excerpt: 'Ngày hội sách với nhiều hoạt động khuyến đọc hấp dẫn cho học sinh toàn trường.',
      daysAgo: 30,
      content: `<h2>Ngày hội sách lần thứ 5 — "Sách là người bạn tốt"</h2>
<p>Ngày hội sách Lê Quý Đôn lần thứ 5 đã diễn ra thành công tốt đẹp với sự tham gia của toàn bộ học sinh từ lớp 1 đến lớp 5.</p>
<p>Các hoạt động chính bao gồm: triển lãm sách, trao đổi sách cũ, thi kể chuyện theo sách, và giao lưu với nhà văn Nguyễn Nhật Ánh qua video call.</p>
<h3>Kết quả</h3>
<ul>
  <li>Hơn 2.000 cuốn sách được trao đổi</li>
  <li>50 bài dự thi "Em vẽ nhân vật yêu thích"</li>
  <li>Giải thưởng cho lớp có tủ sách phong phú nhất</li>
</ul>`,
    },
    {
      title: 'Tổng kết học kỳ I năm học 2025-2026',
      slug: 'tong-ket-hoc-ky-1-2025-2026',
      excerpt: 'Lễ tổng kết và trao thưởng học kỳ I năm học 2025-2026.',
      daysAgo: 60,
      content: `<h2>Tổng kết học kỳ I năm học 2025-2026</h2>
<p>Ngày 15/01/2026, Trường Tiểu học Lê Quý Đôn đã tổ chức Lễ tổng kết học kỳ I năm học 2025-2026 và trao thưởng cho các em học sinh có thành tích xuất sắc.</p>
<h3>Kết quả nổi bật</h3>
<ul>
  <li>Tỷ lệ học sinh đạt Xuất sắc: 45%</li>
  <li>Tỷ lệ học sinh đạt Giỏi: 40%</li>
  <li>15 học sinh đạt giải cấp Quận và Thành phố</li>
  <li>Đội tuyển Toán đạt 5 giải Nhất cấp Quận</li>
</ul>
<p>Ban Giám hiệu ghi nhận sự nỗ lực của toàn thể giáo viên và học sinh, đồng thời cảm ơn sự đồng hành của Quý Phụ huynh trong suốt học kỳ vừa qua.</p>`,
    },
    {
      title: 'Chương trình "Tết yêu thương" trao quà cho trẻ em vùng cao',
      slug: 'tet-yeu-thuong-2026',
      excerpt: 'Học sinh Lê Quý Đôn quyên góp và trao quà Tết cho trẻ em có hoàn cảnh khó khăn.',
      daysAgo: 70,
      content: `<h2>Tết yêu thương — Chia sẻ niềm vui</h2>
<p>Nhân dịp Tết Nguyên đán 2026, Trường Tiểu học Lê Quý Đôn đã tổ chức chương trình "Tết yêu thương" quyên góp quà Tết cho trẻ em có hoàn cảnh khó khăn tại huyện Mộc Châu, Sơn La.</p>
<p>Với sự tham gia nhiệt tình của phụ huynh và học sinh, chương trình đã thu được hơn 200 phần quà bao gồm áo ấm, sách vở, đồ chơi và bánh kẹo.</p>
<h3>Hoạt động tại điểm trao quà</h3>
<p>Đoàn tình nguyện gồm giáo viên và đại diện phụ huynh đã trực tiếp lên Mộc Châu trao quà tại 2 điểm trường. Các em học sinh vùng cao rất vui mừng và xúc động khi nhận quà từ các bạn nhỏ Hà Nội.</p>`,
    },
  ],
  'ngoai-khoa': [
    {
      title: 'Hành Trình Khám Phá Của Doners Khối 5 Tại Bản Rôm',
      slug: 'hanh-trinh-kham-pha-ban-rom',
      excerpt: 'Chuyến trải nghiệm văn hóa bản địa tại Bản Rôm, Sơn La dành cho học sinh Khối 5.',
      daysAgo: 8,
      content: `<h2>Hành trình khám phá Bản Rôm — Sơn La</h2>
<p>Trong 3 ngày 2 đêm (28-30/03/2026), hơn 150 học sinh Khối 5 đã có chuyến trải nghiệm đầy ý nghĩa tại Bản Rôm, huyện Vân Hồ, tỉnh Sơn La.</p>
<h3>Các hoạt động nổi bật</h3>
<ul>
  <li>Trekking khám phá bản làng người Thái</li>
  <li>Học làm bánh dày, nhuộm vải chàm truyền thống</li>
  <li>Đêm lửa trại giao lưu văn nghệ với các bạn nhỏ địa phương</li>
  <li>Trồng cây xanh tại khuôn viên trường tiểu học Bản Rôm</li>
</ul>
<p>Chuyến đi giúp các em hiểu thêm về văn hóa các dân tộc Việt Nam, rèn luyện kỹ năng tự lập và biết yêu thương, chia sẻ với cộng đồng.</p>`,
    },
    {
      title: 'Đại phim kể về Doners Sao "Nhảy mí" là cả thế giới',
      slug: 'dai-phim-doners-sao-nhay-mi',
      excerpt: 'Dự án làm phim ngắn của học sinh về chủ đề tuổi thơ và ước mơ.',
      daysAgo: 12,
      content: `<h2>Dự án phim ngắn "Nhảy mí là cả thế giới"</h2>
<p>CLB Điện ảnh nhí Lê Quý Đôn vừa hoàn thành dự án phim ngắn "Nhảy mí là cả thế giới" — bộ phim kể về những khoảnh khắc đáng yêu trong cuộc sống hàng ngày của các Doners Sao (học sinh lớp 1).</p>
<p>Bộ phim dài 15 phút, được quay hoàn toàn bởi các "đạo diễn nhí" lớp 4-5 dưới sự hướng dẫn của thầy cô.</p>
<h3>Thông tin sản xuất</h3>
<ul>
  <li>Thời gian quay: 2 tuần</li>
  <li>Diễn viên: 25 học sinh lớp 1A, 1B</li>
  <li>Quay phim & biên tập: CLB Điện ảnh nhí (12 thành viên)</li>
</ul>
<p>Phim sẽ được chiếu trong buổi lễ tổng kết năm học và phát trên kênh YouTube của nhà trường.</p>`,
    },
    {
      title: '"Biệt đội nhí" – Doners kể sứ hiệp bao "câu chuyện xanh"',
      slug: 'biet-doi-nhi-cau-chuyen-xanh',
      excerpt: 'Dự án bảo vệ môi trường của các em học sinh — những "Biệt đội nhí" xanh.',
      daysAgo: 18,
      content: `<h2>"Biệt đội nhí" — Câu chuyện xanh của Doners</h2>
<p>Dự án "Câu chuyện xanh" là sáng kiến của các em học sinh Khối 3 và Khối 4 nhằm nâng cao ý thức bảo vệ môi trường trong cộng đồng nhà trường.</p>
<h3>Hoạt động của Biệt đội nhí</h3>
<ul>
  <li>Phân loại rác tại nguồn — mỗi lớp có 3 thùng rác riêng biệt</li>
  <li>Trồng và chăm sóc vườn rau sạch mini trên sân thượng</li>
  <li>Chiến dịch "Nói không với nhựa dùng một lần"</li>
  <li>Thiết kế poster tuyên truyền bảo vệ môi trường</li>
</ul>
<p>Sau 1 tháng triển khai, lượng rác thải nhựa trong trường đã giảm 40%. Dự án được Ban Giám hiệu đánh giá cao và sẽ nhân rộng ra toàn trường.</p>`,
    },
    {
      title: 'Trại xuân 2026 "Mùa xuân ơi..." - Team Tên Trộm 3 Doners',
      slug: 'trai-xuan-2026-mua-xuan-oi',
      excerpt: 'Trại xuân 2026 với nhiều hoạt động vui chơi, rèn luyện kỹ năng sống.',
      daysAgo: 22,
      content: `<h2>Trại xuân 2026 — "Mùa xuân ơi..."</h2>
<p>Trại xuân 2026 được tổ chức tại khuôn viên nhà trường trong 2 ngày, với chủ đề "Mùa xuân ơi..." mang đậm không khí Tết cổ truyền Việt Nam.</p>
<h3>Các trạm hoạt động</h3>
<ul>
  <li>Trạm 1: Gói bánh chưng cùng ông bà</li>
  <li>Trạm 2: Viết thư pháp — Xin chữ đầu xuân</li>
  <li>Trạm 3: Trò chơi dân gian (ô ăn quan, nhảy dây, kéo co)</li>
  <li>Trạm 4: Làm thiệp chúc Tết handmade</li>
  <li>Trạm 5: Hội chợ xuân mini — Doners bán hàng gây quỹ từ thiện</li>
</ul>
<p>Team "Tên Trộm 3 Doners" (lớp 3C) đã xuất sắc giành giải Nhất toàn trại với số điểm cao nhất ở cả 5 trạm.</p>`,
    },
    {
      title: 'Chuyến dã ngoại Ba Vì cho lớp 4-5',
      slug: 'chuyen-da-ngoai-ba-vi',
      excerpt: 'Học sinh khối 4-5 trải nghiệm thiên nhiên tại Vườn quốc gia Ba Vì.',
      daysAgo: 28,
      content: `<h2>Dã ngoại Ba Vì — Khám phá thiên nhiên</h2>
<p>Ngày 08/03/2026, hơn 300 học sinh Khối 4 và Khối 5 đã có chuyến dã ngoại đến Vườn quốc gia Ba Vì, cách Hà Nội khoảng 60km.</p>
<h3>Lịch trình hoạt động</h3>
<ul>
  <li>Sáng: Leo núi Đỉnh Vua (1.296m) theo đường mòn sinh thái</li>
  <li>Trưa: Picnic tập thể, chia sẻ đồ ăn tự chuẩn bị</li>
  <li>Chiều: Tham quan Đền Thượng, tìm hiểu về Tản Viên Sơn Thánh</li>
</ul>
<p>Chuyến đi giúp các em gần gũi với thiên nhiên, rèn thể lực và tinh thần đồng đội. Nhiều em chia sẻ đây là kỷ niệm đáng nhớ nhất trong năm học.</p>`,
    },
    {
      title: 'CLB Robotics giành giải Nhất cuộc thi STEM',
      slug: 'clb-robotics-giai-nhat-stem',
      excerpt: 'Đội Robotics nhà trường xuất sắc giành giải cao nhất cuộc thi STEM cấp thành phố.',
      daysAgo: 40,
      content: `<h2>CLB Robotics Lê Quý Đôn — Giải Nhất STEM Hà Nội 2026</h2>
<p>Đội Robotics của Trường Tiểu học Lê Quý Đôn đã xuất sắc giành giải Nhất cuộc thi STEM dành cho học sinh tiểu học do Sở GD&ĐT Hà Nội tổ chức ngày 25/02/2026.</p>
<h3>Dự án dự thi</h3>
<p>Đội đã trình bày dự án "Robot thu gom rác thông minh" sử dụng Arduino và cảm biến siêu âm. Robot có khả năng tự di chuyển, phát hiện và thu gom rác trong phạm vi 5 mét.</p>
<h3>Thành viên đội</h3>
<ul>
  <li>Nguyễn Minh Khoa (5A) — Đội trưởng</li>
  <li>Trần Thu Hà (5B) — Lập trình</li>
  <li>Phạm Đức Anh (4A) — Thiết kế cơ khí</li>
  <li>Lê Hoàng Nam (4C) — Thuyết trình</li>
</ul>`,
    },
    {
      title: 'Chương trình trao đổi với PLC Sydney',
      slug: 'chuong-trinh-trao-doi-plc-sydney',
      excerpt: 'Học sinh tham gia chương trình trao đổi văn hóa với trường PLC Sydney, Australia.',
      daysAgo: 50,
      content: `<h2>Giao lưu quốc tế — PLC Sydney, Australia</h2>
<p>Trong khuôn khổ hợp tác quốc tế, Trường Tiểu học Lê Quý Đôn đã đón tiếp đoàn 15 học sinh và 3 giáo viên từ trường PLC Sydney (Presbyterian Ladies' College), Australia.</p>
<h3>Chương trình giao lưu 5 ngày</h3>
<ul>
  <li>Ngày 1-2: Học sinh PLC tham gia lớp học cùng các bạn Việt Nam</li>
  <li>Ngày 3: Tham quan Hà Nội cổ — Văn Miếu Quốc Tử Giám</li>
  <li>Ngày 4: Hội thao giao hữu và triển lãm văn hóa</li>
  <li>Ngày 5: Lễ chia tay, trao quà lưu niệm</li>
</ul>
<p>Chương trình giúp học sinh hai nước giao lưu, học hỏi lẫn nhau và rèn luyện kỹ năng giao tiếp tiếng Anh trong môi trường thực tế.</p>`,
    },
    {
      title: 'Hội khỏe Phù Đổng cấp trường',
      slug: 'hoi-khoe-phu-dong-cap-truong',
      excerpt: 'Hội khỏe Phù Đổng với các nội dung thi đấu thể thao dành cho học sinh toàn trường.',
      daysAgo: 55,
      content: `<h2>Hội khỏe Phù Đổng cấp trường năm 2026</h2>
<p>Hội khỏe Phù Đổng cấp trường năm 2026 đã diễn ra sôi nổi trong 3 ngày (10-12/02/2026) với sự tham gia của hơn 400 vận động viên nhí đến từ tất cả các lớp.</p>
<h3>Các môn thi đấu</h3>
<ul>
  <li>Điền kinh: Chạy 60m, 200m, nhảy xa</li>
  <li>Bóng đá mini: 5 đội (mỗi khối 1 đội)</li>
  <li>Cầu lông đôi nam nữ</li>
  <li>Cờ vua cá nhân</li>
  <li>Bơi lội: 25m tự do, 25m ếch</li>
</ul>
<p>Khối 5 đã giành giải Nhất toàn đoàn với tổng 285 điểm. Các vận động viên xuất sắc sẽ đại diện trường tham dự Hội khỏe Phù Đổng cấp Quận.</p>`,
    },
  ],
  'hoc-tap': [
    {
      title: 'Thành Tích Tháng 3 | Doners Xuất Sắc Giành 1.536 Giải',
      slug: 'thanh-tich-thang-3-1536-giai',
      excerpt: 'Tổng hợp thành tích học tập tháng 3/2026 với 1.536 giải thưởng các cấp.',
      daysAgo: 3,
      content: `<h2>Thành tích tháng 3/2026 — Con số ấn tượng</h2>
<p>Tháng 3/2026, học sinh Trường Tiểu học Lê Quý Đôn tiếp tục ghi dấu ấn với 1.536 giải thưởng từ các cuộc thi, kỳ thi ở nhiều cấp độ.</p>
<h3>Phân bố giải thưởng</h3>
<ul>
  <li>Giải Quốc tế: 12 giải (IMAS, SASMO, Kangaroo Math)</li>
  <li>Giải Quốc gia: 45 giải (IOE, Violympic, Trạng Nguyên)</li>
  <li>Giải cấp Thành phố: 128 giải</li>
  <li>Giải cấp Quận: 356 giải</li>
  <li>Giải cấp Trường: 995 giải</li>
</ul>
<p>Đặc biệt, em Trần Minh Anh (lớp 5A) đạt Huy chương Vàng cuộc thi Toán quốc tế IMAS lần thứ 8.</p>`,
    },
    {
      title: 'Học sinh lớp 5 đạt giải Nhất Olympic Toán cấp Quận',
      slug: 'giai-nhat-olympic-toan-cap-quan',
      excerpt: 'Em Nguyễn Phương Linh đạt giải Nhất Olympic Toán cấp Quận Ba Đình.',
      daysAgo: 14,
      content: `<h2>Giải Nhất Olympic Toán cấp Quận Ba Đình</h2>
<p>Em Nguyễn Phương Linh, học sinh lớp 5B, đã xuất sắc giành giải Nhất kỳ thi Olympic Toán cấp Quận Ba Đình năm học 2025-2026, với số điểm 98/100.</p>
<p>Phương Linh là học sinh có thành tích học tập xuất sắc, từng đạt giải Nhì cấp Thành phố năm lớp 4. Em chia sẻ: "Con yêu Toán vì nó giúp con tư duy logic và giải quyết vấn đề. Con cảm ơn thầy cô và bố mẹ đã luôn hỗ trợ con."</p>
<h3>Thành tích đội tuyển Toán</h3>
<ul>
  <li>1 giải Nhất, 3 giải Nhì, 5 giải Ba</li>
  <li>100% thành viên đội tuyển đạt giải</li>
</ul>`,
    },
    {
      title: 'Kết quả Cambridge Flyers đạt tỷ lệ 95%',
      slug: 'ket-qua-cambridge-flyers-95',
      excerpt: 'Học sinh Khối 5 đạt tỷ lệ đỗ Cambridge Flyers 95% — cao nhất từ trước đến nay.',
      daysAgo: 20,
      content: `<h2>Cambridge Flyers — Tỷ lệ đạt 95%</h2>
<p>Kết quả kỳ thi Cambridge Flyers tháng 2/2026 cho thấy 95% học sinh Khối 5 đạt chứng chỉ, trong đó 40% đạt loại Xuất sắc (15 shields).</p>
<h3>So sánh qua các năm</h3>
<ul>
  <li>2023-2024: Tỷ lệ đạt 88%</li>
  <li>2024-2025: Tỷ lệ đạt 92%</li>
  <li>2025-2026: Tỷ lệ đạt 95% — cao nhất từ trước đến nay</li>
</ul>
<p>Kết quả này phản ánh chất lượng giảng dạy tiếng Anh ngày càng được nâng cao, với đội ngũ giáo viên bản ngữ và chương trình học tích hợp Cambridge.</p>`,
    },
    {
      title: 'Dự án STEM "Thành phố thông minh" của lớp 4A',
      slug: 'du-an-stem-thanh-pho-thong-minh',
      excerpt: 'Lớp 4A trình bày dự án STEM mô hình thành phố thông minh với đèn giao thông tự động.',
      daysAgo: 32,
      content: `<h2>Dự án STEM — "Thành phố thông minh"</h2>
<p>Học sinh lớp 4A đã hoàn thành dự án STEM "Thành phố thông minh" sau 4 tuần nghiên cứu và chế tạo. Mô hình bao gồm hệ thống đèn giao thông tự động, đèn đường cảm biến ánh sáng và hệ thống tưới cây tự động.</p>
<h3>Công nghệ sử dụng</h3>
<ul>
  <li>Arduino Uno R3 làm bộ xử lý trung tâm</li>
  <li>Cảm biến ánh sáng LDR cho hệ thống đèn đường</li>
  <li>Cảm biến độ ẩm cho hệ thống tưới cây</li>
  <li>LED RGB cho đèn giao thông</li>
</ul>
<p>Dự án được trưng bày tại Triển lãm STEM toàn trường và nhận được nhiều lời khen ngợi từ Ban Giám hiệu cũng như phụ huynh.</p>`,
    },
    {
      title: 'Cuộc thi viết chữ đẹp cấp trường',
      slug: 'cuoc-thi-viet-chu-dep',
      excerpt: 'Cuộc thi viết chữ đẹp nhằm rèn luyện nét chữ và tính kiên nhẫn cho học sinh.',
      daysAgo: 38,
      content: `<h2>Cuộc thi viết chữ đẹp năm 2026</h2>
<p>Cuộc thi viết chữ đẹp cấp trường năm 2026 đã thu hút sự tham gia của hơn 600 học sinh từ Khối 1 đến Khối 5.</p>
<p>Mỗi em có 45 phút để trình bày bài viết theo mẫu quy định. Ban giám khảo đánh giá dựa trên các tiêu chí: đúng mẫu chữ, đều nét, sạch đẹp và trình bày khoa học.</p>
<h3>Kết quả</h3>
<ul>
  <li>Giải Nhất: Em Lê Thị Minh Ngọc (lớp 3B)</li>
  <li>Giải Nhì: Em Phạm Hải Đăng (lớp 2A), Em Vũ Khánh Linh (lớp 4C)</li>
  <li>Giải Ba: 5 em từ các khối lớp</li>
</ul>`,
    },
    {
      title: 'Thi Hùng biện Tiếng Anh lần thứ 3',
      slug: 'thi-hung-bien-tieng-anh-lan-3',
      excerpt: 'Cuộc thi Hùng biện Tiếng Anh dành cho học sinh Khối 3-5 với chủ đề "My Dream".',
      daysAgo: 45,
      content: `<h2>English Speech Contest lần thứ 3 — "My Dream"</h2>
<p>Cuộc thi Hùng biện Tiếng Anh lần thứ 3 với chủ đề "My Dream" đã diễn ra sôi nổi với 30 thí sinh đến từ Khối 3, 4, 5.</p>
<p>Các em đã tự tin trình bày bài nói trước ban giám khảo gồm giáo viên Việt Nam và giáo viên bản ngữ. Nhiều bài hùng biện gây ấn tượng mạnh về nội dung lẫn khả năng diễn đạt.</p>
<h3>Kết quả</h3>
<ul>
  <li>Giải Nhất: Em Đặng Quỳnh Anh (5A) — Chủ đề "My Dream to be a Doctor"</li>
  <li>Giải Nhì: Em Hoàng Minh Tuấn (4B) — "A World Without Plastic"</li>
  <li>Giải Ba: Em Ngô Thanh Trúc (3C) — "My Little Garden"</li>
</ul>`,
    },
    {
      title: 'Giờ học trải nghiệm STEM khối 2',
      slug: 'gio-hoc-trai-nghiem-stem-khoi-2',
      excerpt: 'Học sinh Khối 2 trải nghiệm giờ học STEM với chủ đề "Cầu vồng trong phòng thí nghiệm".',
      daysAgo: 52,
      content: `<h2>STEM Khối 2 — "Cầu vồng trong phòng thí nghiệm"</h2>
<p>Giờ học STEM của Khối 2 tuần này mang đến cho các em trải nghiệm thú vị với thí nghiệm "Cầu vồng trong phòng thí nghiệm".</p>
<p>Dưới sự hướng dẫn của cô giáo, các em đã tự tay pha trộn các dung dịch có tỷ trọng khác nhau (nước đường, dầu ăn, nước muối) để tạo ra "cầu vồng" nhiều lớp trong cốc thủy tinh.</p>
<h3>Kiến thức đạt được</h3>
<ul>
  <li>Hiểu về khái niệm tỷ trọng (density)</li>
  <li>Rèn kỹ năng quan sát và ghi chép</li>
  <li>Phát triển tư duy khoa học qua dự đoán và kiểm chứng</li>
</ul>`,
    },
    {
      title: 'Tuần lễ đọc sách "Books for Fun"',
      slug: 'tuan-le-doc-sach-books-for-fun',
      excerpt: 'Tuần lễ đọc sách tiếng Anh với nhiều hoạt động khuyến đọc sáng tạo.',
      daysAgo: 58,
      content: `<h2>Tuần lễ đọc sách "Books for Fun"</h2>
<p>Tuần lễ đọc sách tiếng Anh "Books for Fun" diễn ra từ 03-07/02/2026, mang đến nhiều hoạt động khuyến đọc hấp dẫn cho học sinh toàn trường.</p>
<h3>Các hoạt động chính</h3>
<ul>
  <li>Thứ 2: Dress Up as Your Favourite Character — Hóa trang nhân vật yêu thích</li>
  <li>Thứ 3: Book Swap — Trao đổi sách tiếng Anh giữa các lớp</li>
  <li>Thứ 4: Storytelling Competition — Thi kể chuyện tiếng Anh</li>
  <li>Thứ 5: Reading Buddies — Đọc sách cặp đôi (lớp lớn đọc cho lớp nhỏ)</li>
  <li>Thứ 6: Book Fair — Hội chợ sách với các nhà xuất bản</li>
</ul>
<p>Hơn 1.500 cuốn sách tiếng Anh đã được đọc và trao đổi trong tuần lễ này.</p>`,
    },
    {
      title: 'Giải thưởng "Lớp học hạnh phúc" học kỳ I',
      slug: 'giai-thuong-lop-hoc-hanh-phuc-hk1',
      excerpt: 'Trao giải "Lớp học hạnh phúc" cho các lớp có môi trường học tập tích cực nhất.',
      daysAgo: 65,
      content: `<h2>Giải thưởng "Lớp học hạnh phúc" — Học kỳ I</h2>
<p>Nhà trường vừa công bố và trao giải thưởng "Lớp học hạnh phúc" học kỳ I năm học 2025-2026 cho các lớp có môi trường học tập tích cực, thân thiện nhất.</p>
<h3>Tiêu chí đánh giá</h3>
<ul>
  <li>Sự gắn kết giữa các thành viên trong lớp</li>
  <li>Tinh thần hợp tác và giúp đỡ lẫn nhau</li>
  <li>Không có hiện tượng bắt nạt học đường</li>
  <li>Góc lớp sáng tạo và sạch đẹp</li>
</ul>
<h3>Kết quả</h3>
<p>Lớp 3A, 4B và 5C đã được vinh danh là "Lớp học hạnh phúc" tiêu biểu. Mỗi lớp nhận phần thưởng là 1 buổi dã ngoại đặc biệt do nhà trường tổ chức.</p>`,
    },
  ],
  'tuyen-sinh': [
    {
      title: 'Thông báo Tuyển sinh năm học 2026-2027',
      slug: 'thong-bao-tuyen-sinh-2026-2027',
      excerpt: 'Trường Tiểu học Lê Quý Đôn thông báo tuyển sinh lớp 1 và các khối lớp năm học 2026-2027.',
      daysAgo: 2,
      content: `<h2>Tuyển sinh năm học 2026-2027</h2>
<p>Trường Tiểu học Lê Quý Đôn trân trọng thông báo kế hoạch tuyển sinh năm học 2026-2027 cho các khối lớp từ lớp 1 đến lớp 5.</p>
<h3>Đối tượng tuyển sinh</h3>
<ul>
  <li><strong>Lớp 1:</strong> Trẻ sinh năm 2020 (đủ 6 tuổi tính đến 31/12/2026)</li>
  <li><strong>Lớp 2-5:</strong> Học sinh chuyển trường từ các trường tiểu học khác</li>
</ul>
<h3>Thời gian đăng ký</h3>
<p>Từ ngày 01/04/2026 đến hết ngày 30/06/2026. Hồ sơ nộp trực tiếp tại Phòng Tuyển sinh hoặc đăng ký online tại website nhà trường.</p>
<h3>Liên hệ</h3>
<p>Hotline: 024 3762 1234 | Email: tuyensinh@lequydonhanoi.edu.vn</p>`,
    },
    {
      title: 'Thông báo Tuyển sinh năm học 2025-2026',
      slug: 'thong-bao-tuyen-sinh-2025-2026',
      excerpt: 'Thông tin tuyển sinh lớp 1 và các khối lớp năm học 2025-2026.',
      daysAgo: 75,
      content: `<h2>Tuyển sinh năm học 2025-2026</h2>
<p>Trường Tiểu học Lê Quý Đôn trân trọng thông báo kế hoạch tuyển sinh năm học 2025-2026.</p>
<h3>Chỉ tiêu tuyển sinh</h3>
<ul>
  <li>Lớp 1: 8 lớp × 30 học sinh = 240 học sinh</li>
  <li>Lớp 2-5: Tuyển bổ sung theo chỉ tiêu còn lại</li>
</ul>
<h3>Quyền lợi học sinh</h3>
<ul>
  <li>Chương trình học chuẩn Bộ GD&ĐT kết hợp Cambridge</li>
  <li>Tiếng Anh với giáo viên bản ngữ 8 tiết/tuần</li>
  <li>STEM, Robotics, Nghệ thuật, Thể thao toàn diện</li>
  <li>Bán trú với thực đơn dinh dưỡng khoa học</li>
</ul>`,
    },
    {
      title: 'Thông báo Câu lạc bộ Ngôi nhà mơ ước 2026',
      slug: 'clb-ngoi-nha-mo-uoc-2026',
      excerpt: 'Chương trình CLB Ngôi nhà mơ ước dành cho trẻ 5 tuổi chuẩn bị vào lớp 1.',
      daysAgo: 7,
      content: `<h2>CLB Ngôi nhà mơ ước 2026</h2>
<p>CLB "Ngôi nhà mơ ước" là chương trình trải nghiệm dành cho các bé 5 tuổi chuẩn bị vào lớp 1, giúp các con làm quen với môi trường học tập tại Trường Tiểu học Lê Quý Đôn.</p>
<h3>Nội dung chương trình</h3>
<ul>
  <li>Làm quen với lớp học, thầy cô và bạn bè</li>
  <li>Hoạt động STEM mini dành cho bé</li>
  <li>Học tiếng Anh vui nhộn với giáo viên nước ngoài</li>
  <li>Vận động thể chất và trò chơi ngoài trời</li>
</ul>
<h3>Lịch hoạt động</h3>
<p>Mỗi thứ 7 hàng tuần, từ 8h30 đến 11h00. Chương trình miễn phí hoàn toàn.</p>
<p>Đăng ký: Hotline 024 3762 1234 hoặc form online trên website.</p>`,
    },
    {
      title: 'Thông báo Câu lạc bộ Ngôi nhà mơ ước 2025',
      slug: 'clb-ngoi-nha-mo-uoc-2025',
      excerpt: 'CLB Ngôi nhà mơ ước năm 2025 — chương trình làm quen trước khi vào lớp 1.',
      daysAgo: 80,
      content: `<h2>CLB Ngôi nhà mơ ước 2025</h2>
<p>Trường Tiểu học Lê Quý Đôn tiếp tục tổ chức CLB "Ngôi nhà mơ ước" năm 2025 dành cho các bé sinh năm 2019 chuẩn bị vào lớp 1 năm học 2025-2026.</p>
<h3>Thông tin đăng ký</h3>
<ul>
  <li>Đối tượng: Trẻ sinh năm 2019</li>
  <li>Thời gian: Thứ 7 hàng tuần, 8h30 - 11h00</li>
  <li>Địa điểm: Cơ sở 1 — Đội Cấn, Ba Đình, Hà Nội</li>
  <li>Chi phí: Miễn phí</li>
</ul>
<p>Phụ huynh đăng ký qua hotline 024 3762 1234 hoặc trực tiếp tại phòng Tuyển sinh.</p>`,
    },
    {
      title: 'Hội thảo 3 SẴN SÀNG cùng 1 năm đầu tiên',
      slug: 'hoi-thao-3-san-sang',
      excerpt: 'Hội thảo chia sẻ kinh nghiệm chuẩn bị cho con vào lớp 1 dành cho phụ huynh.',
      daysAgo: 16,
      content: `<h2>Hội thảo "3 SẴN SÀNG cùng 1 năm đầu tiên"</h2>
<p>Nhà trường trân trọng kính mời Quý Phụ huynh tham dự Hội thảo "3 Sẵn sàng cùng 1 năm đầu tiên" — chương trình chia sẻ kinh nghiệm chuẩn bị cho con vào lớp 1.</p>
<h3>3 Sẵn sàng</h3>
<ul>
  <li><strong>Sẵn sàng về tâm lý:</strong> Giúp con tự tin, vui vẻ khi đến trường</li>
  <li><strong>Sẵn sàng về kỹ năng:</strong> Tự phục vụ bản thân, giao tiếp cơ bản</li>
  <li><strong>Sẵn sàng về kiến thức:</strong> Nhận biết chữ cái, số đếm, tư duy logic</li>
</ul>
<h3>Thông tin sự kiện</h3>
<p>Thời gian: 21/03/2026, 8h30 - 11h30<br/>Địa điểm: Hội trường tầng 3, Cơ sở 1<br/>Diễn giả: PGS.TS Nguyễn Thị Minh Phương — Chuyên gia Giáo dục Tiểu học</p>`,
    },
    {
      title: 'Quy trình tuyển sinh và nhập học',
      slug: 'quy-trinh-tuyen-sinh-nhap-hoc',
      excerpt: 'Hướng dẫn chi tiết quy trình tuyển sinh và thủ tục nhập học tại trường.',
      daysAgo: 42,
      content: `<h2>Quy trình tuyển sinh và nhập học</h2>
<p>Để Quý Phụ huynh nắm rõ quy trình, nhà trường xin thông báo các bước tuyển sinh và nhập học như sau:</p>
<h3>Bước 1: Đăng ký ghi danh</h3>
<p>Phụ huynh đăng ký online hoặc nộp hồ sơ trực tiếp tại Phòng Tuyển sinh.</p>
<h3>Bước 2: Tham quan trường</h3>
<p>Phụ huynh và con được mời tham quan cơ sở vật chất, gặp gỡ Ban Giám hiệu.</p>
<h3>Bước 3: Đánh giá đầu vào</h3>
<p>Học sinh tham gia buổi đánh giá năng lực (không phải thi tuyển) trong môi trường thân thiện.</p>
<h3>Bước 4: Thông báo kết quả</h3>
<p>Nhà trường gửi thông báo kết quả trong vòng 7 ngày làm việc.</p>
<h3>Bước 5: Hoàn tất nhập học</h3>
<p>Phụ huynh nộp đầy đủ hồ sơ gốc và hoàn tất thủ tục tài chính.</p>`,
    },
    {
      title: 'Chương trình học bổng năm 2026',
      slug: 'chuong-trinh-hoc-bong-2026',
      excerpt: 'Thông báo chương trình học bổng dành cho học sinh có thành tích xuất sắc.',
      daysAgo: 48,
      content: `<h2>Chương trình học bổng năm 2026</h2>
<p>Trường Tiểu học Lê Quý Đôn trân trọng thông báo Chương trình Học bổng năm 2026 nhằm khuyến khích và hỗ trợ các em học sinh có thành tích học tập xuất sắc.</p>
<h3>Các loại học bổng</h3>
<ul>
  <li><strong>Học bổng Toàn phần (100%):</strong> Dành cho học sinh đạt giải Nhất cấp Thành phố trở lên</li>
  <li><strong>Học bổng Bán phần (50%):</strong> Dành cho học sinh đạt giải Nhì, Ba cấp Thành phố</li>
  <li><strong>Học bổng Khuyến học (30%):</strong> Dành cho học sinh có hoàn cảnh khó khăn, học lực Giỏi</li>
</ul>
<h3>Thời gian nộp hồ sơ</h3>
<p>Từ 01/03/2026 đến 30/04/2026. Chi tiết xin liên hệ Phòng Tuyển sinh.</p>`,
    },
    {
      title: 'Lịch tham quan trường dành cho phụ huynh',
      slug: 'lich-tham-quan-truong',
      excerpt: 'Lịch tham quan trường hàng tuần dành cho phụ huynh quan tâm đến môi trường học tập.',
      daysAgo: 53,
      content: `<h2>Lịch tham quan trường</h2>
<p>Nhà trường tổ chức các buổi tham quan (Open House) hàng tuần dành cho Quý Phụ huynh muốn tìm hiểu về môi trường học tập và chương trình giáo dục tại Lê Quý Đôn.</p>
<h3>Lịch tham quan</h3>
<ul>
  <li><strong>Thứ 3 hàng tuần:</strong> 9h00 - 11h00 (Cơ sở 1 — Đội Cấn)</li>
  <li><strong>Thứ 5 hàng tuần:</strong> 9h00 - 11h00 (Cơ sở 2 — Trung Kính)</li>
</ul>
<h3>Nội dung buổi tham quan</h3>
<ul>
  <li>Giới thiệu triết lý giáo dục và chương trình đào tạo</li>
  <li>Tham quan lớp học, phòng chức năng, sân chơi</li>
  <li>Giao lưu với Ban Giám hiệu và giáo viên</li>
  <li>Giải đáp thắc mắc về tuyển sinh</li>
</ul>
<p>Đăng ký trước qua hotline 024 3762 1234 để được sắp xếp lịch phù hợp.</p>`,
    },
  ],
  'thuc-don': [
    {
      title: 'Thực đơn CLB Ngôi nhà mơ ước 11/4/2026',
      slug: 'thuc-don-clb-nnmu-11-04-2026',
      excerpt: 'Thực đơn bữa ăn nhẹ CLB Ngôi nhà mơ ước ngày 11/4/2026.',
      daysAgo: 0,
      content: `<h2>Thực đơn CLB Ngôi nhà mơ ước — 11/4/2026</h2>
<h3>Bữa sáng (9h00)</h3>
<ul>
  <li>Bánh mì sandwich trứng ốp la</li>
  <li>Sữa tươi Vinamilk 180ml</li>
  <li>Chuối tiêu</li>
</ul>
<h3>Bữa phụ (10h30)</h3>
<ul>
  <li>Sữa chua Vinamilk</li>
  <li>Bánh quy bơ</li>
</ul>
<p>Thực đơn được xây dựng bởi chuyên gia dinh dưỡng, đảm bảo đầy đủ dinh dưỡng cho các bé 5 tuổi.</p>`,
    },
    {
      title: 'Thực đơn tuần 06/4 - 10/4/2026',
      slug: 'thuc-don-tuan-06-10-04-2026',
      excerpt: 'Thực đơn bán trú tuần 06/4 - 10/4/2026 cho học sinh toàn trường.',
      daysAgo: 1,
      content: `<h2>Thực đơn tuần 06/4 - 10/4/2026</h2>
<h3>Thứ 2 (06/4)</h3>
<ul>
  <li>Cơm trắng, thịt gà rang gừng, canh bí đỏ nấu tôm, rau muống luộc</li>
  <li>Tráng miệng: Dưa hấu</li>
</ul>
<h3>Thứ 3 (07/4)</h3>
<ul>
  <li>Cơm trắng, cá basa sốt cà chua, canh rau ngót thịt băm, đậu phụ nhồi thịt</li>
  <li>Tráng miệng: Sữa chua</li>
</ul>
<h3>Thứ 4 (08/4)</h3>
<ul>
  <li>Phở bò Hà Nội, nem rán, salad rau trộn</li>
  <li>Tráng miệng: Chuối</li>
</ul>
<h3>Thứ 5 (09/4)</h3>
<ul>
  <li>Cơm trắng, sườn xào chua ngọt, canh cải thảo nấu thịt, trứng chiên</li>
  <li>Tráng miệng: Cam</li>
</ul>
<h3>Thứ 6 (10/4)</h3>
<ul>
  <li>Mì Ý sốt bò bằm, cánh gà chiên giòn, salad dầu giấm</li>
  <li>Tráng miệng: Thạch rau câu</li>
</ul>`,
    },
    {
      title: 'Thực đơn CLB NNMU 04/4/2026',
      slug: 'thuc-don-clb-nnmu-04-04-2026',
      excerpt: 'Thực đơn bữa ăn nhẹ CLB Ngôi nhà mơ ước ngày 04/4/2026.',
      daysAgo: 5,
      content: `<h2>Thực đơn CLB Ngôi nhà mơ ước — 04/4/2026</h2>
<h3>Bữa sáng (9h00)</h3>
<ul>
  <li>Xôi gấc đậu xanh</li>
  <li>Sữa tươi Vinamilk 180ml</li>
  <li>Táo</li>
</ul>
<h3>Bữa phụ (10h30)</h3>
<ul>
  <li>Bánh flan caramel</li>
  <li>Nước cam ép</li>
</ul>`,
    },
    {
      title: 'Thực đơn tuần 30/3 - 03/4/2026',
      slug: 'thuc-don-tuan-30-03-03-04-2026',
      excerpt: 'Thực đơn bán trú tuần 30/3 - 03/4/2026.',
      daysAgo: 8,
      content: `<h2>Thực đơn tuần 30/3 - 03/4/2026</h2>
<h3>Thứ 2 (30/3)</h3>
<ul>
  <li>Cơm trắng, thịt bò xào ớt chuông, canh bầu nấu tôm, giá đỗ xào</li>
  <li>Tráng miệng: Thanh long</li>
</ul>
<h3>Thứ 3 (31/3)</h3>
<ul>
  <li>Cơm trắng, cá hồi áp chảo, canh mồng tơi nấu cua, đậu cô ve luộc</li>
  <li>Tráng miệng: Sữa chua nha đam</li>
</ul>
<h3>Thứ 4 (01/4)</h3>
<ul>
  <li>Bún chả Hà Nội, chả giò, rau sống</li>
  <li>Tráng miệng: Xoài</li>
</ul>
<h3>Thứ 5 (02/4)</h3>
<ul>
  <li>Cơm trắng, gà nướng mật ong, canh su hào nấu sườn, rau cải luộc</li>
  <li>Tráng miệng: Ổi</li>
</ul>
<h3>Thứ 6 (03/4)</h3>
<ul>
  <li>Cơm chiên Dương Châu, canh wonton, gà viên sốt BBQ</li>
  <li>Tráng miệng: Chè đậu đỏ</li>
</ul>`,
    },
    {
      title: 'Thực đơn CLB NNMU 28/3/2026',
      slug: 'thuc-don-clb-nnmu-28-03-2026',
      excerpt: 'Thực đơn bữa ăn nhẹ CLB Ngôi nhà mơ ước ngày 28/3/2026.',
      daysAgo: 12,
      content: `<h2>Thực đơn CLB Ngôi nhà mơ ước — 28/3/2026</h2>
<h3>Bữa sáng (9h00)</h3>
<ul>
  <li>Bánh cuốn nóng nhân thịt</li>
  <li>Sữa tươi Vinamilk 180ml</li>
  <li>Chuối</li>
</ul>
<h3>Bữa phụ (10h30)</h3>
<ul>
  <li>Sữa chua trái cây</li>
  <li>Bánh gạo Hàn Quốc</li>
</ul>`,
    },
    {
      title: 'Thực đơn tuần 23/3 - 27/3/2026',
      slug: 'thuc-don-tuan-23-27-03-2026',
      excerpt: 'Thực đơn bán trú tuần 23/3 - 27/3/2026.',
      daysAgo: 15,
      content: `<h2>Thực đơn tuần 23/3 - 27/3/2026</h2>
<h3>Thứ 2 (23/3)</h3>
<ul>
  <li>Cơm trắng, thịt kho tàu, canh chua cá lóc, rau muống xào tỏi</li>
  <li>Tráng miệng: Dưa hấu</li>
</ul>
<h3>Thứ 3 (24/3)</h3>
<ul>
  <li>Cơm trắng, gà rang muối, canh bí xanh nấu tôm, đậu phụ sốt cà</li>
  <li>Tráng miệng: Cam</li>
</ul>
<h3>Thứ 4 (25/3)</h3>
<ul>
  <li>Bún bò Huế, chả cua, rau sống</li>
  <li>Tráng miệng: Táo</li>
</ul>
<h3>Thứ 5 (26/3)</h3>
<ul>
  <li>Cơm trắng, cá thu sốt cà, canh rau đay nấu cua, trứng hấp</li>
  <li>Tráng miệng: Sữa chua</li>
</ul>
<h3>Thứ 6 (27/3)</h3>
<ul>
  <li>Nui xào bò rau củ, cánh gà chiên nước mắm, súp ngô</li>
  <li>Tráng miệng: Thạch trái cây</li>
</ul>`,
    },
    {
      title: 'Thực đơn CLB NNMU 21/3/2026',
      slug: 'thuc-don-clb-nnmu-21-03-2026',
      excerpt: 'Thực đơn bữa ăn nhẹ CLB Ngôi nhà mơ ước ngày 21/3/2026.',
      daysAgo: 19,
      content: `<h2>Thực đơn CLB Ngôi nhà mơ ước — 21/3/2026</h2>
<h3>Bữa sáng (9h00)</h3>
<ul>
  <li>Cháo gà hạt sen</li>
  <li>Sữa tươi Vinamilk 180ml</li>
  <li>Lê</li>
</ul>
<h3>Bữa phụ (10h30)</h3>
<ul>
  <li>Bánh bông lan trứng muối</li>
  <li>Nước dâu ép</li>
</ul>`,
    },
    {
      title: 'Thực đơn tuần 16/3 - 20/3/2026',
      slug: 'thuc-don-tuan-16-20-03-2026',
      excerpt: 'Thực đơn bán trú tuần 16/3 - 20/3/2026.',
      daysAgo: 22,
      content: `<h2>Thực đơn tuần 16/3 - 20/3/2026</h2>
<h3>Thứ 2 (16/3)</h3>
<ul>
  <li>Cơm trắng, thịt lợn om nấm, canh bắp cải nấu giò sống, salad Nga</li>
  <li>Tráng miệng: Chuối</li>
</ul>
<h3>Thứ 3 (17/3)</h3>
<ul>
  <li>Cơm trắng, cá diêu hồng chiên xù, canh mướp nấu tôm, bông cải luộc</li>
  <li>Tráng miệng: Dưa lưới</li>
</ul>
<h3>Thứ 4 (18/3)</h3>
<ul>
  <li>Mì Quảng, bánh tráng, rau sống</li>
  <li>Tráng miệng: Sữa chua</li>
</ul>
<h3>Thứ 5 (19/3)</h3>
<ul>
  <li>Cơm trắng, vịt quay, canh khoai mỡ nấu sườn, đậu đũa luộc</li>
  <li>Tráng miệng: Cam</li>
</ul>
<h3>Thứ 6 (20/3)</h3>
<ul>
  <li>Cơm gà Hải Nam, canh rong biển đậu phụ, rau cải ngọt xào tỏi</li>
  <li>Tráng miệng: Kem que</li>
</ul>`,
    },
  ],
};

// ─── EVENTS ───────────────────────────────────────────────

const EVENTS = [
  {
    title: 'Kỷ niệm 20 năm thành lập Hệ thống Trường Liên cấp Lê Quý Đôn',
    description: 'Lễ kỷ niệm 20 năm thành lập với sự tham gia của các thế hệ cựu học sinh, phụ huynh và đối tác giáo dục.',
    startDate: '2025-08-04T08:00:00.000Z',
    endDate: '2025-08-04T17:00:00.000Z',
    location: 'Cơ sở 1 — Đội Cấn, Ba Đình, Hà Nội',
    imageUrl: thumbnail('event-20-nam'),
    status: 'past' as const,
  },
  {
    title: 'Hội thảo 3 SẴN SÀNG cùng con vào lớp 1',
    description: 'Chương trình chia sẻ kinh nghiệm chuẩn bị tâm lý, kỹ năng và kiến thức cho con trước khi vào lớp 1. Diễn giả: PGS.TS Nguyễn Thị Minh Phương.',
    startDate: '2026-03-21T01:30:00.000Z',
    endDate: '2026-03-21T04:30:00.000Z',
    location: 'Hội trường tầng 3, Cơ sở 1 — Đội Cấn',
    imageUrl: thumbnail('event-3-san-sang'),
    status: 'past' as const,
  },
  {
    title: 'Ngày hội Open Day 2026',
    description: 'Ngày hội mở cửa trường học — tham quan cơ sở vật chất, trải nghiệm lớp học mẫu, giao lưu với Ban Giám hiệu và giáo viên. Chương trình dành cho phụ huynh và học sinh quan tâm đến tuyển sinh.',
    startDate: '2026-05-15T01:00:00.000Z',
    endDate: '2026-05-15T05:00:00.000Z',
    location: 'Cơ sở 1 & Cơ sở 2 — Hà Nội',
    imageUrl: thumbnail('event-open-day'),
    status: 'upcoming' as const,
  },
];

// ─── FAQ ──────────────────────────────────────────────────

const FAQS = [
  {
    question: 'Đối tượng tuyển sinh?',
    answer: 'Trường Tiểu học Lê Quý Đôn tuyển sinh học sinh từ lớp 1 đến lớp 5. Đối với lớp 1, trẻ phải đủ 6 tuổi tính đến ngày 31/12 của năm nhập học (sinh năm 2020 cho năm học 2026-2027). Đối với lớp 2-5, nhà trường tuyển bổ sung học sinh chuyển trường khi còn chỉ tiêu.',
    displayOrder: 1,
  },
  {
    question: 'Thời gian tuyển sinh?',
    answer: 'Nhà trường tuyển sinh quanh năm, tuy nhiên đợt tuyển sinh chính thường bắt đầu từ tháng 3 đến tháng 6 hàng năm. Phụ huynh nên đăng ký sớm để đảm bảo suất học cho con. Thông tin chi tiết về lịch tuyển sinh từng năm được cập nhật trên website và fanpage nhà trường.',
    displayOrder: 2,
  },
  {
    question: 'Hồ sơ tuyển sinh gồm những gì?',
    answer: 'Hồ sơ tuyển sinh bao gồm:\n- Đơn xin nhập học (theo mẫu nhà trường)\n- Bản sao giấy khai sinh có công chứng\n- Sổ hộ khẩu/sổ tạm trú (bản sao)\n- 04 ảnh 3x4 (chụp trong vòng 6 tháng)\n- Học bạ các năm học trước (đối với lớp 2-5)\n- Giấy chuyển trường (đối với lớp 2-5)\n- Sổ tiêm chủng (đối với lớp 1)',
    displayOrder: 3,
  },
  {
    question: 'Quy trình tuyển sinh?',
    answer: 'Quy trình tuyển sinh gồm 5 bước:\n1. Đăng ký ghi danh: Nộp hồ sơ online hoặc trực tiếp\n2. Tham quan trường: Phụ huynh và con tham quan cơ sở vật chất\n3. Đánh giá đầu vào: Buổi trải nghiệm đánh giá năng lực (không phải thi tuyển)\n4. Thông báo kết quả: Trong vòng 7 ngày làm việc\n5. Hoàn tất nhập học: Nộp hồ sơ gốc và hoàn tất thủ tục',
    displayOrder: 4,
  },
  {
    question: 'Thời gian học?',
    answer: 'Học sinh học bán trú từ thứ 2 đến thứ 6:\n- Buổi sáng: 7h15 - 11h30\n- Ăn trưa và nghỉ trưa: 11h30 - 13h30\n- Buổi chiều: 13h30 - 16h30\n- CLB ngoại khóa (tùy chọn): 16h30 - 17h30\n\nThứ 7: CLB Ngôi nhà mơ ước (dành cho bé chuẩn bị vào lớp 1), 8h30 - 11h00.',
    displayOrder: 5,
  },
  {
    question: 'Con chuyển trường từ trường khác có được không?',
    answer: 'Hoàn toàn được. Nhà trường nhận học sinh chuyển trường ở tất cả các khối lớp khi còn chỉ tiêu. Học sinh chuyển trường cần chuẩn bị: giấy chuyển trường, học bạ, và tham gia buổi đánh giá năng lực để nhà trường xếp lớp phù hợp. Nhà trường có chương trình hỗ trợ học sinh mới hòa nhập nhanh chóng.',
    displayOrder: 6,
  },
  {
    question: 'Sau khi đăng ký ghi danh, bao lâu sẽ nhận được kết quả?',
    answer: 'Sau khi nhận đầy đủ hồ sơ đăng ký, nhà trường sẽ liên hệ sắp xếp lịch tham quan và đánh giá trong vòng 3-5 ngày làm việc. Kết quả đánh giá sẽ được thông báo trong vòng 7 ngày làm việc kể từ ngày đánh giá. Tổng thời gian từ khi nộp hồ sơ đến khi có kết quả thường là 2-3 tuần.',
    displayOrder: 7,
  },
  {
    question: 'Tôi cần tư vấn chi tiết hơn thì liên hệ ở đâu?',
    answer: 'Quý Phụ huynh có thể liên hệ qua các kênh sau:\n- Hotline: 024 3762 1234 (giờ hành chính)\n- Email: tuyensinh@lequydonhanoi.edu.vn\n- Fanpage Facebook: Trường Tiểu học Lê Quý Đôn Hà Nội\n- Trực tiếp tại Phòng Tuyển sinh, Cơ sở 1 — Đội Cấn, Ba Đình, Hà Nội\n\nNhân viên tuyển sinh sẵn sàng hỗ trợ từ thứ 2 đến thứ 7 (8h00 - 17h00).',
    displayOrder: 8,
  },
];

// ─── MAIN ─────────────────────────────────────────────────

async function main() {
  console.log('=== SEED DEMO DATA — LeQuyDon ===\n');

  // 1. Login
  await login();

  // 2. Tao categories
  console.log('\n📁 Tao categories...');
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    try {
      const result = await apiPost('/categories', {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      });
      const id = result.data?.id || result.id;
      categoryMap[cat.slug] = id;
      console.log(`   ✅ ${cat.name} (${id})`);
    } catch (err: any) {
      console.error(`   ❌ ${cat.name}: ${err.message}`);
    }
  }

  // 3. Tao articles
  console.log('\n📝 Tao articles...');
  let articleCount = 0;
  for (const [catSlug, articles] of Object.entries(ARTICLES)) {
    const categoryId = categoryMap[catSlug];
    if (!categoryId) {
      console.error(`   ⚠️  Skip ${catSlug} — khong tim thay category`);
      continue;
    }
    console.log(`   📂 ${catSlug} (${articles.length} bai):`);
    for (const article of articles) {
      try {
        await apiPost('/articles', {
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          categoryId,
          thumbnailUrl: thumbnail(article.slug),
          status: 'published',
          publishedAt: recentDate(article.daysAgo),
        });
        articleCount++;
        console.log(`      ✅ ${article.title.substring(0, 50)}...`);
      } catch (err: any) {
        console.error(`      ❌ ${article.title.substring(0, 50)}: ${err.message}`);
      }
    }
  }

  // 4. Tao events
  console.log('\n📅 Tao events...');
  for (const event of EVENTS) {
    try {
      await apiPost('/events', event);
      console.log(`   ✅ ${event.title}`);
    } catch (err: any) {
      console.error(`   ❌ ${event.title}: ${err.message}`);
    }
  }

  // 5. Tao FAQs
  console.log('\n❓ Tao FAQs...');
  for (const faq of FAQS) {
    try {
      await apiPost('/admissions/faq', {
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.displayOrder,
        isVisible: true,
      });
      console.log(`   ✅ ${faq.question}`);
    } catch (err: any) {
      console.error(`   ❌ ${faq.question}: ${err.message}`);
    }
  }

  // Summary
  console.log('\n=== HOAN TAT ===');
  console.log(`Categories: ${Object.keys(categoryMap).length}/${CATEGORIES.length}`);
  console.log(`Articles: ${articleCount}`);
  console.log(`Events: ${EVENTS.length}`);
  console.log(`FAQs: ${FAQS.length}`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
