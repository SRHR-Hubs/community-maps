import { useEffect, useMemo, useState } from "react";
import useOmnisearch from "./useOmnisearch";

const useFilterExpr = (mapRef) => {
  const [expr, setExpr] = useState(null);
  const {
    state: { serviceHits },
  } = useOmnisearch();

  const slugs = useMemo(
    () => serviceHits.map((service) => service.slug),
    [serviceHits]
  );

  useEffect(() => {
    if (mapRef.current === null) {
      return;
    }

    if (serviceHits === null || serviceHits.length === 0) {
      setExpr(null);
      return;
    }
    setExpr(["in", ["get", "slug"], ["literal", slugs]]);

    return () => {};
  }, [mapRef, serviceHits]);

  return [expr, new Set(slugs)];
};

export default useFilterExpr;
