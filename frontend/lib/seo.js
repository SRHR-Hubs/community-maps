import { DefaultSeo, NextSeo } from "next-seo";
import config from "../config/next-seo.config";

export const DefaultSEO = () => <DefaultSeo {...config} />;
export const SEO = (props) => {
    let newProps = {...props};
    if ('canonical' in props) {
        newProps.canonical = `${process.env.HOST}/${props.canonical}`
    }
    
    return <NextSeo {...newProps}/>
};
