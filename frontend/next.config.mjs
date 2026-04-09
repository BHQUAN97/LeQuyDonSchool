/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lqd.bhquan.store' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'backend' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800,
  },
  // Enable standalone output for smaller Docker images
  output: 'standalone',
  // Compression handled by Nginx in production
  compress: false,
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
