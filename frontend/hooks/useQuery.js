import qs from "qs";

const useQuery = () => (obj, options) =>
  qs.stringify(obj, {
    ...options,
    encodeValuesOnly: true,
    indices: false,
  });

export default useQuery;
