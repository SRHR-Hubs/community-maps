import { useState } from "react";
import Omnisearch from "../../search/Omnisearch";

const OmnisearchContainer = ({ on }) => {
  const [show, toggleShow] = useState(false);

  const handleToggleShow = (e) => {
    toggleShow(!show);
  };

  const icon = show ? "icon-arrow-left" : "icon-search";

  return (
    <div id="omnisearch-container" data-show={show}>
      <div className="show-toggle" onClick={handleToggleShow}>
        <i className={"icon " + icon} />
      </div>
      <Omnisearch on={on} />
    </div>
  );
};

export default OmnisearchContainer;
