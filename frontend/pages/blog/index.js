import PageLayout from "../../components/layout/page/PageLayout";
import BlogService from "../../services/BlogService";
import Link from 'next/link'

const BlogHome = ({ posts }) => {
  return (
    <PageLayout id="blog">
      <h1>Blog home</h1>
      {posts.map(({slug, title}) => (
        <li key={slug}><Link href={`/blog/${slug}`}>{title}</Link></li>
      ))}
    </PageLayout>
  );
};

export async function getStaticProps() {
  const posts = await BlogService.getAllPosts({ fields: ['slug', 'title']});
  
  return {
    props: {
      posts,
    },
  };
}

export default BlogHome;
