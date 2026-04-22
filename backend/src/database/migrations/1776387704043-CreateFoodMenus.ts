import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tao bang food_menus — thuc don an uong theo ngay (khac voi navigation menu_items).
 * Moi ngay co 1 row voi 3 bua JSON (breakfast / lunch / dinner).
 *
 * NOTE: Auto-generated output tu TypeORM CLI bi filter lai — chi giu phan
 * lien quan den food_menus, bo nhung alter/drop index noise trong cac bang khac
 * (do sai lech giua entity metadata va schema hien tai, se fix trong migration rieng).
 */
export class CreateFoodMenus1776387704043 implements MigrationInterface {
  name = 'CreateFoodMenus1776387704043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`food_menus\` (
        \`id\` CHAR(26) NOT NULL,
        \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL,
        \`date\` DATE NOT NULL,
        \`breakfast\` JSON NULL,
        \`lunch\` JSON NULL,
        \`dinner\` JSON NULL,
        \`note\` TEXT NULL,
        \`status\` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
        \`created_by\` CHAR(26) NULL,
        \`updated_by\` CHAR(26) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_food_menus_date\` (\`date\`),
        INDEX \`idx_food_menus_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `food_menus`');
  }
}
