/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },

  i18n: {
    locales: ['en-CA'],
    defaultLocale: 'en-CA',
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // config.resolve.fallback = {
      //   ...config.resolve.fallback,
      //   child_process: false,
      // };

      config.externals = {
        sharp: "sharp",
      };
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            dimensions: false,
          },
        },
      ],
    });

    return config;
  },
};

const plugins = [withBundleAnalyzer];

const config = plugins.reduce((cfg, plugin) => plugin(cfg), nextConfig);

module.exports = config;
