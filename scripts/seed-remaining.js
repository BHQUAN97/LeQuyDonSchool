/**
 * Seed du lieu con thieu cho LeQuyDon qua API
 * - Insert lai cac articles bi loi JSON
 * - Insert FAQs (endpoint: /admissions/faq)
 * Chay: node scripts/seed-remaining.js [BASE_URL]
 */

const BASE_URL = process.argv[2] || 'http://localhost:4200/api';
let TOKEN = '';

async function login() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@lequydon.edu.vn', password: 'Admin@123456' }),
  });
  const json = await res.json();
  if (!json.success) throw new Error('Login failed: ' + json.message);
  TOKEN = json.data.accessToken;
  console.log('Login OK');
}

async function post(endpoint, data) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.success) {
    process.stdout.write('.');
    return json.data;
  } else {
    console.log(`\n  WARN: ${endpoint} -> ${json.message}`);
    return null;
  }
}

// Lay danh sach categories
async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, {
    headers: { 'Authorization': `Bearer ${TOKEN}` },
  });
  const json = await res.json();
  return json.data || [];
}

// Lay articles hien co
async function getExistingArticles() {
  const res = await fetch(`${BASE_URL}/articles?limit=100`, {
    headers: { 'Authorization': `Bearer ${TOKEN}` },
  });
  const json = await res.json();
  return (json.data || []).map(a => a.slug);
}

const IMGS = [
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
  'https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800',
  'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
  'https://images.unsplash.com/photo-1564429238961-bf8b8bd096c4?w=800',
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800',
  'https://images.unsplash.com/photo-1594312915251-48db9280c8f0?w=800',
  'https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=800',
  'https://images.unsplash.com/photo-1548449112-96a38a643324?w=800',
  'https://images.unsplash.com/photo-1605326073732-23fc92e28b08?w=800',
];

function img(i) { return IMGS[i % IMGS.length]; }

// Articles bi loi JSON tu bash script (do co dau " trong content)
function getFailedArticles(catMap) {
  return [
    // TIN TUC
    {
      title: 'Trường Tiểu học Lê Quý Đôn khai giảng năm học 2025-2026',
      slug: 'khai-giang-nam-hoc-2025-2026',
      excerpt: 'Sáng ngày 5/9/2025, Trường Tiểu học Lê Quý Đôn long trọng tổ chức lễ khai giảng năm học mới 2025-2026.',
      content: '<h2>Lễ khai giảng trang trọng và ấm áp</h2><p>Sáng ngày 5/9/2025, trong không khí trang nghiêm và phấn khởi, Trường Tiểu học Lê Quý Đôn đã long trọng tổ chức Lễ khai giảng năm học 2025-2026. Buổi lễ có sự tham gia của đại diện Phòng GD&amp;ĐT quận Nam Từ Liêm, Ban Giám hiệu nhà trường, toàn thể giáo viên, nhân viên, hơn 1.500 học sinh và đông đảo phụ huynh.</p><p>Phát biểu tại buổi lễ, Thầy Hiệu trưởng nhấn mạnh: <em>Năm học 2025-2026 là năm bản lề quan trọng, đánh dấu chặng đường 20 năm xây dựng và phát triển của nhà trường.</em></p><h3>Điểm nhấn của lễ khai giảng</h3><ul><li>Tiết mục văn nghệ đặc sắc do học sinh các khối trình diễn</li><li>Trao học bổng cho 50 học sinh xuất sắc</li><li>Ra mắt CLB Robotics và CLB Tiếng Anh PLC mới</li><li>Khánh thành phòng Lab STEM hiện đại</li></ul><p>Năm học mới hứa hẹn nhiều hoạt động bổ ích, giúp các em học sinh phát triển toàn diện trong môi trường giáo dục hiện đại và nhân văn.</p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(0), status: 'published', publishedAt: '2025-09-05T08:00:00.000Z',
    },
    {
      title: 'Họp phụ huynh đầu năm học 2025-2026: Đồng hành cùng con',
      slug: 'hop-phu-huynh-dau-nam-2025-2026',
      excerpt: 'Ngày 10/9/2025, Trường Tiểu học Lê Quý Đôn tổ chức buổi họp phụ huynh đầu năm.',
      content: '<h2>Buổi họp phụ huynh ý nghĩa</h2><p>Với phương châm Gia đình và nhà trường cùng đồng hành, buổi họp phụ huynh đầu năm được tổ chức tại từng lớp với sự chủ trì của giáo viên chủ nhiệm.</p><p>Nội dung chính bao gồm:</p><ul><li>Giới thiệu chương trình Quốc gia nâng cao và Tiếng Anh tăng cường</li><li>Kế hoạch hoạt động ngoại khóa năm học mới</li><li>Chế độ dinh dưỡng học đường với menu 4 tuần không trùng lặp</li><li>Ứng dụng quản lý học sinh thông minh</li><li>Bầu Ban đại diện cha mẹ học sinh</li></ul><p>Phụ huynh tích cực đặt câu hỏi và đóng góp ý kiến xây dựng.</p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(1), status: 'published', publishedAt: '2025-09-10T08:00:00.000Z',
    },
    {
      title: 'Kết quả thi Olympic Toán cấp Quận năm 2026',
      slug: 'ket-qua-olympic-toan-cap-quan-2026',
      excerpt: 'Học sinh Trường Tiểu học Lê Quý Đôn đạt thành tích xuất sắc tại kỳ thi Olympic Toán cấp Quận năm 2026 với 45 giải thưởng.',
      content: '<h2>45 giải thưởng Olympic Toán cấp Quận</h2><p>Trong kỳ thi Olympic Toán cấp Quận Nam Từ Liêm năm 2026, đội tuyển Toán đã xuất sắc giành được 45 giải thưởng, bao gồm:</p><ul><li><strong>8 giải Nhất</strong> — cao nhất trong các trường tham gia</li><li><strong>12 giải Nhì</strong></li><li><strong>15 giải Ba</strong></li><li><strong>10 giải Khuyến khích</strong></li></ul><p>Đặc biệt, em Nguyễn Minh Anh (lớp 5A1) đạt điểm cao nhất toàn quận với 98/100 điểm.</p><p>Cô Nguyễn Thị Hương, trưởng bộ môn Toán, cho biết: Kết quả này là minh chứng cho phương pháp dạy học tích cực, phát huy tư duy sáng tạo mà nhà trường đã áp dụng trong nhiều năm qua.</p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(3), status: 'published', publishedAt: '2026-01-20T08:00:00.000Z',
    },
    {
      title: 'Trường Tiểu học Lê Quý Đôn đón Đoàn kiểm tra chất lượng giáo dục',
      slug: 'don-doan-kiem-tra-chat-luong-giao-duc',
      excerpt: 'Ngày 15/11/2025, Đoàn kiểm tra của Sở GD&ĐT Hà Nội đánh giá cao chất lượng giáo dục.',
      content: '<h2>Đoàn kiểm tra Sở GD&amp;ĐT Hà Nội đánh giá cao</h2><p>Ngày 15/11/2025, Đoàn kiểm tra của Sở GD&amp;ĐT Hà Nội do ThS. Trần Văn Minh — Phó Giám đốc Sở dẫn đầu đã đến thăm và kiểm tra toàn diện hoạt động giáo dục.</p><p>Qua một ngày kiểm tra thực tế, Đoàn đánh giá:</p><ul><li>Cơ sở vật chất hiện đại, đạt chuẩn quốc tế</li><li>Chương trình giáo dục phong phú, chú trọng phát triển toàn diện</li><li>Đội ngũ giáo viên có chuyên môn cao, tận tâm</li><li>Công tác quản lý học sinh khoa học, minh bạch</li><li>Bữa ăn học đường đảm bảo dinh dưỡng và an toàn</li></ul><p>ThS. Trần Văn Minh nhận xét: <em>Trường Tiểu học Lê Quý Đôn là một trong những trường tiểu học ngoài công lập tiêu biểu của Hà Nội.</em></p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(5), status: 'published', publishedAt: '2025-11-15T08:00:00.000Z',
    },
    {
      title: 'Phát động phong trào Trường học xanh - sạch - đẹp',
      slug: 'phong-trao-truong-hoc-xanh-sach-dep',
      excerpt: 'Phong trào Trường học xanh - sạch - đẹp nhằm nâng cao ý thức bảo vệ môi trường cho học sinh.',
      content: '<h2>Trường học xanh - sạch - đẹp</h2><p>Ngày 20/10/2025, Trường Tiểu học Lê Quý Đôn chính thức phát động phong trào với sự tham gia nhiệt tình của toàn thể cán bộ giáo viên và học sinh.</p><p>Phong trào bao gồm các hoạt động:</p><ul><li>Trồng cây xanh tại khuôn viên trường</li><li>Phân loại rác tại nguồn</li><li>Thi đua lớp học sạch đẹp nhất</li><li>Sáng kiến giảm rác thải nhựa</li></ul><p>Mỗi lớp được giao chăm sóc một bồn cây, học sinh luân phiên tưới nước và theo dõi sự phát triển.</p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(6), status: 'published', publishedAt: '2025-10-20T08:00:00.000Z',
    },
    {
      title: 'Trường Tiểu học Lê Quý Đôn ra mắt ứng dụng quản lý học sinh',
      slug: 'ra-mat-ung-dung-quan-ly-hoc-sinh',
      excerpt: 'Ứng dụng di động giúp phụ huynh theo dõi kết quả học tập, lịch học, bữa ăn và sức khỏe.',
      content: '<h2>Ứng dụng quản lý học sinh thông minh</h2><p>Từ tháng 10/2025, Trường Tiểu học Lê Quý Đôn chính thức triển khai ứng dụng di động LQD Connect trên cả iOS và Android.</p><h3>Tính năng chính</h3><ul><li>Xem kết quả học tập, nhận xét của giáo viên theo thời gian thực</li><li>Thời khóa biểu và lịch hoạt động ngoại khóa</li><li>Menu bữa ăn hàng ngày với thông tin dinh dưỡng</li><li>Đăng ký xe đưa đón, CLB ngoại khóa online</li><li>Chat trực tiếp với giáo viên chủ nhiệm</li><li>Nhận thông báo quan trọng từ nhà trường</li></ul><p>Ứng dụng nhận được phản hồi tích cực từ 90% phụ huynh sau 2 tuần sử dụng.</p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(9), status: 'published', publishedAt: '2025-10-01T08:00:00.000Z',
    },
    {
      title: 'Giáo viên Lê Quý Đôn đạt giải Giáo viên dạy giỏi cấp Thành phố',
      slug: 'giao-vien-dat-giai-day-gioi-cap-thanh-pho',
      excerpt: 'Cô Trần Thị Mai Hương xuất sắc đạt giải Nhất cuộc thi Giáo viên dạy giỏi cấp Thành phố Hà Nội.',
      content: '<h2>Vinh danh giáo viên xuất sắc</h2><p>Cô Trần Thị Mai Hương — giáo viên chủ nhiệm lớp 4A2 đã xuất sắc đạt giải Nhất cuộc thi Giáo viên dạy giỏi cấp Thành phố Hà Nội năm 2025.</p><p>Với bài giảng Toán lớp 4 chủ đề Phân số trong đời sống, cô Hương đã sáng tạo phương pháp dạy học trải nghiệm, giúp học sinh tự khám phá kiến thức qua các hoạt động thực tế.</p><p>Cô chia sẻ: <em>Tôi luôn tin rằng mỗi đứa trẻ đều có tiềm năng riêng. Nhiệm vụ của giáo viên là tìm ra cách để khơi dậy niềm đam mê học tập trong mỗi em.</em></p><p>Đây là giải thưởng cá nhân thứ 3 của cô Hương trong 5 năm gần đây.</p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(10), status: 'published', publishedAt: '2025-12-20T08:00:00.000Z',
    },
    {
      title: 'Ngày hội Đọc sách tại Trường Lê Quý Đôn 2026',
      slug: 'ngay-hoi-doc-sach-2026',
      excerpt: 'Ngày hội Đọc sách 2026 thu hút hơn 1.200 học sinh tham gia với nhiều hoạt động sáng tạo.',
      content: '<h2>Ngày hội Đọc sách 2026</h2><p>Hưởng ứng Ngày Sách và Văn hóa đọc Việt Nam 21/4, Trường Tiểu học Lê Quý Đôn tổ chức Ngày hội Đọc sách với chủ đề Sách — Người bạn đồng hành.</p><h3>Các hoạt động</h3><ul><li>Triển lãm sách với hơn 5.000 đầu sách các thể loại</li><li>Cuộc thi kể chuyện theo sách cho học sinh các khối</li><li>Workshop làm bookmark sáng tạo</li><li>Giao lưu với nhà văn Nguyễn Nhật Ánh</li><li>Quyên góp sách cho thư viện vùng cao</li></ul><p>Thư viện nhà trường cũng nhân dịp này bổ sung thêm 500 đầu sách mới.</p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(12), status: 'published', publishedAt: '2026-04-10T08:00:00.000Z',
    },
    {
      title: 'Kết quả cuộc thi Viết chữ đẹp cấp Trường năm 2026',
      slug: 'ket-qua-cuoc-thi-viet-chu-dep-2026',
      excerpt: 'Cuộc thi Viết chữ đẹp thu hút 800 học sinh tham gia, chọn ra 50 bài xuất sắc nhất.',
      content: '<h2>Nét chữ nết người</h2><p>Với phương châm Nét chữ - Nết người, cuộc thi Viết chữ đẹp năm 2026 thu hút sự tham gia nhiệt tình của 800 học sinh từ khối 1 đến khối 5.</p><p>Ban giám khảo gồm các thầy cô có kinh nghiệm đã chọn ra:</p><ul><li>10 giải Nhất (mỗi khối 2 giải)</li><li>15 giải Nhì</li><li>25 giải Ba</li></ul><p>50 bài viết xuất sắc nhất được gửi tham dự cuộc thi cấp Quận.</p>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(14), status: 'published', publishedAt: '2026-03-15T08:00:00.000Z',
    },
    {
      title: 'Hội thảo Giáo dục hiện đại tại Trường Lê Quý Đôn',
      slug: 'hoi-thao-giao-duc-hien-dai-2026',
      excerpt: 'Hội thảo quy tụ 200 giáo viên và chuyên gia giáo dục hàng đầu.',
      content: '<h2>Hội thảo Giáo dục hiện đại</h2><p>Ngày 5/3/2026, Trường Tiểu học Lê Quý Đôn phối hợp với Viện Khoa học Giáo dục Việt Nam tổ chức Hội thảo Giáo dục hiện đại — Phát triển toàn diện.</p><p>Hội thảo quy tụ hơn 200 đại biểu gồm giáo viên, nhà quản lý giáo dục, chuyên gia tâm lý và đại diện phụ huynh.</p><h3>Nội dung chính</h3><ul><li>Phương pháp dạy học tích cực trong bối cảnh chuyển đổi số</li><li>Ứng dụng AI hỗ trợ cá nhân hóa việc học</li><li>Phát triển kỹ năng mềm cho học sinh tiểu học</li><li>Vai trò của gia đình trong giáo dục hiện đại</li></ul>',
      categoryId: catMap['tin-tuc'], thumbnailUrl: img(15), status: 'published', publishedAt: '2026-03-05T08:00:00.000Z',
    },
    // SU KIEN
    {
      title: 'Lễ kỷ niệm 20 năm thành lập Hệ thống Trường Lê Quý Đôn',
      slug: 'le-ky-niem-20-nam-thanh-lap',
      excerpt: 'Lễ kỷ niệm 20 năm thành lập (2005-2025) với chủ đề From Building to Blooming.',
      content: '<h2>20 năm xây dựng và phát triển</h2><p>Ngày 4/8/2025, Hệ thống Trường liên cấp Lê Quý Đôn long trọng tổ chức Lễ kỷ niệm 20 năm thành lập với chủ đề From Building to Blooming — Dựng xây ngàn hoa.</p><p>Buổi lễ quy tụ hơn 3.000 khách mời gồm đại diện các cơ quan quản lý giáo dục, đối tác quốc tế PLC Sydney, cựu học sinh, phụ huynh và toàn thể cán bộ giáo viên.</p><h3>Điểm nhấn</h3><ul><li>Video hành trình 20 năm với những dấu mốc quan trọng</li><li>Tri ân các thầy cô thế hệ đầu tiên</li><li>Giao lưu cựu học sinh thành đạt</li><li>Khánh thành tòa nhà học tập mới 5 tầng</li></ul><p>20 năm — từ một cơ sở nhỏ với 200 học sinh, Lê Quý Đôn đã phát triển thành hệ thống 3 trường liên cấp với hơn 5.000 học sinh.</p>',
      categoryId: catMap['su-kien'], thumbnailUrl: img(0), status: 'published', publishedAt: '2025-08-04T08:00:00.000Z',
    },
    {
      title: 'Lễ kết nạp Đội Khối 3 tại Quảng trường Ba Đình',
      slug: 'le-ket-nap-doi-khoi-3-ba-dinh',
      excerpt: 'Học sinh Khối 3 vinh dự được kết nạp Đội tại Quảng trường Ba Đình lịch sử.',
      content: '<h2>Dấu mốc thiêng liêng</h2><p>Sáng ngày 26/3/2026, tại Quảng trường Ba Đình lịch sử, 180 học sinh Khối 3 đã vinh dự được kết nạp vào Đội Thiếu niên Tiền phong Hồ Chí Minh.</p><p>Buổi lễ diễn ra trang nghiêm với các nghi thức truyền thống: chào cờ, hát Quốc ca, tuyên thệ, đeo khăn quàng đỏ.</p><p>Em Nguyễn Hoàng Minh (lớp 3A1) xúc động chia sẻ: <em>Con rất tự hào khi được đứng tại đây, nơi Bác Hồ đọc Tuyên ngôn Độc lập. Con hứa sẽ học tập thật tốt.</em></p><p>Đây là truyền thống mỗi năm của nhà trường, giáo dục lòng yêu nước và tinh thần tự hào dân tộc cho học sinh.</p>',
      categoryId: catMap['su-kien'], thumbnailUrl: img(1), status: 'published', publishedAt: '2026-03-26T08:00:00.000Z',
    },
    {
      title: 'Ngày hội Thể thao Lê Quý Đôn 2026',
      slug: 'ngay-hoi-the-thao-2026',
      excerpt: 'Ngày hội Thể thao thường niên với điền kinh, bơi lội, bóng đá mini.',
      content: '<h2>Ngày hội Thể thao — Khỏe để học tốt</h2><p>Ngày 20/3/2026, Trường Tiểu học Lê Quý Đôn tổ chức Ngày hội Thể thao thường niên.</p><h3>Các nội dung thi đấu</h3><ul><li><strong>Điền kinh:</strong> Chạy 60m, 100m, nhảy xa, nhảy cao</li><li><strong>Bóng đá mini:</strong> Giải đấu 5 người giữa các lớp Khối 4-5</li><li><strong>Bơi lội:</strong> Bơi tự do 25m cho Khối 3-5</li><li><strong>Trò chơi dân gian:</strong> Kéo co, nhảy bao bố, đi cà kheo</li><li><strong>Aerobic:</strong> Thi đồng diễn giữa các lớp Khối 1-2</li></ul><p>Kết quả: Khối 5 giành giải Nhất toàn đoàn. Tổng cộng 120 huy chương được trao.</p>',
      categoryId: catMap['su-kien'], thumbnailUrl: img(2), status: 'published', publishedAt: '2026-03-20T08:00:00.000Z',
    },
    {
      title: 'Đêm Gala Nghệ thuật 2025 — Sắc màu tuổi thơ',
      slug: 'dem-gala-nghe-thuat-2025',
      excerpt: 'Đêm Gala với hơn 500 học sinh biểu diễn trên sân khấu hoành tráng.',
      content: '<h2>Đêm Gala — Sắc màu tuổi thơ</h2><p>Tối ngày 20/12/2025, chương trình gồm 25 tiết mục đa dạng từ múa, hát, kịch, nhạc cụ đến thời trang.</p><h3>Các tiết mục ấn tượng</h3><ul><li>Màn đồng diễn mở màn Việt Nam ơi với 200 học sinh</li><li>Vở kịch tiếng Anh The Little Prince do CLB Tiếng Anh PLC trình diễn</li><li>Biểu diễn piano và violin của nhóm học sinh tài năng</li><li>Fashion show Áo dài em mặc với thiết kế sáng tạo</li></ul><p>Đêm Gala nhận được sự cổ vũ nhiệt tình từ hơn 2.000 phụ huynh và khách mời.</p>',
      categoryId: catMap['su-kien'], thumbnailUrl: img(3), status: 'published', publishedAt: '2025-12-20T08:00:00.000Z',
    },
    {
      title: 'Tham quan dã ngoại Ecopark cho học sinh Khối 2',
      slug: 'tham-quan-da-ngoai-ecopark-khoi-2',
      excerpt: 'Chuyến dã ngoại Ecopark giúp học sinh Khối 2 trải nghiệm thiên nhiên.',
      content: '<h2>Chuyến dã ngoại bổ ích</h2><p>Ngày 15/11/2025, 280 học sinh Khối 2 đã có chuyến dã ngoại thú vị tại Khu đô thị sinh thái Ecopark (Hưng Yên).</p><p>Chương trình dã ngoại bao gồm:</p><ul><li>Tham quan vườn bách thảo với hơn 100 loài cây</li><li>Hoạt động teambuilding</li><li>Thí nghiệm khoa học ngoài trời</li><li>Picnic và trò chơi dân gian tại bãi cỏ</li><li>Vẽ tranh phong cảnh thiên nhiên</li></ul><p>Cô giáo chủ nhiệm chia sẻ: <em>Mỗi chuyến dã ngoại đều giúp các em tự tin hơn, biết cách hợp tác với bạn bè.</em></p>',
      categoryId: catMap['su-kien'], thumbnailUrl: img(4), status: 'published', publishedAt: '2025-11-15T08:00:00.000Z',
    },
    {
      title: 'Cuộc thi Hùng biện Tiếng Anh 2026 — My Dream for Vietnam',
      slug: 'cuoc-thi-hung-bien-tieng-anh-2026',
      excerpt: 'Cuộc thi thu hút 120 học sinh Khối 4-5 tham gia.',
      content: '<h2>My Dream for Vietnam</h2><p>Cuộc thi Hùng biện Tiếng Anh năm 2026 với chủ đề My Dream for Vietnam diễn ra trong 2 ngày.</p><h3>Kết quả</h3><ul><li><strong>Giải Nhất:</strong> Nguyễn Phương Linh (5A2) — My Vietnam, My Garden</li><li><strong>Giải Nhì:</strong> Trần Đức Anh (5A1) — Technology for Farmers</li><li><strong>Giải Ba:</strong> Lê Minh Châu (4A3) — Clean Water for Everyone</li></ul><p>Ban giám khảo gồm giáo viên bản ngữ từ PLC Sydney đánh giá cao khả năng phát âm và tư duy logic của học sinh.</p>',
      categoryId: catMap['su-kien'], thumbnailUrl: img(5), status: 'published', publishedAt: '2026-03-11T08:00:00.000Z',
    },
    {
      title: 'Lễ tri ân Ngày Nhà giáo Việt Nam 20/11',
      slug: 'le-tri-an-ngay-nha-giao-20-11',
      excerpt: 'Chương trình đặc biệt Thầy Cô — Người truyền cảm hứng.',
      content: '<h2>Tri ân Thầy Cô</h2><p>Ngày 20/11/2025, Trường Tiểu học Lê Quý Đôn tổ chức Lễ tri ân Ngày Nhà giáo Việt Nam.</p><h3>Chương trình</h3><ul><li>Video clip Một ngày của Thầy Cô do học sinh tự quay</li><li>Cuộc thi viết thư Em yêu Thầy Cô — 1.500 bức thư</li><li>Tiết mục ca nhạc đặc biệt của phụ huynh</li><li>Trao giải cho 20 giáo viên xuất sắc</li><li>Triển lãm tranh vẽ chân dung Thầy Cô</li></ul><p>Bức thư cảm động nhất: <em>Con yêu cô giống như yêu mẹ vậy. Cô dạy con biết đọc, biết viết, biết yêu thương bạn bè.</em></p>',
      categoryId: catMap['su-kien'], thumbnailUrl: img(6), status: 'published', publishedAt: '2025-11-20T08:00:00.000Z',
    },
    // HOAT DONG NGOAI KHOA
    {
      title: 'Chương trình Kỹ năng sống toàn diện',
      slug: 'chuong-trinh-ky-nang-song',
      excerpt: 'Kỹ năng sống toàn diện: phòng cháy, sơ cấp cứu, giao thông an toàn.',
      content: '<h2>Kỹ năng sống — Bảo vệ bản thân</h2><p>Chương trình Kỹ năng sống được tích hợp vào giờ sinh hoạt hàng tuần:</p><ul><li><strong>Phòng cháy chữa cháy:</strong> Diễn tập sơ tán mỗi quý</li><li><strong>Sơ cấp cứu:</strong> Xử lý vết thương nhẹ, gọi 115</li><li><strong>An toàn giao thông:</strong> Luật đi đường, đội mũ bảo hiểm</li><li><strong>Phòng chống xâm hại:</strong> Quy tắc 5 ngón tay</li><li><strong>Kỹ năng tài chính:</strong> Quản lý tiền tiêu vặt</li><li><strong>Phòng chống bắt nạt:</strong> Nhận diện và ứng xử đúng cách</li></ul><p>Chương trình được thiết kế bởi chuyên gia tâm lý và phối hợp với Công an Phòng cháy Quận Nam Từ Liêm.</p>',
      categoryId: catMap['hoat-dong-ngoai-khoa'], thumbnailUrl: img(4), status: 'published', publishedAt: '2025-09-25T08:00:00.000Z',
    },
    {
      title: 'CLB Nấu ăn nhí — Bé vào bếp cùng Mẹ',
      slug: 'clb-nau-an-nhi-be-vao-bep',
      excerpt: 'CLB Nấu ăn nhí giúp học sinh học cách chế biến món ăn đơn giản.',
      content: '<h2>CLB Nấu ăn nhí</h2><p>CLB Nấu ăn nhí Bé vào bếp cùng Mẹ là hoạt động ngoại khóa độc đáo.</p><h3>Nội dung sinh hoạt</h3><ul><li>Học cách chế biến các món ăn đơn giản: salad, sandwich, bánh cuốn</li><li>Tìm hiểu nhóm dinh dưỡng: tinh bột, protein, vitamin, chất xơ</li><li>An toàn vệ sinh thực phẩm</li><li>Bữa ăn cân bằng cho học sinh tiểu học</li></ul><p>Mỗi tháng, CLB tổ chức 1 buổi Bếp yêu thương mời phụ huynh cùng nấu ăn với các em.</p>',
      categoryId: catMap['hoat-dong-ngoai-khoa'], thumbnailUrl: img(6), status: 'published', publishedAt: '2026-01-10T08:00:00.000Z',
    },
    {
      title: 'Học sinh Lê Quý Đôn tham gia thiện nguyện vùng cao',
      slug: 'hoc-sinh-thien-nguyen-vung-cao',
      excerpt: 'Chương trình Sách cho em quyên góp 3.000 cuốn sách cho trẻ em vùng cao Hà Giang.',
      content: '<h2>Sách cho em — Chương trình thiện nguyện</h2><p>Trong tháng 12/2025, nhà trường phát động chương trình Sách cho em nhằm quyên góp sách cho trẻ em vùng cao.</p><p>Kết quả: hơn 3.000 cuốn sách, 200 bộ quần áo ấm, 100 bộ đồ dùng học tập.</p><p>Ngày 20/12/2025, đoàn đại diện nhà trường đã trực tiếp trao quà tại 3 điểm trường ở huyện Mèo Vạc, Hà Giang.</p><p>Em Phạm Minh Anh (5A2) chia sẻ: <em>Con rất vui khi nhìn thấy các bạn nhỏ vùng cao cười khi nhận sách.</em></p>',
      categoryId: catMap['hoat-dong-ngoai-khoa'], thumbnailUrl: img(8), status: 'published', publishedAt: '2025-12-20T08:00:00.000Z',
    },
    {
      title: 'CLB Đọc sách — 30 phút đọc mỗi ngày',
      slug: 'clb-doc-sach-30-phut-moi-ngay',
      excerpt: 'CLB Đọc sách khuyến khích thói quen đọc sách mỗi ngày.',
      content: '<h2>CLB Đọc sách</h2><p>CLB Đọc sách 30 phút mỗi ngày khuyến khích học sinh duy trì thói quen đọc sách:</p><h3>Cách thức hoạt động</h3><ul><li>Mỗi học sinh có sổ theo dõi đọc sách</li><li>Chia sẻ sách hay mỗi tuần tại lớp</li><li>Viết cảm nhận ngắn sau mỗi cuốn sách</li><li>Thi Đại sứ đọc sách mỗi quý</li></ul><p>Thư viện trường mở cửa từ 7:00-17:30 với hơn 15.000 đầu sách. Trung bình mỗi học sinh đọc 24 cuốn sách/năm, gấp 3 lần mức trung bình quốc gia.</p>',
      categoryId: catMap['hoat-dong-ngoai-khoa'], thumbnailUrl: img(9), status: 'published', publishedAt: '2026-02-01T08:00:00.000Z',
    },
    // HOC TAP
    {
      title: 'Bí quyết học tốt từ học sinh xuất sắc',
      slug: 'bi-quyet-hoc-tot-hoc-sinh-xuat-sac',
      excerpt: '5 học sinh xuất sắc nhất trường chia sẻ bí quyết học tập hiệu quả.',
      content: '<h2>Bí quyết học tốt</h2><h3>1. Nguyễn Minh Anh (5A1) — Thủ khoa Toán</h3><p><em>Em luôn làm bài tập ngay khi về nhà, không để dồn.</em></p><h3>2. Trần Đức Huy (5A2) — Giải Nhất Tiếng Anh</h3><p><em>Em xem phim hoạt hình tiếng Anh mỗi ngày 20 phút.</em></p><h3>3. Lê Phương Linh (4A1) — Giải Nhất Khoa học</h3><p><em>Em thích làm thí nghiệm ở nhà. Mỗi tuần em thử 1 thí nghiệm.</em></p><h3>4. Hoàng Minh Quân (5A3) — Giải Nhất Văn</h3><p><em>Em đọc sách mỗi ngày và viết nhật ký.</em></p><h3>5. Nguyễn Thu Hà (4A2) — Đa tài</h3><p><em>Em lập thời gian biểu cho mỗi ngày, chia đều thời gian cho học và chơi.</em></p>',
      categoryId: catMap['hoc-tap'], thumbnailUrl: img(4), status: 'published', publishedAt: '2026-02-15T08:00:00.000Z',
    },
    {
      title: 'Học qua dự án — Project-Based Learning',
      slug: 'hoc-qua-du-an-pbl-le-quy-don',
      excerpt: 'Phương pháp học qua dự án (PBL) giúp học sinh áp dụng kiến thức vào thực tiễn.',
      content: '<h2>Project-Based Learning</h2><p>Mỗi học kỳ, học sinh Khối 3-5 thực hiện 2 dự án liên môn:</p><h3>Ví dụ dự án học kỳ I/2025-2026</h3><ul><li><strong>Khối 3:</strong> Khu vườn của em — Toán (đo diện tích) + Khoa học (cây trồng) + Mỹ thuật</li><li><strong>Khối 4:</strong> Chợ quê Việt Nam — Toán (tính tiền) + Xã hội (nghề nghiệp) + Tiếng Việt</li><li><strong>Khối 5:</strong> Thành phố thông minh — STEM (mô hình) + Khoa học (năng lượng) + Tiếng Anh</li></ul><p>Học sinh làm việc theo nhóm 4-5 em, được hướng dẫn bởi giáo viên mentor. Sản phẩm cuối cùng được trưng bày và thuyết trình trước hội đồng.</p>',
      categoryId: catMap['hoc-tap'], thumbnailUrl: img(7), status: 'published', publishedAt: '2026-01-05T08:00:00.000Z',
    },
    // TUYEN SINH
    {
      title: 'Hướng dẫn nộp hồ sơ tuyển sinh trực tuyến',
      slug: 'huong-dan-nop-ho-so-truc-tuyen',
      excerpt: 'Hướng dẫn từng bước nộp hồ sơ trực tuyến qua website và ứng dụng.',
      content: '<h2>Nộp hồ sơ trực tuyến</h2><p>Từ năm 2026, phụ huynh có thể nộp hồ sơ tuyển sinh hoàn toàn trực tuyến:</p><h3>Các bước thực hiện</h3><ol><li>Truy cập website trường, chọn mục Tuyển sinh</li><li>Điền thông tin học sinh và phụ huynh</li><li>Upload ảnh giấy khai sinh, sổ hộ khẩu</li><li>Upload ảnh 3x4 của học sinh</li><li>Chọn lịch tham quan và phỏng vấn</li><li>Xác nhận và nhận mã hồ sơ</li></ol><h3>Hồ sơ bao gồm</h3><ul><li>Đơn xin nhập học (form online)</li><li>Giấy khai sinh (bản sao)</li><li>Sổ hộ khẩu hoặc giấy tạm trú (bản sao)</li><li>Sổ tiêm chủng</li><li>Bảng đánh giá của trường mầm non</li></ul>',
      categoryId: catMap['tuyen-sinh'], thumbnailUrl: img(3), status: 'published', publishedAt: '2026-03-01T08:00:00.000Z',
    },
    {
      title: 'Phụ huynh chia sẻ lý do chọn Lê Quý Đôn',
      slug: 'phu-huynh-chia-se-ly-do-chon-truong',
      excerpt: 'Lắng nghe chia sẻ chân thật từ 5 phụ huynh.',
      content: '<h2>Vì sao chọn Lê Quý Đôn?</h2><h3>Chị Nguyễn Thu Hương — Lớp 3A2</h3><p><em>Tôi chọn Lê Quý Đôn vì chương trình Tiếng Anh. Con trai tôi sau 2 năm đã tự tin giao tiếp với giáo viên nước ngoài.</em></p><h3>Anh Trần Minh Đức — Lớp 5A1</h3><p><em>Điều tôi ấn tượng nhất là sự minh bạch. Mọi thông tin về con đều được cập nhật trên app.</em></p><h3>Chị Lê Thị Mai — Lớp 1A3</h3><p><em>Con gái tôi từ nhút nhát đã trở nên tự tin sau 1 tháng.</em></p><h3>Anh Phạm Văn Hùng — Lớp 4A2</h3><p><em>Bể bơi và chương trình thể thao là yếu tố quyết định.</em></p><h3>Chị Đỗ Thị Lan — Lớp 2A1</h3><p><em>Tôi yên tâm vì bữa ăn. Menu thay đổi liên tục, con ăn ngon miệng.</em></p>',
      categoryId: catMap['tuyen-sinh'], thumbnailUrl: img(6), status: 'published', publishedAt: '2026-03-20T08:00:00.000Z',
    },
    // DOI SONG HOC DUONG
    {
      title: 'CLB Bữa trưa vui vẻ',
      slug: 'clb-bua-trua-vui-ve',
      excerpt: 'Hoạt động Bữa trưa vui vẻ giúp học sinh ăn ngon miệng hơn.',
      content: '<h2>Bữa trưa vui vẻ</h2><p>CLB Bữa trưa vui vẻ khuyến khích học sinh ăn ngon và đầy đủ dinh dưỡng:</p><h3>Hoạt động</h3><ul><li>Nhạc nhẹ nhàng trong giờ ăn</li><li>Trang trí bàn ăn theo chủ đề mỗi tuần</li><li>Ngôi sao ăn ngoan — khen thưởng học sinh ăn hết suất</li><li>Thứ Sáu khám phá — thử món ăn mới mỗi tuần</li><li>Học sinh tự phục vụ (lớp 3-5) rèn kỹ năng tự lập</li></ul><p>Từ khi triển khai, tỷ lệ học sinh ăn hết suất tăng từ 65% lên 85%.</p>',
      categoryId: catMap['doi-song-hoc-duong'], thumbnailUrl: img(9), status: 'published', publishedAt: '2026-01-20T08:00:00.000Z',
    },
  ];
}

async function main() {
  console.log('=== SEED REMAINING DATA ===');
  console.log(`API: ${BASE_URL}`);

  await login();

  // Get categories
  const cats = await getCategories();
  const catMap = {};
  cats.forEach(c => { catMap[c.slug] = c.id; });
  console.log(`Categories: ${cats.length} found`);

  // Get existing articles
  const existing = await getExistingArticles();
  console.log(`Existing articles: ${existing.length}`);

  // Insert missing articles
  const articles = getFailedArticles(catMap);
  let created = 0;
  console.log(`\nInserting ${articles.length} articles...`);
  for (const art of articles) {
    if (existing.includes(art.slug)) {
      process.stdout.write('+'); // already exists
      continue;
    }
    const result = await post('articles', art);
    if (result) created++;
  }
  console.log(`\nArticles created: ${created}`);

  // Insert FAQs (correct endpoint: /admissions/faq)
  console.log('\nInserting FAQs...');
  const faqs = [
    { question: 'Trường có nhận học sinh chuyển cấp không?', answer: 'Có. Nhà trường nhận xét tuyển học sinh từ lớp 2-5 khi còn chỉ tiêu. Học sinh cần qua bài đánh giá năng lực phù hợp với khối lớp đăng ký.', displayOrder: 1, isVisible: true },
    { question: 'Chương trình học có khác trường công không?', answer: 'Trường dạy chương trình Quốc gia nâng cao — đầy đủ nội dung Bộ GD&ĐT quy định, bổ sung Tiếng Anh tăng cường (8 tiết/tuần), STEM, Robotics và Kỹ năng sống.', displayOrder: 2, isVisible: true },
    { question: 'Xe đưa đón hoạt động như thế nào?', answer: 'Trường có 10 tuyến xe buýt phủ các quận nội thành. Mỗi xe có GPS tracking, camera giám sát và bảo mẫu đi kèm. Phụ huynh theo dõi vị trí xe qua ứng dụng LQD Connect.', displayOrder: 3, isVisible: true },
    { question: 'Bữa ăn của học sinh được chuẩn bị ra sao?', answer: 'Mỗi ngày 1 bữa chính + 2 bữa phụ. Menu 4 tuần không trùng lặp, nguồn thực phẩm VietGAP. Bếp một chiều đạt chuẩn ATTP, kiểm tra mẫu lưu 24h.', displayOrder: 4, isVisible: true },
    { question: 'Học phí là bao nhiêu?', answer: 'Học phí từ 8.5 triệu/tháng (10 tháng/năm), bao gồm học phí, Tiếng Anh tăng cường, STEM và bữa ăn chính. Chưa bao gồm xe đưa đón và CLB ngoại khóa tự chọn.', displayOrder: 5, isVisible: true },
    { question: 'Trường có chương trình học bổng không?', answer: 'Có. Mỗi năm trường dành 20 suất học bổng (5 toàn phần, 5 giảm 75%, 10 giảm 50%) cho học sinh có thành tích xuất sắc và năng khiếu đặc biệt.', displayOrder: 6, isVisible: true },
    { question: 'Giáo viên bản ngữ dạy những gì?', answer: 'Giáo viên bản ngữ từ PLC Sydney dạy Speaking, Listening và CLIL (Content and Language Integrated Learning). Mỗi tuần học sinh có 4 tiết với giáo viên bản ngữ.', displayOrder: 7, isVisible: true },
    { question: 'Trường có phòng tâm lý không?', answer: 'Có. Trường có 1 chuyên gia tâm lý trẻ em (ThS. Tâm lý học) thường trực, hỗ trợ tư vấn cá nhân và tổ chức Workshop cho phụ huynh về nuôi dạy con.', displayOrder: 8, isVisible: true },
  ];
  let faqCreated = 0;
  for (const faq of faqs) {
    const result = await post('admissions/faq', faq);
    if (result) faqCreated++;
  }
  console.log(`\nFAQs created: ${faqCreated}`);

  console.log('\n=== DONE ===');
  console.log(`Total new articles: ${created}`);
  console.log(`Total new FAQs: ${faqCreated}`);
}

main().catch(console.error);
