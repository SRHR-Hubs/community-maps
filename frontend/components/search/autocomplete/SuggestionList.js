export const SuggestionList = ({ hits, display, onSelect }) => {
  if (hits === null || hits.length === 0) return null;
  return (
    <ul className="menu">
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
