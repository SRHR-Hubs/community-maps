import { DefaultSeo, NextSeo } from "next-seo";
import config from "../config/next-seo.config";

export const DefaultSEO = () => <DefaultSeo {...config} />;
export const SEO = NextSeo;
