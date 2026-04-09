import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Category, CategoryStatus } from '../../modules/categories/entities/category.entity';
import { Article, ArticleStatus } from '../../modules/articles/entities/article.entity';
import { Page, PageStatus } from '../../modules/pages/entities/page.entity';
import { Event, EventStatus } from '../../modules/events/entities/event.entity';
import { Setting } from '../../modules/settings/entities/setting.entity';
import { MenuItem, MenuTarget } from '../../modules/navigation/entities/menu-item.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed du lieu mau cho website truong tieu hoc Le Quy Don.
 * Idempotent — kiem tra ton tai truoc khi insert.
 * Chay: npm run seed:content
 */
async function seedContent() {
  await AppDataSource.initialize();
  console.log('[SEED] Bat dau seed content...');

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

  // ─── CATEGORIES ───
  await seedCategories(adminId);

  // ─── ARTICLES ───
  await seedArticles(adminId);

  // ─── PAGES ───
  await seedPages(adminId);

  // ─── EVENTS ───
  await seedEvents(adminId);

  // ─── SETTINGS ───
  await seedSettings();

  // ─── NAVIGATION ───
  await seedNavigation();

  console.log('[SEED] Hoan tat seed content!');
  await AppDataSource.destroy();
}

// ═══════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════

const categoriesData = [
  { name: 'Tin tức', slug: 'tin-tuc', description: 'Tin tức chung của trường', display_order: 1 },
  { name: 'Sự kiện', slug: 'su-kien', description: 'Các sự kiện nổi bật của trường', display_order: 2 },
  { name: 'Hoạt động ngoại khóa', slug: 'hoat-dong-ngoai-khoa', description: 'Các hoạt động ngoại khóa, câu lạc bộ', display_order: 3 },
  { name: 'Học tập', slug: 'hoc-tap', description: 'Thông tin về chương trình học tập, kết quả giảng dạy', display_order: 4 },
  { name: 'Tuyển sinh', slug: 'tuyen-sinh', description: 'Thông tin tuyển sinh các khối lớp', display_order: 5 },
  { name: 'Đời sống học đường', slug: 'doi-song-hoc-duong', description: 'Hoạt động đời sống, bán trú, dinh dưỡng', display_order: 6 },
];

async function seedCategories(adminId: string) {
  const repo = AppDataSource.getRepository(Category);
  let created = 0;

  for (const cat of categoriesData) {
    const existing = await repo.findOne({ where: { slug: cat.slug } });
    if (existing) continue;

    await repo.save(
      repo.create({
        id: generateUlid(),
        ...cat,
        status: CategoryStatus.ACTIVE,
        parent_id: null,
        created_by: adminId,
        updated_by: null,
      }),
    );
    created++;
  }

  console.log(`[SEED] Categories: ${created} moi tao, ${categoriesData.length - created} da ton tai.`);
}

// ═══════════════════════════════════════════════════
// ARTICLES
// ═══════════════════════════════════════════════════

async function seedArticles(adminId: string) {
  const repo = AppDataSource.getRepository(Article);
  const catRepo = AppDataSource.getRepository(Category);

  // Map slug -> id de gan category
  const catMap: Record<string, string> = {};
  const allCats = await catRepo.find();
  for (const c of allCats) {
    catMap[c.slug] = c.id;
  }

  const now = new Date();

  const articlesData = [
    {
      title: 'Lễ khai giảng năm học 2025-2026 tại trường Tiểu học Lê Quý Đôn',
      slug: 'le-khai-giang-nam-hoc-2025-2026',
      categorySlug: 'su-kien',
      status: ArticleStatus.PUBLISHED,
      excerpt: 'Sáng ngày 5/9/2025, trường Tiểu học Lê Quý Đôn long trọng tổ chức Lễ khai giảng năm học mới 2025-2026.',
      content: `<h2>Lễ khai giảng năm học 2025-2026</h2>
<p>Sáng ngày 5 tháng 9 năm 2025, trong không khí trang nghiêm và phấn khởi, trường Tiểu học Lê Quý Đôn đã long trọng tổ chức Lễ khai giảng năm học mới 2025-2026.</p>
<p>Buổi lễ có sự tham dự của đông đảo các thầy cô giáo, phụ huynh và hơn 1.200 học sinh từ lớp 1 đến lớp 5. Đặc biệt, các em học sinh lớp 1 lần đầu tiên bước vào ngôi trường mới với niềm vui và sự háo hức.</p>
<h3>Phát biểu khai giảng</h3>
<p>Trong bài phát biểu khai giảng, cô Hiệu trưởng Nguyễn Thị Minh Hằng đã gửi lời chúc mừng năm học mới tới toàn thể thầy cô và các em học sinh, đồng thời nhấn mạnh mục tiêu nâng cao chất lượng giáo dục toàn diện trong năm học mới.</p>
<p>Năm học 2025-2026, nhà trường tiếp tục triển khai chương trình giáo dục phổ thông mới với nhiều đổi mới trong phương pháp giảng dạy, chú trọng phát triển năng lực và phẩm chất của học sinh.</p>`,
    },
    {
      title: 'Kết quả thi Olympic Toán cấp quận: 15 học sinh đạt giải',
      slug: 'ket-qua-olympic-toan-cap-quan-2025',
      categorySlug: 'hoc-tap',
      status: ArticleStatus.PUBLISHED,
      excerpt: 'Trường Tiểu học Lê Quý Đôn tự hào thông báo 15 học sinh đạt giải trong kỳ thi Olympic Toán cấp quận năm 2025.',
      content: `<h2>15 học sinh đạt giải Olympic Toán cấp quận</h2>
<p>Trong kỳ thi Olympic Toán học cấp quận năm học 2024-2025, trường Tiểu học Lê Quý Đôn đã đạt thành tích xuất sắc với 15 học sinh đoạt giải, trong đó có 3 giải Nhất, 5 giải Nhì và 7 giải Ba.</p>
<h3>Danh sách học sinh đạt giải Nhất</h3>
<ul>
<li>Em Nguyễn Minh Anh — Lớp 5A1</li>
<li>Em Trần Đức Huy — Lớp 5A2</li>
<li>Em Phạm Thu Hà — Lớp 4A1</li>
</ul>
<p>Đây là kết quả của sự nỗ lực không ngừng của các em học sinh cùng với sự hướng dẫn tận tâm của đội ngũ giáo viên bộ môn Toán. Nhà trường xin gửi lời chúc mừng tới các em và các thầy cô giáo!</p>`,
    },
    {
      title: 'Câu lạc bộ Robotics chiêu sinh khóa mới tháng 10/2025',
      slug: 'clb-robotics-chieu-sinh-thang-10-2025',
      categorySlug: 'hoat-dong-ngoai-khoa',
      status: ArticleStatus.PUBLISHED,
      excerpt: 'CLB Robotics trường Tiểu học Lê Quý Đôn mở đăng ký khóa học mới dành cho học sinh lớp 3-5.',
      content: `<h2>CLB Robotics mở đăng ký khóa mới</h2>
<p>Câu lạc bộ Robotics của trường Tiểu học Lê Quý Đôn thông báo chiêu sinh khóa học mới bắt đầu từ tháng 10/2025.</p>
<h3>Thông tin khóa học</h3>
<ul>
<li><strong>Đối tượng:</strong> Học sinh lớp 3, 4, 5</li>
<li><strong>Lịch học:</strong> Thứ 3 và Thứ 5 hàng tuần, 15h30 - 17h00</li>
<li><strong>Địa điểm:</strong> Phòng STEM, Tầng 3</li>
<li><strong>Học phí:</strong> 800.000 VNĐ/tháng (bao gồm trang thiết bị)</li>
</ul>
<p>Các em sẽ được học lập trình cơ bản, thiết kế và lắp ráp robot, tham gia các cuộc thi Robotics cấp quận và thành phố.</p>
<p>Phụ huynh đăng ký tại Văn phòng nhà trường hoặc liên hệ hotline: 024-3456-7890.</p>`,
    },
    {
      title: 'Thông báo tuyển sinh lớp 1 năm học 2026-2027',
      slug: 'thong-bao-tuyen-sinh-lop-1-2026-2027',
      categorySlug: 'tuyen-sinh',
      status: ArticleStatus.PUBLISHED,
      excerpt: 'Trường Tiểu học Lê Quý Đôn thông báo kế hoạch tuyển sinh lớp 1 năm học 2026-2027 với chỉ tiêu 180 học sinh.',
      content: `<h2>Tuyển sinh lớp 1 năm học 2026-2027</h2>
<p>Trường Tiểu học Lê Quý Đôn trân trọng thông báo kế hoạch tuyển sinh lớp 1 cho năm học 2026-2027.</p>
<h3>Chỉ tiêu tuyển sinh</h3>
<p>Nhà trường dự kiến tuyển sinh <strong>180 học sinh</strong>, chia thành 6 lớp.</p>
<h3>Đối tượng tuyển sinh</h3>
<p>Trẻ em sinh năm 2020, có hộ khẩu thường trú hoặc đang cư trú tại các phường thuộc tuyến tuyển sinh của trường.</p>
<h3>Thời gian đăng ký</h3>
<ul>
<li><strong>Nộp hồ sơ trực tuyến:</strong> Từ ngày 01/06/2026 đến ngày 15/06/2026</li>
<li><strong>Nộp hồ sơ trực tiếp:</strong> Từ ngày 01/07/2026 đến ngày 10/07/2026</li>
</ul>
<h3>Hồ sơ cần chuẩn bị</h3>
<ol>
<li>Đơn xin nhập học (theo mẫu)</li>
<li>Bản sao giấy khai sinh</li>
<li>Sổ hộ khẩu (bản sao)</li>
<li>Phiếu tiêm chủng</li>
</ol>
<p>Mọi thắc mắc xin liên hệ Văn phòng nhà trường, ĐT: 024-3456-7890.</p>`,
    },
    {
      title: 'Thực đơn bán trú tuần 14-18/10/2025: Dinh dưỡng cân bằng',
      slug: 'thuc-don-ban-tru-tuan-14-18-10-2025',
      categorySlug: 'doi-song-hoc-duong',
      status: ArticleStatus.PUBLISHED,
      excerpt: 'Thực đơn bán trú tuần từ 14 đến 18/10/2025 được xây dựng theo tiêu chuẩn dinh dưỡng học đường.',
      content: `<h2>Thực đơn bán trú tuần 14-18/10/2025</h2>
<p>Nhà trường công bố thực đơn bán trú tuần từ ngày 14 đến 18/10/2025, được xây dựng bởi chuyên gia dinh dưỡng, đảm bảo cân bằng 4 nhóm chất cho học sinh tiểu học.</p>
<h3>Thứ Hai (14/10)</h3>
<p>Cơm, thịt gà kho gừng, canh bí đao nấu tôm, rau muống luộc, tráng miệng: chuối.</p>
<h3>Thứ Ba (15/10)</h3>
<p>Cơm, cá basa chiên xù, canh cải ngọt nấu thịt, đậu phụ sốt cà chua, tráng miệng: sữa chua.</p>
<h3>Thứ Tư (16/10)</h3>
<p>Phở bò, bánh mì trứng ốp la, tráng miệng: cam.</p>
<h3>Thứ Năm (17/10)</h3>
<p>Cơm, sườn xào chua ngọt, canh mồng tơi nấu cua, giá đỗ xào, tráng miệng: dưa hấu.</p>
<h3>Thứ Sáu (18/10)</h3>
<p>Bún riêu cua, chả giò, tráng miệng: sữa tươi.</p>`,
    },
    {
      title: 'Học sinh lớp 2A3 trồng cây xanh trong khuôn viên trường',
      slug: 'hoc-sinh-lop-2a3-trong-cay-xanh',
      categorySlug: 'tin-tuc',
      status: ArticleStatus.PUBLISHED,
      excerpt: 'Trong tuần lễ môi trường, các em học sinh lớp 2A3 đã tham gia hoạt động trồng cây xanh tại sân trường.',
      content: `<h2>Hoạt động trồng cây xanh của lớp 2A3</h2>
<p>Hưởng ứng tuần lễ bảo vệ môi trường, ngày 12/10/2025, các em học sinh lớp 2A3 dưới sự hướng dẫn của cô giáo chủ nhiệm Trần Thị Lan đã tham gia hoạt động trồng cây xanh trong khuôn viên nhà trường.</p>
<p>Các em đã trồng được 10 cây bàng lá nhỏ và 5 cây phượng vĩ tại khu vực sân chơi phía sau trường. Hoạt động này không chỉ giúp tạo thêm bóng mát cho sân trường mà còn giúp các em hiểu thêm về ý nghĩa của việc bảo vệ môi trường.</p>
<p>"Con rất vui vì được trồng cây. Con sẽ chăm sóc cây mỗi ngày!" — em Nguyễn Gia Bảo, lớp 2A3 chia sẻ.</p>`,
    },
    {
      title: 'Hội thảo phương pháp giáo dục STEM cho giáo viên',
      slug: 'hoi-thao-phuong-phap-giao-duc-stem',
      categorySlug: 'hoc-tap',
      status: ArticleStatus.PUBLISHED,
      excerpt: 'Nhà trường tổ chức hội thảo chuyên đề về phương pháp giáo dục STEM dành cho toàn thể giáo viên.',
      content: `<h2>Hội thảo phương pháp giáo dục STEM</h2>
<p>Ngày 08/10/2025, trường Tiểu học Lê Quý Đôn đã tổ chức hội thảo chuyên đề "Ứng dụng phương pháp giáo dục STEM trong giảng dạy bậc tiểu học" với sự tham gia của toàn thể giáo viên nhà trường.</p>
<p>Hội thảo được chủ trì bởi TS. Lê Văn Thành, chuyên gia giáo dục STEM từ Đại học Sư phạm Hà Nội. Các nội dung chính bao gồm:</p>
<ul>
<li>Tổng quan về giáo dục STEM và xu hướng thế giới</li>
<li>Cách tích hợp STEM vào các môn học hiện hành</li>
<li>Thực hành thiết kế bài giảng STEM cho lớp 3-5</li>
<li>Chia sẻ kinh nghiệm từ các trường đã triển khai thành công</li>
</ul>
<p>Sau hội thảo, nhà trường sẽ triển khai thí điểm chương trình STEM cho khối lớp 4 từ học kỳ II năm học 2025-2026.</p>`,
    },
    {
      title: 'Kế hoạch tổ chức Ngày hội Gia đình 2025',
      slug: 'ke-hoach-ngay-hoi-gia-dinh-2025',
      categorySlug: 'su-kien',
      status: ArticleStatus.DRAFT,
      excerpt: 'Nhà trường dự kiến tổ chức Ngày hội Gia đình vào cuối tháng 11/2025 với nhiều hoạt động hấp dẫn.',
      content: `<h2>Kế hoạch Ngày hội Gia đình 2025</h2>
<p>Trường Tiểu học Lê Quý Đôn dự kiến tổ chức Ngày hội Gia đình năm 2025 vào ngày 30/11/2025 (Chủ nhật) tại sân trường.</p>
<h3>Chương trình dự kiến</h3>
<ul>
<li>8h00: Khai mạc, văn nghệ chào mừng</li>
<li>9h00: Các trò chơi gia đình (kéo co, nhảy bao bố, nấu ăn...)</li>
<li>10h30: Hội chợ ẩm thực do phụ huynh tổ chức</li>
<li>11h30: Trao giải, bế mạc</li>
</ul>
<p><em>Bài viết đang được hoàn thiện, sẽ công bố chính thức sau khi được Ban Giám hiệu phê duyệt.</em></p>`,
    },
    {
      title: 'Lịch nghỉ Tết Nguyên đán 2026 và kế hoạch ôn tập học kỳ I',
      slug: 'lich-nghi-tet-nguyen-dan-2026',
      categorySlug: 'tin-tuc',
      status: ArticleStatus.DRAFT,
      excerpt: 'Thông báo lịch nghỉ Tết Nguyên đán 2026 và kế hoạch ôn tập cuối học kỳ I.',
      content: `<h2>Lịch nghỉ Tết Nguyên đán 2026</h2>
<p>Căn cứ theo lịch nghỉ Tết của Chính phủ, trường Tiểu học Lê Quý Đôn thông báo lịch nghỉ Tết Nguyên đán Bính Ngọ 2026 như sau:</p>
<h3>Thời gian nghỉ</h3>
<p>Từ ngày <strong>16/02/2026</strong> (Thứ Hai, 28 tháng Chạp) đến hết ngày <strong>22/02/2026</strong> (Chủ nhật, mùng 6 Tết).</p>
<p>Học sinh đi học lại vào ngày <strong>23/02/2026</strong> (Thứ Hai, mùng 7 Tết).</p>
<h3>Kế hoạch ôn tập</h3>
<p>Lịch kiểm tra cuối học kỳ I sẽ diễn ra từ ngày 12/01/2026 đến 16/01/2026. Các thầy cô giáo sẽ hướng dẫn ôn tập từ đầu tháng 01/2026.</p>
<p><em>Thông báo chi tiết sẽ được gửi tới phụ huynh qua sổ liên lạc điện tử.</em></p>`,
    },
    {
      title: 'Tham quan Bảo tàng Lịch sử Quốc gia — Khối lớp 5',
      slug: 'tham-quan-bao-tang-lich-su-khoi-5',
      categorySlug: 'hoat-dong-ngoai-khoa',
      status: ArticleStatus.PUBLISHED,
      excerpt: 'Học sinh khối lớp 5 có chuyến tham quan học tập tại Bảo tàng Lịch sử Quốc gia.',
      content: `<h2>Tham quan Bảo tàng Lịch sử Quốc gia</h2>
<p>Ngày 20/10/2025, toàn bộ học sinh khối lớp 5 trường Tiểu học Lê Quý Đôn đã có chuyến tham quan học tập tại Bảo tàng Lịch sử Quốc gia, số 1 Tràng Tiền, Hoàn Kiếm, Hà Nội.</p>
<p>Tại đây, các em được nghe thuyết minh về các giai đoạn lịch sử của dân tộc Việt Nam, từ thời kỳ đồ đá đến thời đại Hồ Chí Minh. Các em đặc biệt thích thú khi được xem các hiện vật từ thời Văn Lang — Âu Lạc và trống đồng Đông Sơn.</p>
<p>"Chuyến đi rất bổ ích, giúp con hiểu thêm về lịch sử nước mình. Con muốn đi thêm nhiều bảo tàng nữa!" — em Hoàng Thị Mai, lớp 5A3.</p>`,
    },
  ];

  let created = 0;
  for (const art of articlesData) {
    const existing = await repo.findOne({ where: { slug: art.slug } });
    if (existing) continue;

    const publishedAt =
      art.status === ArticleStatus.PUBLISHED
        ? new Date(now.getTime() - Math.floor(Math.random() * 30) * 86400000)
        : null;

    await repo.save(
      repo.create({
        id: generateUlid(),
        title: art.title,
        slug: art.slug,
        content: art.content,
        excerpt: art.excerpt,
        thumbnail_url: null,
        status: art.status,
        view_count: Math.floor(Math.random() * 500),
        published_at: publishedAt,
        seo_title: art.title,
        seo_description: art.excerpt,
        category_id: catMap[art.categorySlug] || null,
        created_by: adminId,
        updated_by: null,
      }),
    );
    created++;
  }

  console.log(`[SEED] Articles: ${created} moi tao, ${articlesData.length - created} da ton tai.`);
}

// ═══════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════

const pagesData = [
  {
    title: 'Tổng quan về trường',
    slug: 'tong-quan',
    seo_title: 'Tổng quan — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Giới thiệu tổng quan về trường Tiểu học Lê Quý Đôn — lịch sử hình thành, sứ mệnh và tầm nhìn.',
    content: `<h2>Giới thiệu trường Tiểu học Lê Quý Đôn</h2>
<p>Trường Tiểu học Lê Quý Đôn là một trong những ngôi trường có bề dày truyền thống tại Hà Nội, mang tên nhà bác học lỗi lạc Lê Quý Đôn (1726-1784) — biểu tượng cho tinh thần hiếu học của dân tộc Việt Nam.</p>
<h3>Sứ mệnh</h3>
<p>Xây dựng môi trường giáo dục an toàn, thân thiện, sáng tạo, giúp mỗi học sinh phát triển toàn diện về trí tuệ, thể chất và nhân cách.</p>
<h3>Tầm nhìn</h3>
<p>Trở thành ngôi trường tiểu học hàng đầu tại Hà Nội, nơi mỗi học sinh được khơi dậy tiềm năng, tự tin bước vào tương lai.</p>
<h3>Giá trị cốt lõi</h3>
<ul>
<li><strong>Yêu thương:</strong> Tạo môi trường học tập ấm áp, gắn kết</li>
<li><strong>Sáng tạo:</strong> Khuyến khích tư duy phản biện và sáng tạo</li>
<li><strong>Trách nhiệm:</strong> Rèn luyện ý thức trách nhiệm với bản thân và cộng đồng</li>
<li><strong>Hội nhập:</strong> Trang bị kiến thức và kỹ năng cho công dân toàn cầu</li>
</ul>`,
  },
  {
    title: 'Chương trình học',
    slug: 'chuong-trinh-hoc',
    seo_title: 'Chương trình học — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Chương trình giảng dạy tại trường Tiểu học Lê Quý Đôn: chương trình chính khóa, ngoại ngữ, và các hoạt động bổ trợ.',
    content: `<h2>Chương trình giảng dạy</h2>
<p>Trường Tiểu học Lê Quý Đôn triển khai chương trình giáo dục phổ thông 2018 của Bộ Giáo dục và Đào tạo, kết hợp với các chương trình bổ trợ nhằm phát triển toàn diện năng lực học sinh.</p>
<h3>Chương trình chính khóa</h3>
<ul>
<li>Toán học</li>
<li>Tiếng Việt</li>
<li>Tự nhiên và Xã hội (lớp 1-3), Khoa học & Lịch sử - Địa lý (lớp 4-5)</li>
<li>Đạo đức</li>
<li>Giáo dục thể chất</li>
<li>Âm nhạc, Mỹ thuật</li>
<li>Hoạt động trải nghiệm</li>
</ul>
<h3>Chương trình ngoại ngữ</h3>
<p>Tiếng Anh được giảng dạy từ lớp 1 với 4 tiết/tuần bởi giáo viên Việt Nam và giáo viên bản ngữ. Chương trình theo chuẩn Cambridge YLE.</p>
<h3>Hoạt động bổ trợ</h3>
<ul>
<li>Tin học và Robotics</li>
<li>Giáo dục STEM</li>
<li>Câu lạc bộ nghệ thuật: Hội họa, Âm nhạc, Múa</li>
<li>Thể thao: Bơi lội, Võ thuật, Bóng đá</li>
</ul>`,
  },
  {
    title: 'Cơ sở vật chất',
    slug: 'co-so-vat-chat',
    seo_title: 'Cơ sở vật chất — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Hệ thống cơ sở vật chất hiện đại tại trường Tiểu học Lê Quý Đôn: phòng học, phòng chức năng, sân thể thao.',
    content: `<h2>Cơ sở vật chất</h2>
<p>Trường Tiểu học Lê Quý Đôn được đầu tư xây dựng trên diện tích hơn 8.000 m² với hệ thống cơ sở vật chất hiện đại, đáp ứng tiêu chuẩn trường chuẩn quốc gia.</p>
<h3>Hệ thống phòng học</h3>
<ul>
<li>30 phòng học tiêu chuẩn, trang bị máy chiếu và bảng tương tác</li>
<li>2 phòng Tin học với 40 máy tính mỗi phòng</li>
<li>2 phòng Ngoại ngữ với hệ thống nghe nhìn hiện đại</li>
<li>1 phòng STEM / Robotics</li>
<li>1 phòng Âm nhạc, 1 phòng Mỹ thuật</li>
</ul>
<h3>Khu vực thể chất</h3>
<ul>
<li>Sân bóng đá mini cỏ nhân tạo</li>
<li>Bể bơi 4 làn (25m)</li>
<li>Nhà thể chất đa năng</li>
<li>Khu vui chơi ngoài trời với thiết bị an toàn</li>
</ul>
<h3>Tiện ích khác</h3>
<ul>
<li>Thư viện với hơn 10.000 đầu sách</li>
<li>Nhà ăn bán trú 500 chỗ ngồi</li>
<li>Phòng y tế với y sĩ trực thường xuyên</li>
<li>Hệ thống camera an ninh 24/7</li>
</ul>`,
  },
  {
    title: 'Đội ngũ giáo viên',
    slug: 'doi-ngu-giao-vien',
    seo_title: 'Đội ngũ giáo viên — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Đội ngũ giáo viên trường Tiểu học Lê Quý Đôn — giàu kinh nghiệm, tận tâm và chuyên nghiệp.',
    content: `<h2>Đội ngũ giáo viên</h2>
<p>Trường Tiểu học Lê Quý Đôn tự hào sở hữu đội ngũ giáo viên giàu kinh nghiệm, tận tâm với nghề và luôn không ngừng học hỏi, đổi mới.</p>
<h3>Thống kê đội ngũ</h3>
<ul>
<li><strong>Tổng số giáo viên:</strong> 65 người</li>
<li><strong>Trình độ Thạc sĩ:</strong> 18 người (28%)</li>
<li><strong>Giáo viên giỏi cấp quận/thành phố:</strong> 22 người</li>
<li><strong>Giáo viên nước ngoài (tiếng Anh):</strong> 4 người</li>
</ul>
<h3>Phát triển chuyên môn</h3>
<p>Nhà trường tổ chức các hoạt động bồi dưỡng chuyên môn thường xuyên:</p>
<ul>
<li>Hội thảo chuyên đề hàng tháng</li>
<li>Dự giờ và đánh giá tiết dạy</li>
<li>Tham gia các khóa đào tạo của Sở GD&ĐT</li>
<li>Giao lưu học hỏi với các trường bạn trong và ngoài nước</li>
</ul>
<p>100% giáo viên đạt chuẩn nghề nghiệp theo quy định của Bộ GD&ĐT.</p>`,
  },
  {
    title: 'Liên hệ',
    slug: 'lien-he',
    seo_title: 'Liên hệ — Trường Tiểu học Lê Quý Đôn',
    seo_description: 'Thông tin liên hệ trường Tiểu học Lê Quý Đôn Hà Nội.',
    content: `<h2>Thông tin liên hệ</h2>
<p><strong>Trường Tiểu học Lê Quý Đôn</strong></p>
<ul>
<li><strong>Địa chỉ:</strong> Phố Lê Quý Đôn, Phường Trung Phụng, Quận Đống Đa, Hà Nội</li>
<li><strong>Điện thoại:</strong> 024-3456-7890</li>
<li><strong>Email:</strong> info@lequydonhanoi.edu.vn</li>
<li><strong>Website:</strong> https://lequydonhanoi.edu.vn</li>
</ul>
<h3>Giờ làm việc</h3>
<p>Thứ Hai đến Thứ Sáu: 7h00 — 17h00</p>
<p>Thứ Bảy: 7h30 — 11h30 (chỉ tiếp nhận hồ sơ)</p>
<h3>Ban Giám hiệu</h3>
<ul>
<li><strong>Hiệu trưởng:</strong> Cô Nguyễn Thị Minh Hằng — ĐT: 024-3456-7891</li>
<li><strong>Phó Hiệu trưởng:</strong> Thầy Trần Văn Đức — ĐT: 024-3456-7892</li>
</ul>`,
  },
];

async function seedPages(adminId: string) {
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
}

// ═══════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════

async function seedEvents(adminId: string) {
  const repo = AppDataSource.getRepository(Event);

  const eventsData = [
    {
      title: 'Ngày hội Gia đình 2025',
      description: 'Ngày hội Gia đình thường niên với các trò chơi vận động, hội chợ ẩm thực và biểu diễn văn nghệ. Dành cho toàn thể học sinh và phụ huynh.',
      start_date: new Date('2025-11-30T08:00:00'),
      end_date: new Date('2025-11-30T12:00:00'),
      location: 'Sân trường Tiểu học Lê Quý Đôn',
      status: EventStatus.UPCOMING,
    },
    {
      title: 'Hội thi Olympic Toán — Tiếng Anh cấp trường',
      description: 'Hội thi Olympic Toán và Tiếng Anh cấp trường dành cho học sinh lớp 3, 4, 5. Vòng chung kết sẽ chọn đội tuyển tham dự cấp quận.',
      start_date: new Date('2025-12-15T07:30:00'),
      end_date: new Date('2025-12-15T11:30:00'),
      location: 'Nhà thể chất đa năng',
      status: EventStatus.UPCOMING,
    },
    {
      title: 'Lễ tổng kết năm học 2025-2026',
      description: 'Lễ tổng kết và trao thưởng năm học 2025-2026, vinh danh học sinh giỏi, học sinh tiêu biểu và tập thể lớp xuất sắc.',
      start_date: new Date('2026-05-25T08:00:00'),
      end_date: new Date('2026-05-25T11:00:00'),
      location: 'Hội trường lớn, Tầng 2',
      status: EventStatus.UPCOMING,
    },
    {
      title: 'Hội khỏe Phù Đổng cấp trường',
      description: 'Ngày hội thể thao Hội khỏe Phù Đổng với các môn: chạy, nhảy xa, kéo co, đá cầu, bơi lội. Tất cả các khối lớp đều tham gia.',
      start_date: new Date('2026-03-20T07:30:00'),
      end_date: new Date('2026-03-21T11:30:00'),
      location: 'Sân thể thao và bể bơi trường',
      status: EventStatus.UPCOMING,
    },
  ];

  let created = 0;
  for (const ev of eventsData) {
    const existing = await repo.findOne({ where: { title: ev.title } });
    if (existing) continue;

    await repo.save(
      repo.create({
        id: generateUlid(),
        title: ev.title,
        description: ev.description,
        image_url: null,
        start_date: ev.start_date,
        end_date: ev.end_date,
        location: ev.location,
        link_url: null,
        status: ev.status,
        created_by: adminId,
        updated_by: null,
      }),
    );
    created++;
  }

  console.log(`[SEED] Events: ${created} moi tao, ${eventsData.length - created} da ton tai.`);
}

// ═══════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════

const settingsData = [
  { key: 'site_name', value: 'Trường Tiểu học Lê Quý Đôn', group: 'general' },
  { key: 'site_description', value: 'Website chính thức của Trường Tiểu học Lê Quý Đôn — Đống Đa, Hà Nội', group: 'general' },
  { key: 'site_logo', value: '/images/logo.png', group: 'general' },
  { key: 'contact_email', value: 'info@lequydonhanoi.edu.vn', group: 'contact' },
  { key: 'contact_phone', value: '024-3456-7890', group: 'contact' },
  { key: 'contact_address', value: 'Phố Lê Quý Đôn, Phường Trung Phụng, Quận Đống Đa, Hà Nội', group: 'contact' },
  { key: 'contact_hotline', value: '0912-345-678', group: 'contact' },
  { key: 'facebook_url', value: 'https://facebook.com/tieuhocdequydon', group: 'social' },
  { key: 'youtube_url', value: 'https://youtube.com/@tieuhocdequydon', group: 'social' },
  { key: 'zalo_phone', value: '0912345678', group: 'social' },
  { key: 'seo_default_title', value: 'Trường Tiểu học Lê Quý Đôn — Hà Nội', group: 'seo' },
  { key: 'seo_default_description', value: 'Trường Tiểu học Lê Quý Đôn — Nơi ươm mầm tương lai, phát triển toàn diện cho học sinh tiểu học tại Hà Nội.', group: 'seo' },
];

async function seedSettings() {
  const repo = AppDataSource.getRepository(Setting);
  let created = 0;

  for (const s of settingsData) {
    const existing = await repo.findOne({ where: { key: s.key } });
    if (existing) continue;

    await repo.save(
      repo.create({
        id: generateUlid(),
        key: s.key,
        value: s.value,
        group: s.group,
      }),
    );
    created++;
  }

  console.log(`[SEED] Settings: ${created} moi tao, ${settingsData.length - created} da ton tai.`);
}

// ═══════════════════════════════════════════════════
// NAVIGATION (Menu Items)
// ═══════════════════════════════════════════════════

async function seedNavigation() {
  const repo = AppDataSource.getRepository(MenuItem);

  // Kiem tra da co menu chua
  const count = await repo.count();
  if (count > 0) {
    console.log(`[SEED] Navigation: da co ${count} menu items, bo qua.`);
    return;
  }

  // Tao menu chinh
  const menuItems = [
    { label: 'Trang chủ', url: '/', display_order: 1, children: [] as any[] },
    {
      label: 'Giới thiệu',
      url: '/gioi-thieu',
      display_order: 2,
      children: [
        { label: 'Tổng quan', url: '/trang/tong-quan', display_order: 1 },
        { label: 'Đội ngũ giáo viên', url: '/trang/doi-ngu-giao-vien', display_order: 2 },
        { label: 'Cơ sở vật chất', url: '/trang/co-so-vat-chat', display_order: 3 },
      ],
    },
    {
      label: 'Chương trình học',
      url: '/trang/chuong-trinh-hoc',
      display_order: 3,
      children: [],
    },
    {
      label: 'Tin tức',
      url: '/tin-tuc',
      display_order: 4,
      children: [
        { label: 'Tin tức', url: '/danh-muc/tin-tuc', display_order: 1 },
        { label: 'Sự kiện', url: '/danh-muc/su-kien', display_order: 2 },
        { label: 'Hoạt động ngoại khóa', url: '/danh-muc/hoat-dong-ngoai-khoa', display_order: 3 },
      ],
    },
    {
      label: 'Tuyển sinh',
      url: '/danh-muc/tuyen-sinh',
      display_order: 5,
      children: [],
    },
    {
      label: 'Liên hệ',
      url: '/trang/lien-he',
      display_order: 6,
      children: [],
    },
  ];

  let created = 0;
  for (const item of menuItems) {
    const parentId = generateUlid();
    await repo.save(
      repo.create({
        id: parentId,
        label: item.label,
        url: item.url,
        target: MenuTarget.SELF,
        parent_id: null,
        display_order: item.display_order,
        is_visible: true,
      }),
    );
    created++;

    // Tao menu con
    for (const child of item.children) {
      await repo.save(
        repo.create({
          id: generateUlid(),
          label: child.label,
          url: child.url,
          target: MenuTarget.SELF,
          parent_id: parentId,
          display_order: child.display_order,
          is_visible: true,
        }),
      );
      created++;
    }
  }

  console.log(`[SEED] Navigation: ${created} menu items tao moi.`);
}

// ─── RUN ───
seedContent().catch((err) => {
  console.error('[SEED] Loi:', err);
  process.exit(1);
});
