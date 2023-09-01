import mapboxGL from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

export function makeMap({ container, initSource, on }) {
  const map = new mapboxGL.Map({
    container,
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    style: "mapbox://styles/mapbox/streets-v11?optimize=true",
    // glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    center: [-79.4, 43.7],
    zoom: 5,
  });

  map.once("load", () => {
    // SEE: https://github.com/mapbox/mapbox-gl-js/issues/10129
    const uri = `${process.env.NEXT_PUBLIC_HOST}/res/marker.png`;
    map.loadImage(uri, (error, image) => {
      if (error) throw error;
      map.addImage("marker", image);
    });

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

    map.addLayer(
      {
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
      },
      "service-points"
    );
  });

  map.on("click", (event) => {
    const [feature] = map.queryRenderedFeatures(event.point, {
      layers: ["service-points"],
    });
    if (feature) {
      on?.click?.(feature, map);
    }
  });
  return map;
}

const MapboxGLMap = ({ initSource, mapRef, on = {} }) => {
  const containerRef = useRef(null);

  const unmount = () => {
    console.log("Unmounting map");
    mapRef.current.remove();
  };

  useEffect(() => {
    mapRef.current = makeMap({
      container: containerRef.current,
      initSource,
      on,
    });

    window.addEventListener("beforeunload", unmount);

    return () => {
      window.removeEventListener("beforeunload", unmount);
    };
  }, [initSource, mapRef]);

  return <figure className="mapboxgl-map" ref={containerRef} />;
};

export default MapboxGLMap;
