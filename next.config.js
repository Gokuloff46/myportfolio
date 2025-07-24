/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS image hosts
      },
      {
        protocol: 'http',
        hostname: '**', // Allow all HTTP image hosts (not recommended for production)
      },
    ],
  },
};

module.exports = nextConfig;
