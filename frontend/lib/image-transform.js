import { visit } from 'unist-util-visit';
import { getBlurUrl } from './cloudinary';

/** Almost all of this code was inspired by:
 * https://nikolovlazar.com/blog/generating-blur-for-dynamic-images-nextjs
 */

const cloud = process.env.CLOUDINARY_CLOUD_NAME;
const isCloudinary = (url) => url.startsWith(`https://res.cloudinary.com/${cloud}/image/upload/`)

function isImageNode(node) {
    const { type, tagName, properties } = node;

    return (
        type === 'element' &&
        tagName === 'img' &&
        typeof properties?.src === 'string'
    )
}

async function addMetadata(node){
    if (isCloudinary(node.properties.src)){
        const [filename] = node.properties.src.split("/").slice(-1);
        const [publicId] = filename.split(".");

        const { metadata } = await getBlurUrl(publicId);
        const {originalHeight: height, originalWidth: width, dataURIBase64: blurDataURL} = metadata;

        node.properties = {
            ...node.properties,
            height,
            width,
            blurDataURL
        }
    }
    // TODO: else
}

const metadataPlugin = () => async(tree) => {
    const images = [];

    visit(tree, 'element', (node) => {
        if (isImageNode(node)) { images.push(node); }
    })
    for (const img of images) {
        await addMetadata(img);
    }

    return tree;
}

export default metadataPlugin;