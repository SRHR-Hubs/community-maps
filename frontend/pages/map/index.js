import PageLayout from "../../components/layout/page/PageLayout";
import useServerI18n from "../../hooks/useServerI18n";
import { SEO } from "../../lib/seo";
import PageService from "../../services/PageService";
import dynamic from "next/dynamic";
import ServiceService from "../../services/ServiceService";

import mapboxGL  from "mapbox-gl";
import {renderToString} from 'react-dom/server'
import MapPopup from "./Popup";

const Mapbox = dynamic(() => import("../../components/map/Mapbox"), {
  ssr: false,
  loading: () => "TODO Loading...",
});

const MapHome = ({ geoJSON }) => {
  const handleClick = (feature, map) => {
    const _popup = new mapboxGL.Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(
        renderToString(<MapPopup {...feature.properties}/>)
      )
      .addTo(map);
  };
  return (
    <>
      <SEO />
      <PageLayout
        renderHeader={false}
        renderContactSection={false}
        renderFooter={false}
      >
        <Mapbox
          initSource={geoJSON}
          on={{
            click: handleClick,
          }}
        />
      </PageLayout>
    </>
  );
};

export default MapHome;

export async function getStaticProps({ locale }) {
  const pageProps = {}; // await PageService.getPageProps("map")

  const geoJSON = await ServiceService.getGeoJSON();

  return {
    props: {
      geoJSON,
      ...pageProps,
      ...(await useServerI18n(locale)),
    },
    revalidate: 10,
  };
}
