const path = require("path");

module.exports = {
  stories: ["../components/"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  features: {
    storyStoreV7: true,
  },
  webpackFinal: async (config, { configType }) => {
    // issue: Storybook's SVG loader was upset about
    // SVGR and the presence of SVG imports from node_modules.
    // unbelievably cursed fix based on
    // https://medium.com/@derek_19900/config-storybook-4-to-use-svgr-webpack-plugin-22cb1152f004
    const svgPath = path.resolve(__dirname, "../");
    const assetRule = config.module.rules.find(({ test }) =>
      test?.test(".svg")
    );

    assetRule.exclude = svgPath;

    config.externals = {
      fs: 'fs',
    }

    config.module.rules.push({
      test: /\.svg$/,
      include: svgPath,
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
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  core: {
    builder: "webpack5",
    disableTelemetry: true,
  },
  docs: {
    docsPage: true,
  },
};
