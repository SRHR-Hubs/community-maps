import { useState } from "react";

const useOmnisearchState = ({ init }) => {
  const [searchTerm, setSearchTerm] = useState(init?.searchTerm ?? "");
  const [serviceHits, setServiceHits] = useState(null);
  const [tagHits, setTagHits] = useState(null);

  return {
    state: {
      searchTerm,
      serviceHits,
      tagHits,
    },
    control: {
      setSearchTerm,
      setServiceHits,
      setTagHits,
    },
  };
};

export default useOmnisearchState;
