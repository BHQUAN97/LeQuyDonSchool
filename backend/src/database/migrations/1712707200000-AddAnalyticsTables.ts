import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tao bang page_views va page_view_daily cho module analytics.
 */
export class AddAnalyticsTables1712707200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Bang raw page views
    await queryRunner.query(`
      CREATE TABLE page_views (
        id            BIGINT NOT NULL AUTO_INCREMENT,
        page_path     VARCHAR(500) NOT NULL,
        visitor_ip    VARCHAR(45) NOT NULL,
        user_agent    TEXT DEFAULT NULL,
        referrer      VARCHAR(500) DEFAULT NULL,
        device_type   ENUM('desktop','mobile','tablet') DEFAULT NULL,
        is_bot        BOOLEAN NOT NULL DEFAULT FALSE,
        session_id    VARCHAR(100) DEFAULT NULL,
        viewed_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_page_views_path (page_path(191)),
        INDEX idx_page_views_viewed_at (viewed_at),
        INDEX idx_page_views_dedup (visitor_ip, page_path(100), viewed_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Bang aggregate theo ngay
    await queryRunner.query(`
      CREATE TABLE page_view_daily (
        id              BIGINT NOT NULL AUTO_INCREMENT,
        page_path       VARCHAR(500) NOT NULL,
        view_date       DATE NOT NULL,
        total_views     INT UNSIGNED NOT NULL DEFAULT 0,
        unique_visitors INT UNSIGNED NOT NULL DEFAULT 0,
        mobile_views    INT UNSIGNED NOT NULL DEFAULT 0,
        desktop_views   INT UNSIGNED NOT NULL DEFAULT 0,
        tablet_views    INT UNSIGNED NOT NULL DEFAULT 0,
        bot_views       INT UNSIGNED NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        UNIQUE INDEX uq_page_view_daily (page_path(191), view_date),
        INDEX idx_page_view_daily_date (view_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS page_view_daily');
    await queryRunner.query('DROP TABLE IF EXISTS page_views');
  }
}
