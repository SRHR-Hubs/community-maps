import { createContext, useState } from "react";

export const OmnisearchContext = createContext({});

const OmnisearchProvider = ({ init, children }) => {
  const [searchTerm, setSearchTerm] = useState(init?.searchTerm ?? "");
  const [serviceHits, setServiceHits] = useState(null);
  const [tagHits, setTagHits] = useState(null);
  const [selectedTags, setSelectedTags] = useState(init?.selectedTags ?? []);

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

  console.log("providder", children);

  return (
    <OmnisearchContext.Provider value={value}>
      {children}
    </OmnisearchContext.Provider>
  );
};
export default OmnisearchProvider;
