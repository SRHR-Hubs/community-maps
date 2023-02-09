import isProduction from "../hooks/isProduction";
import isServer from "../hooks/isServer";
import HTTPBackend from "i18next-http-backend";
import fetcher from "../hooks/fetch";
import i18n from '../config/i18n.config.json'

export default {
  debug: !isProduction(),
  i18n,
  load: "languageOnly",
  preload: ['en'],
  ns: ["common"],
  defaultNS: 'common',
  fallbackNS: 'common',
  fallbackLng: "en",

  reloadOnPrerender: !isProduction(),
  initImmediate: false,

  use: [HTTPBackend],

  backend: {
    crossDomain: true,
    loadPath: process.env.API_HOST + "/api/i18n/{{lng}}/",
    addPath: process.env.API_HOST + "/api/i18n/",
  },

  // appendNamespaceToMissingKey: false,
  saveMissing: !isProduction(),
  // saveMissingTo: "current",

  missingKeyHandler: async (
    lngs,
    ns,
    key,
    fallbackValue,
    updateMissing,
    options
  ) => {
    if (!isServer()) {
      // Don't try to handle missing keys from the client
      // console.warn("From client");
      return;
    }
    if (updateMissing) {
      console.warn("Not supported yet");
    }
    await Promise.all(
      lngs.map((language) => {
        const body = {
          language,
          translation_id: key.includes('.') ? key : `common.${key}`,
          text: fallbackValue,
        };
        return fetcher("/api/i18n/", {
          method: "POST",
          body,
        });
      })
    );
    console.log(
      "Missing key",
      key,
      "saved successfully with fallback value",
      fallbackValue
    );
  },
  serializeConfig: false,
};