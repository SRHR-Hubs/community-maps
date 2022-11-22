import Image from "../components/image";
import { getBlurUrl } from "../lib/cloudinary";
import metadataPlugin from "../lib/mdx-remote/image-transform";
import unwrapImagesPlugin from "remark-unwrap-images";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

export default function ImagePage({ url, metadata, source }) {
  const { originalWidth, originalHeight, dataURIBase64 } = metadata;
  const width = Math.floor(originalWidth / 4);
  const height = Math.floor(originalHeight / 4);

  const imageProps = {
    image: {
      src: url,
      blurDataURL: dataURIBase64,
    },
    container: {
      style: {
        width,
        height,
      },
    },
  };

  return (
    <div>
      <Image {...imageProps} />
      <div style={{ maxWidth: "60ch", margin: "0 auto" }}>
        <MDXRemote
          {...source}
          components={{
            // p: (props) => <div {...props}/>,
            img: ({ src, alt, title, width, height, blurDataURL }) => {
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
              return (<Image {...props} />);
            },
          }}
        />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const text =`# hehe\n![This is the image text!](https://res.cloudinary.com/drk1rc6ld/image/upload/v1666106380/cld-sample-5.jpg "Picture of a shoe")\nCarrying on with yet further dumb shit`;
  const source = await serialize(text, {
    mdxOptions: {
      remarkPlugins: [unwrapImagesPlugin],
      rehypePlugins: [metadataPlugin],
    },
  });

  const publicId = `cld-sample-${Math.floor(Math.random() * 4) + 2}`;
  const { url, metadata } = await getBlurUrl(publicId);

  return {
    props: {
      url,
      metadata,
      source,
    },
  };
}
