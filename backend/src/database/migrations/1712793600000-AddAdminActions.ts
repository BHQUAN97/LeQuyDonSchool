import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminActions1712793600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE admin_actions (
        id CHAR(26) NOT NULL,
        action ENUM('create','update','delete','login','logout','upload') NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id CHAR(26) NULL,
        description VARCHAR(500) NOT NULL,
        \`changes\` JSON NULL,
        user_id CHAR(26) NOT NULL,
        user_name VARCHAR(100) NULL,
        ip VARCHAR(45) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_admin_actions_action (action),
        INDEX idx_admin_actions_user_id (user_id),
        INDEX idx_admin_actions_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS admin_actions');
  }
}
