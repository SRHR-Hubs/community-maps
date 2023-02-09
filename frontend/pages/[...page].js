import PageLayout from "../components/layout/page/PageLayout";
import useServerI18n from "../hooks/useServerI18n";
import { Markdown } from "../lib/mdx-remote";
import { SEO } from "../lib/seo";
import PageService from "../services/PageService";

const GenericPage = ({ slug, title, description, content }) => {
  return (
    <>
      <SEO title={title} description={description} canonical={slug} />
      <PageLayout>
        <section className="hero">
          <h1>{title}</h1>
        </section>
        {Object.entries(content).map(([section_id, text]) => (
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

  const pageProps = await PageService.getPageProps(slug, {
    fields,
  });

  return {
    props: {
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
  };
}

export async function getStaticPaths() {
  const pages = await PageService.getAllPages({ published: true });

  const paths = pages.map(({ slug }) => {
    const page = slug.split("/");
    return { params: { page } };
  });

  return { paths, fallback: false };
}

export default GenericPage;
