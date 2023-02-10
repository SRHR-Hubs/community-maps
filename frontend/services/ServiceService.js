import fetcher from "../hooks/fetch";

export default class ServiceService {
  static prefix = "/api/services";

  static async get(endpoint, args) {
    const url = `${this.prefix}/${endpoint}`;

    return fetcher(url, args);
  }

  static async getPage(page, params = {}) {
    const query = {
      ...params,
      page,
    };

    return await this.get("", { query });
  }

  static async getAllServices(params = {}) {
    const result = [];

    let totalPages = Infinity;

    for (let page = 1; page < totalPages; page++) {
      const { results, meta } = await this.getPage(page, { ...params, page });
      result.push(...results);
      if (page === 1) {
        totalPages = meta.total_pages
      }
    }

    return result;
  }

  static async getServiceBySlug(slug, options) {
    const query = {
      ...options,
    };
    const service = await this.get(slug, { query });

    if (!service) {
      throw Error("Getting service by slug failed.");
    }
    return service;
  }
}
