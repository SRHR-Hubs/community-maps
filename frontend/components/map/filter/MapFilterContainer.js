import clsx from "clsx";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import syncStateToQuery from "../../../hooks/syncStatetoQuery";
import useOmnisearch from "../../../hooks/useOmnisearch";

const MapFilterChip = ({ filter: { name }, ...props }) => (
  <span
    className={clsx("filter-chip chip", { badge: props["data-badge"] })}
    role="menuitem"
    tabIndex={0}
    {...props}
  >
    {name} <i className="icon icon-arrow-down" />
  </span>
);

const MapFilterModal = ({ facet, handleClose }) => {
  const {
    state: { selectedTags },
    control: { setSelectedTags },
    data: { tags },
  } = useOmnisearch();

  if (facet === null) return null;

  const handleChange =
    (tag) =>
    ({ target }) =>
      target.checked
        ? setSelectedTags(selectedTags.concat(tag))
        : setSelectedTags(selectedTags.filter(({ id }) => id !== tag.id));

  const tagValues = tags
    .filter((tag) => tag.facet.translation_id === facet.id)
    .sort((a, b) => a.value.localeCompare(b.value));

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
          <div className="modal-title h3">{facet.name}</div>
        </div>
        <div className="modal-body">
          <div className="content">
            <div className="form-group form-horizontal d-flex">
              {tagValues.map((tag) => (
                <div key={tag.id} className="col-6 col-sm-12 d-flex d-centered">
                  <label className="form-checkbox form-inline">
                    <input
                      type="checkbox"
                      onChange={handleChange(tag)}
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

const MapFilterContainer = ({ selectedTagIDs, selectedServiceID }) => {
  const [show, setShow] = useState(true);
  const [selectedFacet, setSelectedFacet] = useState(null);
  const {
    state: { selectedTags },
    control,
    data: { tags, facets },
  } = useOmnisearch();

  syncStateToQuery({
    "filter-modal": selectedFacet?.id,
  });

  const handleToggleShow = (e) => {
    setShow(!show);
  };

  const handleCloseModal = () => {
    setSelectedFacet(null);
  };

  const handleFacetSelect = (facet) => () => {
    setSelectedFacet(facet);
  };

  const handleFilterValueSelect =
    (tag) =>
    ({ target }) => {
      if (target.checked) {
        control.setSelectedTags(selectedTags.concat(tag));
      } else {
        control.setSelectedTags(selectedTags.filter(({ id }) => id !== tag.id));
      }
    };

  const facetsFiltered = new Set(selectedTags.map((tag) => tag.id)).size;

  const facetedTags = useMemo(
    () =>
      tags.reduce(
        (acc, { facet, ...tag }) => ({
          ...acc,
          [facet.translation_id]: (acc[facet.translation_id] ?? []).concat(tag),
        }),
        {}
      ),
    [tags]
  );

  return (
    <>
      <MapFilterModal
        facet={selectedFacet}
        handleClose={handleCloseModal}
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
              onClick={handleFacetSelect(filter)}
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
