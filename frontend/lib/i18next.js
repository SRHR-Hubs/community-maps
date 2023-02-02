import isProduction from "../hooks/isProduction";
import HTTPBackend from "i18next-http-backend";

export default {
  debug: !isProduction(),
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  load: "languageOnly",
  ns: ["common"],
  fallbackLng: 'en',

  saveMissing: !isProduction(),
  reloadOnPrerender: !isProduction(),
  keySeparator: '.',

  use: [HTTPBackend],

  backend: {
    crossDomain: true,
    loadPath: process.env.API_HOST + "/api/i18n/{{lng}}/",
    addPath: process.env.API_HOST + "/api/i18n/",
  },

  serializeConfig: false,
};
