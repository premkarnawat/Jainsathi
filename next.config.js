/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',
      'jainsaathi-matrimony.supabase.co',
    ],
  },
};

module.exports = nextConfig;
