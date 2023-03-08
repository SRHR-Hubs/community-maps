import { useState } from "react";
import { Trans } from "next-i18next";
import Omnisearch from "../../search/Omnisearch";

const OmnisearchContainer = () => {
  const [show, toggleShow] = useState(true);

  const handleToggleShow = (e) => {
    toggleShow(!show);
  };

  const icon = show ? "icon-arrow-left" : "icon-search";

  return (
    <div id="omnisearch-container" data-show={show}>
      <div className="show-toggle" onClick={handleToggleShow}>
        <i className={"icon " + icon} />
      </div>
      <Omnisearch />
    </div>
  );
};

export default OmnisearchContainer;
