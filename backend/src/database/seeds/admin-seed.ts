import { AppDataSource } from '../data-source';
import { User, UserRole, UserStatus } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { generateUlid } from '../../common/utils/ulid';

/**
 * Seed tai khoan Super Admin dau tien.
 * Doc tu env: ADMIN_EMAIL, ADMIN_PASSWORD
 * Chay: npm run seed:admin
 */
async function seedAdmin() {
  const isProduction = process.env.NODE_ENV === 'production';
  const email = process.env.ADMIN_EMAIL || 'admin@lequydon.edu.vn';

  if (isProduction && !process.env.ADMIN_PASSWORD) {
    console.error('[SEED] ADMIN_PASSWORD env var is required in production. Aborting.');
    process.exit(1);
  }

  const password = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'Admin@123456');

  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  // Kiem tra da ton tai chua
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    console.log(`[SEED] Admin "${email}" da ton tai, bo qua.`);
    await AppDataSource.destroy();
    return;
  }

  const user = userRepo.create({
    id: generateUlid(),
    email,
    password_hash: await bcrypt.hash(password, 10),
    full_name: 'Quản trị viên',
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
  });

  await userRepo.save(user);
  console.log(`[SEED] Tao Super Admin: ${email}`);
  await AppDataSource.destroy();
}

seedAdmin().catch((err) => {
  console.error('[SEED] Loi:', err);
  process.exit(1);
});
