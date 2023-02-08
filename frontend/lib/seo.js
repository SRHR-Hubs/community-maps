import { DefaultSeo, NextSeo } from "next-seo";
import config from "../config/next-seo.config";
import isServer from "../hooks/isServer";

export const DefaultSEO = () => <DefaultSeo {...config} />;
export const SEO = (props) => {
    let newProps = {...props};
    if ('canonical' in props && !isServer()) {
        newProps.canonical = `${process.env.HOST}/${props.canonical}`
    }
    
    return <NextSeo {...newProps}/>
};
