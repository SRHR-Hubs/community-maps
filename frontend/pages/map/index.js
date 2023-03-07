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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import syncStateToQuery from "../../hooks/syncStatetoQuery";
import fetcher from "../../hooks/fetch";
import MapFilterContainer from "../../components/map/filter/MapFilterContainer";
import useOmnisearchState from "../../hooks/control/useOmnisearchState";
import useSearch from "../../hooks/useSearch";
const MapboxGLMap = dynamic(() => import("../../components/map/Mapbox"), {
  loading: () => <div className="loading loading-lg"></div>,
  ssr: false,
});

const MapHome = ({ geoJSON, slug, title, description, initQuery }) => {
  const { state, control } = useOmnisearchState({
    init: {
      selectedTags: [].concat(initQuery?.tag ?? []),
    },
  });
  const [mapInstance, setMapInstance] = useState(null);
  const [tagsReady, setTagsReady] = useState(
    typeof state.selectedTags[0] !== "string"
  );
  const { services: serviceIndex, tags: tagIndex } = useSearch();

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
        const { hits: hydratedTags } = await tagIndex.search("", {
          filter: `id IN [${state.selectedTags.join(", ")}]`,
        });
        control.setSelectedTags(hydratedTags);
        setTagsReady(true);
      })();
    }
  }, [state.selectedTags, tagsReady]);

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
      const { hits } = await serviceIndex.search(state.searchTerm, {
        filter,
        limit: 999,
      });
      control.setServiceHits(hits);
    })();
  }, [state.searchTerm, state.selectedTags, tagsReady]);

  useLayoutEffect(() => {
    if (!mapInstance || !tagsReady) {
      return;
    }

    const layers = mapInstance
      .getStyle()
      .layers.filter((layer) => layer.source === "services");

    if (state.serviceHits === null) {
      layers.forEach((layer) => {
        mapInstance.setFilter(layer.id, null);
      });
      return;
    }

    const mapFilterExpr = [
      "in",
      ["get", "slug"],
      ["literal", state.serviceHits.map((service) => service.slug)],
    ];
    mapInstance
      .getStyle()
      .layers.filter((layer) => layer.source === "services")
      .forEach((layer) => {
        mapInstance.setFilter(layer.id, mapFilterExpr);
      });
    mapInstance.triggerRepaint();
  }, [mapInstance, state.serviceHits, tagsReady]);

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
            {tagsReady && (
              <MapFilterContainer
                selectedTags={state.selectedTags}
                handleSelect={control.setSelectedTags}
              />
            )}
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
