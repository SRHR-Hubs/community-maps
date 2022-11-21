import Image from "../components/image";
import { getBlurUrl } from "../lib/cloudinary";

export default function ImagePage({ url, metadata }) {
  const { originalWidth, originalHeight, dataURIBase64 } = metadata;
  const width = Math.floor(originalWidth / 4);
  const height = Math.floor(originalHeight / 4);

  const imageProps = {
    image: {
      src: url,
      blurDataURL: dataURIBase64,
    },
    container: {
      width,
      height,
  }
}

  return (
    <div>
      <Image {...imageProps}/>
    </div>
  )
};

export async function getStaticProps() {
  const publicId = `cld-sample-${Math.floor(Math.random() * 4) + 2}`;
  const { url, metadata } = await getBlurUrl(publicId);

  return {
    props: {
      url,
      metadata,
    },
  };
}
