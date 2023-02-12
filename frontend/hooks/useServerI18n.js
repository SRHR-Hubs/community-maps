import i18next from "../lib/i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n } from "next-i18next";
export default async (locale) => {
  await i18n?.reloadResources();
  return serverSideTranslations(locale, ["common"], i18next);
};
