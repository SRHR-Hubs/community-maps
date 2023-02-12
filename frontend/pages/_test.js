import { index } from "../lib/meilisearch";

const TestPage = (props) => {
  return (
    <div>
      {Object.entries(props).map(([k, v]) => (
        <li>
          {k}: {JSON.stringify(v).substring(0, 100)}
        </li>
      ))}
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      facets: await index.fac,
      docs: await index.getDocuments(),
    },
  };
}

export default TestPage;
