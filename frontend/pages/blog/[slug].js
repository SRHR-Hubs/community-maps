import PageLayout from "../../components/layout/page";
import { Markdown, serialize } from "../../lib/mdx-remote";
import BlogService from "../../services/BlogService";

const BlogPost = ({ slug, source, meta }) => {
  return (
    <PageLayout id={`blog-post-${slug}`}>
      <Markdown {...source} />
      <ul>
        {Array.from(Object.entries(meta)).map(([k, v]) => (
          <li>
            <b>{k}</b>: {v}
          </li>
        ))}
      </ul>
    </PageLayout>
  );
};

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { data, meta } = await BlogService.getPost(slug);

  const { content, ...attributes } = data.attributes;

  const source = await serialize(content);

  return {
    props: {
      slug,
      source,
      meta: {
        ...meta,
        ...attributes,
      },
    },
  };
}

export async function getStaticPaths() {
  const ids = await BlogService.getAllPostIds();

  const paths = ids.map(String).map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
}

export default BlogPost;
