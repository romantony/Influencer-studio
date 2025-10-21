/** @type {import('next').NextConfig} */
const cdnHost = process.env.NEXT_PUBLIC_CDN_HOST;

const nextConfig = {
  transpilePackages: ['undici'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ['images.unsplash.com', 'replicate.delivery'].concat(cdnHost ? [cdnHost] : []),
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'replicate.delivery' },
    ].concat(cdnHost ? [{ protocol: 'https', hostname: cdnHost }] : []),
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure server-only modules like `undici` are not bundled client-side
      config.resolve = config.resolve || {}
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        undici: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
