import Meilisearch from "meilisearch";

export const client = new Meilisearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST,
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY,
});

export const index = client.index("services");
