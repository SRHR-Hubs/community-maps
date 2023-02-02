import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageLayout from "../components/layout/page/PageLayout";
import i18next from "../lib/i18next";
import { Markdown, serialize } from "../lib/mdx-remote";
import { SEO } from "../lib/seo";
import PageService from "../services/PageService";



const GenericPage = ({ slug, title, description, content }) => {
  return (
    <>
      <SEO title={title} description={description} />
      <PageLayout>
        <h1>{title}</h1>
        {content.map(([section_id, text]) => (
          <section id={section_id} key={section_id}>
            <Markdown {...text} />
          </section>
        ))}
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ params, locale }) {
  const { page: tokens } = params;
  const slug = tokens.join("/");
  const fields = ["slug", "title", "description", "content", "updated_at"];

  const page = await PageService.getPageBySlug(slug, {
    fields,
  });

  page.content = await Promise.all(
    page.content.map(async ({ section_id, text }) => [
      section_id,
      await serialize(text),
    ])
  );

  return {
    props: {
      ...page,
      ...(await serverSideTranslations(locale, ["common"], i18next)),
    },
  };
}

export async function getStaticPaths() {
  const pages = await PageService.getAllPages();

  const paths = pages.map(({ slug }) => {
    const page = slug.split("/");
    return { params: { page } };
  });

  return { paths, fallback: false };
}

export default GenericPage;
