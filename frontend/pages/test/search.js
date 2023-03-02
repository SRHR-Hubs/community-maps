import { useEffect, useState } from "react";
import PageLayout from "../../components/layout/page/PageLayout";
import Omnisearch from "../../components/search/Omnisearch";
import useOmnisearchState from "../../hooks/control/useOmnisearchState";
import isProduction from "../../hooks/isProduction";
import syncStateToQuery from "../../hooks/syncStatetoQuery";
import useServerI18n from "../../hooks/useServerI18n";

const SearchTest = ({ initQuery }) => {
  const controller = useOmnisearchState({
    init: {
      searchTerm: initQuery?.q,
    },
  });
  const { searchTerm } = controller.state;
//   const [hits, setHits] = useState(null);
  syncStateToQuery(
    // NOTE: to preserve any other query params, replace below with:
    // { searchTerm, ...initQuery },
    { searchTerm },
    {
      searchTerm: "q",
    }
  );

  return (
    <PageLayout>
      <div
        style={{
          height: "1500px",
        }}
      >
        <Omnisearch
          controller={controller}
        //   on={{
        //     search: setHits,
        //   }}
        />
      </div>
    </PageLayout>
  );
};

export default SearchTest;

export async function getServerSideProps({ locale, query: initQuery }) {
  if (isProduction()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await useServerI18n(locale)),
      initQuery,
    },
  };
}
