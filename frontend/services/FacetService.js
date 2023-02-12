import fetcher from "../hooks/fetch";

export default class FacetService {
  static prefix = "/api/facets";

  static async get(endpoint, args) {
    const url = `${this.prefix}/${endpoint}`;

    return fetcher(url, args);
  }

  static async getDistribution(id_) {
    return this.get(id_ + "/distribution");
  }

  static async getPage(page, params = {}) {
    const query = {
      ...params,
      page,
    };

    return this.get("", { query });
  }
  static async getAllFacets(params = {}) {
    const result = [];

    let totalPages = Infinity;

    for (let page = 1; page <= totalPages; page++) {
      const { results, meta } = await this.getPage(page, params);
      result.push(...results);
      if (page === 1) {
        totalPages = meta.total_pages;
      }
    }

    return result;
  }
}
