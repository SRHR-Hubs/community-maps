import { Cloudinary } from "@cloudinary/url-gen";
import lqip from 'lqip-modern'

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
});

// TODO: non-cloudinary version?

export async function getBlurUrl(publicId) {
    const url = cloudinary.image(publicId).toURL();
    const res = await fetch(url);
    const buffer = Buffer.from(await res.arrayBuffer());

    const { metadata } = await lqip(buffer);

    return {
        url,
        metadata,
    }
}

export default cloudinary;
