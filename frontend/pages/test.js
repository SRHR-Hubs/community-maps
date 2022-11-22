import PageLayout from "../components/layout/page";
import useAPIFetcher from "../hooks/useAPIFetcher";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import metadataPlugin from "../lib/mdx-remote/image-transform";
import unwrapImagesPlugin from "remark-unwrap-images";
import Image from "../components/image";
import BlogService from "../services/BlogService";

const components = {img: ({ src, alt, title, width, height, blurDataURL }) => {
    const props = {
      image: {
        src,
        alt,
        title,
        blurDataURL,
      },
      container: {
        style: {
          width,
          height,
        },
      },
    };
    return (<Image {...props} />);}}

const TestPage = ({ source }) => {
  return (
    <PageLayout id="test">
        <MDXRemote {...source} components={components}/>
    </PageLayout>
  );
};

export async function getStaticProps() {
    const get = useAPIFetcher();
    const {data} = await (await get('/api/posts/1')).json();
    
    const source = await serialize(data.attributes.content, {
        mdxOptions: {
            remarkPlugins: [unwrapImagesPlugin],
            rehypePlugins: [metadataPlugin,]
        }
    })

    return {
        props: {
            source
        }
    }
}

export default TestPage;
