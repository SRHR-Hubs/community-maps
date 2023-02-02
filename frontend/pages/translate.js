import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageLayout from "../components/layout/page/PageLayout";
import i18next from "../lib/i18next";

const TranslationTest = () => {
  const { t } = useTranslation();
  return <PageLayout>{t("very.deeply.nested.key")}</PageLayout>;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
        locale,
        ['common'],
        i18next
    )),
  },
});

export default TranslationTest;
