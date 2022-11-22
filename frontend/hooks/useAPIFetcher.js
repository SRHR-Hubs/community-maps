const useAPIFetcher =
  () =>
  async (url, { headers, ...config } = {}) =>
    fetch(process.env.STRAPI_LOCATION + url, {
      ...config,
      headers: {
        ...headers,
        Authorization: `Bearer ${process.env.STRAPI_LOCAL_KEY}`,
      },
    });

export default useAPIFetcher;
