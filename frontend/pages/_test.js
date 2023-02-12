import { index, client } from "../lib/meilisearch";
import FacetService from "../services/FacetService";
import { useEffect, useRef, useState } from "react";
import PageLayout from "../components/layout/page/PageLayout";
import useServerI18n from "../hooks/useServerI18n";
import { useTranslation } from "next-i18next";

const TestPage = ({ facets, locale }) => {
  const ref = useRef(null);
  const [facet, setFacet] = useState("SERVICE_LANGUAGE");
  const [selectedFacets, setSelected] = useState({});
  const filters = [];
  const [filtered, setFiltered] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      filters.length = 0;
      for (const [value, selected] of Object.entries(selectedFacets)) {
        if (!selected) continue;
        filters.push(`tags.${facet} = "${value}"`);
      }
      const newFiltered = await client.index("services").search("", {
        limit: 50,
        filter: filters,
      });
      setFiltered(newFiltered.hits);
    })();
  }, [selectedFacets]);

  return (
    <PageLayout>
      <div className="columns">
        <div className="column col">
          <select
            name="facets"
            id=""
            ref={ref}
            onChange={(e) => {
              setFacet(ref.current.value);
              setSelected({});
            }}
          >
            {Object.entries(facets).map(
              ([translation_id, { translations }]) => {
                const display =
                  translations?.[locale] ?? t(`tags.${translation_id}`);
                return <option value={translation_id}>{display}</option>;
              }
            )}
          </select>
          {facet &&
            facets[facet].distribution?.map(({ value }) => (
              <div className="form-group">
                <label htmlFor={value} className="form-checkbox">
                  <input
                    type="checkbox"
                    name=""
                    id={value}
                    checked={selectedFacets[value] && "on"}
                    onChange={(e) => {
                      setSelected((prev) => ({
                        ...prev,
                        [value]: e.target.checked,
                      }));
                    }}
                  />
                  <i className="form-icon" /> {value}
                </label>
              </div>
            ))}
        </div>
        <div className="column col">
          <ul>
            {filtered?.map(({ name }) => (
              <li>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export async function getServerSideProps({ locale }) {
  const _facets = await FacetService.getAllFacets();
  const facets = {};
  for (const { translation_id, ...item } of _facets) {
    facets[translation_id] = {
      ...item,
      distribution: await FacetService.getDistribution(translation_id),
    };
  }
  return {
    props: {
      facets,
      locale,
      ...(await useServerI18n(locale)),
    },
  };
}

export default TestPage;
