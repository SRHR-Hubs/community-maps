import { useEffect, useState } from "react";
import useSearch from "../../hooks/useSearch";
import { Chip } from "./autocomplete/Chip";
import { SuggestionList } from "./autocomplete/SuggestionList";

const TagHit = ({ _formatted: hit }) => (
  <div className="columns">
    <div className="col col-2">
      <Chip>{hit.value}</Chip>
    </div>
    <div className="col col-auto col-ml-auto text-gray">{hit.facet.name}</div>
  </div>
);

const ServiceHit = ({ _formatted: hit }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: hit.name,
    }}
  />
);

const Omnisearch = () => {
  const { services, tags } = useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceHits, setServiceHits] = useState(null);
  const [tagHits, setTagHits] = useState(null);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setServiceHits(null);
      setTagHits(null);
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
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="form-group" id="omnisearch">
      <div className="form-autocomplete">
        <div className="form-autocomplete-input form-input">
          <input type="text" className="form-input" onChange={handleChange} />
          <SuggestionList hits={tagHits} display={TagHit} />
          <SuggestionList hits={serviceHits} display={ServiceHit} />
        </div>
      </div>
    </div>
  );
};

// const ResultsBox = ({ index, display, ...props }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [results, setResults] = useState([]);
//   useEffect(() => {
//     (async () => {
//       const search = await index.search(searchTerm);
//       setResults(search.hits);
//     })();
//   }, [searchTerm]);

//   const handleChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <div>
//       <input type="text" name="" id="" onChange={handleChange} {...props} />
//       <div>{results.length} hits</div>
//       <ul>
//         {results.map((result) => (
//           <li key={result.id}>{display(result)}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const Omnisearch = () => {
//   const { services, tags } = useSearch();

//   const omni = {
//     // this was just for fun lol, it should be two streams of results
//     // for one search term
//     search: async (term) => {
//       const serviceResults = await services.search(term);
//       const tagResults = await tags.search(term);
//       return {
//         estimatedTotalHits: serviceResults.estimatedTotalHits + tagResults.estimatedTotalHits,
//         hits: serviceResults.hits.concat(tagResults.hits),
//         limit: serviceResults.limit,
//         offset: serviceResults.offset,
//         proccessingTimeMs: Math.max(serviceResults.processingTimeMs, tagResults.processingTimeMs),
//         query: term
//       }
//     }
//   }

//   return (
//     <div className="columns">
//       <div className="column col-6">
//         <ResultsBox index={services} display={({name}) => name} placeholder="services" />
//       </div>
//       <div className="column col-6">
//         <ResultsBox index={tags} display={({facet: { name }, value }) => `(${name}) ${value}`} placeholder="tags" />
//       </div>
//       <div className="col-6">
//       <ResultsBox index={omni} display={(hit) => (
//         'slug' in hit
//           ? hit.name
//           : `<${hit.facet.name}=${hit.value}>`
//       )} placeholder="omni" />
//       </div>
//     </div>
//   );
// };

export default Omnisearch;
