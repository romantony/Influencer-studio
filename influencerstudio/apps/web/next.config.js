/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['undici'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
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
