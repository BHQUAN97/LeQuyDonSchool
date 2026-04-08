import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Them tat ca bang cho: categories, articles, media, pages, settings, contacts, events,
 * admission_posts, admission_faqs, admission_registrations, menu_items
 */
export class AddAllModules1712620800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Categories
    await queryRunner.query(`
      CREATE TABLE categories (
        id              CHAR(26) NOT NULL,
        name            VARCHAR(100) NOT NULL,
        slug            VARCHAR(150) NOT NULL,
        parent_id       CHAR(26) DEFAULT NULL,
        description     TEXT DEFAULT NULL,
        display_order   INT NOT NULL DEFAULT 0,
        status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
        created_by      CHAR(26) DEFAULT NULL,
        updated_by      CHAR(26) DEFAULT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE INDEX idx_categories_slug (slug),
        INDEX idx_categories_parent (parent_id),
        CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Articles
    await queryRunner.query(`
      CREATE TABLE articles (
        id              CHAR(26) NOT NULL,
        title           VARCHAR(255) NOT NULL,
        slug            VARCHAR(300) NOT NULL,
        content         LONGTEXT NOT NULL,
        excerpt         TEXT DEFAULT NULL,
        thumbnail_url   VARCHAR(500) DEFAULT NULL,
        status          ENUM('draft','published','hidden') NOT NULL DEFAULT 'draft',
        view_count      INT NOT NULL DEFAULT 0,
        published_at    TIMESTAMP NULL DEFAULT NULL,
        seo_title       VARCHAR(255) DEFAULT NULL,
        seo_description TEXT DEFAULT NULL,
        category_id     CHAR(26) DEFAULT NULL,
        created_by      CHAR(26) DEFAULT NULL,
        updated_by      CHAR(26) DEFAULT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE INDEX idx_articles_slug (slug),
        INDEX idx_articles_status (status),
        INDEX idx_articles_category (category_id),
        INDEX idx_articles_published (published_at),
        CONSTRAINT fk_articles_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Media
    await queryRunner.query(`
      CREATE TABLE media (
        id              CHAR(26) NOT NULL,
        filename        VARCHAR(255) NOT NULL,
        original_name   VARCHAR(255) NOT NULL,
        mime_type       VARCHAR(100) NOT NULL,
        size            INT NOT NULL DEFAULT 0,
        url             VARCHAR(500) NOT NULL,
        thumbnail_url   VARCHAR(500) DEFAULT NULL,
        alt_text        VARCHAR(255) DEFAULT NULL,
        width           INT DEFAULT NULL,
        height          INT DEFAULT NULL,
        created_by      CHAR(26) DEFAULT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX idx_media_mime (mime_type),
        INDEX idx_media_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Pages
    await queryRunner.query(`
      CREATE TABLE pages (
        id              CHAR(26) NOT NULL,
        title           VARCHAR(255) NOT NULL,
        slug            VARCHAR(300) NOT NULL,
        content         LONGTEXT NOT NULL,
        status          ENUM('draft','published','hidden') NOT NULL DEFAULT 'draft',
        seo_title       VARCHAR(255) DEFAULT NULL,
        seo_description TEXT DEFAULT NULL,
        created_by      CHAR(26) DEFAULT NULL,
        updated_by      CHAR(26) DEFAULT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE INDEX idx_pages_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Settings
    await queryRunner.query(`
      CREATE TABLE settings (
        id              CHAR(26) NOT NULL,
        \`key\`         VARCHAR(100) NOT NULL,
        value           TEXT DEFAULT NULL,
        \`group\`       VARCHAR(50) NOT NULL DEFAULT 'general',
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE INDEX idx_settings_key (\`key\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Contacts
    await queryRunner.query(`
      CREATE TABLE contacts (
        id              CHAR(26) NOT NULL,
        full_name       VARCHAR(100) NOT NULL,
        email           VARCHAR(255) NOT NULL,
        phone           VARCHAR(20) DEFAULT NULL,
        content         TEXT NOT NULL,
        status          ENUM('new','read','replied') NOT NULL DEFAULT 'new',
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX idx_contacts_status (status),
        INDEX idx_contacts_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Events
    await queryRunner.query(`
      CREATE TABLE events (
        id              CHAR(26) NOT NULL,
        title           VARCHAR(255) NOT NULL,
        description     TEXT DEFAULT NULL,
        image_url       VARCHAR(500) DEFAULT NULL,
        start_date      TIMESTAMP NOT NULL,
        end_date        TIMESTAMP NULL DEFAULT NULL,
        location        VARCHAR(255) DEFAULT NULL,
        link_url        VARCHAR(500) DEFAULT NULL,
        status          ENUM('upcoming','ongoing','past') NOT NULL DEFAULT 'upcoming',
        created_by      CHAR(26) DEFAULT NULL,
        updated_by      CHAR(26) DEFAULT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX idx_events_status (status),
        INDEX idx_events_start (start_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Admission posts
    await queryRunner.query(`
      CREATE TABLE admission_posts (
        id              CHAR(26) NOT NULL,
        title           VARCHAR(255) NOT NULL,
        slug            VARCHAR(300) NOT NULL,
        content         LONGTEXT NOT NULL,
        thumbnail_url   VARCHAR(500) DEFAULT NULL,
        status          ENUM('draft','published') NOT NULL DEFAULT 'draft',
        published_at    TIMESTAMP NULL DEFAULT NULL,
        created_by      CHAR(26) DEFAULT NULL,
        updated_by      CHAR(26) DEFAULT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE INDEX idx_admission_posts_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Admission FAQs
    await queryRunner.query(`
      CREATE TABLE admission_faqs (
        id              CHAR(26) NOT NULL,
        question        VARCHAR(500) NOT NULL,
        answer          TEXT NOT NULL,
        display_order   INT NOT NULL DEFAULT 0,
        is_visible      TINYINT(1) NOT NULL DEFAULT 1,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX idx_faqs_order (display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Admission registrations
    await queryRunner.query(`
      CREATE TABLE admission_registrations (
        id              CHAR(26) NOT NULL,
        full_name       VARCHAR(100) NOT NULL,
        phone           VARCHAR(20) NOT NULL,
        email           VARCHAR(255) DEFAULT NULL,
        grade           VARCHAR(20) NOT NULL,
        is_club_member  TINYINT(1) NOT NULL DEFAULT 0,
        status          ENUM('new','contacted','completed') NOT NULL DEFAULT 'new',
        note            TEXT DEFAULT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX idx_registrations_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Menu items (navigation)
    await queryRunner.query(`
      CREATE TABLE menu_items (
        id              CHAR(26) NOT NULL,
        label           VARCHAR(100) NOT NULL,
        url             VARCHAR(500) NOT NULL,
        target          ENUM('_self','_blank') NOT NULL DEFAULT '_self',
        parent_id       CHAR(26) DEFAULT NULL,
        display_order   INT NOT NULL DEFAULT 0,
        is_visible      TINYINT(1) NOT NULL DEFAULT 1,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at      TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX idx_menu_items_parent (parent_id),
        INDEX idx_menu_items_order (display_order),
        CONSTRAINT fk_menu_items_parent FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS menu_items');
    await queryRunner.query('DROP TABLE IF EXISTS admission_registrations');
    await queryRunner.query('DROP TABLE IF EXISTS admission_faqs');
    await queryRunner.query('DROP TABLE IF EXISTS admission_posts');
    await queryRunner.query('DROP TABLE IF EXISTS events');
    await queryRunner.query('DROP TABLE IF EXISTS contacts');
    await queryRunner.query('DROP TABLE IF EXISTS settings');
    await queryRunner.query('DROP TABLE IF EXISTS pages');
    await queryRunner.query('DROP TABLE IF EXISTS media');
    await queryRunner.query('DROP TABLE IF EXISTS articles');
    await queryRunner.query('DROP TABLE IF EXISTS categories');
  }
}
