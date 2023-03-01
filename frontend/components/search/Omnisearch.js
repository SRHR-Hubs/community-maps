import { useEffect, useState } from "react";
import useSearch from "../../hooks/useSearch";
import Chip from "./autocomplete/Chip";
import SuggestionList from "./autocomplete/SuggestionList";
import Link from "next/link";
import { Trans } from "next-i18next";

const TagHit = ({ _formatted: hit }) => (
  <div className="columns" role="menuitem">
    <div className="col col-2">
      <Chip tabIndex={0}>{hit.value}</Chip>
    </div>
    <div className="col col-auto col-ml-auto text-gray">{hit.facet.name}</div>
  </div>
);

const ServiceHit = ({ _formatted: hit }) => (
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
    state: { searchTerm, serviceHits, tagHits },
    control: { setSearchTerm, setServiceHits, setTagHits },
  },
  on,
}) => {
  const { services, tags } = useSearch();
  // const [searchTerm, setSearchTerm] = useState("");
  // const [serviceHits, setServiceHits] = useState(null);
  // const [tagHits, setTagHits] = useState(null);

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

  const handleChange = (e) => {
    const newValue = e.target.value || "";
    setSearchTerm(newValue);
    on?.input?.(newValue);
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
          <SuggestionList id="tag-hits" hits={tagHits} display={TagHit} />
          <SuggestionList
            id="service-hits"
            hits={serviceHits}
            display={ServiceHit}
          />
        </div>
      </div>
    </div>
  );
};

export default Omnisearch;
