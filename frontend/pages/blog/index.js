import PageLayout from "../../components/layout/page";
import BlogService from "../../services/BlogService";

const BlogHome = ({ posts }) => {
  return (
    <PageLayout id="blog">
      <h1>Blog home</h1>
      {posts.map((id) => (
        <li>Post {id}</li>
      ))}
    </PageLayout>
  );
};

export async function getStaticProps() {
  const service = new BlogService();
  const postIds = await service.getAllPostIds();

  return {
    props: {
      posts: postIds,
    },
  };
}

export default BlogHome;
