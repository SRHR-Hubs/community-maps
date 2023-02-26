export default function toImageProps({
  url,
  metadata: { originalWidth, originalHeight, dataURIBase64 },
  height,
  alt,
  title,
  preserveAspectRatio = false,
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
        ...(width && { width }),
        ...(height && { height }),
        ...(preserveAspectRatio && {
          aspectRatio: `${originalWidth} / ${originalHeight}`,
        }),
      },
    },
  };
}
