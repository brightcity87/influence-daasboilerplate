/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: process.env.NEXT_PUBLIC_FRONTEND_PORT,
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],

    domains: ["localhost", "backend", "frontend", "imgur.com"],
  },
  output: "standalone",
};

export default nextConfig;
