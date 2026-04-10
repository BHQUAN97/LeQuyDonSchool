-- ============================================================
-- Users, refresh_tokens, login_attempts
-- Tu TypeORM migration: 1712534400000-InitialSchema
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id              CHAR(26) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(100) NOT NULL,
  phone           VARCHAR(20) DEFAULT NULL,
  avatar_url      VARCHAR(500) DEFAULT NULL,
  role            ENUM('super_admin','editor') NOT NULL DEFAULT 'editor',
  status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
  last_login_at   TIMESTAMP NULL DEFAULT NULL,
  created_by      CHAR(26) DEFAULT NULL,
  updated_by      CHAR(26) DEFAULT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_users_email (email),
  INDEX idx_users_status_role (status, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id              CHAR(26) NOT NULL,
  user_id         CHAR(26) NOT NULL,
  token_hash      VARCHAR(255) NOT NULL,
  ip_address      VARCHAR(45) DEFAULT NULL,
  user_agent      VARCHAR(500) DEFAULT NULL,
  expires_at      TIMESTAMP NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_refresh_tokens_user (user_id),
  INDEX idx_refresh_tokens_expires (expires_at),
  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
  id              CHAR(26) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  ip_address      VARCHAR(45) NOT NULL,
  success         TINYINT(1) NOT NULL DEFAULT 0,
  attempted_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_login_attempts_ip_time (ip_address, attempted_at),
  INDEX idx_login_attempts_email_time (email, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default Super Admin (dev/staging)
-- Email: admin@lequydon.edu.vn | Password: Admin@123456
INSERT INTO users (id, email, password_hash, full_name, role, status)
VALUES (
  '01JRQX0000DEFAULT0ADMIN',
  'admin@lequydon.edu.vn',
  '$2b$10$A1Sh5G4Zj/jxAEo.jxBxiun3bWtm.Usp4CdFzzlhP.LMWuNXowvkK',
  'Quản trị viên',
  'super_admin',
  'active'
) ON DUPLICATE KEY UPDATE id = id;

SELECT '[OK] users, refresh_tokens, login_attempts created + default admin seeded' AS result;
