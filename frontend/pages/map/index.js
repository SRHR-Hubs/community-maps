import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import PageService from "../../services/PageService";

import GetOutQuick from "../../components/layout/get-out-quick/GetOutQuick";
import MapHeader from "../../components/map/layout/MapHeader";

import dynamic from "next/dynamic";
import { useState } from "react";
import MapFilterContainer from "../../components/map/filter/MapFilterContainer";
import syncStateToQuery from "../../hooks/syncStatetoQuery";
import useOmnisearch from "../../hooks/useOmnisearch";
const MapboxGLMap = dynamic(() => import("../../components/map/Mapbox"), {
  loading: () => <div className="loading loading-lg"></div>,
  ssr: false,
});

const toGeoJSON = (data) => {
  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: data.map(({ _geo, ...properties }) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [_geo.lng, _geo.lat],
        },
        properties,
      })),
    },
  };
};

const MapHome = ({ slug, title, description, initQuery }) => {
  const seoInfo = {
    title,
    description,
    canonical: slug,
  };

  const [selectedServiceID, setSelectedServiceID] = useState();

  const {
    data,
    state: { selectedService, selectedTags },
  } = useOmnisearch();

  syncStateToQuery(
    {
      selected: selectedServiceID,
      tag: selectedTags,
    },
    {
      tag: (tags) => tags.map((tag) => tag.id),
    }
  );

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
            <MapboxGLMap initSource={toGeoJSON(data.geodata)} />
            {/* <OmnisearchContainer /> */}
            <MapFilterContainer />
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

  return {
    props: {
      ...pageProps,
      ...(await useServerI18n(locale)),
      initQuery,
    },
  };
}
