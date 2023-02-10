// import { ofetch } from "ofetch";

// const fetcher = ofetch.create({
//   baseURL: process.env.API_HOST,
// });

const fetcher = async (url, props) => {
  const res = await fetch(`${process.env.API_HOST}${url}`, props);
  const data = await res.json()
  return data;
};
export default fetcher;
