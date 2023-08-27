import { useEffect, useRef } from "react";
import MapPopup from "./MapPopup";
import { Popup } from "mapbox-gl";

const PopupContainer = ({ feature, mapRef }) => {
  const popupRef = useRef();

  useEffect(() => {
    if (!mapRef.current || !feature) {
      return;
    }

    const popup = new Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setDOMContent(popupRef.current)
      .addTo(mapRef.current);

    return () => {
      popup.remove();
    };
  }, [feature, mapRef]);

  return (
    <div className="d-none">
      <MapPopup ref={popupRef} feature={feature?.properties} />
    </div>
  );
};

export default PopupContainer;
