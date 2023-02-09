import Link from "next/link";
import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import BlogService from "../../services/BlogService";
import PageService from "../../services/PageService";

const BlogHome = ({ posts, slug, title }) => {
  return (
    <>
      <SEO title={title} canonical={slug} />
      <PageLayout id={slug}>
        <h1>{title}</h1>
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

  const pageProps = await PageService.getPageProps("blog");

  return {
    props: {
      posts,
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
  };
}

export default BlogHome;
