import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import PageService from "../../services/PageService";
import FORMS from "../../config/forms";
import { useCognitoForm } from "../../lib/cognito-form";
import { useTranslation } from "react-i18next";
import { SEO } from "../../lib/seo";

const FormPage = ({ form_id }) => {
  // SEO stuff
  const { t } = useTranslation();
  const key = Object.keys(FORMS).find((k) => FORMS[k].form_id === form_id);
  const title = t(`pages.common.sections.contact.form-button.${key}`);

  // load the form
  useCognitoForm(form_id, "#form-container");
  return (
    <>
      <SEO title={title} canonical={key} />
      <PageLayout id="contact-form">
        <section id="form-container"></section>
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ params: { form_id }, locale }) {
  const fields = ["slug", "title", "description", "content"];

  const pageProps = await PageService.getPageProps("contact-form", {
    fields,
  });
  return {
    props: {
      ...FORMS[form_id],
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
  };
}

export async function getStaticPaths() {
  const paths = Object.keys(FORMS).map((form_id) => ({
    params: {
      form_id,
    },
  }));

  return { paths, fallback: false };
}

export default FormPage;
