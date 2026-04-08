/**
 * Validate required environment variables at startup.
 * Fails fast neu thieu bien moi truong quan trong.
 */
export function validateEnv(): void {
  const required = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`[ENV] Missing required variables:\n${missing.map((k) => `  - ${k}`).join('\n')}`);
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET?.includes('change-this')) {
    console.error('[ENV] CRITICAL: JWT_SECRET is using default value in production!');
    process.exit(1);
  }
}
