import Image from "next/image";
import { getBlurUrl } from "../lib/cloudinary";

export default ({ url, metadata }) => {
  const { originalWidth, originalHeight, dataURIBase64 } = metadata;
  return (
    <div>
        <Image 
            src={url}
            width={originalWidth / 4}
            height={originalHeight / 4}
            placeholder="blur"
            blurDataURL={dataURIBase64}
        />
    </div>
  )
};

export async function getStaticProps() {
  const publicId = "cld-sample-5";
  const { url, metadata } = await getBlurUrl(publicId);

  return {
    props: {
      url,
      metadata,
    },
  };
}
