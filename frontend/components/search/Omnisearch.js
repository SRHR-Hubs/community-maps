import { useEffect, useState } from "react";
import useSearch from "../../hooks/useSearch";
import Chip from "./autocomplete/Chip";
import SuggestionList from "./autocomplete/SuggestionList";
import Link from "next/link";
import { Trans } from "next-i18next";

const TagHit = ({ _formatted: hit }, { onSelect, onDeselect, ...props }) => (
  <div className="columns">
    <div className="col col-2">
      <Chip tabIndex={0} onClick={onSelect(hit)} handleClose={onDeselect(hit)}>
        {hit.value}
      </Chip>
    </div>
    <div className="col col-auto col-ml-auto text-gray">{hit.facet.name}</div>
  </div>
);

const ServiceHit = ({ _formatted: hit }, props) => (
  <Link href={"/services/" + hit.slug}>
    <span
      dangerouslySetInnerHTML={{
        __html: hit.name,
      }}
    />
  </Link>
);

const Omnisearch = ({
  controller: {
    state: { searchTerm, serviceHits, tagHits, selectedTags },
    control: { setSearchTerm, setServiceHits, setTagHits, setSelectedTags },
  },
  on,
}) => {
  const { services, tags } = useSearch();

  useEffect(() => {
    (async () => {
      if (selectedTags.length > 0 && typeof selectedTags[0] === "string") {
        try {
          const newTags = [];
          // TODO: can be done in one search using
          // the IN filter operator, but doesn't preserve order
          for (const id of selectedTags) {
            const [hit] = (
              await tags.search("", {
                filter: [`id = ${id}`],
              })
            ).hits;
            if (hit) {
              newTags.push(hit);
            }
          }
          setSelectedTags(newTags);
        } catch {
          setSelectedTags([]);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setServiceHits(null);
      setTagHits(null);
      on?.search?.(null);
      return;
    }

    (async () => {
      const serviceResults = await services.search(searchTerm, {
        attributesToHighlight: ["name"],
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
      });
      const tagResults = await tags.search(searchTerm, {
        attributesToCrop: ["value:5"],
      });

      setServiceHits(serviceResults.hits);
      setTagHits(tagResults.hits);

      on?.search?.({
        services: serviceResults.hits,
        tags: tagResults.hits,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const displayedTagHits = tagHits
    ? tagHits.filter((tag) => !selectedTags.some((v) => v.id === tag.id))
    : null;

  const handleChange = (e) => {
    const newValue = e.target.value || "";
    setSearchTerm(newValue);
    on?.input?.(newValue);
  };

  const handleTagSelect = (tag) => (e) => {
    setSelectedTags((prev) => prev.filter((v) => v.id !== tag.id).concat(tag));
  };

  const handleTagDeselect = (tag) => (e) => {
    e.preventDefault();
    setSelectedTags((prev) => prev.filter((v) => v.id !== tag.id));
  };

  return (
    <div className="form-group" id="omnisearch">
      <div className="form-autocomplete">
        <div className="form-autocomplete-input form-input">
          <label htmlFor="omnisearch-input" className="text-assistive">
            <Trans i18nKey="assistive.omnisearch.label">
              Enter any search query for SRHR services here.
            </Trans>
          </label>
          <input
            type="text"
            className="form-input"
            id="omnisearch-input"
            onChange={handleChange}
            value={searchTerm}
          />

          <div id="omnisearch-selected-tags">
            {selectedTags.map((tag) => (
              <Chip key={tag.id} showClose handleClose={handleTagDeselect(tag)}>
                {tag.value}
              </Chip>
            ))}
          </div>
        </div>
        {true ? (
          <SuggestionList
            id="tag-hits"
            hits={displayedTagHits}
            display={TagHit}
            onSelect={handleTagSelect}
            onDeselect={handleTagDeselect}
          />
        ) : (
          <div>loading</div>
        )}
        <SuggestionList
          id="service-hits"
          hits={serviceHits}
          display={ServiceHit}
        />
      </div>
    </div>
  );
};

export default Omnisearch;
