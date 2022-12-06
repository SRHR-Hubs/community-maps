import PageLayout from "../components/layout/page";
import useAPIFetcher from "../hooks/useAPIFetcher";
import useQuery from "../hooks/useQuery";
import { Markdown, serialize } from "../lib/mdx-remote";

const GenericPage = ({ sections }) => {
  // TODO head
  sections = JSON.parse(sections);
  return (
    <PageLayout>
      {Object.entries(sections).map(([sectionId, source]) => (
        <section id={sectionId} key={sectionId}>
          <Markdown {...source} />
        </section>
      ))}
    </PageLayout>
  );
};

export async function getStaticProps({ params }) {
  const { page = [] } = params;
  const fetcher = useAPIFetcher();
  const q = useQuery();

  const url = `/api/pages/?${q({
    filters: {
      url: {
        $eq: "/" + page.join("/"),
      },
    },
    populate: ["head", "sections"],
  })}`;

  const { data } = await (await fetcher(url)).json();

  const [{ attributes }] = data;

  const sections = await Promise.all(
    attributes.sections.map(async ({ sectionId, content }) => [
      sectionId,
      await serialize(content),
    ])
  );

  return {
    props: {
      sections: JSON.stringify(Object.fromEntries(sections)),
    },
  };
}

export async function getStaticPaths() {
  const fetcher = useAPIFetcher();
  const q = useQuery();

  const url = `/api/pages?${q({
    fields: ["url"],
  })}`;

  const { data } = await (await fetcher(url)).json();

  const paths = data.map(({ attributes: { url } }) => ({
    params: { page: url === "/" ? [] : url.substring(1).split("/") },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default GenericPage;
