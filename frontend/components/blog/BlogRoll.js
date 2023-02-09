import Link from "next/link";
import BlogCard from "./BlogCard";

const BlogRoll = () => (
  <div className="columns">
    <div className="column col-4 col-mx-auto">
      <Link href="/blog/my-first-blog-post">
        <BlogCard
          title="My first blog post"
          description="The first blog post to appear on the site."
          subtitle="Yesterday"
        />
      </Link>
    </div>
    <div className="column col-4 col-mx-auto">
      <Link href="/blog/my-first-blog-post">
        <BlogCard
          title="My first blog post"
          description="The first blog post to appear on the site."
          subtitle="Two days ago"
        />
      </Link>
    </div>
    <div className="column col-4 col-mx-auto">
      <Link href="/blog/my-first-blog-post">
        <BlogCard
          title="My first blog post"
          description="The first blog post to appear on the site."
          subtitle="Feburary 2020"
        />
      </Link>
    </div>
  </div>
);

export default BlogRoll;
