import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageLayout from "../../components/layout/page/PageLayout";
import i18next from "../../lib/i18next";
import { Markdown, serialize } from "../../lib/mdx-remote";
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
          <Markdown {...content}/>
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

  const post = await BlogService.getPostBySlug(slug, {
    fields,
  });

  post.content = await serialize(post.content)

  // post.content = await Promise.all(
  //   post.content.map(async ({ section_id, text }) => [
  //     section_id,
  //     await serialize(text),
  //   ])
  // );

  return {
    props: {
      ...post,
      ...(await serverSideTranslations(locale, ["common"], i18next)),
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
