import { DefaultSeo, NextSeo } from "next-seo";
import config from "../config/next-seo.config";
import isServer from "../hooks/isServer";

export const DefaultSEO = () => <DefaultSeo {...config} />;
export const SEO = (props) => {
    let newProps = {...props};
    if ('canonical' in props) {
        newProps.canonical = `${process.env.NEXT_PUBLIC_HOST}/${props.canonical}`
    }
    
    return <NextSeo {...newProps}/>
};
