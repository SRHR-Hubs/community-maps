import { useEffect, useState } from "react";
import useSearch from "../../hooks/useSearch";
import Chip from "./autocomplete/Chip";
import SuggestionList from "./autocomplete/SuggestionList";
import Link from "next/link";
import { Trans } from "next-i18next";
import useOmnisearch from "../../hooks/useOmnisearch";

const TagHit = ({ _formatted: hit }, { onSelect, onDeselect, ...props }) => (
  <div className="columns">
    <div className="col col-2">
      <Chip tabIndex={0} handleClose={onDeselect(hit)}>
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

const Omnisearch = ({ on }) => {
  const {
    state: { searchTerm, serviceHits, tagHits, selectedTags },
    control: { setSearchTerm, setServiceHits, setTagHits, setSelectedTags },
  } = useOmnisearch();
  const { services, tags } = useSearch();
  const [localServiceHits, setLocalServiceHits] = useState(null);
  const [localTagHits, setLocalTagHits] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     if (selectedTags.length > 0 && typeof selectedTags[0] === "string") {
  //       try {
  //         const newTags = [];
  //         // TODO: can be done in one search using
  //         // the IN filter operator, but doesn't preserve order
  //         for (const id of selectedTags) {
  //           const [hit] = (
  //             await tags.search("", {
  //               filter: [`id = ${id}`],
  //             })
  //           ).hits;
  //           if (hit) {
  //             newTags.push(hit);
  //           }
  //         }
  //         setSelectedTags(newTags);
  //       } catch {
  //         setSelectedTags([]);
  //       }
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // TODO:
  // paginated results, sorting, etc.

  useEffect(() => {
    if (searchTerm.length === 0) {
      setLocalServiceHits(null);
      setLocalTagHits(null);
      on?.search?.(null);
      return;
    }

    (async () => {
      const serviceResults = await services.search(searchTerm, {
        attributesToHighlight: ["name"],
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
        limit: 5,
      });
      const tagResults = await tags.search(searchTerm, {
        attributesToCrop: ["value:5"],
        limit: 5,
      });

      setLocalServiceHits(serviceResults.hits);
      setLocalTagHits(tagResults.hits);

      on?.search?.({
        services: serviceResults.hits,
        tags: tagResults.hits,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const displayedTagHits =
    localTagHits?.filter((tag) => !selectedTags.some((v) => v.id === tag.id)) ??
    null;

  const handleChange = (e) => {
    const newValue = e.target.value || "";
    setSearchTerm(newValue);
    on?.input?.(newValue);
  };

  const handleTagSelect = (tag) => (e) => {
    setSelectedTags(selectedTags.concat(tag));
  };

  const handleTagDeselect = (tag) => (e) => {
    e.preventDefault();
    setSelectedTags(selectedTags.filter((v) => v.id !== tag.id));
  };

  return (
    <div className="form-group" id="omnisearch">
      <div className="OLD__form-autocomplete">
        <div className="form-input">
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
        <SuggestionList
          id="tag-hits"
          hits={displayedTagHits}
          display={TagHit}
          onSelect={handleTagSelect}
          onDeselect={handleTagDeselect}
        />
        <SuggestionList
          id="service-hits"
          hits={localServiceHits}
          display={ServiceHit}
          onSelect={on.serviceSelect}
        />
      </div>
    </div>
  );
};

export default Omnisearch;
