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
    }

    return await this.get("", { query })
  }

  static async getAllServices(params = {}) {
    const result = [];

    let next = '';

    for (let page = 1; next !== null; page++) {
      const { results, meta } = await  this.getPage(page, params)
      result.push(...results);
      next = meta.next;
    }

    return result;
  }
}
