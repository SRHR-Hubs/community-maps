import { useEffect } from "react";
import isServer from "../hooks/isServer";

export const useCognitoForm = (form_id, anchorSelector) => {
  useEffect(() => {
    if (isServer()) return;
    const script = document.createElement("script");

    Object.assign(script, {
      src: "https://www.cognitoforms.com/f/seamless.js",
      async: true,
    });

    document.head.appendChild(script);

    script.onload = () => {
      window
        .Cognito(process.env.NEXT_PUBLIC_COGNITO_KEY)
        .mount(form_id, anchorSelector);
    };
  }, []);
};
