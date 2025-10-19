import { withConvex } from "convex/next";

const nextConfig = {
  reactStrictMode: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'example.com'
      }
    ]
  },
  experimental: {
    serverActions: true
  }
};

export default withConvex(nextConfig);
