import { createContext, useState } from "react";
import syncStateToQuery from "../../hooks/syncStatetoQuery";

export const OmnisearchContext = createContext({});

const OmnisearchProvider = ({ init, children }) => {
  const [searchTerm, setSearchTerm] = useState(init?.searchTerm ?? "");
  const [serviceHits, setServiceHits] = useState(null);
  const [tagHits, setTagHits] = useState(null);
  const [selectedTags, setSelectedTags] = useState(init?.selectedTags ?? []);

  syncStateToQuery(
    {
      tag: selectedTags,
    },
    {
      tag: (tags) => {
        return tags.map((tag) => tag.id);
      },
    }
  );

  const value = {
    state: {
      searchTerm,
      serviceHits,
      tagHits,
      selectedTags,
    },
    control: {
      setSearchTerm,
      setServiceHits,
      setTagHits,
      setSelectedTags,
    },
  };

  return (
    <OmnisearchContext.Provider value={value}>
      {children}
    </OmnisearchContext.Provider>
  );
};
export default OmnisearchProvider;
