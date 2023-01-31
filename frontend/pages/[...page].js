import PageLayout from "../components/layout/page/PageLayout";
import { Markdown, serialize } from "../lib/mdx-remote";
import { SEO } from "../lib/seo";
import PageService from "../services/PageService";

const GenericPage = ({ slug, title, description, content }) => {
  // TODO: this works but do it server-side
  // const scope = {
  //   updated_at: new Date(updated_at).toLocaleString(),
  // }
  return (
    <>
      <SEO title={title} description={description} />
      <PageLayout>
        <h1>{title}</h1>
        {content.map(([section_id, text]) => (
          <section id={section_id} key={section_id}>
            <Markdown {...text} /*scope={scope}*/ />
          </section>
        ))}
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ params }) {
  const { page: tokens } = params;
  const slug = tokens.join("/");
  const fields = ["slug", "title", "description", "content", "updated_at"];

  const page = await PageService.getPageBySlug(slug, {
    fields,
  });

  page.content = await Promise.all(
    page.content.map(async ({ translation_id, text }) => [
      translation_id,
      await serialize(text),
    ])
  );

  return {
    props: {
      ...page,
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
