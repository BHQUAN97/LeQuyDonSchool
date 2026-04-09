const isProd = process.env.NODE_ENV === 'production' && process.env.BUILD_MODE !== 'fast';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers — chong XSS, clickjacking, MIME sniffing
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
  allowedDevOrigins: ['demo.remoteterminal.online'],
  // Skip TS/ESLint during build — chay rieng trong CI/dev
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'demo.remoteterminal.online' },
      { protocol: 'https', hostname: 'lqd.bhquan.store' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'backend' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800,
  },
  // Standalone chi can cho Docker production
  ...(isProd ? { output: 'standalone' } : {}),
  // Compression handled by Nginx in production
  compress: false,
  // Bo minify + optimization khi build:fast
  ...(!isProd ? {
    swcMinify: false,
    productionBrowserSourceMaps: false,
    webpack: (config) => {
      config.optimization.minimize = false;
      return config;
    },
  } : {}),
  // Proxy API requests to backend (local dev without Nginx)
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.INTERNAL_API_URL || 'http://localhost:4000/api'}/:path*`,
    },
    {
      source: '/uploads/:path*',
      destination: `${process.env.INTERNAL_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:4000'}/uploads/:path*`,
    },
  ],
};

export default nextConfig;
