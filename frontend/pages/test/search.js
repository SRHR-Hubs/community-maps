import { useEffect, useState } from "react";
import PageLayout from "../../components/layout/page/PageLayout";
import Omnisearch from "../../components/search/Omnisearch";
import isProduction from "../../hooks/isProduction";
import syncStateToQuery from "../../hooks/syncStatetoQuery";
import useOmnisearch from "../../hooks/useOmnisearch";
import useSearch from "../../hooks/useSearch";
import useServerI18n from "../../hooks/useServerI18n";

const SearchTest = ({ initQuery }) => {
  const { state, control } = useOmnisearch();
  syncStateToQuery(
    // NOTE: to preserve any other query params, add to below:
    // {  ...initQuery },
    { q: state.searchTerm, tag: state.selectedTags },
    { tag: (tags) => tags.map((tag) => tag.id) }
  );

  const { services } = useSearch();

  useEffect(() => {
    if (
      state.selectedTags.length < 1 ||
      typeof state.selectedTags[0] === "string"
    ) {
      return;
    }
    (async () => {
      const filter = state.selectedTags
        .map(({ facet, value }) => `tags.${facet.translation_id} = '${value}'`)
        .join(" AND ");
      const { hits, ...etc } = await services.search(state.searchTerm, {
        filter,
      });
      control.setServiceHits(hits.map((hit) => ({ _formatted: hit })));
    })();
  }, [state.searchTerm, state.selectedTags]);

  return (
    <PageLayout>
      <div
        style={{
          height: "1500px",
        }}
      >
        <Omnisearch />
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
