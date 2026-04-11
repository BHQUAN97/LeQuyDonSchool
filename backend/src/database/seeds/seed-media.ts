// Chay: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-media.ts
// Hoac them vao package.json scripts: "seed:media": "ts-node -r tsconfig-paths/register src/database/seeds/seed-media.ts"

import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Media } from '../../modules/media/entities/media.entity';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed anh minh hoa (Media) cho website truong tieu hoc Le Quy Don.
 * Idempotent — kiem tra filename truoc khi insert.
 */

interface MediaSeedItem {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  alt_text: string;
}

// 25 records anh minh hoa truong Le Quy Don
const mediaItems: MediaSeedItem[] = [
  {
    filename: 'khai-giang-2025.jpg',
    original_name: 'Lễ khai giảng 2025.jpg',
    mime_type: 'image/jpeg',
    size: 1_523_400,
    alt_text: 'Lễ khai giảng năm học 2025-2026',
  },
  {
    filename: 'lop-hoc-1a1.jpg',
    original_name: 'Lớp học 1A1.jpg',
    mime_type: 'image/jpeg',
    size: 987_600,
    alt_text: 'Lớp học 1A1',
  },
  {
    filename: 'phong-stem.jpg',
    original_name: 'Phòng thực hành STEM.jpg',
    mime_type: 'image/jpeg',
    size: 1_234_500,
    alt_text: 'Phòng thực hành STEM',
  },
  {
    filename: 'san-bong-da.jpg',
    original_name: 'Sân bóng đá mini.jpg',
    mime_type: 'image/jpeg',
    size: 876_300,
    alt_text: 'Sân bóng đá mini',
  },
  {
    filename: 'be-boi.jpg',
    original_name: 'Bể bơi 4 làn.jpg',
    mime_type: 'image/jpeg',
    size: 1_102_800,
    alt_text: 'Bể bơi 4 làn',
  },
  {
    filename: 'thu-vien.jpg',
    original_name: 'Thư viện trường.jpg',
    mime_type: 'image/jpeg',
    size: 765_400,
    alt_text: 'Thư viện trường',
  },
  {
    filename: 'nha-an.jpg',
    original_name: 'Nhà ăn bán trú.jpg',
    mime_type: 'image/jpeg',
    size: 654_200,
    alt_text: 'Nhà ăn bán trú',
  },
  {
    filename: 'san-truong.jpg',
    original_name: 'Sân trường chính.jpg',
    mime_type: 'image/jpeg',
    size: 1_876_500,
    alt_text: 'Sân trường chính',
  },
  {
    filename: 'hoc-sinh-lop-5.jpg',
    original_name: 'Học sinh lớp 5.jpg',
    mime_type: 'image/jpeg',
    size: 934_100,
    alt_text: 'Học sinh lớp 5',
  },
  {
    filename: 'giao-vien-hoi-thao.jpg',
    original_name: 'Hội thảo giáo viên.jpg',
    mime_type: 'image/jpeg',
    size: 1_345_700,
    alt_text: 'Hội thảo giáo viên',
  },
  {
    filename: 'hoat-dong-ngoai-khoa.jpg',
    original_name: 'Hoạt động ngoại khóa.jpg',
    mime_type: 'image/jpeg',
    size: 1_654_300,
    alt_text: 'Hoạt động ngoại khóa',
  },
  {
    filename: 'clb-robotics.jpg',
    original_name: 'CLB Robotics.jpg',
    mime_type: 'image/jpeg',
    size: 1_123_400,
    alt_text: 'CLB Robotics',
  },
  {
    filename: 'tiet-tieng-anh.jpg',
    original_name: 'Tiết học Tiếng Anh.jpg',
    mime_type: 'image/jpeg',
    size: 876_500,
    alt_text: 'Tiết học Tiếng Anh',
  },
  {
    filename: 'ngay-nha-giao.jpg',
    original_name: 'Ngày Nhà giáo VN.jpg',
    mime_type: 'image/jpeg',
    size: 1_987_600,
    alt_text: 'Ngày Nhà giáo Việt Nam',
  },
  {
    filename: 'trung-thu-2025.jpg',
    original_name: 'Tết Trung thu 2025.jpg',
    mime_type: 'image/jpeg',
    size: 1_456_800,
    alt_text: 'Tết Trung thu 2025',
  },
  {
    filename: 'olympic-toan.jpg',
    original_name: 'Olympic Toán cấp quận.jpg',
    mime_type: 'image/jpeg',
    size: 743_200,
    alt_text: 'Olympic Toán cấp quận',
  },
  {
    filename: 'van-nghe-tet.jpg',
    original_name: 'Văn nghệ mừng Tết.jpg',
    mime_type: 'image/jpeg',
    size: 1_789_300,
    alt_text: 'Văn nghệ mừng Tết',
  },
  {
    filename: 'phong-am-nhac.jpg',
    original_name: 'Phòng Âm nhạc.jpg',
    mime_type: 'image/jpeg',
    size: 567_400,
    alt_text: 'Phòng Âm nhạc',
  },
  {
    filename: 'phong-my-thuat.png',
    original_name: 'Phòng Mỹ thuật.png',
    mime_type: 'image/png',
    size: 1_345_600,
    alt_text: 'Phòng Mỹ thuật',
  },
  {
    filename: 'kham-suc-khoe.jpg',
    original_name: 'Khám sức khỏe.jpg',
    mime_type: 'image/jpeg',
    size: 812_300,
    alt_text: 'Khám sức khỏe học sinh',
  },
  {
    filename: 'xe-dua-don.jpg',
    original_name: 'Xe đưa đón HS.jpg',
    mime_type: 'image/jpeg',
    size: 678_900,
    alt_text: 'Xe đưa đón học sinh',
  },
  {
    filename: 'logo-truong.png',
    original_name: 'Logo trường LQĐ.png',
    mime_type: 'image/png',
    size: 234_500,
    alt_text: 'Logo trường Tiểu học Lê Quý Đôn',
  },
  {
    filename: 'banner-tuyen-sinh.png',
    original_name: 'Banner tuyển sinh.png',
    mime_type: 'image/png',
    size: 1_876_200,
    alt_text: 'Banner tuyển sinh',
  },
  {
    filename: 'da-ngoai-soc-son.jpg',
    original_name: 'Dã ngoại Sóc Sơn.jpg',
    mime_type: 'image/jpeg',
    size: 1_654_700,
    alt_text: 'Dã ngoại Sóc Sơn',
  },
  {
    filename: 'hoi-khoe-phu-dong.png',
    original_name: 'Hội khỏe Phù Đổng.png',
    mime_type: 'image/png',
    size: 1_432_100,
    alt_text: 'Hội khỏe Phù Đổng',
  },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('[SEED:media] Database connected.');

  const userRepo = AppDataSource.getRepository(User);
  const mediaRepo = AppDataSource.getRepository(Media);

  // Lay admin dau tien de gan created_by
  const admin = await userRepo.findOne({
    where: { role: UserRole.SUPER_ADMIN },
  });

  if (!admin) {
    console.error('[SEED:media] Khong tim thay Super Admin. Chay seed:admin truoc.');
    await AppDataSource.destroy();
    process.exit(1);
  }

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < mediaItems.length; i++) {
    const item = mediaItems[i];
    const n = i + 1; // index 1-based de tao URL seed

    // Idempotent: kiem tra filename da ton tai chua
    const existing = await mediaRepo.findOne({ where: { filename: item.filename } });
    if (existing) {
      console.log(`[SEED:media] Bo qua (da ton tai): ${item.filename}`);
      skipped++;
      continue;
    }

    const media = mediaRepo.create({
      id: generateUlid(),
      filename: item.filename,
      original_name: item.original_name,
      mime_type: item.mime_type,
      size: item.size,
      url: `https://picsum.photos/seed/lqd-media-${n}/1200/800`,
      thumbnail_url: `https://picsum.photos/seed/lqd-media-${n}/400/300`,
      alt_text: item.alt_text,
      width: 1200,
      height: 800,
      created_by: admin.id,
    });

    await mediaRepo.save(media);
    console.log(`[SEED:media] Inserted [${n}/25]: ${item.filename}`);
    inserted++;
  }

  await AppDataSource.destroy();
  console.log(`[SEED:media] Hoan thanh — inserted: ${inserted}, skipped: ${skipped}.`);
}

seed().catch(e => { console.error(e); process.exit(1); });
