import mapboxGL from "mapbox-gl";
import isServer from "../../hooks/isServer";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

const Mapbox = ({ initSource, on }) => {
  // TODO: useMemo?
  const ref = useRef(null);

  useEffect(() => {
    const map = makeMap({
      ref,
      initSource,
      on
    });

    return () => map.remove();
  }, []);
  return <figure ref={ref} />;
};

export function makeMap({ ref, initSource, on }) {
  if (isServer() || !ref.current) {
    return;
  }
  const map = new mapboxGL.Map({
    container: ref.current,
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-79.4, 43.7],
    zoom: 5,
  });

  map.once("load", () => {
    // if (onMount) onMount();
    map.loadImage("/res/marker.png", (error, image) => {
      if (error) throw error;
      map.addImage("marker", image);

      map.addSource("services", {
        ...initSource,
        promoteId: "slug",
        //   cluster: true,
      });
      map.addLayer({
        id: "service-map",
        source: "services",
        type: "symbol",
        layout: {
          "icon-image": "marker",
          "icon-size": .5,
          // "icon-allow-overlap": true,
          "icon-anchor": "bottom",
          "icon-ignore-placement": true,
        },
      });
    });
  });

  map.on("click", (event) => {
    const [feature] = map.queryRenderedFeatures(event.point, {
      layers: ["service-map"],
    });
    if (feature && on?.click) {
        on.click(feature, map)
    }
  });

  return map;

  // return () => {
  //   map.remove();
  //   if (onUnmount) {
  //     onMount();
  //   }
  // };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

export default Mapbox;
