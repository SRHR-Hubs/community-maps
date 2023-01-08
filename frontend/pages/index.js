import PageLayout from "../components/layout/page/PageLayout";
import { Markdown, serialize } from "../lib/mdx-remote";
import PageService from "../services/PageService";

const IndexPage = ({ slug, title, description, content }) => {
  // TODO head
  return (
    <PageLayout>
      <h1>{title}</h1>
      <Markdown {...content} />
    </PageLayout>
  );
};

export async function getStaticProps({ params }) {
  const fields = ["slug", "title", "description", "content"];

  const page = await PageService.getPageBySlug("home", {
    fields,
  });

  page.content = await serialize(page.content);

  return {
    props: {
      ...page,
    },
  };
}

export default IndexPage;
