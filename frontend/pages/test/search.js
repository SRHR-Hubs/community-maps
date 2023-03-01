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
  const [hits, setHits] = useState(null);
  syncStateToQuery(
    { searchTerm },
    {
      searchTerm: "q",
    }
  );

  return (
    <PageLayout>
      <Omnisearch
        controller={controller}
        on={{
          search: setHits,
        }}
      />
    </PageLayout>
  );
};

export default SearchTest;

export async function getServerSideProps({ locale, query }) {
  if (isProduction()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await useServerI18n(locale)),
      ...(query && { initQuery: query }),
    },
  };
}
