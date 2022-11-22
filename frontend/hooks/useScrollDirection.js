import { useEffect, useRef, useState } from "react";

export const UP = 0;
export const DOWN = 1;

// Heavily inspired by:
// https://stackoverflow.com/a/57089881

const useScrollDirection = () => {
  const prevScrollY = useRef(0);
  const [direction, setDirection] = useState(DOWN);

  const handleScroll = () => {
    const currScrollY = window.scrollY;

    const currDirection = currScrollY < prevScrollY.current ? UP : DOWN;

    if (currDirection !== direction) {
      setDirection(currDirection);
    }

    prevScrollY.current = currScrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, [direction]);

  return direction;
};

export default useScrollDirection;
