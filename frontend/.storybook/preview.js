import "../styles/main.scss";
import i18n from "./next-i18next";
// import { appWithTranslation } from "next-i18next";
import { I18nextProvider } from "react-i18next";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const withTranslation = (Story) => (
  <I18nextProvider i18n={i18n}>
    <Story />
  </I18nextProvider>
);

export const decorators = [
  (Story) => withTranslation(Story, i18n),
];
