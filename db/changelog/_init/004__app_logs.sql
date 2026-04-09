-- ============================================================
-- App logs — system logging
-- Tu TypeORM migration: 1712707200000-AddAppLogs
-- ============================================================

CREATE TABLE IF NOT EXISTS app_logs (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT '[OK] app_logs created' AS result;
