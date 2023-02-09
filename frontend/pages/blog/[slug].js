import PageLayout from "../../components/layout/page/PageLayout";
import isProduction from "../../hooks/isProduction";
import useServerI18n from "../../hooks/useServerI18n";
import { Markdown } from "../../lib/mdx-remote";
import { SEO } from "../../lib/seo";
import BlogService from "../../services/BlogService";

const BlogPost = ({ title, description, image, content }) => {
  return (
    <>
      <SEO title={title} description={description} />
      <PageLayout>
        <article>
          <h1>{title}</h1>
          <p>{description}</p>
          <Markdown {...content} />
          {/* {content.map(([section_id, text]) => (
            <section id={section_id} key={section_id}>
              <Markdown {...text} />
            </section>
          ))} */}
        </article>
      </PageLayout>
    </>
  );
};

export async function getStaticProps({ params, locale }) {
  const { slug } = params;

  const fields = ["slug", "title", "description", "image", "content"];

  const postProps = await BlogService.getPageProps(slug, {
    fields,
  });

  return {
    notFound: isProduction(),
    props: {
      ...postProps,
      ...(await useServerI18n(locale)),
    },
  };
}

export async function getStaticPaths() {
  const posts = await BlogService.getAllPosts({ published: true });

  const paths = posts.map(({ slug }) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
}

export default BlogPost;
