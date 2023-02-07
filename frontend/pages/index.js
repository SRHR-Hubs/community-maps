import PageLayout from "../components/layout/page/PageLayout";
import { Trans } from "next-i18next";
import { Markdown, serialize } from "../lib/mdx-remote";

import { SEO } from "../lib/seo";
import PageService from "../services/PageService";
import useServerI18n from "../hooks/useServerI18n";

const IndexPage = ({ slug, title, description, content }) => {
  const seoInfo = {
    title,
    description,
    // canonical: slug,
  };
  return (
    <>
      <SEO {...seoInfo} />
      <PageLayout>
        <h1>{title}</h1>
        <Trans i18nKey='pages.home.sections.wocky-slush'>No wocky slush?</Trans>
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ params, locale }) {
  const fields = ["slug", "title", "description", "content"];

  const page = await PageService.getPageBySlug("home", {
    fields,
  });

  return {
    props: {
      ...page,
      ...(await useServerI18n(locale)),
    },
  };
}

export default IndexPage;
