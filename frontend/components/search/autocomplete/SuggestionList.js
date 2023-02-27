const SuggestionList = ({ hits, display, onSelect, ...props }) => {
  if (hits === null || hits.length === 0) return null;
  return (
    <ul className="menu" role="menu" {...props}>
      {hits.map((hit) => (
        <li key={hit.id} className="menu-item">
          <div className="tile tile-centered">
            <div className="tile-content">{display(hit)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
