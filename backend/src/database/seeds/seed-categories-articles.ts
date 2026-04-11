import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Category, CategoryStatus } from '../../modules/categories/entities/category.entity';
import { Article, ArticleStatus } from '../../modules/articles/entities/article.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed danh muc va bai viet cho Truong Tieu hoc Le Quy Don Ha Noi.
 * 25 danh muc (8 cha + 17 con) + 25 bai viet phan bo across categories.
 * Idempotent: kiem tra slug truoc khi insert.
 * Chay: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-categories-articles.ts
 */
async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const admin = await userRepo.findOne({ where: { role: UserRole.SUPER_ADMIN } });
  if (!admin) {
    console.error('[SEED] Khong tim thay Super Admin. Chay seed:admin truoc.');
    process.exit(1);
  }
  const adminId = admin.id;

  await seedCategories(adminId);
  await seedArticles(adminId);

  console.log('[SEED] Done categories + articles');
  await AppDataSource.destroy();
}

// ============================================================
// SEED CATEGORIES — 8 parent + 17 children = 25 total
// ============================================================
async function seedCategories(adminId: string): Promise<void> {
  const repo = AppDataSource.getRepository(Category);

  const parents: Array<{
    slug: string;
    name: string;
    description: string;
    display_order: number;
  }> = [
    { slug: 'tin-tuc', name: 'Tin tức', description: 'Tin tức chung của nhà trường', display_order: 1 },
    { slug: 'hoc-tap', name: 'Học tập', description: 'Kết quả, phương pháp giảng dạy', display_order: 2 },
    { slug: 'hoat-dong', name: 'Hoạt động', description: 'Hoạt động ngoại khóa, câu lạc bộ', display_order: 3 },
    { slug: 'tuyen-sinh', name: 'Tuyển sinh', description: 'Thông tin tuyển sinh', display_order: 4 },
    { slug: 'doi-song', name: 'Đời sống học đường', description: 'Bán trú, dinh dưỡng, y tế', display_order: 5 },
    { slug: 'the-thao', name: 'Thể thao', description: 'Hoạt động thể chất', display_order: 6 },
    { slug: 'nghe-thuat', name: 'Nghệ thuật', description: 'Âm nhạc, mỹ thuật, múa', display_order: 7 },
    { slug: 'stem', name: 'STEM & Công nghệ', description: 'Robotics, khoa học, lập trình', display_order: 8 },
  ];

  const parentIdMap: Record<string, string> = {};

  for (const p of parents) {
    const existing = await repo.findOne({ where: { slug: p.slug } });
    if (existing) {
      console.log(`[SEED] Category "${p.slug}" da ton tai, bo qua.`);
      parentIdMap[p.slug] = existing.id;
      continue;
    }
    const cat = repo.create({
      id: generateUlid(),
      name: p.name,
      slug: p.slug,
      description: p.description,
      display_order: p.display_order,
      parent_id: null,
      status: CategoryStatus.ACTIVE,
      created_by: adminId,
      updated_by: adminId,
    });
    const saved = await repo.save(cat);
    parentIdMap[p.slug] = saved.id;
    console.log(`[SEED] Tao category cha: ${p.slug}`);
  }

  const children: Array<{
    slug: string;
    name: string;
    parentSlug: string;
    display_order: number;
  }> = [
    { slug: 'thong-bao', name: 'Thông báo', parentSlug: 'tin-tuc', display_order: 1 },
    { slug: 'noi-bat', name: 'Tin nổi bật', parentSlug: 'tin-tuc', display_order: 2 },
    { slug: 'noi-bo', name: 'Tin nội bộ', parentSlug: 'tin-tuc', display_order: 3 },
    { slug: 'ket-qua-hoc-tap', name: 'Kết quả học tập', parentSlug: 'hoc-tap', display_order: 1 },
    { slug: 'phuong-phap', name: 'Phương pháp giảng dạy', parentSlug: 'hoc-tap', display_order: 2 },
    { slug: 'ngoai-khoa', name: 'Ngoại khóa', parentSlug: 'hoat-dong', display_order: 1 },
    { slug: 'cau-lac-bo', name: 'Câu lạc bộ', parentSlug: 'hoat-dong', display_order: 2 },
    { slug: 'tham-quan', name: 'Tham quan dã ngoại', parentSlug: 'hoat-dong', display_order: 3 },
    { slug: 'lop-1', name: 'Tuyển sinh lớp 1', parentSlug: 'tuyen-sinh', display_order: 1 },
    { slug: 'chuyen-cap', name: 'Chuyển cấp', parentSlug: 'tuyen-sinh', display_order: 2 },
    { slug: 'ban-tru', name: 'Bán trú & Dinh dưỡng', parentSlug: 'doi-song', display_order: 1 },
    { slug: 'y-te', name: 'Y tế học đường', parentSlug: 'doi-song', display_order: 2 },
    { slug: 'an-toan', name: 'An toàn trường học', parentSlug: 'doi-song', display_order: 3 },
    { slug: 'boi-loi', name: 'Bơi lội', parentSlug: 'the-thao', display_order: 1 },
    { slug: 'vo-thuat', name: 'Võ thuật', parentSlug: 'the-thao', display_order: 2 },
    { slug: 'bong-da', name: 'Bóng đá mini', parentSlug: 'the-thao', display_order: 3 },
    { slug: 'am-nhac', name: 'Âm nhạc', parentSlug: 'nghe-thuat', display_order: 1 },
    { slug: 'hoi-hoa', name: 'Hội họa', parentSlug: 'nghe-thuat', display_order: 2 },
  ];

  for (const c of children) {
    const existing = await repo.findOne({ where: { slug: c.slug } });
    if (existing) {
      console.log(`[SEED] Category "${c.slug}" da ton tai, bo qua.`);
      continue;
    }
    const parentId = parentIdMap[c.parentSlug];
    if (!parentId) {
      console.error(`[SEED] Khong tim thay parent "${c.parentSlug}" cho "${c.slug}". Bo qua.`);
      continue;
    }
    const cat = repo.create({
      id: generateUlid(),
      name: c.name,
      slug: c.slug,
      description: null,
      display_order: c.display_order,
      parent_id: parentId,
      status: CategoryStatus.ACTIVE,
      created_by: adminId,
      updated_by: adminId,
    });
    await repo.save(cat);
    console.log(`[SEED] Tao category con: ${c.slug} (under ${c.parentSlug})`);
  }
}

// ============================================================
// SEED ARTICLES — 25 total
// ============================================================
async function seedArticles(adminId: string): Promise<void> {
  const catRepo = AppDataSource.getRepository(Category);
  const artRepo = AppDataSource.getRepository(Article);

  const allCats = await catRepo.find();
  const catMap: Record<string, string> = {};
  for (const c of allCats) {
    catMap[c.slug] = c.id;
  }

  function daysAgo(n: number): Date {
    const d = new Date('2026-04-11');
    d.setDate(d.getDate() - n);
    return d;
  }

  interface ArticleSeed {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    thumbnail_url: string;
    status: ArticleStatus;
    category_slug: string;
    view_count: number;
    published_at: Date | null;
    seo_title: string;
    seo_description: string;
  }

  const articles: ArticleSeed[] = [
    // -------------------------------------------------------
    // 1. tin-tuc — Lễ khai giảng
    // -------------------------------------------------------
    {
      title: 'Lễ khai giảng năm học 2025-2026: Ngày hội tựu trường rực rỡ',
      slug: 'le-khai-giang-nam-hoc-2025-2026',
      content: `<h2>Không khí náo nức trong ngày khai trường</h2>
<p>Sáng ngày 5 tháng 9 năm 2025, toàn thể giáo viên, học sinh và phụ huynh Trường Tiểu học Lê Quý Đôn – Hà Nội đã cùng tề tựu trong không khí trang trọng và ấm áp của Lễ khai giảng năm học 2025-2026. Sân trường rực rỡ sắc màu với cờ hoa, băng rôn chào mừng năm học mới.</p>
<p>Hơn 800 học sinh từ khối lớp 1 đến khối lớp 5 diện trang phục đồng phục chỉnh tề, xếp hàng ngay ngắn dưới bóng cây xanh mát. Các em học sinh lớp 1 được các anh chị lớp 5 dẫn dắt vào vị trí, tạo nên hình ảnh đẹp về tinh thần đoàn kết.</p>
<h3>Điểm nhấn của buổi lễ</h3>
<p>Năm học 2025-2026, nhà trường đón nhận <strong>160 học sinh lớp 1</strong> vào 4 lớp học. Hiệu trưởng Nguyễn Văn Hùng công bố các mục tiêu trọng tâm của năm học mới:</p>
<ul>
  <li>Nâng cao chất lượng dạy và học theo Chương trình GDPT 2018</li>
  <li>Triển khai mô hình trường học thông minh, ứng dụng công nghệ vào quản lý</li>
  <li>Phát triển các câu lạc bộ STEM, nghệ thuật, thể thao</li>
  <li>Tăng cường kỹ năng sống và giáo dục văn hóa ứng xử cho học sinh</li>
</ul>
<p>Trong bài phát biểu xúc động, thầy Hiệu trưởng nhắn nhủ: <em>"Mỗi ngày đến trường là một ngày hạnh phúc. Thầy cô và nhà trường luôn đồng hành cùng các em trên con đường chinh phục tri thức."</em> Buổi lễ kết thúc bằng màn múa hát chào mừng sôi động của học sinh toàn trường.</p>`,
      excerpt: 'Sáng 5/9/2025, Trường Tiểu học Lê Quý Đôn tổ chức Lễ khai giảng năm học 2025-2026 với sự tham dự của hơn 800 học sinh và đông đảo phụ huynh trong không khí trang trọng và vui tươi.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-1/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'tin-tuc',
      view_count: 742,
      published_at: daysAgo(218),
      seo_title: 'Lễ khai giảng năm học 2025-2026 - Trường TH Lê Quý Đôn',
      seo_description: 'Lễ khai giảng năm học 2025-2026 tại Trường Tiểu học Lê Quý Đôn Hà Nội với hơn 800 học sinh trong không khí trang trọng và ấm áp.',
    },

    // -------------------------------------------------------
    // 2. tin-tuc — Bằng khen UBND TP
    // -------------------------------------------------------
    {
      title: 'Trường Tiểu học Lê Quý Đôn đón nhận Bằng khen UBND Thành phố Hà Nội',
      slug: 'truong-don-bang-khen-ubnd-thanh-pho',
      content: `<h2>Vinh dự và tự hào</h2>
<p>Trong buổi lễ tổng kết năm học 2024-2025 của Sở Giáo dục và Đào tạo Hà Nội, Trường Tiểu học Lê Quý Đôn vinh dự được UBND Thành phố Hà Nội trao tặng <strong>Bằng khen về thành tích xuất sắc trong công tác giáo dục và đào tạo</strong> năm học 2024-2025.</p>
<p>Đây là kết quả của sự nỗ lực không ngừng của toàn thể cán bộ, giáo viên, nhân viên và học sinh. Với tỷ lệ học sinh hoàn thành chương trình tiểu học đạt <strong>100%</strong>, và 98,5% học sinh được đánh giá xuất sắc, nhà trường khẳng định vị thế là một trong những trường tiểu học chất lượng cao hàng đầu quận Ba Đình.</p>
<h3>Những thành tích nổi bật</h3>
<ul>
  <li>Giải Nhất cuộc thi Toán Kangaroo cấp Quốc gia: 2 học sinh</li>
  <li>Giải Nhì Olympic Tiếng Anh cấp Thành phố: 3 học sinh</li>
  <li>Đội tuyển Robotics đạt Huy chương Vàng tại WRO Vietnam 2025</li>
  <li>100% giáo viên đạt chuẩn nghề nghiệp; 35% đạt chuẩn trên mức chuẩn</li>
</ul>
<p>Thầy Hiệu trưởng Nguyễn Văn Hùng bày tỏ lòng biết ơn sâu sắc đến Ban Phụ huynh học sinh và các mạnh thường quân đã đồng hành cùng nhà trường. Tập thể nhà trường hứa sẽ tiếp tục phấn đấu, không ngừng đổi mới sáng tạo để xứng đáng với sự tin tưởng của phụ huynh và học sinh.</p>`,
      excerpt: 'Trường Tiểu học Lê Quý Đôn Hà Nội vinh dự được UBND Thành phố trao Bằng khen về thành tích xuất sắc trong công tác giáo dục và đào tạo năm học 2024-2025.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-2/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'tin-tuc',
      view_count: 589,
      published_at: daysAgo(234),
      seo_title: 'Trường TH Lê Quý Đôn nhận Bằng khen UBND TP Hà Nội 2025',
      seo_description: 'Trường Tiểu học Lê Quý Đôn Hà Nội nhận Bằng khen UBND TP Hà Nội nhờ thành tích xuất sắc năm học 2024-2025 với 100% học sinh hoàn thành chương trình.',
    },

    // -------------------------------------------------------
    // 3. tin-tuc — Lịch tựu trường
    // -------------------------------------------------------
    {
      title: 'Thông báo lịch tựu trường và các hoạt động đầu năm học 2025-2026',
      slug: 'thong-bao-lich-tuu-truong-2025-2026',
      content: `<h2>Lịch tựu trường năm học 2025-2026</h2>
<p>Căn cứ Kế hoạch thời gian năm học 2025-2026 của Bộ Giáo dục và Đào tạo và hướng dẫn của Sở GD&ĐT Hà Nội, Trường Tiểu học Lê Quý Đôn thông báo lịch tựu trường và các hoạt động đầu năm như sau:</p>
<h3>Học sinh các khối lớp 2, 3, 4, 5</h3>
<ul>
  <li><strong>Ngày 1/9/2025:</strong> Học sinh tựu trường, ổn định lớp, nhận sách giáo khoa</li>
  <li><strong>Ngày 2-4/9/2025:</strong> Sinh hoạt đầu năm, phổ biến nội quy, xây dựng nề nếp</li>
  <li><strong>Ngày 5/9/2025:</strong> Lễ khai giảng năm học mới (8h00 – 10h00)</li>
  <li><strong>Ngày 8/9/2025:</strong> Bắt đầu học chính thức theo thời khóa biểu</li>
</ul>
<h3>Học sinh lớp 1 (năm học đầu tiên)</h3>
<ul>
  <li><strong>Ngày 3/9/2025:</strong> Phụ huynh và học sinh đến nhận lớp, gặp gỡ giáo viên chủ nhiệm</li>
  <li><strong>Ngày 4/9/2025:</strong> Làm quen với môi trường học tập (có phụ huynh đi kèm buổi sáng)</li>
  <li><strong>Ngày 5/9/2025:</strong> Tham dự Lễ khai giảng cùng toàn trường</li>
</ul>
<h3>Lưu ý quan trọng</h3>
<p>Phụ huynh cần chuẩn bị đầy đủ đồ dùng học tập theo danh sách nhà trường đã gửi. Học sinh mặc đồng phục theo quy định (áo trắng, quần/váy xanh navy). Mọi thắc mắc xin liên hệ văn phòng nhà trường qua số điện thoại <strong>024-3835-xxxx</strong> trong giờ hành chính từ 7h30 đến 17h00, thứ Hai đến thứ Sáu.</p>`,
      excerpt: 'Thông báo lịch tựu trường và các hoạt động đầu năm học 2025-2026 dành cho học sinh các khối lớp 1 đến 5 tại Trường Tiểu học Lê Quý Đôn Hà Nội.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-3/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'tin-tuc',
      view_count: 412,
      published_at: daysAgo(239),
      seo_title: 'Lịch tựu trường 2025-2026 - Trường TH Lê Quý Đôn Hà Nội',
      seo_description: 'Thông báo chính thức lịch tựu trường năm học 2025-2026 cho học sinh lớp 1-5 tại Trường Tiểu học Lê Quý Đôn Hà Nội.',
    },

    // -------------------------------------------------------
    // 4. hoc-tap — Kết quả học tập cuối năm
    // -------------------------------------------------------
    {
      title: 'Kết quả học tập năm học 2024-2025: 98,5% học sinh hoàn thành xuất sắc',
      slug: 'ket-qua-hoc-tap-nam-hoc-2024-2025',
      content: `<h2>Thành tích ấn tượng cuối năm học</h2>
<p>Năm học 2024-2025 khép lại với những kết quả học tập đáng tự hào. Theo báo cáo tổng kết của Ban Giám hiệu, <strong>100% học sinh hoàn thành chương trình tiểu học</strong>, trong đó 98,5% được xếp loại Hoàn thành xuất sắc — tăng 2,3 điểm phần trăm so với năm học trước.</p>
<h3>Thống kê theo khối lớp</h3>
<ul>
  <li><strong>Khối lớp 1:</strong> 99% học sinh đọc thông viết thạo; 95% biết làm tính cộng trừ thành thạo</li>
  <li><strong>Khối lớp 2:</strong> 97,8% Hoàn thành xuất sắc; 100% học sinh đạt chuẩn tiếng Anh A1</li>
  <li><strong>Khối lớp 3:</strong> 98,2% Hoàn thành xuất sắc; 15 học sinh đoạt giải thi Toán cấp quận</li>
  <li><strong>Khối lớp 4:</strong> 98,9% Hoàn thành xuất sắc; đội văn nghệ đạt Nhì cấp thành phố</li>
  <li><strong>Khối lớp 5:</strong> 100% hoàn thành chương trình; 98,3% Hoàn thành xuất sắc</li>
</ul>
<h3>Kết quả thi học sinh giỏi</h3>
<p>Trong năm học 2024-2025, học sinh của trường đã tham gia và đạt nhiều thành tích xuất sắc tại các cuộc thi cấp quận, thành phố và quốc gia. Đặc biệt, <strong>em Nguyễn Minh Khôi</strong> (lớp 5A) đoạt Giải Nhất cuộc thi Toán Kangaroo cấp Quốc gia, đem lại niềm tự hào lớn cho nhà trường.</p>
<p>Ban Giám hiệu trân trọng cảm ơn sự đồng hành của quý phụ huynh trong suốt năm học qua. Những kết quả này là minh chứng cho sự đổi mới không ngừng trong phương pháp giảng dạy của đội ngũ giáo viên và tinh thần học tập nghiêm túc, sáng tạo của học sinh toàn trường.</p>`,
      excerpt: 'Năm học 2024-2025, 98,5% học sinh Trường Tiểu học Lê Quý Đôn đạt xếp loại Hoàn thành xuất sắc, tăng 2,3% so với năm học trước.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-4/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'hoc-tap',
      view_count: 634,
      published_at: daysAgo(285),
      seo_title: 'Kết quả học tập 2024-2025 - Trường TH Lê Quý Đôn',
      seo_description: '98,5% học sinh Trường TH Lê Quý Đôn hoàn thành xuất sắc năm học 2024-2025 với nhiều giải thưởng cấp quận, thành phố và quốc gia.',
    },

    // -------------------------------------------------------
    // 5. hoc-tap — Phương pháp STEM tích hợp
    // -------------------------------------------------------
    {
      title: 'Đổi mới phương pháp giảng dạy: Tích hợp STEM vào các môn học cơ bản',
      slug: 'doi-moi-phuong-phap-giang-day-stem-tich-hop',
      content: `<h2>STEM không chỉ là môn học riêng lẻ</h2>
<p>Từ năm học 2024-2025, Trường Tiểu học Lê Quý Đôn tiên phong áp dụng mô hình giảng dạy tích hợp STEM vào các môn học truyền thống như Toán, Khoa học, Tiếng Việt và Mỹ thuật. Thay vì học lý thuyết thuần túy, học sinh được tham gia các dự án thực hành gắn kết với đời thực.</p>
<h3>Ví dụ minh họa: Bài học về Diện tích (Toán lớp 4)</h3>
<p>Thay vì làm bài tập tính diện tích trong sách giáo khoa, học sinh lớp 4 được yêu cầu <em>thiết kế một khu vườn rau cho gia đình</em> với diện tích không quá 20m². Các em phải đo đạc thực tế, tính toán, vẽ bản đồ và trình bày kế hoạch trước lớp. Kết quả: 95% học sinh nắm vững khái niệm diện tích sau bài học này.</p>
<h3>Phản hồi từ giáo viên và phụ huynh</h3>
<ul>
  <li>Cô Trần Thị Mai (GV Toán lớp 4): <em>"Các em hứng thú hơn hẳn, không còn lo ngại môn Toán nữa."</em></li>
  <li>Phụ huynh em Hà Anh Tú: <em>"Con tôi về nhà tự giác ôn bài, hào hứng kể chuyện học hơn trước nhiều."</em></li>
</ul>
<h3>Kế hoạch phát triển</h3>
<p>Nhà trường dự kiến mở rộng mô hình này ra toàn bộ các khối lớp trong năm học 2025-2026, đồng thời tổ chức tập huấn chuyên sâu cho 100% giáo viên về phương pháp dạy học tích hợp STEM. Ban Giám hiệu đã ký kết hợp tác với Trường Đại học Bách Khoa Hà Nội để được hỗ trợ về tài liệu giảng dạy và tập huấn giáo viên — bước đi chiến lược nhằm nâng cao chất lượng giáo dục toàn diện, chuẩn bị cho học sinh bước vào kỷ nguyên công nghệ số.</p>`,
      excerpt: 'Trường Tiểu học Lê Quý Đôn tiên phong tích hợp STEM vào các môn học cơ bản, giúp học sinh học qua trải nghiệm thực tế thay vì lý thuyết thuần túy.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-5/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'hoc-tap',
      view_count: 387,
      published_at: daysAgo(178),
      seo_title: 'Tích hợp STEM vào giảng dạy - Trường TH Lê Quý Đôn Hà Nội',
      seo_description: 'Trường TH Lê Quý Đôn áp dụng mô hình giảng dạy tích hợp STEM, giúp học sinh học Toán, Khoa học qua dự án thực tế.',
    },

    // -------------------------------------------------------
    // 6. hoat-dong — Ngày hội câu lạc bộ
    // -------------------------------------------------------
    {
      title: 'Ngày hội Câu lạc bộ 2025: Sân chơi sáng tạo cho học sinh Lê Quý Đôn',
      slug: 'ngay-hoi-cau-lac-bo-2025',
      content: `<h2>Một ngày đặc biệt của các câu lạc bộ</h2>
<p>Ngày 15 tháng 10 năm 2025, Trường Tiểu học Lê Quý Đôn tổ chức <strong>Ngày hội Câu lạc bộ 2025</strong> — sự kiện thường niên được học sinh và phụ huynh mong chờ nhất trong học kỳ I. Với chủ đề <em>"Tài năng nhỏ, Ước mơ lớn"</em>, hơn 300 học sinh từ 12 câu lạc bộ của trường đã có cơ hội trình diễn và giao lưu.</p>
<h3>Các câu lạc bộ tham gia</h3>
<ul>
  <li><strong>CLB Robotics & Lập trình:</strong> Trình diễn robot tự hành giải mê cung</li>
  <li><strong>CLB Âm nhạc:</strong> Hòa tấu nhạc cụ dân tộc và nhạc cụ phương Tây</li>
  <li><strong>CLB Mỹ thuật:</strong> Triển lãm tranh chủ đề "Mùa thu Hà Nội"</li>
  <li><strong>CLB Thể dục Thể thao:</strong> Biểu diễn võ thuật và nhảy dây tập thể</li>
  <li><strong>CLB Tiếng Anh:</strong> Kịch ngắn bằng tiếng Anh và trò chơi ngôn ngữ</li>
  <li><strong>CLB Khoa học:</strong> Thí nghiệm khoa học vui dành cho khán giả nhí</li>
</ul>
<h3>Ấn tượng từ khán giả</h3>
<p>Phụ huynh em Lê Minh Đức chia sẻ: <em>"Tôi không ngờ con tôi có thể lập trình được một chiếc robot như vậy. Thật sự ấn tượng và tự hào."</em> Sự kiện thu hút hơn 500 phụ huynh tham dự, tạo không khí vui tươi, gắn kết giữa gia đình và nhà trường. Đây là minh chứng rõ ràng cho phương châm giáo dục toàn diện của trường: phát triển cả trí tuệ, thể chất và tâm hồn cho từng học sinh.</p>`,
      excerpt: 'Ngày hội Câu lạc bộ 2025 với chủ đề "Tài năng nhỏ, Ước mơ lớn" quy tụ hơn 300 học sinh từ 12 CLB trình diễn tài năng trước hơn 500 phụ huynh.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-6/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'hoat-dong',
      view_count: 521,
      published_at: daysAgo(177),
      seo_title: 'Ngày hội Câu lạc bộ 2025 - Trường TH Lê Quý Đôn',
      seo_description: 'Ngày hội CLB 2025 tại Trường TH Lê Quý Đôn: 12 câu lạc bộ trình diễn tài năng với chủ đề Tài năng nhỏ, Ước mơ lớn.',
    },

    // -------------------------------------------------------
    // 7. hoat-dong — Tham quan Cúc Phương
    // -------------------------------------------------------
    {
      title: 'Chuyến tham quan "Hà Nội Xanh": Học sinh khối 3 khám phá thiên nhiên',
      slug: 'tham-quan-ha-noi-xanh-khoi-3',
      content: `<h2>Học từ thiên nhiên, học từ cuộc sống</h2>
<p>Trong hai ngày 18-19 tháng 10 năm 2025, toàn bộ học sinh khối lớp 3 (160 em) của Trường Tiểu học Lê Quý Đôn đã có chuyến tham quan dã ngoại đến <strong>Vườn Quốc gia Cúc Phương</strong> và <strong>Khu sinh thái Tràng An</strong> — hai điểm đến thiên nhiên nổi tiếng cách Hà Nội khoảng 100km.</p>
<h3>Hành trình hai ngày</h3>
<p><strong>Ngày 1 — Vườn Quốc gia Cúc Phương:</strong> Học sinh được các kiểm lâm hướng dẫn tìm hiểu về các loài thực vật, động vật quý hiếm. Các em tham gia hoạt động trồng cây gây rừng — mỗi em trồng một cây xanh nhỏ mang tên mình.</p>
<p><strong>Ngày 2 — Khu sinh thái Tràng An:</strong> Học sinh ngồi thuyền khám phá hệ thống hang động kỳ vĩ, nghe kể về lịch sử địa chất và văn hóa Ninh Bình. Buổi chiều, các em tham gia chương trình làm thủ công từ nguyên liệu tái chế.</p>
<h3>Bài học từ chuyến đi</h3>
<ul>
  <li>Nhận biết và phân loại các loài cây, con vật trong rừng nhiệt đới</li>
  <li>Ý thức bảo vệ môi trường và đa dạng sinh học</li>
  <li>Kỹ năng làm việc nhóm và tinh thần đồng đội</li>
  <li>Hiểu biết về di sản thiên nhiên thế giới UNESCO</li>
</ul>
<p>Chuyến đi kết thúc thành công tốt đẹp. Mỗi em mang về một cuốn nhật ký tham quan đầy ắp hình ảnh và kỷ niệm đẹp về thiên nhiên đất nước Việt Nam.</p>`,
      excerpt: 'Học sinh khối 3 Trường Tiểu học Lê Quý Đôn có chuyến tham quan hai ngày đến Vườn Quốc gia Cúc Phương và Tràng An, khám phá thiên nhiên và học về bảo vệ môi trường.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-7/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'hoat-dong',
      view_count: 298,
      published_at: daysAgo(173),
      seo_title: 'Tham quan Cúc Phương - Tràng An: Học sinh khối 3 Lê Quý Đôn',
      seo_description: 'Học sinh khối 3 Trường TH Lê Quý Đôn tham quan Vườn Quốc gia Cúc Phương và Tràng An, học về thiên nhiên và bảo vệ môi trường.',
    },

    // -------------------------------------------------------
    // 8. hoat-dong — Tết Trung Thu
    // -------------------------------------------------------
    {
      title: 'Tết Trung Thu 2025: Đêm hội đèn lồng rực rỡ tại Lê Quý Đôn',
      slug: 'tet-trung-thu-2025-dem-hoi-den-long',
      content: `<h2>Giữ gìn truyền thống, vun đắp tình thân</h2>
<p>Tối ngày 6 tháng 9 năm 2025 (14 tháng 8 Âm lịch), sân trường Tiểu học Lê Quý Đôn lung linh ánh đèn lồng và tiếng trống múa lân rộn rã, đánh dấu <strong>Đêm hội Trung Thu 2025</strong> — sự kiện văn hóa truyền thống được toàn thể học sinh, giáo viên và phụ huynh yêu thích.</p>
<h3>Những hoạt động đặc sắc</h3>
<ul>
  <li><strong>Rước đèn lồng:</strong> Hơn 400 học sinh tự tay làm đèn lồng từ giấy bồi và tre, mang đi diễu hành quanh sân trường</li>
  <li><strong>Múa lân:</strong> Đội múa lân chuyên nghiệp biểu diễn ấn tượng, các bé nhỏ thích thú theo dõi</li>
  <li><strong>Phá cỗ Trung Thu:</strong> Mỗi lớp tự chuẩn bị một mâm cỗ với bánh trung thu, hoa quả theo mùa</li>
  <li><strong>Thi làm đèn lồng sáng tạo:</strong> 15 mẫu đèn độc đáo nhất được trao phần thưởng</li>
</ul>
<p>Đặc biệt năm nay, nhà trường phối hợp với Hội Phụ nữ phường để tặng 50 phần quà Trung Thu cho trẻ em có hoàn cảnh khó khăn trong khu vực — một hành động ý nghĩa giáo dục lòng nhân ái từ sớm cho các em học sinh.</p>
<p>Sự kiện kết thúc lúc 21 giờ trong tiếng vỗ tay và nụ cười của mọi người. Đây thực sự là một đêm hội đáng nhớ, góp phần bồi đắp tình yêu văn hóa dân tộc trong trái tim những học trò nhỏ.</p>`,
      excerpt: 'Đêm hội Trung Thu 2025 tại Trường Tiểu học Lê Quý Đôn lung linh với màn rước đèn của 400 học sinh, múa lân và phá cỗ truyền thống.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-8/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'hoat-dong',
      view_count: 463,
      published_at: daysAgo(216),
      seo_title: 'Đêm hội Trung Thu 2025 - Trường TH Lê Quý Đôn Hà Nội',
      seo_description: 'Đêm hội Trung Thu 2025 rực rỡ tại Trường TH Lê Quý Đôn: rước đèn lồng, múa lân và phá cỗ truyền thống cùng hơn 400 học sinh.',
    },

    // -------------------------------------------------------
    // 9. tuyen-sinh — Tuyển sinh lớp 1
    // -------------------------------------------------------
    {
      title: 'Thông báo tuyển sinh lớp 1 năm học 2026-2027: Chỉ tiêu và điều kiện đăng ký',
      slug: 'tuyen-sinh-lop-1-nam-hoc-2026-2027',
      content: `<h2>Thông báo tuyển sinh chính thức</h2>
<p>Trường Tiểu học Lê Quý Đôn – Hà Nội thông báo kế hoạch tuyển sinh vào lớp 1 năm học 2026-2027. Nhà trường trân trọng thông báo đến các bậc phụ huynh có con đủ điều kiện những thông tin quan trọng dưới đây.</p>
<h3>Điều kiện tuyển sinh</h3>
<ul>
  <li><strong>Độ tuổi:</strong> Trẻ em sinh từ ngày 1/1/2020 đến 31/12/2020 (đủ 6 tuổi tính đến ngày 31/8/2026)</li>
  <li><strong>Hộ khẩu:</strong> Ưu tiên trẻ em có hộ khẩu thường trú hoặc tạm trú tại địa bàn phường Điện Biên, Ba Đình</li>
  <li><strong>Sức khỏe:</strong> Đủ sức khỏe để tham gia học tập theo xác nhận của cơ sở y tế</li>
</ul>
<h3>Chỉ tiêu và hồ sơ</h3>
<p>Năm học 2026-2027, nhà trường dự kiến tuyển sinh <strong>160 học sinh</strong> vào 4 lớp. Hồ sơ gồm: đơn đăng ký theo mẫu, bản sao giấy khai sinh có công chứng, bản sao sổ hộ khẩu/KT3 có công chứng, giấy xác nhận sức khỏe từ cơ sở y tế, 2 ảnh 3x4 chụp trong vòng 6 tháng.</p>
<h3>Thời gian nộp hồ sơ</h3>
<p>Từ <strong>1/4/2026 đến 30/4/2026</strong>, trong giờ hành chính tại Văn phòng nhà trường (thứ 2 đến thứ 6, 7h30-11h30 và 13h30-17h00). Phụ huynh có thể đặt lịch hẹn qua website nhà trường để tránh xếp hàng chờ đợi. Mọi thắc mắc xin liên hệ Văn phòng nhà trường qua số điện thoại <strong>024-3835-xxxx</strong>.</p>`,
      excerpt: 'Trường TH Lê Quý Đôn thông báo tuyển sinh lớp 1 năm học 2026-2027 với 160 chỉ tiêu, ưu tiên trẻ có hộ khẩu địa bàn phường Điện Biên, Ba Đình.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-9/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'tuyen-sinh',
      view_count: 698,
      published_at: daysAgo(69),
      seo_title: 'Tuyển sinh lớp 1 năm 2026-2027 - Trường TH Lê Quý Đôn Hà Nội',
      seo_description: 'Thông báo tuyển sinh lớp 1 năm học 2026-2027: 160 chỉ tiêu, điều kiện, hồ sơ và thời gian đăng ký vào Trường Tiểu học Lê Quý Đôn Hà Nội.',
    },

    // -------------------------------------------------------
    // 10. tuyen-sinh — Chuyển cấp lên lớp 6
    // -------------------------------------------------------
    {
      title: 'Hội thảo định hướng chuyển cấp: Hành trang vào lớp 6 cho học sinh khối 5',
      slug: 'hoi-thao-dinh-huong-chuyen-cap-lop-6',
      content: `<h2>Chuẩn bị hành trang cho bước chuyển quan trọng</h2>
<p>Ngày 15 tháng 11 năm 2025, Trường Tiểu học Lê Quý Đôn tổ chức <strong>Hội thảo định hướng chuyển cấp</strong> dành cho học sinh khối 5 và phụ huynh. Với sự tham dự của hơn 200 phụ huynh và đại diện từ 5 trường THCS nổi tiếng, hội thảo đã cung cấp nhiều thông tin hữu ích.</p>
<h3>Các trường THCS tham gia hội thảo</h3>
<ul>
  <li>THCS Trưng Vương – Hà Nội</li>
  <li>THCS Giảng Võ – Ba Đình</li>
  <li>THCS Chu Văn An – Hà Nội</li>
  <li>THCS Đống Đa – Hà Nội</li>
  <li>Trường Liên cấp Lê Quý Đôn (cơ sở 2)</li>
</ul>
<h3>Nội dung hội thảo</h3>
<p>Đại diện các trường THCS trình bày về chương trình học, hoạt động ngoại khóa, cơ sở vật chất và quy trình tuyển sinh vào lớp 6. Nhà tâm lý học giáo dục TS. Nguyễn Thị Lan chia sẻ về <em>cách giúp trẻ thích nghi với môi trường học tập mới</em>, nhấn mạnh cha mẹ cần tạo tâm lý tự tin thay vì áp lực điểm số.</p>
<p>Phụ huynh nên cho con tham gia các câu lạc bộ, hoạt động ngoại khóa để phát triển kỹ năng mềm — yếu tố các trường THCS chất lượng cao ngày càng coi trọng bên cạnh học lực. Tài liệu hội thảo được đăng tải trên website nhà trường để phụ huynh tiện tham khảo.</p>`,
      excerpt: 'Hội thảo định hướng chuyển cấp lên lớp 6 dành cho học sinh khối 5 với sự tham dự của 5 trường THCS uy tín và hơn 200 phụ huynh.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-10/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'tuyen-sinh',
      view_count: 445,
      published_at: daysAgo(147),
      seo_title: 'Hội thảo chuyển cấp lớp 6 - Trường TH Lê Quý Đôn',
      seo_description: 'Hội thảo định hướng chuyển cấp vào lớp 6 cho học sinh khối 5 và phụ huynh Trường TH Lê Quý Đôn, với đại diện 5 trường THCS tham dự.',
    },

    // -------------------------------------------------------
    // 11. doi-song — Thực đơn bán trú
    // -------------------------------------------------------
    {
      title: 'Thực đơn bán trú tháng 11: Đảm bảo dinh dưỡng và đa dạng khẩu phần ăn',
      slug: 'thuc-don-ban-tru-thang-11-2025',
      content: `<h2>Nguyên tắc xây dựng thực đơn bán trú</h2>
<p>Nhà trường luôn coi việc đảm bảo dinh dưỡng cho học sinh bán trú là nhiệm vụ hàng đầu. Thực đơn tháng 11 năm 2025 được xây dựng bởi chuyên gia dinh dưỡng Bệnh viện Nhi Trung Ương phối hợp với Ban Bán trú nhà trường, đảm bảo:</p>
<ul>
  <li>Đủ 4 nhóm thực phẩm: đạm, béo, bột đường, vitamin và khoáng chất</li>
  <li>Năng lượng bữa trưa đạt 35-40% nhu cầu năng lượng ngày (600-700 kcal)</li>
  <li>Đa dạng thực phẩm, thay đổi theo mùa và không lặp lại trong tuần</li>
  <li>Ưu tiên thực phẩm sạch, có nguồn gốc rõ ràng từ các nhà cung cấp uy tín</li>
</ul>
<h3>Thực đơn mẫu tuần 1 tháng 11</h3>
<p><strong>Thứ 2:</strong> Cơm trắng, thịt bò xào hành tây, canh chua cá hồi, dưa hấu tráng miệng<br>
<strong>Thứ 3:</strong> Cơm trắng, gà rang gừng, canh bí đỏ thịt xay, cam tráng miệng<br>
<strong>Thứ 4:</strong> Cơm trắng, tôm rang chua ngọt, canh rau ngót thịt, táo tráng miệng<br>
<strong>Thứ 5:</strong> Cơm trắng, cá ba sa sốt cà chua, canh mồng tơi tôm, lê tráng miệng<br>
<strong>Thứ 6:</strong> Cơm trắng, thịt heo kho tiêu, canh cải thịt bằm, nho tráng miệng</p>
<h3>Minh bạch thông tin</h3>
<p>Thực đơn đầy đủ cả tháng được công khai trên bảng thông báo tại cổng trường và trên phần mềm quản lý bán trú. Phụ huynh có thể theo dõi khẩu phần ăn của con mỗi ngày. Mọi phản ánh về chất lượng bữa ăn, xin liên hệ trực tiếp với Ban Bán trú qua hotline của nhà trường trong giờ hành chính.</p>`,
      excerpt: 'Thực đơn bán trú tháng 11/2025 được xây dựng bởi chuyên gia dinh dưỡng BV Nhi TW, đảm bảo đủ dưỡng chất 600-700 kcal và đa dạng khẩu phần cho học sinh.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-11/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'doi-song',
      view_count: 321,
      published_at: daysAgo(165),
      seo_title: 'Thực đơn bán trú tháng 11/2025 - Trường TH Lê Quý Đôn',
      seo_description: 'Thực đơn bán trú tháng 11/2025 của Trường TH Lê Quý Đôn Hà Nội đảm bảo dinh dưỡng 600-700 kcal/bữa trưa theo tiêu chuẩn BV Nhi TW.',
    },

    // -------------------------------------------------------
    // 12. doi-song — Khám sức khỏe định kỳ
    // -------------------------------------------------------
    {
      title: 'Khám sức khỏe định kỳ đầu năm học: 100% học sinh được kiểm tra toàn diện',
      slug: 'kham-suc-khoe-dinh-ky-dau-nam-2025',
      content: `<h2>Sức khỏe là nền tảng của học tập</h2>
<p>Từ ngày 15 đến 30 tháng 9 năm 2025, Trường Tiểu học Lê Quý Đôn phối hợp với Bệnh viện Đa khoa Hà Nội tổ chức chương trình <strong>Khám sức khỏe định kỳ đầu năm học</strong> cho toàn bộ học sinh. Đây là hoạt động thường niên được nhà trường duy trì từ năm 2015 nhằm phát hiện sớm các vấn đề sức khỏe ảnh hưởng đến học tập.</p>
<h3>Nội dung khám</h3>
<ul>
  <li><strong>Đo chiều cao, cân nặng</strong> — đánh giá chỉ số BMI và tình trạng dinh dưỡng</li>
  <li><strong>Kiểm tra thị lực</strong> — phát hiện cận thị, loạn thị sớm</li>
  <li><strong>Khám răng miệng</strong> — phát hiện sâu răng và hướng dẫn vệ sinh răng miệng</li>
  <li><strong>Đo huyết áp, nghe tim phổi</strong> — đánh giá sức khỏe tổng quát</li>
  <li><strong>Kiểm tra thính lực</strong> — phát hiện giảm thính lực ảnh hưởng đến học tập</li>
</ul>
<h3>Kết quả sơ bộ</h3>
<p>Kết quả cho thấy <strong>85% học sinh có sức khỏe tốt</strong>. Một số lưu ý đáng chú ý: 12% học sinh có biểu hiện cận thị nhẹ đến trung bình (cần đeo kính), 8% học sinh thừa cân cần điều chỉnh chế độ ăn và tăng cường vận động.</p>
<p>Phiếu kết quả khám sức khỏe của từng học sinh được gửi về cho phụ huynh. Những học sinh cần theo dõi thêm sẽ được nhà trường thông báo trực tiếp và hỗ trợ chuyển giới thiệu đến các cơ sở y tế phù hợp.</p>`,
      excerpt: 'Toàn bộ học sinh Trường TH Lê Quý Đôn được khám sức khỏe định kỳ từ ngày 15-30/9/2025, bao gồm thị lực, răng miệng, thính lực và đánh giá dinh dưỡng.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-12/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'doi-song',
      view_count: 287,
      published_at: daysAgo(192),
      seo_title: 'Khám sức khỏe định kỳ đầu năm học 2025 - Trường TH Lê Quý Đôn',
      seo_description: '100% học sinh Trường TH Lê Quý Đôn được khám sức khỏe toàn diện đầu năm: thị lực, răng miệng, thính lực, BMI và tình trạng dinh dưỡng.',
    },

    // -------------------------------------------------------
    // 13. the-thao — Giải bơi lội
    // -------------------------------------------------------
    {
      title: 'Giải Bơi lội liên trường tiểu học quận Ba Đình 2025: Lê Quý Đôn giành 3 Huy chương Vàng',
      slug: 'giai-boi-loi-lien-truong-quan-ba-dinh-2025',
      content: `<h2>Thành tích xuất sắc tại đường đua xanh</h2>
<p>Ngày 25 tháng 10 năm 2025, tại Bể bơi Thủ Đô (số 8 Trần Phú, Ba Đình), <strong>Giải Bơi lội liên trường tiểu học quận Ba Đình năm 2025</strong> đã diễn ra sôi nổi với sự tham dự của 12 trường tiểu học. Đội bơi Trường Tiểu học Lê Quý Đôn ghi dấu ấn đặc biệt với bảng thành tích ấn tượng.</p>
<h3>Thành tích của đội bơi Lê Quý Đôn</h3>
<ul>
  <li><strong>Huy chương Vàng</strong> — 50m ếch nam (em Phạm Đức Anh, lớp 5B) — thời gian: 42.3 giây</li>
  <li><strong>Huy chương Vàng</strong> — 50m tự do nữ (em Nguyễn Thu Hà, lớp 4A) — thời gian: 38.7 giây</li>
  <li><strong>Huy chương Vàng</strong> — 4x50m tiếp sức hỗn hợp — phá kỷ lục giải</li>
  <li><strong>Huy chương Bạc</strong> — 50m bướm nam (em Lê Tuấn Kiệt, lớp 5A)</li>
  <li><strong>Huy chương Đồng</strong> — 100m tự do nữ (em Trần Bảo Châu, lớp 5C)</li>
</ul>
<h3>Chặng đường luyện tập</h3>
<p>Để đạt được những kết quả này, các em đã luyện tập kiên trì từ 5h30 sáng mỗi ngày tại Bể bơi Thủ Đô, dưới sự huấn luyện tận tâm của HLV Trần Văn Minh — cựu tuyển thủ bơi lội quốc gia. Đây là năm thứ 3 liên tiếp Lê Quý Đôn dẫn đầu bảng tổng sắc giải bơi liên trường quận, khẳng định thế mạnh thể thao của nhà trường.</p>`,
      excerpt: 'Đội bơi Trường TH Lê Quý Đôn giành 3 Huy chương Vàng, 1 Bạc, 1 Đồng tại Giải Bơi lội liên trường quận Ba Đình 2025, lần thứ 3 liên tiếp dẫn đầu bảng tổng sắc.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-13/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'the-thao',
      view_count: 576,
      published_at: daysAgo(168),
      seo_title: 'Lê Quý Đôn giành 3 HCV tại Giải Bơi lội liên trường Ba Đình 2025',
      seo_description: 'Đội bơi Trường TH Lê Quý Đôn đoạt 3 Huy chương Vàng tại Giải Bơi lội liên trường tiểu học quận Ba Đình 2025.',
    },

    // -------------------------------------------------------
    // 14. the-thao — Bóng đá mini
    // -------------------------------------------------------
    {
      title: 'Giải Bóng đá mini liên trường tiểu học quận Ba Đình: Đội Lê Quý Đôn vào bán kết',
      slug: 'giai-bong-da-mini-lien-truong-2025',
      content: `<h2>Cuộc hành trình trên sân cỏ</h2>
<p>Tháng 10 năm 2025, <strong>Giải Bóng đá mini dành cho học sinh tiểu học quận Ba Đình</strong> diễn ra sôi nổi với sự tham gia của 16 đội từ 16 trường tiểu học. Đội bóng Trường Tiểu học Lê Quý Đôn — gồm 10 tuyển thủ từ các khối lớp 4 và 5 — đã có hành trình ấn tượng tại giải đấu năm nay.</p>
<h3>Hành trình tại giải</h3>
<ul>
  <li><strong>Vòng bảng:</strong> Thắng cả 3 trận, ghi 8 bàn, thủng lưới 2 lần — đứng nhất bảng B</li>
  <li><strong>Tứ kết:</strong> Thắng đội TH Hoàng Diệu với tỷ số 3-1 sau hiệp phụ</li>
  <li><strong>Bán kết:</strong> Thua đội TH Trưng Vương với tỷ số 1-2 trong trận cầu kịch tính</li>
</ul>
<p>Dù chưa vào chung kết, các em đã chơi với tinh thần fair-play và bản lĩnh đáng ngưỡng mộ. Em Hoàng Minh Quân (lớp 5B) được bầu chọn là <strong>Cầu thủ xuất sắc nhất vòng tứ kết</strong> với 2 bàn thắng và 3 đường kiến tạo.</p>
<h3>Kế hoạch phát triển</h3>
<p>HLV bóng đá trường — thầy Lê Hải Nam — cho biết sẽ mở rộng CLB bóng đá từ 20 lên 35 thành viên trong năm học tới, tăng cường luyện tập kỹ thuật cá nhân và chiến thuật đội hình. Nhà trường đang xin phép nâng cấp sân bóng mini để các em có điều kiện tập luyện tốt hơn.</p>`,
      excerpt: 'Đội bóng đá mini Trường TH Lê Quý Đôn vào đến bán kết Giải liên trường quận Ba Đình 2025 sau khi thắng cả 3 trận vòng bảng và vượt qua tứ kết.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-14/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'the-thao',
      view_count: 354,
      published_at: daysAgo(163),
      seo_title: 'Đội bóng đá TH Lê Quý Đôn vào bán kết liên trường Ba Đình 2025',
      seo_description: 'Đội bóng đá mini Trường TH Lê Quý Đôn vào bán kết giải liên trường quận Ba Đình 2025 sau hành trình ấn tượng.',
    },

    // -------------------------------------------------------
    // 15. the-thao — CLB Vovinam
    // -------------------------------------------------------
    {
      title: 'Khai giảng CLB Vovinam: Học võ để rèn thân, luyện tâm',
      slug: 'khai-giang-clb-vovinam-2025',
      content: `<h2>Võ cổ truyền Việt Nam đến với học sinh tiểu học</h2>
<p>Ngày 1 tháng 10 năm 2025, Trường Tiểu học Lê Quý Đôn chính thức khai giảng <strong>Câu lạc bộ Vovinam</strong> trong khuôn khổ chương trình giáo dục thể chất mở rộng. Đây là kết quả của sự phối hợp giữa nhà trường và Liên đoàn Vovinam Hà Nội, với mong muốn mang bộ môn võ thuật dân tộc đến gần hơn với thế hệ trẻ.</p>
<h3>Tại sao chọn Vovinam?</h3>
<p>Vovinam — Việt Võ Đạo — là môn võ cổ truyền Việt Nam kết hợp kỹ thuật chiến đấu với triết lý đạo đức và nhân cách. Tập Vovinam giúp học sinh:</p>
<ul>
  <li>Rèn luyện sức khỏe, sự dẻo dai và phản xạ</li>
  <li>Phát triển tinh thần kỷ luật, tự chủ và kiên nhẫn</li>
  <li>Học tự vệ và bảo vệ bản thân trong các tình huống nguy hiểm</li>
  <li>Tự hào và gìn giữ di sản văn hóa võ thuật dân tộc</li>
</ul>
<h3>Thông tin CLB</h3>
<p>CLB hoạt động <strong>2 buổi/tuần</strong> (thứ Ba và thứ Năm, 16h00-17h30), dưới sự hướng dẫn của HLV Nguyễn Thanh Bình — Đai Đen đẳng 5 Vovinam, từng đại diện Việt Nam thi đấu quốc tế. Khóa khai giảng đầu tiên có <strong>45 học sinh</strong> từ khối lớp 3 đến 5 tham gia. Phụ huynh có thể đăng ký tại văn phòng nhà trường từ nay đến hết tháng 10.</p>`,
      excerpt: 'Trường TH Lê Quý Đôn khai giảng CLB Vovinam dưới sự hướng dẫn của HLV Đai Đen đẳng 5, với 45 học sinh khối 3-5 tham gia khóa đầu tiên.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-15/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'the-thao',
      view_count: 267,
      published_at: daysAgo(193),
      seo_title: 'Khai giảng CLB Vovinam - Trường TH Lê Quý Đôn Hà Nội',
      seo_description: 'Trường TH Lê Quý Đôn khai giảng CLB Vovinam 2025, 45 học sinh khối 3-5 tham gia tập luyện cùng HLV Đai Đen đẳng 5.',
    },

    // -------------------------------------------------------
    // 16. nghe-thuat — Triển lãm mỹ thuật
    // -------------------------------------------------------
    {
      title: 'Triển lãm Mỹ thuật "Màu sắc Lê Quý Đôn": Hơn 200 tác phẩm của học sinh',
      slug: 'trien-lam-my-thuat-mau-sac-le-quy-don',
      content: `<h2>Khi trẻ nhỏ nói lên bằng màu sắc</h2>
<p>Từ ngày 20 đến 25 tháng 11 năm 2025, hành lang và sảnh chính Trường Tiểu học Lê Quý Đôn trở thành một phòng trưng bày nghệ thuật thu nhỏ với hơn <strong>200 tác phẩm hội họa và thủ công</strong> của học sinh từ lớp 1 đến lớp 5. Triển lãm mang chủ đề <em>"Màu sắc Lê Quý Đôn"</em> — nơi mỗi bức tranh là một câu chuyện nhỏ về cuộc sống học đường.</p>
<h3>Các hạng mục trưng bày</h3>
<ul>
  <li><strong>Tranh màu nước:</strong> 80 tác phẩm phong cảnh, chân dung và tĩnh vật</li>
  <li><strong>Tranh sáp màu:</strong> 65 tác phẩm chủ đề "Gia đình tôi" và "Mùa hè của tôi"</li>
  <li><strong>Thủ công sáng tạo:</strong> 40 sản phẩm làm từ vật liệu tái chế</li>
  <li><strong>Tranh cát:</strong> 20 tác phẩm tranh cát nghệ thuật do CLB Mỹ thuật thực hiện</li>
</ul>
<h3>Tiếng nói từ các nghệ sĩ nhỏ</h3>
<p>Em Bùi Ngọc Anh (lớp 3C), tác giả bức tranh "Mẹ và con" được nhiều người yêu thích nhất, chia sẻ: <em>"Con vẽ mẹ con đang đọc sách dưới cây táo trong sân nhà. Con muốn mọi người biết con yêu mẹ nhiều lắm."</em></p>
<p>Giáo viên Mỹ thuật — cô Lê Phương Thảo — cho biết triển lãm là cơ hội để các em được nhìn nhận và trân trọng, đồng thời khơi dậy niềm đam mê nghệ thuật từ sớm. Dự kiến triển lãm sẽ được tổ chức thường niên vào cuối mỗi học kỳ I.</p>`,
      excerpt: 'Triển lãm "Màu sắc Lê Quý Đôn" trưng bày hơn 200 tác phẩm hội họa và thủ công của học sinh từ lớp 1-5, là sân chơi nghệ thuật thường niên đầy ý nghĩa.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-16/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'nghe-thuat',
      view_count: 341,
      published_at: daysAgo(143),
      seo_title: 'Triển lãm Mỹ thuật "Màu sắc Lê Quý Đôn" 2025',
      seo_description: 'Hơn 200 tác phẩm hội họa và thủ công của học sinh Trường TH Lê Quý Đôn trong triển lãm "Màu sắc Lê Quý Đôn" tháng 11/2025.',
    },

    // -------------------------------------------------------
    // 17. nghe-thuat — Biểu diễn âm nhạc
    // -------------------------------------------------------
    {
      title: 'Đêm nhạc "Giai điệu tuổi thơ": CLB Âm nhạc Lê Quý Đôn chào năm mới 2026',
      slug: 'dem-nhac-giai-dieu-tuoi-tho-2026',
      content: `<h2>Âm nhạc kết nối trái tim</h2>
<p>Tối ngày 20 tháng 12 năm 2025, Nhà Văn hóa Lao động quận Ba Đình rộn rã tiếng nhạc khi <strong>CLB Âm nhạc Trường Tiểu học Lê Quý Đôn</strong> biểu diễn chương trình <em>"Giai điệu tuổi thơ — Chào năm mới 2026"</em>. Đây là chương trình biểu diễn thường niên kết thúc học kỳ I, được tổ chức lần thứ 7 liên tiếp.</p>
<h3>Chương trình biểu diễn</h3>
<ul>
  <li><strong>Hợp xướng:</strong> Tốp ca 30 học sinh biểu diễn bài "Mùa xuân ơi" và "Trời xanh của tôi"</li>
  <li><strong>Độc tấu piano:</strong> Em Nguyễn Thúy Quỳnh (lớp 5A) biểu diễn Sonata Ánh trăng của Beethoven</li>
  <li><strong>Hòa tấu nhạc cụ dân tộc:</strong> Đàn tranh, sáo trúc, đàn bầu với bản "Lý cây bông"</li>
  <li><strong>Nhạc kịch thiếu nhi:</strong> "Người nhạc sĩ mù" — câu chuyện về lòng kiên trì và ước mơ âm nhạc</li>
  <li><strong>Guitar đệm hát:</strong> Bộ tứ guitar lớp 4 biểu diễn các bài hát thiếu nhi Việt Nam</li>
</ul>
<p>Chương trình kéo dài gần 2 tiếng đồng hồ với sự tham dự của hơn 300 khán giả — chủ yếu là phụ huynh và học sinh. Nhiều phụ huynh xúc động, không ít người đã rơi lệ trước những giọng ca trong sáng, hồn nhiên của con em mình.</p>
<p>Toàn bộ số tiền bán vé (20.000đ/vé) được dùng để mua nhạc cụ cho CLB, đảm bảo không thu thêm bất kỳ khoản đóng góp nào từ phụ huynh.</p>`,
      excerpt: 'Đêm nhạc "Giai điệu tuổi thơ" của CLB Âm nhạc Lê Quý Đôn thu hút hơn 300 khán giả với hợp xướng, độc tấu piano, nhạc cụ dân tộc và nhạc kịch thiếu nhi.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-17/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'nghe-thuat',
      view_count: 412,
      published_at: daysAgo(113),
      seo_title: 'Đêm nhạc "Giai điệu tuổi thơ 2026" - CLB Âm nhạc Lê Quý Đôn',
      seo_description: 'CLB Âm nhạc Trường TH Lê Quý Đôn biểu diễn "Giai điệu tuổi thơ — Chào năm mới 2026" với hơn 300 khán giả tại Nhà Văn hóa Ba Đình.',
    },

    // -------------------------------------------------------
    // 18. stem — Đội Robotics WRO
    // -------------------------------------------------------
    {
      title: 'Đội Robotics Lê Quý Đôn giành Huy chương Vàng WRO Vietnam 2025',
      slug: 'doi-robotics-le-quy-don-hcv-wro-vietnam-2025',
      content: `<h2>Chiến thắng lịch sử của đội Robotics nhỏ tuổi</h2>
<p>Tháng 8 năm 2025, tại <strong>Cuộc thi Robotics Quốc tế WRO Vietnam 2025</strong> (World Robot Olympiad) tổ chức tại Hà Nội, đội Robotics của Trường Tiểu học Lê Quý Đôn đã làm nên kỳ tích khi giành <strong>Huy chương Vàng</strong> hạng mục Regular Category — đội trẻ nhất trong lịch sử giải đạt thành tích này.</p>
<h3>Đội thi gồm có</h3>
<ul>
  <li>Em Trần Anh Khoa (lớp 5A) — trưởng nhóm, phụ trách lập trình</li>
  <li>Em Lê Bảo Ngọc (lớp 4B) — phụ trách thiết kế cơ khí robot</li>
  <li>Em Nguyễn Việt Hoàng (lớp 5C) — phụ trách chiến thuật và thử nghiệm</li>
</ul>
<h3>Hành trình đến chức vô địch</h3>
<p>Robot mang tên <em>"Vạn Lý"</em> được thiết kế để thực hiện nhiệm vụ phân loại rác thải tự động — chủ đề phù hợp với tinh thần bảo vệ môi trường. Đội đã dành hơn <strong>300 giờ</strong> nghiên cứu, thiết kế, lập trình và thử nghiệm trong vòng 6 tháng, trải qua không biết bao nhiêu lần thất bại và điều chỉnh.</p>
<p>Với kết quả xuất sắc tại WRO Vietnam 2025, đội Robotics Lê Quý Đôn được tuyển chọn vào đội tuyển quốc gia để tham dự <strong>WRO International Final 2025</strong> tại Panama. Đây là cột mốc lịch sử, lần đầu tiên một trường tiểu học Việt Nam được đại diện quốc gia tại đấu trường robotics quốc tế.</p>`,
      excerpt: 'Đội Robotics 3 thành viên của Trường TH Lê Quý Đôn giành Huy chương Vàng WRO Vietnam 2025 và được tuyển chọn đại diện Việt Nam tại WRO International Final.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-18/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'stem',
      view_count: 783,
      published_at: daysAgo(230),
      seo_title: 'Đội Robotics Lê Quý Đôn giành HCV WRO Vietnam 2025',
      seo_description: 'Đội Robotics Trường TH Lê Quý Đôn giành Huy chương Vàng WRO Vietnam 2025, đội trẻ nhất lịch sử đạt thành tích này.',
    },

    // -------------------------------------------------------
    // 19. stem — Hội chợ khoa học
    // -------------------------------------------------------
    {
      title: 'Hội chợ Khoa học 2025: Nơi ươm mầm các nhà khoa học tương lai',
      slug: 'hoi-cho-khoa-hoc-2025-le-quy-don',
      content: `<h2>Khoa học trở nên thú vị và gần gũi</h2>
<p>Ngày 5 tháng 12 năm 2025, <strong>Hội chợ Khoa học thường niên lần thứ 4</strong> của Trường Tiểu học Lê Quý Đôn diễn ra với không khí sôi nổi và đầy háo hức. Hơn 60 dự án khoa học được trưng bày, do chính các em học sinh từ lớp 3 đến lớp 5 nghiên cứu và thực hiện trong suốt học kỳ I.</p>
<h3>Một số dự án nổi bật</h3>
<ul>
  <li><strong>"Cây trồng trong bóng tối"</strong> (lớp 3A) — nghiên cứu ảnh hưởng của ánh sáng đến sự sinh trưởng của cây, kết quả sau 3 tuần thí nghiệm</li>
  <li><strong>"Nước sạch từ chai nhựa tái chế"</strong> (lớp 4B) — thiết kế bộ lọc nước đơn giản từ cát, sỏi và than hoạt tính</li>
  <li><strong>"Năng lượng mặt trời mini"</strong> (lớp 5A) — lắp ráp mô hình pin mặt trời nhỏ thắp sáng đèn LED</li>
  <li><strong>"Vi khuẩn trong tay sau khi rửa"</strong> (lớp 4C) — thí nghiệm vi sinh học đơn giản chứng minh tầm quan trọng của rửa tay đúng cách</li>
</ul>
<h3>Ban giám khảo và giải thưởng</h3>
<p>Ban giám khảo gồm các giảng viên Đại học Khoa học Tự nhiên Hà Nội đã đánh giá cao chất lượng của các dự án. Dự án "Nước sạch từ chai nhựa tái chế" đoạt <strong>Giải Nhất</strong>, được đề cử tham gia Hội thi Khoa học Kỹ thuật cấp quận. Sự kiện thu hút hơn 600 khán giả tham dự trong ngày, trong đó có nhiều phụ huynh và học sinh các trường bạn.</p>`,
      excerpt: 'Hội chợ Khoa học 2025 của Trường TH Lê Quý Đôn trưng bày hơn 60 dự án nghiên cứu do học sinh lớp 3-5 thực hiện, thu hút hơn 600 khán giả.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-19/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'stem',
      view_count: 456,
      published_at: daysAgo(128),
      seo_title: 'Hội chợ Khoa học 2025 - Trường TH Lê Quý Đôn Hà Nội',
      seo_description: 'Hội chợ Khoa học lần 4 của Trường TH Lê Quý Đôn với hơn 60 dự án nghiên cứu của học sinh, được giảng viên ĐH Khoa học Tự nhiên đánh giá.',
    },

    // -------------------------------------------------------
    // 20. thong-bao (child of tin-tuc) — Thông báo nghỉ lễ
    // -------------------------------------------------------
    {
      title: 'Thông báo lịch nghỉ Tết Nguyên Đán 2026 và kế hoạch học bù',
      slug: 'thong-bao-lich-nghi-tet-nguyen-dan-2026',
      content: `<h2>Thông báo nghỉ Tết Nguyên Đán Bính Ngọ 2026</h2>
<p>Căn cứ Quyết định của Thủ tướng Chính phủ về lịch nghỉ Tết Nguyên Đán năm 2026 và hướng dẫn của Sở Giáo dục và Đào tạo Hà Nội, Trường Tiểu học Lê Quý Đôn thông báo lịch nghỉ Tết và kế hoạch học bù như sau:</p>
<h3>Lịch nghỉ Tết</h3>
<ul>
  <li><strong>Bắt đầu nghỉ:</strong> Thứ Sáu, ngày 23 tháng 1 năm 2026 (25 tháng 12 Âm lịch)</li>
  <li><strong>Kết thúc nghỉ:</strong> Thứ Năm, ngày 5 tháng 2 năm 2026 (8 tháng 1 Âm lịch)</li>
  <li><strong>Ngày học lại:</strong> Thứ Sáu, ngày 6 tháng 2 năm 2026</li>
  <li><strong>Tổng số ngày nghỉ:</strong> 14 ngày (bao gồm ngày lễ và cuối tuần)</li>
</ul>
<h3>Kế hoạch học bù</h3>
<p>Do kỳ nghỉ Tết dài hơn thường lệ 2 ngày, nhà trường sẽ tổ chức học bù vào <strong>hai buổi sáng Thứ Bảy</strong> (ngày 21/2 và 28/2/2026). Lịch học cụ thể sẽ được thông báo sau khi tham khảo ý kiến Ban Phụ huynh học sinh.</p>
<h3>Lưu ý về an toàn dịp Tết</h3>
<p>Nhà trường khuyến cáo phụ huynh chú ý an toàn giao thông, an toàn thực phẩm và phòng tránh đuối nước cho trẻ trong dịp nghỉ Tết. Nếu có sự cố khẩn cấp, phụ huynh có thể liên hệ Ban Giám hiệu qua số hotline trực ban. Chúc toàn thể gia đình học sinh một năm mới Bính Ngọ 2026 bình an, hạnh phúc và thịnh vượng!</p>`,
      excerpt: 'Trường TH Lê Quý Đôn thông báo học sinh nghỉ Tết Nguyên Đán 2026 từ 23/1 đến 5/2/2026, học lại từ 6/2/2026 với kế hoạch học bù hai buổi sáng Thứ Bảy.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-20/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'thong-bao',
      view_count: 534,
      published_at: daysAgo(98),
      seo_title: 'Lịch nghỉ Tết 2026 - Trường TH Lê Quý Đôn Hà Nội',
      seo_description: 'Thông báo lịch nghỉ Tết Nguyên Đán 2026 và kế hoạch học bù của Trường TH Lê Quý Đôn Hà Nội.',
    },

    // -------------------------------------------------------
    // 21. ket-qua-hoc-tap (child of hoc-tap) — Học sinh giỏi cấp quận
    // -------------------------------------------------------
    {
      title: 'Học sinh giỏi cấp quận học kỳ I 2025-2026: 42 em đoạt giải',
      slug: 'hoc-sinh-gioi-cap-quan-hoc-ky-1-2025-2026',
      content: `<h2>Thành tích học sinh giỏi học kỳ I</h2>
<p>Trong kỳ thi học sinh giỏi cấp quận Ba Đình học kỳ I năm học 2025-2026 diễn ra vào tháng 12/2025, Trường Tiểu học Lê Quý Đôn đã đạt thành tích xuất sắc khi có tổng cộng <strong>42 học sinh đoạt giải</strong> ở các môn thi, đứng thứ 2 toàn quận về số lượng giải.</p>
<h3>Phân bổ giải theo môn</h3>
<ul>
  <li><strong>Toán:</strong> 3 Giải Nhất, 5 Giải Nhì, 7 Giải Ba, 4 Khuyến khích</li>
  <li><strong>Tiếng Việt:</strong> 2 Giải Nhất, 4 Giải Nhì, 5 Giải Ba, 3 Khuyến khích</li>
  <li><strong>Tiếng Anh:</strong> 1 Giải Nhất, 3 Giải Nhì, 3 Giải Ba, 2 Khuyến khích</li>
</ul>
<h3>Niềm tự hào đặc biệt</h3>
<p>Em <strong>Phạm Thanh Hà</strong> (lớp 5B) đoạt <strong>Giải Nhất môn Toán</strong> với số điểm tuyệt đối, đồng thời đoạt Giải Nhì môn Tiếng Anh — trở thành học sinh duy nhất đoạt 2 giải Nhất-Nhì trong cùng kỳ thi cấp quận.</p>
<p>Em <strong>Nguyễn Minh Châu</strong> (lớp 4A) đoạt Giải Nhất môn Tiếng Việt với bài văn miêu tả được ban giám khảo đánh giá cao về xúc cảm và sự sáng tạo ngôn ngữ.</p>
<p>Ban Giám hiệu trao thưởng và biểu dương toàn bộ 42 học sinh đoạt giải trong buổi chào cờ đầu tuần. Nhà trường đặt mục tiêu phấn đấu dẫn đầu toàn quận tại kỳ thi học sinh giỏi học kỳ II sắp tới.</p>`,
      excerpt: '42 học sinh Trường TH Lê Quý Đôn đoạt giải tại kỳ thi học sinh giỏi cấp quận Ba Đình học kỳ I 2025-2026, xếp thứ 2 toàn quận về số lượng giải.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-21/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'ket-qua-hoc-tap',
      view_count: 489,
      published_at: daysAgo(120),
      seo_title: '42 học sinh TH Lê Quý Đôn đoạt giải học sinh giỏi quận Ba Đình HK1',
      seo_description: '42 học sinh Trường TH Lê Quý Đôn đoạt giải học sinh giỏi cấp quận Ba Đình học kỳ I 2025-2026 ở các môn Toán, Tiếng Việt và Tiếng Anh.',
    },

    // -------------------------------------------------------
    // 22. ngoai-khoa (child of hoat-dong) — Ngày hội đọc sách
    // -------------------------------------------------------
    {
      title: 'Ngày hội Đọc sách 2025: Khơi dậy tình yêu văn học từ những trang sách đầu tiên',
      slug: 'ngay-hoi-doc-sach-2025-le-quy-don',
      content: `<h2>Đọc sách — thói quen nền tảng của mọi thành công</h2>
<p>Nhân Ngày Sách Việt Nam (21/4) năm 2025, Trường Tiểu học Lê Quý Đôn tổ chức <strong>Ngày hội Đọc sách 2025</strong> với chuỗi hoạt động phong phú kéo dài suốt một tuần (15-21/4/2025), nhằm xây dựng văn hóa đọc sách từ sớm cho học sinh tiểu học.</p>
<h3>Các hoạt động trong tuần</h3>
<ul>
  <li><strong>Triển lãm sách:</strong> Trưng bày hơn 500 đầu sách thiếu nhi trong thư viện mở rộng ra sân trường</li>
  <li><strong>Đọc sách to:</strong> Học sinh lớp 5 đọc to truyện cho các em lớp 1-2 nghe mỗi buổi sáng</li>
  <li><strong>Cuộc thi kể chuyện sách:</strong> Mỗi lớp cử 1 đại diện kể lại cuốn sách yêu thích trước toàn trường</li>
  <li><strong>Trao đổi sách:</strong> Học sinh mang sách cũ đến đổi lấy sách mới — 350 cuốn sách được luân chuyển</li>
  <li><strong>Gặp gỡ tác giả:</strong> Nhà văn thiếu nhi Nguyễn Nhật Ánh (qua video call) giao lưu với học sinh</li>
</ul>
<h3>Thông điệp từ sự kiện</h3>
<p>Thầy Hiệu trưởng phát biểu: <em>"Mỗi cuốn sách là một cuộc phiêu lưu. Chúng tôi muốn học sinh Lê Quý Đôn trở thành những người bạn thân thiết của sách ngay từ những năm đầu đời — bởi thói quen đọc sách sẽ theo các em đến suốt cuộc đời."</em></p>
<p>Sau sự kiện, thư viện nhà trường ghi nhận lượt mượn sách tăng <strong>240%</strong> so với tháng trước — minh chứng rõ nét cho hiệu quả của hoạt động.</p>`,
      excerpt: 'Ngày hội Đọc sách 2025 của Trường TH Lê Quý Đôn kéo dài cả tuần với triển lãm sách, trao đổi sách và giao lưu tác giả, giúp lượt mượn sách thư viện tăng 240%.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-22/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'ngoai-khoa',
      view_count: 312,
      published_at: daysAgo(355),
      seo_title: 'Ngày hội Đọc sách 2025 - Trường TH Lê Quý Đôn Hà Nội',
      seo_description: 'Ngày hội Đọc sách 2025 tại Trường TH Lê Quý Đôn: triển lãm sách, đổi sách, kể chuyện và giao lưu tác giả trong cả tuần.',
    },

    // -------------------------------------------------------
    // 23. DRAFT — Kế hoạch cải tạo sân trường
    // -------------------------------------------------------
    {
      title: 'Kế hoạch cải tạo và nâng cấp sân trường năm 2026 (dự thảo)',
      slug: 'ke-hoach-cai-tao-san-truong-2026',
      content: `<h2>Tầm nhìn về môi trường học tập lý tưởng</h2>
<p>Nhằm nâng cao chất lượng môi trường học tập và vui chơi cho học sinh, Ban Giám hiệu Trường Tiểu học Lê Quý Đôn đang xây dựng kế hoạch cải tạo toàn diện sân trường trong năm 2026. Dự án sẽ được thực hiện vào kỳ nghỉ hè, đảm bảo không ảnh hưởng đến hoạt động giảng dạy.</p>
<h3>Hạng mục cải tạo dự kiến</h3>
<ul>
  <li><strong>Khu vui chơi STEAM:</strong> Lắp đặt các thiết bị vui chơi giáo dục kết hợp yếu tố STEM</li>
  <li><strong>Vườn sinh thái học đường:</strong> Khu vực trồng rau, hoa và cây thuốc cho học sinh thực hành</li>
  <li><strong>Sân bóng đa năng:</strong> Nâng cấp mặt sân bằng thảm cỏ nhân tạo, lắp đặt khung bóng rổ</li>
  <li><strong>Góc đọc sách ngoài trời:</strong> Xây dựng khu đọc sách có mái che, ghế ngồi thoải mái</li>
  <li><strong>Hệ thống chiếu sáng LED:</strong> Thay toàn bộ đèn sân trường sang LED tiết kiệm năng lượng</li>
</ul>
<h3>Kinh phí và lộ trình</h3>
<p>Tổng kinh phí dự kiến khoảng <strong>2,5 tỷ đồng</strong>, được huy động từ ngân sách nhà nước (50%), quỹ phụ huynh (30%) và các nhà tài trợ doanh nghiệp (20%). Lộ trình thực hiện từ tháng 6 đến tháng 8 năm 2026. Bản kế hoạch chi tiết đang được hoàn thiện và sẽ trình xin ý kiến Ban Phụ huynh trong cuộc họp tháng 3/2026.</p>
<p><em>Lưu ý: Đây là tài liệu dự thảo, chưa công bố chính thức. Mọi thông tin có thể thay đổi sau khi được phê duyệt.</em></p>`,
      excerpt: 'Dự thảo kế hoạch cải tạo sân trường năm 2026 với 5 hạng mục lớn bao gồm khu STEAM, vườn sinh thái, sân đa năng, tổng kinh phí dự kiến 2,5 tỷ đồng.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-23/800/400',
      status: ArticleStatus.DRAFT,
      category_slug: 'tin-tuc',
      view_count: 0,
      published_at: null,
      seo_title: 'Kế hoạch cải tạo sân trường 2026 - Trường TH Lê Quý Đôn',
      seo_description: 'Dự thảo kế hoạch cải tạo sân trường 2026 của Trường TH Lê Quý Đôn với khu STEAM, vườn sinh thái và sân đa năng.',
    },

    // -------------------------------------------------------
    // 24. HIDDEN — Báo cáo nội bộ tài chính
    // -------------------------------------------------------
    {
      title: 'Báo cáo tài chính nội bộ quỹ phụ huynh học kỳ I 2025-2026',
      slug: 'bao-cao-tai-chinh-noi-bo-quy-phu-huynh-hk1-2025',
      content: `<h2>Báo cáo thu chi Quỹ Phụ huynh học kỳ I 2025-2026</h2>
<p>Tài liệu này là báo cáo nội bộ về tình hình thu chi Quỹ Phụ huynh học kỳ I năm học 2025-2026, được Ban Phụ huynh nhà trường công khai với tất cả phụ huynh học sinh. Tổng số thu và chi được kiểm toán độc lập bởi công ty kiểm toán ABC.</p>
<h3>Tổng thu học kỳ I</h3>
<ul>
  <li>Phí đóng góp đầu năm (800 học sinh x 500.000đ): 400.000.000đ</li>
  <li>Tiền bán vé đêm nhạc "Giai điệu tuổi thơ": 6.000.000đ</li>
  <li>Tài trợ doanh nghiệp (3 công ty): 50.000.000đ</li>
  <li><strong>Tổng thu: 456.000.000đ</strong></li>
</ul>
<h3>Tổng chi học kỳ I</h3>
<ul>
  <li>Chi hoạt động ngoại khóa (tham quan, hội chợ khoa học...): 180.000.000đ</li>
  <li>Chi mua sắm đồ dùng học tập, thiết bị CLB: 95.000.000đ</li>
  <li>Chi khen thưởng học sinh đoạt giải: 25.000.000đ</li>
  <li>Chi sửa chữa nhỏ cơ sở vật chất: 40.000.000đ</li>
  <li><strong>Tổng chi: 340.000.000đ</strong></li>
</ul>
<h3>Số dư chuyển sang học kỳ II</h3>
<p><strong>116.000.000đ</strong> — sẽ được dùng chủ yếu để đầu tư cho kế hoạch cải tạo sân trường năm 2026 và các hoạt động học kỳ II. Chi tiết từng khoản chi có phiếu chứng từ đầy đủ, lưu tại Văn phòng nhà trường, phụ huynh có thể đến kiểm tra trong giờ hành chính.</p>`,
      excerpt: 'Báo cáo nội bộ thu chi Quỹ Phụ huynh học kỳ I 2025-2026: tổng thu 456 triệu, tổng chi 340 triệu, số dư chuyển kỳ II là 116 triệu đồng.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-24/800/400',
      status: ArticleStatus.HIDDEN,
      category_slug: 'noi-bo',
      view_count: 45,
      published_at: daysAgo(110),
      seo_title: 'Báo cáo tài chính nội bộ HK1 2025-2026 - Trường TH Lê Quý Đôn',
      seo_description: 'Báo cáo thu chi nội bộ Quỹ Phụ huynh học kỳ I 2025-2026 của Trường TH Lê Quý Đôn Hà Nội.',
    },

    // -------------------------------------------------------
    // 25. PUBLISHED recently — Tuần lễ sức khỏe học đường
    // -------------------------------------------------------
    {
      title: 'Tuần lễ Sức khỏe Học đường 2026: Nâng cao ý thức chăm sóc sức khỏe cho học sinh',
      slug: 'tuan-le-suc-khoe-hoc-duong-2026',
      content: `<h2>Sức khỏe là tài sản quý giá nhất</h2>
<p>Từ ngày 7 đến 11 tháng 4 năm 2026, Trường Tiểu học Lê Quý Đôn tổ chức <strong>Tuần lễ Sức khỏe Học đường 2026</strong> — chuỗi hoạt động giáo dục sức khỏe toàn diện dành cho học sinh các khối lớp, phối hợp với Trung tâm Y tế dự phòng quận Ba Đình và Bệnh viện Nhi Trung Ương.</p>
<h3>Các hoạt động trong tuần</h3>
<ul>
  <li><strong>Thứ Hai 7/4:</strong> Buổi nói chuyện về dinh dưỡng cân bằng và thói quen ăn uống lành mạnh dành cho khối 1-2</li>
  <li><strong>Thứ Ba 8/4:</strong> Hướng dẫn kỹ năng sơ cứu cơ bản (băng bó vết thương, gọi cấp cứu) dành cho khối 3-4</li>
  <li><strong>Thứ Tư 9/4:</strong> Tọa đàm về sức khỏe tâm thần, kỹ năng quản lý cảm xúc và phòng chống bạo lực học đường dành cho khối 4-5</li>
  <li><strong>Thứ Năm 10/4:</strong> Ngày thể dục thể thao toàn trường — thi nhảy dây tập thể và aerobic</li>
  <li><strong>Thứ Sáu 11/4:</strong> Tổng kết, trao giải "Lớp học sức khỏe tiêu biểu" và cam kết "Thực đơn lành mạnh mỗi ngày"</li>
</ul>
<h3>Thông điệp của Tuần lễ</h3>
<p>Với khẩu hiệu <em>"Khỏe mạnh để học tốt — Học tốt để tương lai sáng"</em>, Tuần lễ Sức khỏe Học đường 2026 nhằm trang bị cho học sinh kiến thức và kỹ năng tự chăm sóc sức khỏe bản thân, đồng thời xây dựng thói quen vận động và dinh dưỡng lành mạnh ngay từ khi còn nhỏ. Phụ huynh được mời tham dự các buổi tọa đàm buổi chiều từ 16h00-17h30.</p>`,
      excerpt: 'Tuần lễ Sức khỏe Học đường 2026 (7-11/4) tại Trường TH Lê Quý Đôn với các hoạt động giáo dục dinh dưỡng, sơ cứu, sức khỏe tâm thần và thể dục thể thao.',
      thumbnail_url: 'https://picsum.photos/seed/lqd-art-25/800/400',
      status: ArticleStatus.PUBLISHED,
      category_slug: 'doi-song',
      view_count: 87,
      published_at: daysAgo(4),
      seo_title: 'Tuần lễ Sức khỏe Học đường 2026 - Trường TH Lê Quý Đôn',
      seo_description: 'Tuần lễ Sức khỏe Học đường 2026 tại Trường TH Lê Quý Đôn: dinh dưỡng, sơ cứu, sức khỏe tâm thần và ngày thể dục toàn trường.',
    },
  ];

  // Insert bai viet — kiem tra slug truoc de idempotent
  for (const a of articles) {
    const existing = await artRepo.findOne({ where: { slug: a.slug } });
    if (existing) {
      console.log(`[SEED] Article "${a.slug}" da ton tai, bo qua.`);
      continue;
    }

    const categoryId = catMap[a.category_slug] ?? null;
    if (!categoryId) {
      console.warn(`[SEED] Khong tim thay category "${a.category_slug}" cho bai "${a.slug}". Gan category_id = null.`);
    }

    const art = artRepo.create({
      id: generateUlid(),
      title: a.title,
      slug: a.slug,
      content: a.content,
      excerpt: a.excerpt,
      thumbnail_url: a.thumbnail_url,
      status: a.status,
      category_id: categoryId,
      view_count: a.view_count,
      published_at: a.published_at,
      seo_title: a.seo_title,
      seo_description: a.seo_description,
      created_by: adminId,
      updated_by: adminId,
    });

    await artRepo.save(art);
    console.log(`[SEED] Tao article: ${a.slug} [${a.status}]`);
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
