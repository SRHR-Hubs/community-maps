import isProduction from "../hooks/isProduction";
import isServer from "../hooks/isServer";
import { DefaultSEO as SEO } from "../lib/seo";
import { appWithTranslation as withTranslation } from "next-i18next";
import "../styles/main.scss";
import i18n from "../lib/i18next";
import OmnisearchProvider from "../context/providers/OmnisearchProvider";

// inject development dependencies
if (!isServer() && !isProduction()) {
  const React = require("react");
  const ReactDOM = require("react-dom");
  const axe = require("@axe-core/react");
  axe(React, ReactDOM, 1000);
}

function MyApp({ Component, pageProps }) {
  return (
    <OmnisearchProvider>
      <SEO />
      <Component {...pageProps} />
    </OmnisearchProvider>
  );
}

export default withTranslation(MyApp, i18n);
