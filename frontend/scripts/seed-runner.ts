/**
 * Main seed runner — tao demo data cho LeQuyDon.
 * Chay: npx tsx scripts/seed-runner.ts
 */

import { login, apiPost, apiGet } from './seed-helpers';
import { readdirSync } from 'fs';
import { resolve, basename } from 'path';

// Danh sach categories can tao
const CATEGORIES = [
  { name: 'Tin tức - Sự kiện', slug: 'su-kien' },
  { name: 'Hoạt động ngoại khóa', slug: 'ngoai-khoa' },
  { name: 'Hoạt động học tập', slug: 'hoc-tap' },
  { name: 'Thông tin tuyển sinh', slug: 'tuyen-sinh' },
  { name: 'Thực đơn', slug: 'thuc-don' },
];

/** Tao categories, skip neu da ton tai */
async function seedCategories() {
  console.log('\n--- Creating categories ---');
  const existing = await apiGet('/categories');
  const existingSlugs = new Set(
    Array.isArray(existing) ? existing.map((c: any) => c.slug) : []
  );

  for (const cat of CATEGORIES) {
    if (existingSlugs.has(cat.slug)) {
      console.log(`  SKIP ${cat.name} (da ton tai)`);
      continue;
    }
    const result = await apiPost('/categories', cat);
    if (result.id) {
      console.log(`  OK   ${cat.name} → id=${result.id}`);
    }
  }
}

/** Tim va chay tat ca file seed-*.ts (tru seed-runner va seed-helpers) */
async function runSeedFiles() {
  // Danh sach seed files theo thu tu mong muon
  const seedFiles = [
    './seed-articles-sukien',
    './seed-articles-ngoaikhoa',
    './seed-articles-hoctap',
    './seed-articles-tuyensinh',
    './seed-articles-thucdon',
    './seed-events',
    './seed-faqs',
  ];

  // Kiem tra file nao thuc su ton tai trong thu muc scripts
  const scriptsDir = resolve(__dirname);
  const allFiles = readdirSync(scriptsDir).map((f) => basename(f, '.ts'));

  for (const file of seedFiles) {
    const moduleName = file.replace('./', '');
    if (!allFiles.includes(moduleName)) {
      console.log(`\n--- SKIP ${moduleName} (chua tao) ---`);
      continue;
    }

    console.log(`\n--- Running ${moduleName} ---`);
    try {
      const mod = await import(file);
      if (typeof mod.default === 'function') {
        await mod.default();
      } else {
        console.log(`  WARN: ${moduleName} khong export default function`);
      }
    } catch (err: any) {
      console.error(`  ERROR in ${moduleName}:`, err.message || err);
    }
  }
}

async function main() {
  console.log('=== SEED DEMO DATA ===');
  console.log(`Target: ${new Date().toLocaleString('vi-VN')}\n`);

  // Buoc 1: Login
  await login();

  // Buoc 2: Tao categories
  await seedCategories();

  // Buoc 3: Chay cac seed files
  await runSeedFiles();

  console.log('\n=== DONE ===');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
