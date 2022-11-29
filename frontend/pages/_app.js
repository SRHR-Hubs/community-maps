import isProduction from "../hooks/isProduction";
import isServer from "../hooks/isServer";
import "../styles/main.scss";

// inject development dependencies
if (!isServer() && !isProduction()) {
  const React = require("react");
  const ReactDOM = require("react-dom");
  const axe = require("@axe-core/react");
  axe(React, ReactDOM, 1000);
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
