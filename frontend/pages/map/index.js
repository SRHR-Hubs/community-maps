import PageLayout from "../../components/layout/page/PageLayout";
// import { makeMap } from "../../components/map/Mapbox";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import PageService from "../../services/PageService";
import ServiceService from "../../services/ServiceService";

import { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import GetOutQuick from "../../components/layout/get-out-quick/GetOutQuick";
import MapFilterContainer from "../../components/map/filter/MapFilterContainer";
import MapHeader from "../../components/map/layout/MapHeader";
import MapPopup from "../../components/map/MapPopup";

import dynamic from "next/dynamic";
import { makeMap } from "../../components/map/Mapbox";

const MapHome = ({ geoJSON, slug, title, description }) => {
  const ref = useRef(null);
  let map;
  let Popup;

  const handleClick = (feature, map) => {
    const _popup = new Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(renderToString(<MapPopup {...feature.properties} />))
      .addTo(map);
  };

  useEffect(() => {
    (async () => {
      const mapbox = await import("mapbox-gl");
      Popup = mapbox.Popup;
    })();

    map = makeMap({
      ref,
      initSource: geoJSON,
      on: {
        click: handleClick,
      },
    });

    return () => map.remove();
  }, []);

  const seoInfo = {
    title,
    description,
    canonical: slug,
  };

  return (
    <>
      <SEO {...seoInfo} />
      <PageLayout
        renderHeader={false}
        renderContactSection={false}
        renderFooter={false}
        id="community-map"
      >
        <MapHeader />
        <div className="map-overlay">
          <figure ref={ref} />
          <MapFilterContainer />
        </div>
        <GetOutQuick />
      </PageLayout>
    </>
  );
};

export default MapHome;

export async function getServerSideProps({ locale }) {
  const pageProps = await PageService.getPageProps("map");
  const query = {
    published: true,
  };

  const geoJSON = await ServiceService.getGeoJSON({ query });

  return {
    props: {
      geoJSON,
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
  };
}
