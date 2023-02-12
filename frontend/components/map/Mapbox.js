import mapboxGL from "mapbox-gl";
import isServer from "../../hooks/isServer";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

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
        id: "service-points",
        source: "services",
        type: "symbol",
        layout: {
          "icon-image": "marker",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
          "icon-anchor": "bottom",
          "icon-ignore-placement": true,
        },
      });
      map.addLayer({
        id: "service-text",
        source: "services",
        type: "symbol",
        minzoom: 12,
        layout: {
          "text-field": ["get", "name"],
          "text-justify": "left",
          "text-anchor": "left",
          "text-offset": [1, 0],
        },
      });
    });
  });

  map.on("click", (event) => {
    const [feature] = map.queryRenderedFeatures(event.point, {
      layers: ["service-points"],
    });
    if (feature && on?.click) {
      on.click(feature, map);
    }
  });

  return map;
}

const Mapbox = ({ ref }) => {
  // TODO: useMemo?
  
  return <figure ref={ref} />;
};
export default Mapbox;
