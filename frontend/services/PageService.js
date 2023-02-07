import fetcher from "../hooks/fetch";

export default class PageService {
  static prefix = "/api/pages";

  static async get(endpoint, args) {
    const url = `${this.prefix}/${endpoint}`;
    return fetcher(url, args);
  }

  static async getAllPages(params = {}) {
    const { fields = ["slug"] } = params;
    const result = [];

    const query = {
      fields,
      ...params,
    };

    let next = null;

    do {
      const { results, meta } = await this.get("", { query });
      result.push(...results);
      next = meta.next;
    } while (next !== null);

    return result;
  }

  static async getPageBySlug(slug, options) {
    const query = {
      ...options,
    };

    const page  = await this.get(slug, { query });

    if (!page) {
      throw Error(`Getting page with slug ${slug} failed.`);
    }

    return page;
  }
}
