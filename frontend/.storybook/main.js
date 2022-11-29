const path = require("path");
module.exports = {
  stories: ["../components/**/*.stories.js(x)?"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  features: {
    storyStoreV7: true,
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
