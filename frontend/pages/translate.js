import PageLayout from "../components/layout/page/PageLayout";
import { Trans } from "next-i18next";
import useServerI18n from "../hooks/useServerI18n";

const TranslationTest = () => {
  return (
    <PageLayout>
      <Trans i18nKey={"extremely.one.more.level.epic"}>
        This is freakin' epic
      </Trans>
    </PageLayout>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await useServerI18n(locale)),
  },
});

export default TranslationTest;
