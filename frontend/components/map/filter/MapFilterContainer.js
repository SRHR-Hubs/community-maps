import { useState, useEffect } from "react";
import { index } from "../../../lib/meilisearch";

const MapFilterContainer = ({ facets, searchValue = "" }) => {
  const [selectedFacets, setSelected] = useState({});
  const [hits, setHits] = useState([]);
  let totalDocuments = 0;

  // Get the total number of possible documents.
  // I'm sure there's a better way to do this.
  useEffect(() => {
    (async () => {
      totalDocuments = (await index.getDocuments()).total;
    })();
  }, []);

  // Whenever the selections are updated
  useEffect(() => {
    (async () => {
      const filters = [];
      Object.entries(selectedFacets).forEach(([translation_id, selections]) => {
        const filter = [];
        selections.forEach((value) => {
          filter.push(`tags.${translation_id} = ${value}`);
        });
        filters.push(filter);
      });
      const { hits } = await index.search(searchValue, {
        filter: filters,
        limit: totalDocuments,
      });
      setHits(hits);
    })();
  }, [selectedFacets]);

  // TODO: not very SOLID of me to put this here, but it's 3am.
  // It'll also probably perform poorly.
//   const makeMapFilter = (tags)

  return <div className="filter-container"></div>;
};

export default MapFilterContainer;
