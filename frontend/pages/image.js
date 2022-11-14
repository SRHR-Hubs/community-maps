import Image from "next/image";
import { getBlurUrl } from "../lib/cloudinary";

export default function ImagePage({ url, metadata }) {
  const { originalWidth, originalHeight, dataURIBase64 } = metadata;
  const width = Math.floor(originalWidth / 4);
  const height = Math.floor(originalHeight / 4);

  return (
    <div className="image-container" style={{
      width,
      height
    }}>
        <Image 
            className="image-component"
            src={url}
            fill
            placeholder="blur"
            blurDataURL={dataURIBase64}
        />
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
