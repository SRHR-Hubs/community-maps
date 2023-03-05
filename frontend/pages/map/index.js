import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import PageService from "../../services/PageService";
import ServiceService from "../../services/ServiceService";

import { renderToString } from "react-dom/server";
import GetOutQuick from "../../components/layout/get-out-quick/GetOutQuick";
import MapHeader from "../../components/map/layout/MapHeader";
import MapPopup from "../../components/map/MapPopup";

import { Popup } from "mapbox-gl";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import syncStateToQuery from "../../hooks/syncStatetoQuery";
import fetcher from "../../hooks/fetch";
import MapFilterContainer from "../../components/map/filter/MapFilterContainer";
import useOmnisearchState from "../../hooks/control/useOmnisearchState";
const MapboxGLMap = dynamic(() => import("../../components/map/Mapbox"), {
  loading: () => <div className="loading loading-lg"></div>,
  ssr: false,
});

const MapHome = ({ geoJSON, slug, title, description, initQuery }) => {
  const { state, control } = useOmnisearchState({ initQuery });

  const [selectedService, setSelectedService] = useState(
    initQuery?.selected ?? null
  );
  syncStateToQuery({ selected: selectedService });

  // TODO: hydrate selected service popup
  // (requires access to map instance)

  const handleClick = (feature, map) => {
    if (!feature) {
      setSelectedService(null);
      return;
    }
    const _popup = new Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(renderToString(<MapPopup {...feature.properties} />))
      .addTo(map);
    setSelectedService(feature.properties.slug);
  };

  const seoInfo = {
    title,
    description,
    canonical: slug,
  };

  const handlers = {
    click: handleClick,
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
        <div className="map-overlay">
          <MapHeader />
          <div className="map-viewport">
            <MapboxGLMap initSource={geoJSON} on={handlers} />
            <MapFilterContainer
              selectedTags={state.selectedTags}
              handleSelect={control.setSelectedTags}
            />
          </div>
        </div>
        <GetOutQuick />
      </PageLayout>
    </>
  );
};

export default MapHome;

export async function getServerSideProps({ locale, query: initQuery }) {
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
      initQuery,
    },
  };
}
