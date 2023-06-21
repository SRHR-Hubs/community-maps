import { useEffect } from "react";
import Image from "next/image";

// @refresh reset

export const useUndraw = (props = {}) => {
  useEffect(() => {
    (async () => {
      const Undraw = (await import("undraw-js")).default;
      new Undraw().init({
        defaultColor: "#6C63FF",
        version: "1.0.4",
        ...props,
      });
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const UndrawIcon = ({ name, alt, color, fallback }) => (
  <Image
    unoptimized
    alt={alt}
    data-ujs-name={name}
    data-ujs-color={color}
    data-ujs-fall-img={fallback}
  />
);
