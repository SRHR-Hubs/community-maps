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
  const { pathname } = router;

  useEffect(() => {
    const transformedState = {};
    for (const [k, v] of Object.entries(state)) {
      const key = k in transformers ? transformers[k] : k;
      const valueDeleteable = typeof v !== "boolean" && !v;
      if (valueDeleteable) {
        delete transformedState[key];
        continue;
      }
      // TODO: does !== undefined make sense for deletion?
      if (k in transformers && transformers[k] !== undefined) {
        transformedState[transformers[k]] = v;
      } else {
        transformedState[k] = v;
      }
    }

    if (!Object.values(transformedState).some((v) => !!v)) {
      router.replace(pathname, undefined, { shallow: true });
      return;
    }
    const newUrl = `${pathname}?${qs(transformedState)}`;
    router.replace(newUrl, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Object.values(state)]);
};

export default syncStateToQuery;
