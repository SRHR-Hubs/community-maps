import { DefaultSeo, NextSeo } from "next-seo";
import config from "../config/next-seo.config";

export const DefaultSEO = () => <DefaultSeo {...config} />;
export const SEO = (props) => {
  const { title, description } = props;
  let newProps = {
    ...props,
    openGraph: {
      title,
      description,
    },
  };
  if ("canonical" in props) {
    const url = `${process.env.NEXT_PUBLIC_HOST}/${props.canonical}`;
    newProps.canonical = url;
    newProps.openGraph.url = url;
  }
  if ("images" in props) {
    newProps.openGraph.images = props.images.concat(config.images);
  }

  return <NextSeo {...newProps} />;
};
