import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import PageService from "../../services/PageService";

import GetOutQuick from "../../components/layout/get-out-quick/GetOutQuick";
import MapHeader from "../../components/map/layout/MapHeader";
import OmnisearchContainer from "../../components/map/search/OmnisearchContainer";
import PopupContainer from "../../components/map/popup/PopupContainer";

import dynamic from "next/dynamic";
import { useMemo, useReducer, useRef, useState } from "react";
import MapFilterContainer from "../../components/map/filter/MapFilterContainer";
import syncStateToQuery from "../../hooks/syncStatetoQuery";
import useOmnisearch from "../../hooks/useOmnisearch";
const MapboxGLMap = dynamic(() => import("../../components/map/Mapbox"), {
  loading: () => <div className="loading loading-lg"></div>,
  ssr: false,
});

const MapHome = ({ slug, title, description, initQuery }) => {
  const seoInfo = {
    title,
    description,
    canonical: slug,
  };

  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState();

  const {
    data,
    state: { selectedTags },
  } = useOmnisearch();

  syncStateToQuery(
    {
      selected: selectedFeature,
      tag: selectedTags,
    },
    {
      selected: (feature) => feature?.properties?.slug,
      tag: (tags) => tags.map((tag) => tag.id),
    }
  );

  const selectFeature = (feature) => {
    if (!feature) {
      setSelectedFeature(null);
      return;
    }
    // not all hits have the same shape,
    // so to make life easier, search
    // for the associated function from
    // data.geodata
    else if (!feature.geometry) {
      const geoFeature = data.geodata.data.features.find(
        (item) => item.properties.slug === feature.slug
      );
      setSelectedFeature(geoFeature);
      return;
    }
    setSelectedFeature(feature);
  };

  // TODO:
  // Hook filters, etc. back up to markers,
  // probably using FilterExpr

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
            <MapboxGLMap
              initSource={data.geodata}
              on={{ click: selectFeature }}
              mapRef={mapRef}
            />
            <OmnisearchContainer
              on={{
                serviceSelect: (feat) => () => selectFeature(feat),
              }}
            />
            <MapFilterContainer />
            <PopupContainer mapRef={mapRef} feature={selectedFeature} />
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
