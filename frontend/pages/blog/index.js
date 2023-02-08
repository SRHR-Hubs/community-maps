import PageLayout from "../../components/layout/page/PageLayout";
import BlogService from "../../services/BlogService";
import Link from "next/link";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";

const BlogHome = ({ posts }) => {
  return (
    <>
      <SEO title="Blog Home" canonical="blog"/>
      <PageLayout id="blog">
        <h1>Blog home</h1>
        <ul>
          {posts.map(({ slug, title }) => (
            <li key={slug}>
              <Link href={`/blog/${slug}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ locale }) {
  const posts = await BlogService.getAllPosts({
    fields: ["slug", "title"],
    published: true,
  });

  return {
    props: {
      posts,
      ...(await useServerI18n(locale)),
    },
  };
}

export default BlogHome;
