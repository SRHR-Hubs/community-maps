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
  const { page } = params;
  // const slug = tokens.join("/");
  const fields = ["slug", "title", "description", "content", "updated_at"];

  const pageProps = await PageService.getPageProps(page, {
    fields,
  });

  return {
    props: {
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const pages = await PageService.getAllPages({ published: true, size: 2 });

  // this only took hours to solve.
  // https://github.com/vercel/next.js/issues/45692
  // current time: 1:39 am.
  const existingSlugs = [
    "home",
    "blog",
    "services",
    "about",
    "map",
    "service-detail",
    "contact-form",
  ];

  const paths = pages
    .filter(({ slug }) => !existingSlugs.includes(slug))
    .map(({ slug, language }) => {
      console.log(slug);
      const [page] = slug.split("/");
      return { params: { page /*locale: language*/ } };
    });

  return { paths, fallback: false };
}

export default GenericPage;
