/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'noqvxgegewivxnjwdaat.supabase.co',
      },
    ],
  },
};

export default nextConfig;
