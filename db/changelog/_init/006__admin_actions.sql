-- ============================================================
-- Admin actions — audit trail
-- Tu TypeORM migration: 1712793600000-AddAdminActions
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_actions (
  id CHAR(26) NOT NULL,
  action ENUM('create','update','delete','login','logout','upload') NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id CHAR(26) NULL,
  description VARCHAR(500) NOT NULL,
  `changes` JSON NULL,
  user_id CHAR(26) NOT NULL,
  user_name VARCHAR(100) NULL,
  ip VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_admin_actions_action (action),
  INDEX idx_admin_actions_user_id (user_id),
  INDEX idx_admin_actions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT '[OK] admin_actions created' AS result;
