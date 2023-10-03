import i18next from "../lib/i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { i18n } from "next-i18next";
const useServerI18n = async (locale = "") => {
  // await i18n?.reloadResources();
  return serverSideTranslations(locale, ["common"], i18next);
};

export default useServerI18n;
