import PageLayout from "../../components/layout/page/PageLayout";
import { makeMap } from "../../components/map/Mapbox";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import PageService from "../../services/PageService";
import ServiceService from "../../services/ServiceService";

import mapboxGL from "mapbox-gl";
import { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import GetOutQuick from "../../components/layout/get-out-quick/GetOutQuick";
import MapFilterContainer from "../../components/map/filter/MapFilterContainer";
import MapHeader from "../../components/map/layout/MapHeader";
import MapPopup from "../../components/map/MapPopup";

const MapHome = ({ geoJSON, slug, title, description }) => {
  const ref = useRef(null);
  let map;

  const handleClick = (feature, map) => {
    const _popup = new mapboxGL.Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(renderToString(<MapPopup {...feature.properties} />))
      .addTo(map);
  };

  useEffect(() => {
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
        <div className="columns col-gapless">
          <div className="column col-auto hide-sm">
            <MapHeader />
          </div>
          <div className="column col-auto">
            <figure ref={ref} />
            <MapFilterContainer />
          </div>
        </div>
        <GetOutQuick />
      </PageLayout>
    </>
  );
};

export default MapHome;

export async function getServerSideProps({ locale }) {
  const pageProps = await PageService.getPageProps("map");

  const geoJSON = await ServiceService.getGeoJSON();

  return {
    props: {
      geoJSON,
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
  };
}
