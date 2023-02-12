// import { ofetch } from "ofetch";
import useQuery from "./useQuery";

const qs = useQuery();

const fetcher = async (url, props = {}) => {
  const { query, ...init } = props;
  const params = qs(query);
  const endpoint = process.env.API_HOST + url + "?" + params;
  const res = await fetch(endpoint, init);
  const data = await res.json();
  return data;
};
export default fetcher;
