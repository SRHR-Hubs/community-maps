import PageLayout from "../../components/layout/page";
import { Markdown, serialize } from "../../lib/mdx-remote";
import BlogService from "../../services/BlogService";

const BlogPost = ({ id, source, meta }) => {
  return (
    <PageLayout id={`blog-post-${id}`}>
      <Markdown {...source} />
      <ul>
        {Object.entries(meta).map(([k, v]) => (
          <li>
            <b>{k}</b>: {v}
          </li>
        ))}
      </ul>
    </PageLayout>
  );
};

export async function getStaticProps({ params }) {
  const service = new BlogService();
  const { slug: id } = params;
  const { data, meta } = await service.getPost(id);

  const source = await serialize(data.attributes.content)

  return {
    props: {
      id,
      source,
      meta,
    },
  };
}

export async function getStaticPaths() {
  const service = new BlogService();
  const ids = await service.getAllPostIds();

  const paths = ids.map(String).map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
}

export default BlogPost;
