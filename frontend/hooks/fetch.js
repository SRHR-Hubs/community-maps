// import { ofetch } from "ofetch";

// const fetcher = ofetch.create({
//   baseURL: process.env.API_HOST,
// });

const fetcher = async (url, props) => {
  const endpoint = `${process.env.API_HOST}${url}`;
  const res = await fetch(endpoint, props);
  const data = await res.json()
  return data;
};
export default fetcher;
