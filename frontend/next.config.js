/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const i18n = require("./config/i18n.config.json");

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
  staticPageGenerationTimeout: 1000,

  i18n,

  experimental: {
    enableUndici: true
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
