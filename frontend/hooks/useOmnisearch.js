import { useContext, useReducer } from "react";
import useSearch from "./useSearch";
import { OmnisearchContext } from "../context/providers/OmnisearchProvider";

const useOmnisearch = () => useContext(OmnisearchContext);

const _useOmnisearch = ({ init }) => {
  const { services, facets, tags } = useSearch();

  const reducer = (state, action) => {

  };

  const load = (initArg) => ({
    searchTerm: "",
    serviceHits: null,
    tagHits: null,
    selectedTags: [],
    ...initArg,
  });

  return useReducer(reducer, init, load);
};

export default useOmnisearch;
