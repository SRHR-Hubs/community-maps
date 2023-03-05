import { useRouter } from "next/router";
import { useEffect } from "react";
import useQuery from "./useQuery";

/**
 * Synchronize an arbitrary state object into query params.
 * Probably breaks in a lot of fun, unexpected ways
 * @param {Object} state
 * @param {Object} initial Any other query parameters, which should be left alone
 * @param {Object} transformers
 */
const syncStateToQuery = (state, transformers = {}) => {
  const qs = useQuery();
  const router = useRouter();
  const { pathname, query } = router;

  useEffect(() => {
    const transformedState = {...query};
    for (const [k, v] of Object.entries(state)) {
      const valueDeleteable = typeof v !== "boolean" && !v;
      if (valueDeleteable) {
        delete transformedState[k];
        continue;
      }
      transformedState[k] = transformers[k]?.(v) ?? v;
    }

    const newUrl = `${pathname}?${qs(transformedState)}`
      // if qs is empty, remove the trailing ?
      .replace(/\?$/, "");

    router.replace(newUrl, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Object.values(state)]);
};

export default syncStateToQuery;
