import { createContext, useEffect, useMemo, useState } from "react";
import useSearch from "../../hooks/useSearch";
import toGeoJSON from "../../hooks/toGeoJson";

export const OmnisearchContext = createContext({});

const OmnisearchProvider = ({ init, children }) => {
  const search = useSearch();

  const [searchTerm, setSearchTerm] = useState(init?.searchTerm ?? "");
  const [serviceHits, setServiceHits] = useState([]);
  const [facetDistribution, setFacetDistribution] = useState({});
  const [selectedTags, setSelectedTags] = useState(init?.selectedTags ?? []);

  const [data, setData] = useState({
    services: [],
    facets: [],
    tags: [],
    geodata: { data: { features: [] } },
  });

  const tagGroups = useMemo(
    () =>
      selectedTags.reduce(
        (acc, { facet, ...tag }) => ({
          ...acc,
          [facet.translation_id]: (acc[facet.translation_id] ?? []).concat(tag),
        }),
        {}
      ),
    [selectedTags]
  );

  const commonArgs = { limit: 999 };

  // load initial data
  useEffect(() => {
    (async () => {
      setData({
        services: (await search.services.getDocuments({ ...commonArgs }))
          .results,
        facets: (await search.facets.getDocuments({ ...commonArgs })).results,
        tags: (await search.tags.getDocuments({ ...commonArgs })).results,
        geodata: toGeoJSON(
          (await search.geodata.getDocuments({ ...commonArgs })).results
        ),
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update state.serviceHits and facetDistribution
  // when searchTerm or selectedTags update
  useEffect(() => {
    (async () => {
      if (searchTerm.length === 0 && selectedTags.length === 0) {
        return setServiceHits(data.services);
      }
      const filter = Object.entries(tagGroups).map(([facet_id, tags]) => {
        const values = tags.map((tag) => `'${tag.value}'`).join(", ");
        return [`tags.${facet_id} IN [${values}]`];
      });

      const results = await search.services.search(searchTerm, {
        ...commonArgs,
        filter,
        facets: ["tags"],
      });

      setServiceHits(results.hits);

      // results.facetDistribution annoyingly contains a
      // bunch of non-facet keys: an empty `tags` key
      // and a huge `tags.id` key. Remove them
      const facetDistribution = Object.entries(
        results.facetDistribution
      ).reduce(
        (acc, [key, distribution]) =>
          !key.startsWith("tags.") || key.endsWith("id")
            ? acc
            : { ...acc, [key.slice(5)]: distribution },
        {}
      );

      setFacetDistribution(facetDistribution);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedTags]);

  const value = {
    state: {
      searchTerm,
      serviceHits,
      selectedTags,
      tagGroups,
      facetDistribution,
    },
    control: {
      setSearchTerm,
      setServiceHits,
      setSelectedTags,
    },
    data,
  };

  return (
    <OmnisearchContext.Provider value={value}>
      {children}
    </OmnisearchContext.Provider>
  );
};
export default OmnisearchProvider;
