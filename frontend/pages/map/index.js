import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import PageService from "../../services/PageService";
import ServiceService from "../../services/ServiceService";

import { renderToString } from "react-dom/server";
import GetOutQuick from "../../components/layout/get-out-quick/GetOutQuick";
import MapHeader from "../../components/map/layout/MapHeader";
import MapPopup from "../../components/map/MapPopup";

import { LngLat, LngLatBounds, Popup } from "mapbox-gl";
import dynamic from "next/dynamic";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import MapFilterContainer from "../../components/map/filter/MapFilterContainer";
import useSearch from "../../hooks/useSearch";
import useOmnisearch from "../../hooks/useOmnisearch";
import syncStateToQuery from "../../hooks/syncStatetoQuery";
import OmnisearchContainer from "../../components/map/search/OmnisearchContainer";
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

  const { geodata: geodataIndex } = useSearch();

  const [geodata, setGeodata] = useState([]);

  useEffect(() => {
    (async () => {
      setGeodata((await geodataIndex.getDocuments({ limit: 999 })).results);
    })();
  }, []);

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
            <MapboxGLMap initSource={toGeoJSON(geodata)} />
            {/* <OmnisearchContainer /> */}
            {/* <MapFilterContainer ready={tagsReady} /> */}
          </div>
        </div>
        <GetOutQuick />
      </PageLayout>
    </>
  );
};

const _MapHome = ({ slug, title, description, initQuery }) => {
  const { state, control } = useOmnisearch();
  const geoJSON = {};

  const [mapInstance, setMapInstance] = useState(null);
  const [tagsReady, setTagsReady] = useState(false);
  const { services: serviceIndex, tags: tagIndex, geodata } = useSearch();
  const [filterExpr, setFilterExpr] = useState(null);

  const [selectedService, setSelectedService] = useState(
    initQuery?.selected ?? null
  );

  syncStateToQuery(
    {
      selected: selectedService,
      tag: state.selectedTags,
    },
    {
      tag: (tags) => {
        return tags.map((tag) => tag.id);
      },
    }
  );

  ////// effects
  // TODO a lot of these should go somewhere else
  useEffect(() => {
    // hydrate tags

    if (!tagsReady) {
      (async () => {
        const data = await geodata.getDocuments({ limit: 999 });
        console.log(toGeoJSON(data.results));
        if (initQuery?.tag) {
          const tags = [].concat(initQuery.tag);
          const { hits: hydratedTags } = await tagIndex.search("", {
            filter: `id IN [${tags.join(", ")}]`,
          });
          control.setSelectedTags(hydratedTags);
        }
        setTagsReady(true);
      })();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!tagsReady) return;
    else if (state.selectedTags.length === 0) {
      control.setServiceHits(null);
      return;
    }
    (async () => {
      const groupedTags = state.selectedTags.reduce((acc, tag) => {
        const { translation_id } = tag.facet;
        return {
          ...acc,
          [translation_id]: (acc[translation_id] ?? []).concat(tag),
        };
      }, {});

      const filter = Object.entries(groupedTags).map(
        ([translation_id, tags]) =>
          tags && [
            `tags.${translation_id} IN [${tags
              .map((tag) => `'${tag.value}'`)
              .join(", ")}]`,
          ]
      );
      const { hits } = await serviceIndex.search("", {
        filter,
        limit: 999,
      });
      control.setServiceHits(hits);
    })();
  }, [state.selectedTags, tagsReady]);

  useLayoutEffect(() => {
    if (!mapInstance || !tagsReady) {
      return;
    }

    const layers = mapInstance
      .getStyle()
      .layers.filter((layer) => layer.source === "services");

    const slugs = state.serviceHits?.map((service) => service.slug);

    const mapFilterExpr =
      state.serviceHits !== null
        ? ["in", ["get", "slug"], ["literal", slugs]]
        : null;

    layers.forEach((layer) => {
      mapInstance.setFilter(layer.id, mapFilterExpr);
    });

    if (slugs && !slugs.includes(selectedService)) {
      setSelectedService(null);
    }

    setFilterExpr(mapFilterExpr);
  }, [mapInstance, state.serviceHits]);

  useEffect(() => {
    // TODO: doesn't work properly just yet
    return;
    // https://stackoverflow.com/a/35715102
    if (!mapInstance) {
      return;
    }

    const boundingBox = mapInstance
      .queryRenderedFeatures(undefined, {
        layers: ["service-points"],
      })
      .map(({ geometry: { coordinates } }) => {
        return LngLat.convert(coordinates);
      })
      .reduce((bounds, coords) => {
        return bounds.extend(coords);
      }, new LngLatBounds());

    if (!boundingBox.isEmpty()) {
      mapInstance.fitBounds(boundingBox, {
        maxZoom: 12,
        padding: 50,
      });
    }
  }, [mapInstance, state.serviceHits]);

  useEffect(() => {
    // control map popups
    if (!selectedService || !mapInstance) {
      return;
    }

    const feature = geoJSON.data.features.find(
      ({ properties: { slug } }) => slug === selectedService
    );

    const _popup = new Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(renderToString(<MapPopup {...feature.properties} />))
      .addTo(mapInstance);

    return () => {
      _popup.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService, mapInstance]);

  ////// handlers
  const handleClick = (feature) => {
    if (!feature) {
      setSelectedService(null);
      return;
    }
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
            <MapboxGLMap
              initSource={geoJSON}
              on={handlers}
              instance={{
                current: mapInstance,
                set: setMapInstance,
              }}
            />
            <OmnisearchContainer />
            <MapFilterContainer ready={tagsReady} />
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
