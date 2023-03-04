import { Triangle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Trans } from "react-i18next";
import useSearch from "../../../hooks/useSearch";

const MapFilterChip = ({ id: translation_id, name }) => (
  <span className="filter-chip chip">
    {name} <i className="icon icon-arrow-down" />
  </span>
);

const MapFilterContainer = ({ facets, searchValue = "" }) => {
  const [show, setShow] = useState(true);
  // const [selectedFacets, setSelected] = useState({});
  // const [hits, setHits] = useState([]);
  // let totalDocuments = 0;

  // Whenever the selections are updated
  // useEffect(() => {
  //   (async () => {
  //     const filters = [];
  //     Object.entries(selectedFacets).forEach(([translation_id, selections]) => {
  //       const filter = [];
  //       selections.forEach((value) => {
  //         filter.push(`tags.${translation_id} = ${value}`);
  //       });
  //       filters.push(filter);
  //     });
  //     const { hits } = await index.search(searchValue, {
  //       filter: filters,
  //       limit: totalDocuments,
  //     });
  //     setHits(hits);
  //   })();
  // }, [selectedFacets]);

  // TODO: not very SOLID of me to put this here, but it's 3am.
  // It'll also probably perform poorly.
  //   const makeMapFilter = (tags)

  const handleToggleShow = (e) => {
    setShow(!show);
  };

  return (
    <div id="filter-container" data-show={show} onClick={handleToggleShow}>
      <div className="show-toggle">
        <Trans i18nKey="layout.map.filter-menu.toggle">Filter results</Trans>
        <i className="icon icon-arrow-up" />
      </div>
      {facets.map(MapFilterChip)}
    </div>
  );
};

export default MapFilterContainer;
