import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tao bang app_logs — luu log he thong.
 */
export class AddAppLogs1712707200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE app_logs (
        id              CHAR(26) NOT NULL,
        level           ENUM('error','warn','info','debug') NOT NULL DEFAULT 'info',
        message         VARCHAR(500) NOT NULL,
        stack_trace     TEXT DEFAULT NULL,
        endpoint        VARCHAR(255) DEFAULT NULL,
        status_code     SMALLINT DEFAULT NULL,
        ip              VARCHAR(45) DEFAULT NULL,
        user_id         CHAR(26) DEFAULT NULL,
        user_agent      VARCHAR(500) DEFAULT NULL,
        context         JSON DEFAULT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_app_logs_level (level),
        INDEX idx_app_logs_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS app_logs`);
  }
}
