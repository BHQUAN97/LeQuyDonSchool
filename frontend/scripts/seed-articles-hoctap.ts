/**
 * Seed 8 articles cho category "Hoạt động học tập".
 * Chay qua seed-runner.ts hoac truc tiep: npx tsx scripts/seed-articles-hoctap.ts
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

const CATEGORY_SLUG = 'hoc-tap';

const articles: Article[] = [
  {
    title: 'Thành Tích Tháng 3 — Doners Xuất Sắc Giành 1.536 Giải',
    slug: 'thanh-tich-thang-3-doners-xuat-sac-gianh-1536-giai',
    excerpt:
      'Tổng kết thành tích nổi bật của học sinh Lê Quý Đôn trong tháng 3 với 1.536 giải thưởng các cấp.',
    thumbnailUrl: 'https://picsum.photos/seed/hoctap01/800/450',
    publishedAt: '2026-03-31T08:00:00Z',
    content: `
<h2>Tổng kết Thành tích Tháng 3 năm 2026</h2>
<p>Trường Tiểu học Lê Quý Đôn tự hào thông báo kết quả học tập và thi đua xuất sắc của các em học sinh trong tháng 3 vừa qua. Với tổng cộng <strong>1.536 giải thưởng</strong> ở nhiều cấp độ từ trường đến thành phố, các Doners đã chứng minh năng lực vượt trội trong mọi lĩnh vực.</p>

<h3>Phân bố giải thưởng theo cấp</h3>
<p>Trong số 1.536 giải, có <strong>124 giải cấp Thành phố</strong>, 387 giải cấp Quận và 1.025 giải cấp Trường. Đặc biệt, khối lớp 5 đóng góp nhiều nhất với 412 giải, tiếp theo là khối lớp 4 với 356 giải. Khối lớp 1 cũng ghi nhận con số ấn tượng 198 giải thưởng, cho thấy nền tảng vững chắc ngay từ những năm đầu tiên.</p>

<h3>Các lĩnh vực nổi bật</h3>
<p>Toán học tiếp tục là thế mạnh truyền thống với 320 giải. Tiếng Anh ghi nhận sự tăng trưởng mạnh mẽ nhất với 285 giải, tăng 40% so với cùng kỳ năm trước. Các môn Khoa học Tự nhiên đạt 198 giải, và đặc biệt lĩnh vực STEM có 156 giải — một con số kỷ lục.</p>

<p>Ban Giám hiệu xin gửi lời chúc mừng đến toàn thể học sinh, phụ huynh và giáo viên. Những thành tích này là minh chứng rõ nét cho phương pháp giáo dục toàn diện, lấy học sinh làm trung tâm mà nhà trường đang theo đuổi. Chúng ta hãy cùng nhau duy trì và phát huy tinh thần học tập trong những tháng tiếp theo!</p>

<p><em>Danh sách chi tiết học sinh đạt giải được niêm yết tại bảng tin các khối và gửi qua email đến Phụ huynh.</em></p>
`,
  },
  {
    title: 'Học sinh lớp 5 đạt giải Nhất Olympic Toán cấp Quận',
    slug: 'hoc-sinh-lop-5-dat-giai-nhat-olympic-toan-cap-quan',
    excerpt:
      'Em Nguyễn Minh Anh lớp 5A xuất sắc giành giải Nhất kỳ thi Olympic Toán cấp Quận năm 2026.',
    thumbnailUrl: 'https://picsum.photos/seed/hoctap02/800/450',
    publishedAt: '2026-03-25T09:00:00Z',
    content: `
<h2>Giải Nhất Olympic Toán cấp Quận 2026</h2>
<p>Ngày 22 tháng 3 năm 2026, Phòng Giáo dục và Đào tạo quận Cầu Giấy đã tổ chức kỳ thi Olympic Toán cấp Quận dành cho học sinh tiểu học. Em <strong>Nguyễn Minh Anh</strong>, học sinh lớp 5A trường Tiểu học Lê Quý Đôn, đã xuất sắc giành giải Nhất với số điểm cao nhất toàn quận.</p>

<h3>Hành trình đến giải Nhất</h3>
<p>Kỳ thi năm nay thu hút hơn 500 thí sinh đến từ 28 trường tiểu học trong quận. Đề thi gồm 30 câu trắc nghiệm và 5 bài tự luận, bao gồm các chủ đề: số học nâng cao, hình học phẳng, tổ hợp và logic. Em Minh Anh hoàn thành bài thi với 98/100 điểm, bỏ xa người xếp thứ hai tới 7 điểm.</p>

<h3>Lời chia sẻ của em Minh Anh</h3>
<p>"Em rất vui và cảm ơn thầy cô đã hướng dẫn em. Em luyện tập mỗi ngày 30 phút Toán nâng cao từ đầu năm học. Những bài toán khó giúp em rèn tư duy logic và không bỏ cuộc khi gặp khó khăn." — Minh Anh chia sẻ sau khi nhận giải.</p>

<p>Cô Trần Thị Hương, giáo viên chủ nhiệm lớp 5A kiêm huấn luyện đội tuyển Toán, cho biết: "Minh Anh là học sinh có tố chất Toán học nổi bật. Em luôn tự giác, ham học hỏi và đặc biệt giỏi trong việc tìm nhiều cách giải cho cùng một bài toán."</p>

<p>Em Minh Anh sẽ đại diện cho quận Cầu Giấy tham gia kỳ thi Olympic Toán cấp Thành phố Hà Nội vào tháng 4 tới. Nhà trường và gia đình đang tích cực hỗ trợ em chuẩn bị cho kỳ thi quan trọng này.</p>
`,
  },
  {
    title: 'Kết quả Cambridge Flyers đạt tỷ lệ 95%',
    slug: 'ket-qua-cambridge-flyers-dat-ty-le-95',
    excerpt:
      '95% học sinh khối 5 đạt chứng chỉ Cambridge Flyers, trong đó 32% đạt loại xuất sắc 15 khiên.',
    thumbnailUrl: 'https://picsum.photos/seed/hoctap03/800/450',
    publishedAt: '2026-03-18T10:00:00Z',
    content: `
<h2>Kết quả kỳ thi Cambridge Flyers 2026</h2>
<p>Trường Tiểu học Lê Quý Đôn vui mừng thông báo kết quả kỳ thi Cambridge English: Flyers (YLE) dành cho học sinh khối 5. Với <strong>tỷ lệ đạt 95%</strong>, đây là năm thứ ba liên tiếp nhà trường duy trì tỷ lệ đạt trên 90%.</p>

<h3>Thống kê chi tiết</h3>
<p>Tổng số 186 học sinh tham gia kỳ thi, trong đó 177 em đạt chứng chỉ. Đặc biệt, <strong>60 em (32%) đạt 15 khiên</strong> — mức điểm tối đa, tương đương trình độ A2 theo khung tham chiếu châu Âu CEFR. 78 em đạt từ 12 đến 14 khiên, và 39 em đạt từ 10 đến 11 khiên.</p>

<h3>Chương trình đào tạo Tiếng Anh</h3>
<p>Chương trình Tiếng Anh tại Lê Quý Đôn được thiết kế theo lộ trình Cambridge rõ ràng: Starters (lớp 1-2), Movers (lớp 3-4) và Flyers (lớp 5). Học sinh được học 8 tiết Tiếng Anh mỗi tuần, trong đó 4 tiết với giáo viên bản ngữ, tập trung vào kỹ năng nghe nói và phát âm chuẩn.</p>

<p>Cô Nguyễn Thanh Vân, Tổ trưởng bộ môn Tiếng Anh, cho biết: "Bí quyết thành công nằm ở phương pháp học qua trải nghiệm. Các em được tham gia English Club, Drama Class và Debate hàng tuần, giúp sử dụng tiếng Anh trong ngữ cảnh thực tế thay vì chỉ học ngữ pháp trên sách vở."</p>

<p>Nhà trường gửi lời chúc mừng đến tất cả các em học sinh và cảm ơn các bậc Phụ huynh đã đồng hành trong suốt quá trình học tập. Chứng chỉ Cambridge sẽ được phát tại buổi lễ tổng kết cuối năm.</p>
`,
  },
  {
    title: 'Dự án STEM Thành phố thông minh của lớp 4A',
    slug: 'du-an-stem-thanh-pho-thong-minh-lop-4a',
    excerpt:
      'Học sinh lớp 4A trình bày dự án mô hình Thành phố thông minh sử dụng Arduino và cảm biến.',
    thumbnailUrl: 'https://picsum.photos/seed/hoctap04/800/450',
    publishedAt: '2026-03-10T08:30:00Z',
    content: `
<h2>Dự án STEM: Thành phố thông minh — Smart City</h2>
<p>Trong khuôn khổ chương trình STEM học kỳ II, học sinh lớp 4A đã hoàn thành và trình bày dự án <strong>"Thành phố thông minh"</strong> — một mô hình thu nhỏ kết hợp kiến thức Toán, Khoa học, Công nghệ và Nghệ thuật. Dự án nhận được đánh giá cao từ Ban Giám hiệu và các chuyên gia giáo dục STEM.</p>

<h3>Mô tả dự án</h3>
<p>Mô hình Thành phố thông minh có kích thước 1.2m x 0.8m, bao gồm: hệ thống đèn đường tự động bật/tắt theo ánh sáng (cảm biến quang), hệ thống tưới cây thông minh (cảm biến độ ẩm), đèn giao thông điều khiển bằng Arduino, và hệ thống thu gom rác tự động sử dụng cảm biến siêu âm.</p>

<h3>Quá trình thực hiện</h3>
<p>Dự án kéo dài 6 tuần, chia thành các giai đoạn: nghiên cứu (1 tuần), thiết kế (1 tuần), lắp ráp và lập trình (3 tuần), và trình bày (1 tuần). 35 học sinh được chia thành 7 nhóm, mỗi nhóm phụ trách một khu vực chức năng. Các em tự phân công nhiệm vụ, quản lý tiến độ và giải quyết vấn đề phát sinh.</p>

<p>Thầy Lê Văn Đức, giáo viên hướng dẫn STEM, chia sẻ: "Điều ấn tượng nhất là các em tự tìm hiểu cách lập trình Arduino qua video hướng dẫn và thử nghiệm. Vai trò của thầy chỉ là đặt câu hỏi gợi mở và hỗ trợ khi các em gặp khó khăn kỹ thuật."</p>

<p>Dự án sẽ được trưng bày tại Ngày hội STEM cấp Quận vào cuối tháng 4 và tham gia cuộc thi Sáng tạo Khoa học Kỹ thuật dành cho học sinh tiểu học Hà Nội.</p>
`,
  },
  {
    title: 'Cuộc thi viết chữ đẹp cấp trường',
    slug: 'cuoc-thi-viet-chu-dep-cap-truong',
    excerpt:
      'Hơn 200 học sinh tham gia cuộc thi viết chữ đẹp cấp trường, tôn vinh nét chữ nết người.',
    thumbnailUrl: 'https://picsum.photos/seed/hoctap05/800/450',
    publishedAt: '2026-03-05T09:00:00Z',
    content: `
<h2>Cuộc thi Viết chữ đẹp cấp trường năm 2026</h2>
<p>Sáng ngày 4 tháng 3, trường Tiểu học Lê Quý Đôn đã tổ chức cuộc thi <strong>Viết chữ đẹp</strong> cấp trường năm học 2025-2026. Với chủ đề "Nét chữ — Nết người", cuộc thi thu hút sự tham gia của hơn 200 học sinh được tuyển chọn từ các lớp, đại diện cho 5 khối từ lớp 1 đến lớp 5.</p>

<h3>Nội dung thi</h3>
<p>Mỗi khối có bài thi phù hợp với trình độ: khối 1 viết chữ cái và từ đơn, khối 2-3 viết đoạn văn ngắn, khối 4-5 viết bài thơ và đoạn văn nghị luận. Thời gian thi 45 phút, học sinh sử dụng bút mực theo quy định. Bài thi được chấm theo tiêu chí: đúng mẫu chữ, đều nét, đẹp tổng thể, và tốc độ viết phù hợp.</p>

<h3>Kết quả</h3>
<p>Ban giám khảo đã trao <strong>5 giải Nhất</strong> (mỗi khối 1 giải), 10 giải Nhì, 15 giải Ba và 20 giải Khuyến khích. Em Trần Khánh Linh lớp 3B gây ấn tượng mạnh với nét chữ đều tăm tắp, được ban giám khảo nhận xét là "đẹp như in". Em Nguyễn Gia Bảo lớp 1C cũng nhận nhiều lời khen với khả năng viết chữ hoa trang trí rất sáng tạo.</p>

<p>Cô Phạm Thị Mai, Phó Hiệu trưởng phụ trách chuyên môn, phát biểu: "Viết chữ đẹp không chỉ là rèn kỹ năng viết mà còn giáo dục tính kiên nhẫn, cẩn thận và thẩm mỹ cho học sinh. Đây là truyền thống tốt đẹp mà nhà trường duy trì hàng năm."</p>

<p>Các bài thi đạt giải sẽ được trưng bày tại sảnh chính nhà trường trong tuần tới để toàn thể học sinh và phụ huynh thưởng thức.</p>
`,
  },
  {
    title: 'Thi Hùng biện Tiếng Anh lần thứ 3',
    slug: 'thi-hung-bien-tieng-anh-lan-thu-3',
    excerpt:
      'Chung kết cuộc thi Hùng biện Tiếng Anh lần 3 với chủ đề "My Green Future" diễn ra sôi nổi.',
    thumbnailUrl: 'https://picsum.photos/seed/hoctap06/800/450',
    publishedAt: '2026-02-28T14:00:00Z',
    content: `
<h2>Chung kết Hùng biện Tiếng Anh lần thứ 3</h2>
<p>Chiều ngày 27 tháng 2, trường Tiểu học Lê Quý Đôn tổ chức vòng Chung kết cuộc thi <strong>Hùng biện Tiếng Anh</strong> lần thứ 3 dành cho học sinh khối 4-5. Chủ đề năm nay là <em>"My Green Future — Tương lai xanh của em"</em>, khuyến khích các em thể hiện suy nghĩ về bảo vệ môi trường bằng tiếng Anh.</p>

<h3>Vòng chung kết</h3>
<p>12 thí sinh xuất sắc nhất được chọn từ vòng sơ khảo (với hơn 80 thí sinh đăng ký) đã trình bày bài hùng biện trước ban giám khảo gồm 3 giáo viên bản ngữ và 2 giáo viên Tiếng Anh của trường. Mỗi thí sinh có 3 phút trình bày và 2 phút trả lời câu hỏi từ ban giám khảo.</p>

<h3>Những bài hùng biện ấn tượng</h3>
<p>Em Lê Hà My lớp 5C giành <strong>giải Nhất</strong> với bài "Solar Panels on Every Rooftop", trình bày tự tin với phát âm chuẩn và sử dụng nhiều cấu trúc ngữ pháp nâng cao. Em Phạm Đức Anh lớp 4B đạt giải Nhì với bài "Say No to Plastic" kết hợp hình ảnh minh họa sinh động. Giải Ba thuộc về em Ngô Thanh Trúc lớp 5A với chủ đề "Green School, Happy Students".</p>

<p>Mr. James Wilson, giáo viên bản ngữ và thành viên ban giám khảo, nhận xét: "I'm truly impressed by the students' English proficiency and confidence. Their ideas about environmental protection are creative and well-researched. Some presentations could easily compete at a higher level."</p>

<p>Cuộc thi Hùng biện Tiếng Anh đã trở thành sự kiện thường niên được học sinh và phụ huynh mong đợi, góp phần xây dựng môi trường học Tiếng Anh tích cực tại nhà trường.</p>
`,
  },
  {
    title: 'Giờ học trải nghiệm STEM khối 2',
    slug: 'gio-hoc-trai-nghiem-stem-khoi-2',
    excerpt:
      'Học sinh khối 2 hào hứng với giờ học STEM chế tạo ô tô chạy bằng bóng bay và cầu giấy.',
    thumbnailUrl: 'https://picsum.photos/seed/hoctap07/800/450',
    publishedAt: '2026-02-20T08:00:00Z',
    content: `
<h2>Giờ học trải nghiệm STEM — Khối 2</h2>
<p>Trong tuần thứ hai của tháng 2, toàn bộ học sinh khối 2 trường Tiểu học Lê Quý Đôn đã tham gia giờ học trải nghiệm STEM với hai thí nghiệm thú vị: <strong>"Ô tô chạy bằng bóng bay"</strong> và <strong>"Cầu giấy chịu lực"</strong>. Đây là hoạt động nằm trong chương trình STEM xuyên suốt năm học dành cho khối 1-2.</p>

<h3>Thí nghiệm 1: Ô tô bóng bay</h3>
<p>Sử dụng vật liệu đơn giản gồm ống hút, nắp chai, băng dính và bóng bay, các nhóm học sinh thiết kế và chế tạo ô tô chạy bằng lực đẩy không khí. Qua hoạt động này, các em hiểu được nguyên lý phản lực — không khí thoát ra phía sau đẩy xe về phía trước — ứng dụng của Định luật III Newton ở dạng đơn giản nhất.</p>

<h3>Thí nghiệm 2: Cầu giấy chịu lực</h3>
<p>Mỗi nhóm nhận 10 tờ giấy A4 và 50cm băng dính, nhiệm vụ là xây một cây cầu dài tối thiểu 30cm có thể chịu được sức nặng của quyển sách giáo khoa. Các em phải thử nghiệm nhiều cách gấp giấy: ống tròn, hình tam giác, gấp zíc zắc để tìm ra cấu trúc chắc chắn nhất.</p>

<p>Cô Hoàng Thị Lan, giáo viên STEM khối 2, cho biết: "Ở lứa tuổi này, mục tiêu của STEM không phải kiến thức hàn lâm mà là khơi gợi sự tò mò và tư duy giải quyết vấn đề. Khi cây cầu bị sập, các em không nản mà hào hứng thử cách khác — đó chính là tinh thần STEM."</p>

<p>Nhóm chiến thắng phần thi Cầu giấy đến từ lớp 2D, với cây cầu chịu được 3 quyển sách giáo khoa chồng lên nhau. Bí quyết của nhóm là cuộn giấy thành ống tròn làm trụ, kết hợp mặt cầu gấp zíc zắc tạo độ cứng tối đa.</p>
`,
  },
  {
    title: 'Tuần lễ đọc sách Books for Fun',
    slug: 'tuan-le-doc-sach-books-for-fun',
    excerpt:
      'Tuần lễ đọc sách "Books for Fun" khuyến khích văn hóa đọc với nhiều hoạt động hấp dẫn.',
    thumbnailUrl: 'https://picsum.photos/seed/hoctap08/800/450',
    publishedAt: '2026-02-14T08:00:00Z',
    content: `
<h2>Tuần lễ đọc sách "Books for Fun"</h2>
<p>Từ ngày 10 đến 14 tháng 2, trường Tiểu học Lê Quý Đôn tổ chức <strong>Tuần lễ đọc sách "Books for Fun"</strong> — sự kiện thường niên nhằm khuyến khích văn hóa đọc và tình yêu sách trong toàn thể học sinh. Năm nay, chương trình được mở rộng với nhiều hoạt động mới, thu hút sự tham gia của 100% học sinh toàn trường.</p>

<h3>Các hoạt động nổi bật</h3>
<p><strong>Hội chợ sách:</strong> Hơn 2.000 đầu sách từ 5 nhà xuất bản được trưng bày tại sảnh chính, với mức giảm giá 20-30% dành cho học sinh. Phụ huynh cũng quyên góp hơn 500 cuốn sách cũ cho tủ sách lớp học.</p>

<p><strong>Book Character Day:</strong> Ngày thứ Tư, toàn trường hóa trang thành nhân vật yêu thích trong sách. Từ Harry Potter, Doraemon đến Dế Mèn, sân trường tràn ngập sắc màu và tiếng cười. Giải "Nhân vật sáng tạo nhất" thuộc về em Vũ Quang Huy lớp 3A với bộ trang phục Thằng Bờm tự thiết kế.</p>

<p><strong>Storytelling Contest:</strong> Cuộc thi kể chuyện bằng hai ngôn ngữ Việt-Anh thu hút 45 thí sinh. Các em không chỉ kể lại câu chuyện mà còn sáng tạo thêm phần kết hoặc thay đổi góc nhìn nhân vật, thể hiện khả năng tư duy phản biện ấn tượng.</p>

<h3>Kết quả và duy trì</h3>
<p>Sau một tuần, thư viện trường ghi nhận lượng mượn sách tăng <strong>180%</strong> so với tuần thông thường. Chương trình "15 phút đọc sách mỗi ngày" được triển khai cho toàn trường, với sổ nhật ký đọc sách để phụ huynh cùng theo dõi và khuyến khích con tại nhà.</p>

<p>Thầy Nguyễn Hữu Tùng, Hiệu trưởng nhà trường, khẳng định: "Đọc sách là nền tảng của mọi sự học. Chúng tôi mong muốn Books for Fun không chỉ là sự kiện một tuần mà là điểm khởi đầu cho thói quen đọc suốt đời của mỗi học sinh."</p>
`,
  },
];

export default async function seedArticlesHocTap() {
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

// Cho phep chay truc tiep: npx tsx scripts/seed-articles-hoctap.ts
if (require.main === module) {
  (async () => {
    const { login } = await import('./seed-helpers');
    await login();
    await seedArticlesHocTap();
    console.log('Done.');
  })();
}
