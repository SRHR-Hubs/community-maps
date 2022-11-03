/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { 
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
      }
    ]
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
      }
      config.externals = {
        'sharp': 'commonjs sharp',
      }
    }
    return config;
  },
};

module.exports = nextConfig;
