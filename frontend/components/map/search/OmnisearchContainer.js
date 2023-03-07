import { useState } from "react";
import useOmnisearch from "../../../hooks/useOmnisearch";
import Omnisearch from "../../search/Omnisearch";

const OmnisearchContainer = () => {
  const { state, control } = useOmnisearch();
  const [show, toggleShow] = useState(true);

  return (
    <div id="omnisearch-container" data-show={show}>
      <Omnisearch />
    </div>
  );
};

export default OmnisearchContainer;
