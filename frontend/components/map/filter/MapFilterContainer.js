import { Triangle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Trans } from "react-i18next";
import syncStateToQuery from "../../../hooks/syncStatetoQuery";
import useSearch from "../../../hooks/useSearch";

const MapFilterChip = ({ filter: { name }, ...props }) => (
  <span
    className={"filter-chip chip " + (props["data-badge"] && "badge")}
    role="menuitem"
    tabIndex={0}
    {...props}
  >
    {name} <i className="icon icon-arrow-down" />
  </span>
);

const MapFilterModal = ({ filter, onSelect, handleClose }) => {
  if (!filter) return null;
  const { name, id: translation_id, value: values } = filter;
  return (
    <div className="modal active" id="filter-modal">
      <a className="modal-overlay" aria-label="Close" onClick={handleClose}></a>
      <div className="modal-container">
        <div className="modal-header">
          <a
            className="btn btn-clear float-right"
            aria-label="Close"
            onClick={handleClose}
          ></a>
          <div className="modal-title h3">{name}</div>
        </div>
        <div className="modal-body">
          <div className="content">
            <div className="form-group form-horizontal d-flex">
              {values.map((value) => (
                <div key={value} className="col-6 col-sm-12 d-flex d-centered">
                  <label className="form-checkbox form-inline">
                    <input
                      type="checkbox"
                      onChange={onSelect(translation_id, value)}
                    />
                    <i className="form-icon"></i> {value}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
};

const MapFilterContainer = ({ selectedTags, handleSelect }) => {
  const [show, setShow] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [facets, setFacets] = useState([]);

  useEffect(() => {
    (async () => {
      const { facets: facetIndex } = useSearch();
      const { results } = await facetIndex.getDocuments();
      setFacets(results);
    })();
  }, []);

  syncStateToQuery({
    "filter-modal": selectedFilter?.id,
  });

  const handleToggleShow = (e) => {
    setShow(!show);
  };

  const handleCloseModal = () => {
    setSelectedFilter(null);
  };

  const handleFilterSelect = (filter) => () => {
    setSelectedFilter(filter);
  };

  const handleFilterValueSelect =
    (translation_id, value) =>
    ({ target }) => {
      const filterString = `tags.${translation_id} = '${value}'`;
      const newSelectedTags = selectedTags.filter(
        (tag) => tag !== filterString
      );
      if (target.checked) {
        handleSelect(newSelectedTags.concat(filterString));
      } else {
        handleSelect(newSelectedTags);
      }
    };

  return (
    <>
      <MapFilterModal
        filter={selectedFilter}
        handleClose={handleCloseModal}
        onSelect={handleFilterValueSelect}
      />
      <div id="filter-container" role="menu" data-show={show}>
        <div
          className={"show-toggle " + (selectedTags?.length && "badge")}
          onClick={handleToggleShow}
          data-badge={selectedTags?.length}
        >
          <Trans i18nKey="layout.map.filter-menu.toggle">Filter results</Trans>
          <i className="icon icon-arrow-up" />
        </div>
        {facets ? (
          facets.map((filter) => (
            <MapFilterChip
              key={filter.id}
              filter={filter}
              onClick={handleFilterSelect(filter)}
              data-badge={
                selectedTags.filter((stmt) =>
                  stmt.startsWith(`tags.${filter.id}`)
                ).length
              }
            />
          ))
        ) : (
          <p>loading</p>
        )}
      </div>
    </>
  );
};

export default MapFilterContainer;
