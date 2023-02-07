import i18next from "../lib/i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default async locale => serverSideTranslations(locale, ['common'], i18next);