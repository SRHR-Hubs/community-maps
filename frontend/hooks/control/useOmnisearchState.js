import { useState } from "react";

const useOmnisearchState = ({ init }) => {
  const [searchTerm, setSearchTerm] = useState(init?.searchTerm ?? "");
  const [serviceHits, setServiceHits] = useState(null);
  const [tagHits, setTagHits] = useState(null);
  const [selectedTags, setSelectedTags] = useState(init?.selectedTags ?? []);

  return {
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
};

export default useOmnisearchState;
