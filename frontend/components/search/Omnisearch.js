import { useEffect, useState } from "react";
import useSearch from "../../hooks/useSearch";

const ResultsBox = ({ index, display, ...props }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    (async () => {
      const search = await index.search(searchTerm);
      setResults(search.hits);
    })();
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <input type="text" name="" id="" onChange={handleChange} {...props} />
      <div>{results.length} hits</div>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{display(result)}</li>
        ))}
      </ul>
    </div>
  );
};

const Omnisearch = () => {
  const { services, tags } = useSearch();


  const omni = {
    // this was just for fun lol, it should be two streams of results
    // for one search term
    search: async (term) => {
      const serviceResults = await services.search(term);
      const tagResults = await tags.search(term);
      return {
        estimatedTotalHits: serviceResults.estimatedTotalHits + tagResults.estimatedTotalHits,
        hits: serviceResults.hits.concat(tagResults.hits),
        limit: serviceResults.limit,
        offset: serviceResults.offset,
        proccessingTimeMs: Math.max(serviceResults.processingTimeMs, tagResults.processingTimeMs),
        query: term
      }
    }
  }

  return (
    <div className="columns">
      <div className="column col-6">
        <ResultsBox index={services} display={({name}) => name} placeholder="services" />
      </div>
      <div className="column col-6">
        <ResultsBox index={tags} display={({facet: { name }, value }) => `(${name}) ${value}`} placeholder="tags" />
      </div>
      <div className="col-6">
      <ResultsBox index={omni} display={(hit) => (
        'slug' in hit
          ? hit.name
          : hit.value
      )} placeholder="omni" />
      </div>
    </div>
  );
};

export default Omnisearch;
