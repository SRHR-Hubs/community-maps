import { useEffect, useState } from "react";
import useSearch from "../../hooks/useSearch";

const ResultsBox = ({index}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    (async () => {
      const search = await index.search(searchTerm);
      console.log(searchTerm, search)
      setResults(search.hits);
    })();
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <input type="text" name="" id="" onChange={handleChange} />
      <div>{results.length} hits</div>
    </div>
  );
};

const Omnisearch = () => {
  const { services, facets } = useSearch();
  return (
    <div>
      <ResultsBox index={services} />
      <ResultsBox index={facets} />
    </div>
  );
};

export default Omnisearch;
