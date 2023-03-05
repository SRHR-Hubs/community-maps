import { useState, useEffect } from "react";
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

const MapFilterModal = ({ filter, onSelect, handleClose, selectedTags }) => {
  const { tags: tagIndex } = useSearch();
  const [tagValues, setTagValues] = useState(null);
  useEffect(() => {
    if (filter) {
      (async () => {
        const { hits } = await tagIndex.search("", {
          filter: `facet.translation_id = ${filter.id}`,
          limit: 999,
          sort: ["value:asc"],
        });
        setTagValues(hits);
      })();
    } else {
      setTagValues(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  if (!filter) return <p>loading</p>;

  const { name } = filter;

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
              {tagValues?.map((tag) => (
                <div
                  key={tag.value}
                  className="col-6 col-sm-12 d-flex d-centered"
                >
                  <label className="form-checkbox form-inline">
                    <input
                      type="checkbox"
                      onChange={onSelect(tag)}
                      checked={selectedTags.some(
                        (selected) => selected.id === tag.id
                      )}
                    />
                    <i className="form-icon"></i> {tag.value}
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
    (tag) =>
    ({ target }) => {
      if (target.checked) {
        handleSelect(selectedTags.concat(tag));
      } else {
        handleSelect(selectedTags.filter(({ id }) => id !== tag.id));
      }
    };

  const facetsFiltered = new Set(selectedTags.map((tag) => tag.id)).size;

  return (
    <>
      <MapFilterModal
        filter={selectedFilter}
        handleClose={handleCloseModal}
        onSelect={handleFilterValueSelect}
        selectedTags={selectedTags}
      />
      <div id="filter-container" role="menu" data-show={show}>
        <div
          className={"show-toggle " + (facetsFiltered && "badge")}
          onClick={handleToggleShow}
          data-badge={facetsFiltered}
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
                selectedTags.filter(
                  (tag) => tag.facet.translation_id === filter.id
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
