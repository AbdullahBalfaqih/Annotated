/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: '/index.html', destination: '/' },
      { source: '/home.html', destination: '/home' },
      { source: '/login.html', destination: '/login' },
      { source: '/auth/callback.html', destination: '/auth/callback' },
    ];
  },
};

export default nextConfig;
