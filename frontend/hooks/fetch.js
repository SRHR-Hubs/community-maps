import { ofetch } from "ofetch";

const fetcher = ofetch.create({
  baseURL: process.env.API_HOST,
});

export default fetcher;
