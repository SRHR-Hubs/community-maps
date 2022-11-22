import Image from "../../components/image";
import { MDXRemote } from "next-mdx-remote";
import { serialize as mdxSerialize } from "next-mdx-remote/serialize";

import metadataPlugin from "./image-transform";
import unwrapImagesPlugin from "remark-unwrap-images";

export function transformImgProps({ src, alt, title, width, height, blurDataURL }) {
  return {
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
}

export const components = {
  img: (props) => {
    return <Image {...transformImgProps(props)} />},
};

export const Markdown = (source) => (
  <MDXRemote {...source} components={components}/>
)

const mdxOptions = {
  remarkPlugins: [unwrapImagesPlugin],
  rehypePlugins: [metadataPlugin],
};

export const serialize = async (content) =>
  mdxSerialize(content, {
    mdxOptions,
  });
