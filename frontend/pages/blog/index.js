import PageLayout from "../../components/layout/page";
import BlogService from "../../services/BlogService";
import Link from 'next/link'

const BlogHome = ({ posts }) => {
  return (
    <PageLayout id="blog">
      <h1>Blog home</h1>
      {posts.map((id) => (
        <li><Link href={`/blog/${id}`}>Post {id}</Link></li>
      ))}
    </PageLayout>
  );
};

export async function getStaticProps() {
  const postIds = await BlogService.getAllPostIds();

  return {
    props: {
      posts: postIds,
    },
  };
}

export default BlogHome;
