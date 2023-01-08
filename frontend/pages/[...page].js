import PageLayout from "../components/layout/page/PageLayout";
import { Markdown, serialize } from "../lib/mdx-remote";
import PageService from "../services/PageService";

const GenericPage = ({ slug, title, description, content }) => {
  // TODO head
  return (
    <PageLayout>
      <h1>{title}</h1>
      <Markdown {...content}/>
    </PageLayout>
  );
};

export async function getStaticProps({ params }) {
  const { page: tokens } = params;
  const slug = tokens.join("/");
  const fields = ["slug", "title", "description", "content"];

  const page = await PageService.getPageBySlug(slug, {
    fields,
  });

  page.content = await serialize(page.content);

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
