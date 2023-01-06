import PageLayout from "../../components/layout/page";
import { Markdown, serialize } from "../../lib/mdx-remote";
import BlogService from "../../services/BlogService";

const BlogPost = ({ title, description, image, content }) => {
  return (
    <PageLayout>
      <article>
        <h1>{title}</h1>
        <p>{description}</p>
        <Markdown {...content} />
      </article>
    </PageLayout>
  );
};

export async function getStaticProps({ params }) {
  const { slug } = params;

  const fields = ["slug", "title", "description", "image", "content"];

  const post = await BlogService.getPostBySlug(slug, {
    fields,
  });

  post.content = await serialize(post.content);

  return {
    props: {
      ...post,
    },
  };
}

export async function getStaticPaths() {
  const posts = await BlogService.getAllPosts();

  const paths = posts.map(({ slug }) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
}

export default BlogPost;
