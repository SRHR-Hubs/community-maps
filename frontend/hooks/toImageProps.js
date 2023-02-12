export default function toImageProps({
  url,
  metadata: { originalWidth, originalHeight, dataURIBase64 },
  height = null,
  width = null,
  alt = null,
  title = null,
}) {
  return {
    image: {
      src: url,
      blurDataURL: dataURIBase64,
      alt,
      title: title ?? alt,
    },
    container: {
      style: {
        width,
        height,
        aspectRatio: `${originalWidth} / ${originalHeight}`,
      },
    },
  };
}
